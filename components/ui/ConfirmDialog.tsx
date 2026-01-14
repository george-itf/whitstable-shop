'use client';

import { AlertTriangle, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { cn } from '@/lib/utils';

export type ConfirmVariant = 'danger' | 'warning' | 'success' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  variant?: ConfirmVariant;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonVariant: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    buttonVariant: 'coral' as const,
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    buttonVariant: 'primary' as const,
  },
  info: {
    icon: XCircle,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonVariant: 'secondary' as const,
  },
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center py-4">
        {/* Icon */}
        <div className={cn('w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4', config.iconBg)}>
          <Icon className={cn('w-8 h-8', config.iconColor)} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>

        {/* Message */}
        <p className="text-grey mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
