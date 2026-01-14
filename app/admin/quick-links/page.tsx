'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { Button, Card, Input, Modal, Select } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Link as LinkIcon,
  GripVertical,
  ExternalLink,
  Eye,
  EyeOff,
  Menu,
} from 'lucide-react';

interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  section: 'discover' | 'community' | 'account' | 'custom';
  sort_order: number;
  is_active: boolean;
  is_external: boolean;
  created_at: string;
}

const sectionLabels: Record<string, string> = {
  discover: 'Discover',
  community: 'Community',
  account: 'Account',
  custom: 'Custom Links',
};

const defaultLinks: Omit<QuickLink, 'id' | 'created_at'>[] = [
  { title: 'All Shops', url: '/shops', icon: '🛍️', section: 'discover', sort_order: 1, is_active: true, is_external: false },
  { title: "What's On", url: '/events', icon: '📅', section: 'discover', sort_order: 2, is_active: true, is_external: false },
  { title: 'Map', url: '/map', icon: '🗺️', section: 'discover', sort_order: 3, is_active: true, is_external: false },
  { title: 'Local Info', url: '/info', icon: 'ℹ️', section: 'discover', sort_order: 4, is_active: true, is_external: false },
  { title: 'Deals & Offers', url: '/offers', icon: '🏷️', section: 'discover', sort_order: 5, is_active: true, is_external: false },
  { title: 'Trending', url: '/trending', icon: '🔥', section: 'discover', sort_order: 6, is_active: true, is_external: false },
  { title: 'Ask a Local', url: '/ask', icon: '❓', section: 'community', sort_order: 1, is_active: true, is_external: false },
  { title: 'Photos', url: '/photos', icon: '📷', section: 'community', sort_order: 2, is_active: true, is_external: false },
  { title: 'Awards', url: '/awards', icon: '🏆', section: 'community', sort_order: 3, is_active: true, is_external: false },
  { title: 'Dog Walks', url: '/dogs', icon: '🐕', section: 'community', sort_order: 4, is_active: true, is_external: false },
  { title: 'Leaderboard', url: '/leaderboard', icon: '📊', section: 'community', sort_order: 5, is_active: true, is_external: false },
];

const popularEmojis = ['🛍️', '📅', '🗺️', 'ℹ️', '🏷️', '🔥', '❓', '📷', '🏆', '🐕', '📊', '❤️', '👤', '🔔', '📈', '🎉', '☕', '🦪', '🍽️', '🏠', '🎨', '📚', '⛵', '🌊', '🌅'];

export default function QuickLinksPage() {
  const router = useRouter();
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [hasCustomLinks, setHasCustomLinks] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: '🔗',
    section: 'custom' as 'discover' | 'community' | 'account' | 'custom',
    sort_order: 1,
    is_active: true,
    is_external: false,
  });

  useEffect(() => {
    fetchData();
  }, [router]);

  async function fetchData() {
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/admin/quick-links');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/admin');
        return;
      }

      // Try to fetch custom quick links
      const { data, error } = await supabase
        .from('quick_links')
        .select('*')
        .order('section')
        .order('sort_order');

      if (!error && data && data.length > 0) {
        setLinks(data);
        setHasCustomLinks(true);
      } else {
        // Use default links if table doesn't exist or is empty
        setLinks(defaultLinks.map((link, index) => ({
          ...link,
          id: `default-${index}`,
          created_at: new Date().toISOString(),
        })));
        setHasCustomLinks(false);
      }
    } catch (error) {
      console.error('Error fetching quick links:', error);
      // Fallback to default links
      setLinks(defaultLinks.map((link, index) => ({
        ...link,
        id: `default-${index}`,
        created_at: new Date().toISOString(),
      })));
    } finally {
      setIsLoading(false);
    }
  }

  async function initializeLinks() {
    setIsSaving(true);
    try {
      const supabase = createClient();

      // Insert all default links
      const linksToInsert = defaultLinks.map((link) => ({
        title: link.title,
        url: link.url,
        icon: link.icon,
        section: link.section,
        sort_order: link.sort_order,
        is_active: link.is_active,
        is_external: link.is_external,
      }));

      const { error } = await supabase.from('quick_links').insert(linksToInsert);

      if (!error) {
        setHasCustomLinks(true);
        fetchData();
      } else {
        console.error('Error initializing links:', error);
        alert('Could not initialize links. The quick_links table may not exist.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  }

  // Group links by section
  const linksBySection = links.reduce((acc, link) => {
    if (!acc[link.section]) acc[link.section] = [];
    acc[link.section].push(link);
    return acc;
  }, {} as Record<string, QuickLink[]>);

  function openCreateModal() {
    setEditingLink(null);
    const maxOrder = Math.max(0, ...links.filter(l => l.section === 'custom').map(l => l.sort_order));
    setFormData({
      title: '',
      url: '',
      icon: '🔗',
      section: 'custom',
      sort_order: maxOrder + 1,
      is_active: true,
      is_external: false,
    });
    setIsModalOpen(true);
  }

  function openEditModal(link: QuickLink) {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      icon: link.icon,
      section: link.section,
      sort_order: link.sort_order,
      is_active: link.is_active,
      is_external: link.is_external,
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!formData.title || !formData.url) return;

    setIsSaving(true);
    try {
      const supabase = createClient();

      const linkData = {
        title: formData.title,
        url: formData.url,
        icon: formData.icon,
        section: formData.section,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
        is_external: formData.is_external || formData.url.startsWith('http'),
      };

      if (editingLink && !editingLink.id.startsWith('default-')) {
        await supabase.from('quick_links').update(linkData).eq('id', editingLink.id);
      } else {
        await supabase.from('quick_links').insert(linkData);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving link:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(linkId: string) {
    if (linkId.startsWith('default-')) {
      setShowDeleteConfirm(null);
      return;
    }

    try {
      const supabase = createClient();
      await supabase.from('quick_links').delete().eq('id', linkId);
      setShowDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  }

  async function toggleActive(link: QuickLink) {
    if (link.id.startsWith('default-') || !hasCustomLinks) return;

    try {
      const supabase = createClient();
      await supabase
        .from('quick_links')
        .update({ is_active: !link.is_active })
        .eq('id', link.id);
      fetchData();
    } catch (error) {
      console.error('Error updating link:', error);
    }
  }

  async function moveLink(linkId: string, direction: 'up' | 'down', section: string) {
    if (!hasCustomLinks) return;

    const sectionLinks = linksBySection[section] || [];
    const index = sectionLinks.findIndex((l) => l.id === linkId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sectionLinks.length - 1)
    ) {
      return;
    }

    const supabase = createClient();
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const currentLink = sectionLinks[index];
    const swapLink = sectionLinks[newIndex];

    await Promise.all([
      supabase
        .from('quick_links')
        .update({ sort_order: swapLink.sort_order })
        .eq('id', currentLink.id),
      supabase
        .from('quick_links')
        .update({ sort_order: currentLink.sort_order })
        .eq('id', swapLink.id),
    ]);

    fetchData();
  }

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-sky px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-white font-bold text-xl">quick links</h1>
          </div>
        </div>
        <div className="px-4 py-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-4 bg-grey-light rounded w-3/4 mb-2" />
              <div className="h-3 bg-grey-light rounded w-1/2" />
            </Card>
          ))}
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-sky px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-white font-bold text-xl">quick links</h1>
              <p className="text-white/80 text-xs">Menu navigation links</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={openCreateModal} disabled={!hasCustomLinks}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Initialize Button */}
      {!hasCustomLinks && (
        <div className="px-4 py-3 bg-yellow/10 border-b border-yellow/20">
          <p className="text-sm text-ink mb-2">
            Quick links are using default values. Initialize to customize them.
          </p>
          <Button size="sm" variant="coral" onClick={initializeLinks} isLoading={isSaving}>
            Initialize Custom Links
          </Button>
        </div>
      )}

      {/* Links List */}
      <div className="px-4 py-4 space-y-6 pb-24">
        {['discover', 'community', 'account', 'custom'].map((section) => {
          const sectionLinks = linksBySection[section] || [];
          if (sectionLinks.length === 0 && section !== 'custom') return null;

          return (
            <div key={section}>
              <h2 className="font-bold text-ink mb-3 flex items-center gap-2">
                <Menu className="w-4 h-4 text-sky" />
                {sectionLabels[section]}
              </h2>
              <div className="space-y-2">
                {sectionLinks.map((link, index) => (
                  <Card key={link.id} className={`relative ${!link.is_active ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      {/* Reorder buttons */}
                      {hasCustomLinks && (
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveLink(link.id, 'up', section)}
                            disabled={index === 0}
                            className="p-0.5 text-grey hover:text-ink disabled:opacity-30"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 15l-6-6-6 6" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveLink(link.id, 'down', section)}
                            disabled={index === sectionLinks.length - 1}
                            className="p-0.5 text-grey hover:text-ink disabled:opacity-30"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Icon */}
                      <div className="w-9 h-9 rounded-lg bg-sky-light flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">{link.icon}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-ink text-sm">{link.title}</h3>
                          {link.is_external && (
                            <ExternalLink className="w-3 h-3 text-grey" />
                          )}
                        </div>
                        <p className="text-xs text-grey truncate">{link.url}</p>
                      </div>

                      {/* Actions */}
                      {hasCustomLinks && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleActive(link)}
                            className={`p-1.5 rounded-lg ${
                              link.is_active ? 'bg-green/20 text-green' : 'bg-grey-light text-grey'
                            }`}
                            title={link.is_active ? 'Hide' : 'Show'}
                          >
                            {link.is_active ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openEditModal(link)}
                            className="p-1.5 bg-sky-light text-sky rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(link.id)}
                            className="p-1.5 bg-coral-light text-coral rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {showDeleteConfirm === link.id && (
                      <div className="absolute inset-0 bg-white rounded-card flex items-center justify-center gap-3 p-4">
                        <p className="text-sm text-ink">Delete this link?</p>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(link.id)}>
                          Delete
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowDeleteConfirm(null)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}

                {section === 'custom' && sectionLinks.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-grey-light rounded-card">
                    <LinkIcon className="w-8 h-8 text-grey-light mx-auto mb-2" />
                    <p className="text-sm text-grey">No custom links yet</p>
                    {hasCustomLinks && (
                      <Button size="sm" variant="ghost" onClick={openCreateModal} className="mt-2">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Custom Link
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLink ? 'Edit Link' : 'Add New Link'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Beach Guide"
          />

          <Input
            label="URL *"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="/page or https://..."
            helperText="Use /path for internal links or full URL for external"
          />

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {popularEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-colors ${
                    formData.icon === emoji
                      ? 'bg-sky text-white'
                      : 'bg-grey-light hover:bg-grey-light/70'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <Input
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Or type any emoji"
            />
          </div>

          <Select
            label="Section"
            value={formData.section}
            onChange={(e) =>
              setFormData({
                ...formData,
                section: e.target.value as 'discover' | 'community' | 'account' | 'custom',
              })
            }
          >
            <option value="discover">Discover</option>
            <option value="community">Community</option>
            <option value="account">Account</option>
            <option value="custom">Custom Links</option>
          </Select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_external || formData.url.startsWith('http')}
              onChange={(e) => setFormData({ ...formData, is_external: e.target.checked })}
              className="w-5 h-5 rounded border-grey-light text-sky focus:ring-sky"
            />
            <span className="text-sm text-ink">External link (opens in new tab)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-grey-light text-green focus:ring-green"
            />
            <span className="text-sm text-ink">Active (visible in menu)</span>
          </label>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="coral" onClick={handleSave} isLoading={isSaving} className="flex-1">
              {editingLink ? 'Save Changes' : 'Add Link'}
            </Button>
          </div>
        </div>
      </Modal>

      <BottomNav />
    </MobileWrapper>
  );
}
