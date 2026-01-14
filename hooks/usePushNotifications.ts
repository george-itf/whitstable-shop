'use client';

import { useState, useEffect, useCallback } from 'react';

interface PushState {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  permission: NotificationPermission | 'default';
  error: string | null;
}

/**
 * Hook for managing push notification subscriptions
 *
 * Usage:
 * ```tsx
 * const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();
 *
 * if (!isSupported) return <p>Push notifications not supported</p>;
 *
 * return (
 *   <button onClick={isSubscribed ? unsubscribe : subscribe}>
 *     {isSubscribed ? 'Disable' : 'Enable'} notifications
 *   </button>
 * );
 * ```
 */
export function usePushNotifications() {
  const [state, setState] = useState<PushState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    permission: 'default',
    error: null,
  });

  // Check support and current subscription status
  useEffect(() => {
    async function checkStatus() {
      // Check browser support
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setState({
          isSupported: false,
          isSubscribed: false,
          isLoading: false,
          permission: 'default',
          error: 'Push notifications not supported in this browser',
        });
        return;
      }

      // Get permission status
      const permission = Notification.permission;

      try {
        // Register service worker if not already
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        setState({
          isSupported: true,
          isSubscribed: !!subscription,
          isLoading: false,
          permission,
          error: null,
        });
      } catch (error) {
        console.error('Push status check error:', error);
        setState({
          isSupported: true,
          isSubscribed: false,
          isLoading: false,
          permission,
          error: 'Failed to check notification status',
        });
      }
    }

    checkStatus();
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration.scope);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
      }
    }
    throw new Error('Service Worker not supported');
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          permission,
          error: 'Notification permission denied',
        }));
        return false;
      }

      // Get service worker registration
      const registration = await registerServiceWorker();
      await navigator.serviceWorker.ready;

      // Get VAPID public key from API
      const configRes = await fetch('/api/notifications/push');
      const config = await configRes.json();

      if (!config.vapidPublicKey) {
        throw new Error('Push notifications not configured on server');
      }

      // Convert VAPID key to Uint8Array
      const vapidKey = urlBase64ToUint8Array(config.vapidPublicKey);

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      // Send subscription to server
      const res = await fetch('/api/notifications/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
            auth: arrayBufferToBase64(subscription.getKey('auth')),
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save subscription');
      }

      setState({
        isSupported: true,
        isSubscribed: true,
        isLoading: false,
        permission: 'granted',
        error: null,
      });

      return true;
    } catch (error) {
      console.error('Subscribe error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to subscribe',
      }));
      return false;
    }
  }, [registerServiceWorker]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe locally
        await subscription.unsubscribe();

        // Remove from server
        await fetch(`/api/notifications/push?endpoint=${encodeURIComponent(subscription.endpoint)}`, {
          method: 'DELETE',
        });
      }

      setState((prev) => ({
        ...prev,
        isSubscribed: false,
        isLoading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to unsubscribe',
      }));
      return false;
    }
  }, []);

  return {
    ...state,
    subscribe,
    unsubscribe,
  };
}

// Helper: Convert URL-safe base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Helper: Convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default usePushNotifications;
