'use client';

import { cn } from '@/lib/utils';
import { useEffect, useCallback, useRef, useId } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

// Get all focusable elements within a container
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  return Array.from(elements).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  );
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  initialFocusRef,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Handle focus trap
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;

    const focusableElements = getFocusableElements(modalRef.current);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift + Tab
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, []);

  // Setup effects when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Store current active element to restore later
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Add event listeners
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'hidden';

      // Focus the initial element or first focusable element
      requestAnimationFrame(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else if (modalRef.current) {
          const focusableElements = getFocusableElements(modalRef.current);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            // If no focusable elements, focus the modal itself
            modalRef.current.focus();
          }
        }
      });
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = '';

      // Restore focus to previous element
      if (previousActiveElement.current && isOpen) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleEscape, handleTabKey, initialFocusRef]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-white rounded-card shadow-lg',
          'transform transition-all duration-200',
          'focus:outline-none',
          sizes[size]
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-grey-light">
            <h2 id={titleId} className="text-lg font-bold text-ink">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-grey hover:text-ink transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-2"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Description (visually hidden if not displayed) */}
        {description && (
          <p id={descriptionId} className="sr-only">
            {description}
          </p>
        )}

        {/* Close button for modals without title */}
        {!title && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1 text-grey hover:text-ink transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-2 z-10"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        )}

        {/* Content */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
