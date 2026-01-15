'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';

interface Notice {
  id: string;
  message: string;
  is_active: boolean;
  expires_at: string | null;
}

export default function AdminNoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    async function fetchNotices() {
      try {
        const supabase = createClient();

        // Check authentication and admin role
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login?redirect=/admin/notices');
          return;
        }

        // Check if admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin') {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        setIsAdmin(true);

        // Fetch all notices
        const res = await fetch('/api/notices?all=true');
        if (res.ok) {
          const data = await res.json();
          setNotices(data);
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotices();
  }, [router]);

  const handleToggle = async (id: string) => {
    const notice = notices.find((n) => n.id === id);
    if (!notice) return;

    try {
      const res = await fetch('/api/notices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !notice.is_active }),
      });

      if (res.ok) {
        setNotices(
          notices.map((n) =>
            n.id === id ? { ...n, is_active: !n.is_active } : n
          )
        );
      }
    } catch (error) {
      console.error('Error toggling notice:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/notices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setNotices(notices.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });

      if (res.ok) {
        const newNotice = await res.json();
        setNotices([newNotice, ...notices]);
        setNewMessage('');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  };

  if (isLoading) {
    return (
      <MobileWrapper>
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
          </div>
        </div>
        <div className="px-4 py-6 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-5 bg-grey-light rounded w-3/4 mb-3" />
              <div className="h-8 bg-grey-light rounded w-1/4" />
            </Card>
          ))}
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  if (isAdmin === false) {
    return (
      <MobileWrapper>
        <div className="bg-coral px-4 py-4">
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
        </div>
        <div className="px-4 py-6 text-center py-12">
          <p className="text-grey">You don&apos;t have permission to view this page.</p>
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

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
        {notices.filter((n) => n.is_active).length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-grey">PREVIEW</h2>
            <div className="bg-coral text-white px-4 py-3 rounded-card flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <p className="text-sm font-medium flex-1">
                {notices.find((n) => n.is_active)?.message}
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
                      notice.is_active ? 'bg-green' : 'bg-grey-light'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        notice.is_active ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {notice.expires_at && (
                  <p className="text-xs text-grey mb-3">
                    Expires:{' '}
                    {new Date(notice.expires_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
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
