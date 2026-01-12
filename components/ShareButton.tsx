'use client';

import { useState, useCallback } from 'react';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  type?: 'shop' | 'event';
  className?: string;
}

interface ShareOption {
  name: string;
  icon: string;
  action: () => void;
}

/**
 * ShareButton component with Web Share API support
 * Falls back to modal with share options on desktop
 */
export function ShareButton({
  title,
  text,
  url,
  type = 'shop',
  className = '',
}: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate share text based on type
  const shareText =
    type === 'shop'
      ? `Check out ${title} in Whitstable — ${url}`
      : `${title} in Whitstable — ${url}`;

  // Check if Web Share API is available
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  // Native share handler
  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title,
        text: shareText,
        url,
      });
    } catch (err) {
      // User cancelled or error - fall back to modal
      if ((err as Error).name !== 'AbortError') {
        setShowModal(true);
      }
    }
  }, [title, shareText, url]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  // Share options for modal
  const shareOptions: ShareOption[] = [
    {
      name: 'Copy link',
      icon: '🔗',
      action: handleCopy,
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Facebook',
      icon: '📘',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'Twitter',
      icon: '🐦',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'Email',
      icon: '📧',
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`;
      },
    },
  ];

  // Main click handler
  const handleClick = () => {
    if (canShare) {
      handleNativeShare();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`share-button ${className}`}
        aria-label={`Share ${title}`}
        type="button"
      >
        <ShareIcon />
        <span>Share</span>
      </button>

      {/* Share Modal */}
      {showModal && (
        <div
          className="share-modal-overlay"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div
            className="share-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="share-modal-header">
              <h3 id="share-modal-title">Share</h3>
              <button
                onClick={() => setShowModal(false)}
                className="share-modal-close"
                aria-label="Close"
                type="button"
              >
                ×
              </button>
            </div>

            <div className="share-modal-content">
              <p className="share-modal-text">{text}</p>

              <div className="share-options">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => {
                      option.action();
                      if (option.name !== 'Copy link') {
                        setShowModal(false);
                      }
                    }}
                    className="share-option"
                    type="button"
                  >
                    <span className="share-option-icon">{option.icon}</span>
                    <span className="share-option-name">
                      {option.name === 'Copy link' && copied
                        ? 'Copied!'
                        : option.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .share-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background: white;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          transition: all 0.2s;
        }

        .share-button:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .share-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 50;
          animation: fadeIn 0.2s ease;
        }

        @media (min-width: 640px) {
          .share-modal-overlay {
            align-items: center;
          }
        }

        .share-modal {
          background: white;
          border-radius: 1rem 1rem 0 0;
          width: 100%;
          max-width: 24rem;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @media (min-width: 640px) {
          .share-modal {
            border-radius: 1rem;
          }
        }

        .share-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .share-modal-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
        }

        .share-modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          padding: 0.25rem;
          line-height: 1;
        }

        .share-modal-content {
          padding: 1rem;
        }

        .share-modal-text {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .share-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .share-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .share-option:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .share-option-icon {
          font-size: 1.5rem;
        }

        .share-option-name {
          font-size: 0.75rem;
          color: #374151;
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
    </>
  );
}

// SVG Share Icon
function ShareIcon() {
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
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export default ShareButton;
