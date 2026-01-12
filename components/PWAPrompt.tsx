'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWAPrompt component
 * Shows "Add to Homescreen" prompt after 2nd visit
 * Handles iOS, Android, and desktop PWA installation
 */
export function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Detect platform
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone;

    // Don't show if already installed
    if (isStandalone) {
      return;
    }

    if (isIOS) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }
  }, []);

  // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Check visit count and show prompt
  useEffect(() => {
    if (platform === null) return;

    const STORAGE_KEY = 'pwa-prompt';
    const stored = localStorage.getItem(STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : { visits: 0, dismissed: false };

    // Don't show if dismissed
    if (data.dismissed) return;

    // Increment visit count
    data.visits += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Show prompt after 2nd visit
    if (data.visits >= 2) {
      // Delay to not interrupt initial page load
      const timeout = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [platform]);

  // Handle install button click
  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      // Trigger native install prompt
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setShowPrompt(false);
      }

      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    const stored = localStorage.getItem('pwa-prompt');
    const data = stored ? JSON.parse(stored) : { visits: 0 };
    data.dismissed = true;
    localStorage.setItem('pwa-prompt', JSON.stringify(data));
  }, []);

  if (!showPrompt || !platform) return null;

  return (
    <div className="pwa-prompt-overlay">
      <div className="pwa-prompt">
        <button
          onClick={handleDismiss}
          className="pwa-prompt-close"
          aria-label="Close"
          type="button"
        >
          ×
        </button>

        <div className="pwa-prompt-icon">
          <AppIcon />
        </div>

        <h3 className="pwa-prompt-title">Add to Home Screen</h3>

        <p className="pwa-prompt-text">
          Add whitstable.shop to your home screen for quick access to shops,
          events, and local info.
        </p>

        {platform === 'ios' && (
          <div className="pwa-prompt-instructions">
            <p>
              <strong>To install:</strong>
            </p>
            <ol>
              <li>
                Tap the <ShareIconInline /> Share button in Safari
              </li>
              <li>
                Scroll down and tap <strong>Add to Home Screen</strong>
              </li>
              <li>
                Tap <strong>Add</strong>
              </li>
            </ol>
          </div>
        )}

        {platform === 'android' && deferredPrompt && (
          <button onClick={handleInstall} className="pwa-prompt-button" type="button">
            Install App
          </button>
        )}

        {platform === 'android' && !deferredPrompt && (
          <div className="pwa-prompt-instructions">
            <p>
              <strong>To install:</strong>
            </p>
            <ol>
              <li>Tap the menu button (three dots)</li>
              <li>
                Tap <strong>Add to Home screen</strong>
              </li>
            </ol>
          </div>
        )}

        {platform === 'desktop' && deferredPrompt && (
          <button onClick={handleInstall} className="pwa-prompt-button" type="button">
            Install App
          </button>
        )}

        {platform === 'desktop' && !deferredPrompt && (
          <p className="pwa-prompt-desktop-note">
            Click the install icon in your browser&apos;s address bar to add this
            app.
          </p>
        )}

        <button onClick={handleDismiss} className="pwa-prompt-dismiss" type="button">
          Not now
        </button>
      </div>

      <style jsx>{`
        .pwa-prompt-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 100;
          animation: fadeIn 0.3s ease;
        }

        @media (min-width: 640px) {
          .pwa-prompt-overlay {
            align-items: center;
          }
        }

        .pwa-prompt {
          background: white;
          border-radius: 1.5rem 1.5rem 0 0;
          padding: 1.5rem;
          width: 100%;
          max-width: 24rem;
          text-align: center;
          position: relative;
          animation: slideUp 0.3s ease;
        }

        @media (min-width: 640px) {
          .pwa-prompt {
            border-radius: 1.5rem;
          }
        }

        .pwa-prompt-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #9ca3af;
          line-height: 1;
          padding: 0.25rem;
        }

        .pwa-prompt-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1rem;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pwa-prompt-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.5rem;
        }

        .pwa-prompt-text {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0 0 1rem;
          line-height: 1.5;
        }

        .pwa-prompt-instructions {
          text-align: left;
          background: #f9fafb;
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .pwa-prompt-instructions p {
          margin: 0 0 0.5rem;
          font-size: 0.875rem;
        }

        .pwa-prompt-instructions ol {
          margin: 0;
          padding-left: 1.25rem;
          font-size: 0.875rem;
          color: #4b5563;
        }

        .pwa-prompt-instructions li {
          margin-bottom: 0.5rem;
        }

        .pwa-prompt-instructions li:last-child {
          margin-bottom: 0;
        }

        .pwa-prompt-button {
          width: 100%;
          padding: 0.875rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 0.75rem;
          transition: background 0.2s;
        }

        .pwa-prompt-button:hover {
          background: #2563eb;
        }

        .pwa-prompt-dismiss {
          background: none;
          border: none;
          color: #6b7280;
          font-size: 0.875rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .pwa-prompt-dismiss:hover {
          color: #374151;
        }

        .pwa-prompt-desktop-note {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @media (min-width: 640px) {
          @keyframes slideUp {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        }
      `}</style>
    </div>
  );
}

// App Icon SVG
function AppIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="white"
      stroke="white"
      strokeWidth="0"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline
        points="9 22 9 12 15 12 15 22"
        fill="none"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}

// iOS Share Icon (inline)
function ShareIconInline() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline', verticalAlign: 'middle' }}
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export default PWAPrompt;
