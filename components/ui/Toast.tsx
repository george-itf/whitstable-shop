'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Toast Types
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, options?: Partial<Toast>) => void;
  error: (message: string, options?: Partial<Toast>) => void;
  warning: (message: string, options?: Partial<Toast>) => void;
  info: (message: string, options?: Partial<Toast>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Icons for each variant
const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

// Styles for each variant
const variantStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

// Individual Toast Component
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const Icon = icons[toast.variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg',
        'animate-in slide-in-from-right-full duration-300',
        variantStyles[toast.variant]
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconStyles[toast.variant])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.message}</p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onRemove();
            }}
            className="mt-1 text-xs font-semibold underline hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Toast Container
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
}

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration ?? 5000;

    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({ message, variant: 'success', ...options });
  }, [addToast]);

  const error = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({ message, variant: 'error', duration: 8000, ...options });
  }, [addToast]);

  const warning = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({ message, variant: 'warning', ...options });
  }, [addToast]);

  const info = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({ message, variant: 'info', ...options });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastProvider;
