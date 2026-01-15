'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  X,
  ImageIcon,
  FileText,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import type { LocalInfoPage } from '@/types/database';

// Available icons for selection
const AVAILABLE_ICONS = [
  'Trash2', 'Waves', 'Music', 'Car', 'Sun', 'Phone', 'Building',
  'Calendar', 'Stethoscope', 'Heart', 'MapPin', 'AlertCircle', 'Info',
];

// Available colors
const AVAILABLE_COLORS = [
  { label: 'Green', value: 'text-green', bg: 'bg-green' },
  { label: 'Sky Blue', value: 'text-sky', bg: 'bg-sky' },
  { label: 'Coral', value: 'text-coral', bg: 'bg-coral' },
  { label: 'Yellow', value: 'text-yellow', bg: 'bg-yellow' },
  { label: 'Red', value: 'text-red-500', bg: 'bg-red-500' },
];

interface EditingPage extends Partial<LocalInfoPage> {
  isNew?: boolean;
}

export default function AdminLocalInfoPage() {
  const router = useRouter();
  const [pages, setPages] = useState<LocalInfoPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [editingPage, setEditingPage] = useState<EditingPage | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login?redirect=/admin/local-info');
          return;
        }

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

        const res = await fetch('/api/admin/local-info?all=true');
        if (res.ok) {
          const data = await res.json();
          setPages(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  // Show toast
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle page active status
  const toggleActive = async (page: LocalInfoPage) => {
    try {
      const res = await fetch('/api/admin/local-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: page.id, is_active: !page.is_active }),
      });

      if (res.ok) {
        setPages(pages.map(p => p.id === page.id ? { ...p, is_active: !p.is_active } : p));
        showToast('success', `"${page.title}" is now ${!page.is_active ? 'visible' : 'hidden'}`);
      }
    } catch (error) {
      showToast('error', 'Failed to update page');
    }
  };

  // Delete page
  const deletePage = async (page: LocalInfoPage) => {
    if (!confirm(`Delete "${page.title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch('/api/admin/local-info', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: page.id }),
      });

      if (res.ok) {
        setPages(pages.filter(p => p.id !== page.id));
        showToast('success', `"${page.title}" deleted`);
      }
    } catch (error) {
      showToast('error', 'Failed to delete page');
    }
  };

  // Save page (create or update)
  const savePage = async () => {
    if (!editingPage) return;
    if (!editingPage.slug || !editingPage.title) {
      showToast('error', 'Title and URL slug are required');
      return;
    }

    setIsSaving(true);

    try {
      const method = editingPage.isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/local-info', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPage),
      });

      if (res.ok) {
        const savedPage = await res.json();
        if (editingPage.isNew) {
          setPages([...pages, savedPage]);
        } else {
          setPages(pages.map(p => p.id === savedPage.id ? savedPage : p));
        }
        setEditingPage(null);
        showToast('success', editingPage.isNew ? 'Page created!' : 'Changes saved!');
      } else {
        const error = await res.json();
        showToast('error', error.error || 'Failed to save');
      }
    } catch (error) {
      showToast('error', 'Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  // Move page up/down in order
  const moveOrder = async (page: LocalInfoPage, direction: 'up' | 'down') => {
    const currentIndex = pages.findIndex(p => p.id === page.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= pages.length) return;

    const otherPage = pages[newIndex];

    // Swap display orders
    try {
      await Promise.all([
        fetch('/api/admin/local-info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: page.id, display_order: otherPage.display_order }),
        }),
        fetch('/api/admin/local-info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: otherPage.id, display_order: page.display_order }),
        }),
      ]);

      const newPages = [...pages];
      newPages[currentIndex] = { ...otherPage, display_order: page.display_order };
      newPages[newIndex] = { ...page, display_order: otherPage.display_order };
      newPages.sort((a, b) => a.display_order - b.display_order);
      setPages(newPages);
    } catch (error) {
      showToast('error', 'Failed to reorder');
    }
  };

  // Import default pages
  const importDefaults = async () => {
    setIsImporting(true);
    try {
      const res = await fetch('/api/admin/local-info/seed', {
        method: 'POST',
      });

      if (res.ok) {
        const result = await res.json();
        if (result.inserted > 0) {
          // Refresh the pages list
          const pagesRes = await fetch('/api/admin/local-info?all=true');
          if (pagesRes.ok) {
            const data = await pagesRes.json();
            setPages(data);
          }
          showToast('success', `Imported ${result.inserted} default pages`);
        } else {
          showToast('success', 'All default pages already exist');
        }
      } else {
        showToast('error', 'Failed to import pages');
      }
    } catch (error) {
      showToast('error', 'Failed to import pages');
    } finally {
      setIsImporting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Toast notification */}
      {toast && (
        <div className={cn(
          'fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg',
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Local Info Pages</h1>
              <p className="text-sm text-gray-500">Manage info pages like tide times, parking, etc.</p>
            </div>
          </div>
          <button
            onClick={() => setEditingPage({ isNew: true, is_active: true, display_order: pages.length })}
            className="flex items-center gap-2 px-4 py-2 bg-coral text-white rounded-lg font-medium hover:bg-coral/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Page
          </button>
        </div>

        {/* Quick tips */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-sky-900 mb-2">Quick tips</h3>
          <ul className="text-sm text-sky-800 space-y-1">
            <li>Click the <Eye className="w-4 h-4 inline" /> icon to show/hide a page on the site</li>
            <li>Click <Pencil className="w-4 h-4 inline" /> to edit page content and images</li>
            <li>Use the arrows to change the order pages appear in the list</li>
          </ul>
        </div>

        {/* Pages list */}
        <div className="space-y-2">
          {pages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No info pages yet.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={importDefaults}
                  disabled={isImporting}
                  className="flex items-center gap-2 px-4 py-2 bg-sky text-white rounded-lg font-medium hover:bg-sky/90 disabled:opacity-50 transition-colors"
                >
                  {isImporting ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Importing...
                    </>
                  ) : (
                    'Import Default Pages'
                  )}
                </button>
                <span className="text-gray-400">or</span>
                <button
                  onClick={() => setEditingPage({ isNew: true, is_active: true, display_order: 0 })}
                  className="text-coral hover:underline font-medium"
                >
                  Create from scratch
                </button>
              </div>
            </div>
          ) : (
            pages.map((page, index) => (
              <div
                key={page.id}
                className={cn(
                  'flex items-center gap-4 p-4 bg-white rounded-lg border transition-all',
                  page.is_active ? 'border-gray-200' : 'border-gray-100 bg-gray-50 opacity-60'
                )}
              >
                {/* Order controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveOrder(page, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move up"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveOrder(page, 'down')}
                    disabled={index === pages.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>

                {/* Image preview */}
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {page.image_url ? (
                    <Image
                      src={page.image_url}
                      alt={page.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={cn('w-full h-full flex items-center justify-center', page.bg_color || 'bg-gray-200')}>
                      <ImageIcon className="w-6 h-6 text-white/70" />
                    </div>
                  )}
                </div>

                {/* Page info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{page.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{page.subtitle || 'No subtitle'}</p>
                  <p className="text-xs text-gray-400 mt-1">/info/{page.slug}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* View on site */}
                  <Link
                    href={`/info/${page.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
                    title="View on site"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>

                  {/* Toggle visibility */}
                  <button
                    onClick={() => toggleActive(page)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      page.is_active
                        ? 'text-green-500 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    )}
                    title={page.is_active ? 'Click to hide' : 'Click to show'}
                  >
                    {page.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => setEditingPage(page)}
                    className="p-2 text-gray-400 hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                    title="Edit page"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deletePage(page)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete page"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isSaving && setEditingPage(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPage.isNew ? 'Add New Page' : `Edit: ${editingPage.title}`}
              </h2>
              <button
                onClick={() => !isSaving && setEditingPage(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 space-y-6">
              {/* Basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={editingPage.title || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    placeholder="e.g. Tide Times"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /info/
                    </span>
                    <input
                      type="text"
                      value={editingPage.slug || ''}
                      onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                      placeholder="tide-times"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingPage.subtitle || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, subtitle: e.target.value })}
                  placeholder="e.g. high & low tide predictions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Header Image URL
                </label>
                <input
                  type="text"
                  value={editingPage.image_url || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                />
                {editingPage.image_url && (
                  <div className="mt-2">
                    <Image
                      src={editingPage.image_url}
                      alt="Preview"
                      width={200}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme Color
                </label>
                <div className="flex gap-2">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setEditingPage({ ...editingPage, color: color.value, bg_color: color.bg })}
                      className={cn(
                        'w-10 h-10 rounded-lg transition-all',
                        color.bg,
                        editingPage.bg_color === color.bg ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      )}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Facts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Facts (shown at top of page)
                </label>
                <div className="space-y-2">
                  {(editingPage.quick_facts as Array<{ label: string; value: string }> || []).map((fact, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={fact.label}
                        onChange={(e) => {
                          const facts = [...(editingPage.quick_facts as Array<{ label: string; value: string }> || [])];
                          facts[i] = { ...facts[i], label: e.target.value };
                          setEditingPage({ ...editingPage, quick_facts: facts });
                        }}
                        placeholder="Label"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={fact.value}
                        onChange={(e) => {
                          const facts = [...(editingPage.quick_facts as Array<{ label: string; value: string }> || [])];
                          facts[i] = { ...facts[i], value: e.target.value };
                          setEditingPage({ ...editingPage, quick_facts: facts });
                        }}
                        placeholder="Value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => {
                          const facts = (editingPage.quick_facts as Array<{ label: string; value: string }> || []).filter((_, j) => j !== i);
                          setEditingPage({ ...editingPage, quick_facts: facts });
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const facts = [...(editingPage.quick_facts as Array<{ label: string; value: string }> || []), { label: '', value: '' }];
                      setEditingPage({ ...editingPage, quick_facts: facts });
                    }}
                    className="text-sm text-coral hover:underline"
                  >
                    + Add quick fact
                  </button>
                </div>
              </div>

              {/* Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Useful Links
                </label>
                <div className="space-y-2">
                  {(editingPage.links as Array<{ label: string; url: string; description?: string }> || []).map((link, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const links = [...(editingPage.links as Array<{ label: string; url: string; description?: string }> || [])];
                          links[i] = { ...links[i], label: e.target.value };
                          setEditingPage({ ...editingPage, links: links });
                        }}
                        placeholder="Link text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const links = [...(editingPage.links as Array<{ label: string; url: string; description?: string }> || [])];
                          links[i] = { ...links[i], url: e.target.value };
                          setEditingPage({ ...editingPage, links: links });
                        }}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => {
                          const links = (editingPage.links as Array<{ label: string; url: string }> || []).filter((_, j) => j !== i);
                          setEditingPage({ ...editingPage, links: links });
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const links = [...(editingPage.links as Array<{ label: string; url: string }> || []), { label: '', url: '' }];
                      setEditingPage({ ...editingPage, links: links });
                    }}
                    className="text-sm text-coral hover:underline"
                  >
                    + Add link
                  </button>
                </div>
              </div>

              {/* Content Sections */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Content Sections
                </label>
                <div className="space-y-4">
                  {(editingPage.sections as Array<{ heading?: string; content: string[] }> || []).map((section, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={section.heading || ''}
                          onChange={(e) => {
                            const sections = [...(editingPage.sections as Array<{ heading?: string; content: string[] }> || [])];
                            sections[i] = { ...sections[i], heading: e.target.value };
                            setEditingPage({ ...editingPage, sections: sections });
                          }}
                          placeholder="Section heading"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
                        />
                        <button
                          onClick={() => {
                            const sections = (editingPage.sections as Array<{ heading?: string; content: string[] }> || []).filter((_, j) => j !== i);
                            setEditingPage({ ...editingPage, sections: sections });
                          }}
                          className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={(section.content || []).join('\n')}
                        onChange={(e) => {
                          const sections = [...(editingPage.sections as Array<{ heading?: string; content: string[] }> || [])];
                          sections[i] = { ...sections[i], content: e.target.value.split('\n') };
                          setEditingPage({ ...editingPage, sections: sections });
                        }}
                        placeholder="Content (one paragraph per line, use **bold** for emphasis)"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const sections = [...(editingPage.sections as Array<{ heading?: string; content: string[] }> || []), { heading: '', content: [] }];
                      setEditingPage({ ...editingPage, sections: sections });
                    }}
                    className="text-sm text-coral hover:underline"
                  >
                    + Add section
                  </button>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => !isSaving && setEditingPage(null)}
                disabled={isSaving}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={savePage}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-coral text-white rounded-lg font-medium hover:bg-coral/90 disabled:opacity-50 transition-colors"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Page
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
