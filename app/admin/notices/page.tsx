'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

// Mock notices
const mockNotices = [
  {
    id: '1',
    message: 'Oyster Festival this weekend! Road closures in effect.',
    isActive: true,
    expiresAt: '2025-07-28',
  },
];

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState(mockNotices);
  const [showForm, setShowForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const handleToggle = (id: string) => {
    setNotices(
      notices.map((n) =>
        n.id === id ? { ...n, isActive: !n.isActive } : n
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotices(notices.filter((n) => n.id !== id));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setNotices([
      ...notices,
      {
        id: Date.now().toString(),
        message: newMessage,
        isActive: true,
        expiresAt: null as unknown as string,
      },
    ]);
    setNewMessage('');
    setShowForm(false);
  };

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-coral px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-white font-bold text-xl">notices</h1>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'cancel' : '+ add'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {/* Add notice form */}
        {showForm && (
          <Card className="border-coral border-2">
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Notice Message"
                id="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter notice message..."
                required
              />
              <Button type="submit" variant="coral" className="w-full">
                create notice
              </Button>
            </form>
          </Card>
        )}

        {/* Preview */}
        {notices.filter((n) => n.isActive).length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-grey">PREVIEW</h2>
            <div className="bg-coral text-white px-4 py-3 rounded-card flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <p className="text-sm font-medium flex-1">
                {notices.find((n) => n.isActive)?.message}
              </p>
            </div>
          </div>
        )}

        {/* Notices list */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-grey">ALL NOTICES</h2>

          {notices.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-grey">No notices. Create one to display on the homepage.</p>
            </Card>
          ) : (
            notices.map((notice) => (
              <Card key={notice.id}>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm text-ink flex-1">{notice.message}</p>
                  <button
                    onClick={() => handleToggle(notice.id)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      notice.isActive ? 'bg-green' : 'bg-grey-light'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        notice.isActive ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {notice.expiresAt && (
                  <p className="text-xs text-grey mb-3">
                    Expires: {notice.expiresAt}
                  </p>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-coral"
                  onClick={() => handleDelete(notice.id)}
                >
                  delete
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
