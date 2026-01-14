'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { Button, Card, Input, Modal, Select, Textarea, Badge } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Megaphone,
  Calendar,
  Trophy,
  BookOpen,
  Camera,
  Eye,
  Star,
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  hero_image_url: string | null;
  campaign_type: 'awards' | 'guide' | 'competition' | 'promotion' | 'seasonal';
  content: Record<string, unknown> | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

const campaignTypeIcons: Record<string, React.ElementType> = {
  awards: Trophy,
  guide: BookOpen,
  competition: Camera,
  promotion: Megaphone,
  seasonal: Calendar,
};

const campaignTypeLabels: Record<string, string> = {
  awards: 'Awards',
  guide: 'Guide',
  competition: 'Competition',
  promotion: 'Promotion',
  seasonal: 'Seasonal',
};

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    hero_image_url: '',
    campaign_type: 'promotion' as 'awards' | 'guide' | 'competition' | 'promotion' | 'seasonal',
    start_date: '',
    end_date: '',
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    fetchData();
  }, [router]);

  async function fetchData() {
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/admin/campaigns');
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

      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function openCreateModal() {
    setEditingCampaign(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      hero_image_url: '',
      campaign_type: 'promotion',
      start_date: '',
      end_date: '',
      is_active: true,
      is_featured: false,
    });
    setIsModalOpen(true);
  }

  function openEditModal(campaign: Campaign) {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      slug: campaign.slug,
      description: campaign.description || '',
      hero_image_url: campaign.hero_image_url || '',
      campaign_type: campaign.campaign_type,
      start_date: campaign.start_date || '',
      end_date: campaign.end_date || '',
      is_active: campaign.is_active,
      is_featured: campaign.is_featured,
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!formData.title) return;

    setIsSaving(true);
    try {
      const supabase = createClient();

      const campaignData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        description: formData.description || null,
        hero_image_url: formData.hero_image_url || null,
        campaign_type: formData.campaign_type,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
      };

      if (editingCampaign) {
        await supabase.from('campaigns').update(campaignData).eq('id', editingCampaign.id);
      } else {
        await supabase.from('campaigns').insert(campaignData);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(campaignId: string) {
    try {
      const supabase = createClient();
      await supabase.from('campaigns').delete().eq('id', campaignId);
      setShowDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  }

  async function toggleActive(campaign: Campaign) {
    try {
      const supabase = createClient();
      await supabase.from('campaigns').update({ is_active: !campaign.is_active }).eq('id', campaign.id);
      fetchData();
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  }

  async function toggleFeatured(campaign: Campaign) {
    try {
      const supabase = createClient();
      await supabase.from('campaigns').update({ is_featured: !campaign.is_featured }).eq('id', campaign.id);
      fetchData();
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  }

  // Separate active and inactive
  const activeCampaigns = campaigns.filter((c) => c.is_active);
  const inactiveCampaigns = campaigns.filter((c) => !c.is_active);

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-coral px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-white font-bold text-xl">campaigns</h1>
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
      <div className="bg-coral px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-white font-bold text-xl">campaigns</h1>
              <p className="text-white/80 text-xs">{campaigns.length} campaigns</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="px-4 py-4 space-y-6 pb-24">
        {/* Active Campaigns */}
        {activeCampaigns.length > 0 && (
          <div>
            <h2 className="font-bold text-ink mb-3 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-green" />
              Active Campaigns ({activeCampaigns.length})
            </h2>
            <div className="space-y-3">
              {activeCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onEdit={() => openEditModal(campaign)}
                  onDelete={() => setShowDeleteConfirm(campaign.id)}
                  onToggleActive={() => toggleActive(campaign)}
                  onToggleFeatured={() => toggleFeatured(campaign)}
                  showDeleteConfirm={showDeleteConfirm === campaign.id}
                  onConfirmDelete={() => handleDelete(campaign.id)}
                  onCancelDelete={() => setShowDeleteConfirm(null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Inactive Campaigns */}
        {inactiveCampaigns.length > 0 && (
          <div>
            <h2 className="font-bold text-grey mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Inactive ({inactiveCampaigns.length})
            </h2>
            <div className="space-y-3 opacity-60">
              {inactiveCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onEdit={() => openEditModal(campaign)}
                  onDelete={() => setShowDeleteConfirm(campaign.id)}
                  onToggleActive={() => toggleActive(campaign)}
                  onToggleFeatured={() => toggleFeatured(campaign)}
                  showDeleteConfirm={showDeleteConfirm === campaign.id}
                  onConfirmDelete={() => handleDelete(campaign.id)}
                  onCancelDelete={() => setShowDeleteConfirm(null)}
                />
              ))}
            </div>
          </div>
        )}

        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="w-12 h-12 text-grey-light mx-auto mb-3" />
            <p className="text-grey">No campaigns found</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Campaign Title *"
            value={formData.title}
            onChange={(e) => {
              setFormData({
                ...formData,
                title: e.target.value,
                slug: editingCampaign ? formData.slug : generateSlug(e.target.value),
              });
            }}
            placeholder="e.g. Summer Beach Guide 2025"
          />

          <Input
            label="URL Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="summer-beach-guide-2025"
            helperText="Auto-generated from title"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the campaign..."
            rows={3}
          />

          <Input
            label="Hero Image URL"
            value={formData.hero_image_url}
            onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
            placeholder="https://..."
          />

          <Select
            label="Campaign Type"
            value={formData.campaign_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                campaign_type: e.target.value as 'awards' | 'guide' | 'competition' | 'promotion' | 'seasonal',
              })
            }
          >
            <option value="promotion">Promotion</option>
            <option value="seasonal">Seasonal</option>
            <option value="guide">Guide</option>
            <option value="awards">Awards</option>
            <option value="competition">Competition</option>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-grey-light text-green focus:ring-green"
              />
              <span className="text-sm text-ink">Active (visible on site)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 rounded border-grey-light text-yellow focus:ring-yellow"
              />
              <span className="text-sm text-ink">Featured Campaign</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="coral" onClick={handleSave} isLoading={isSaving} className="flex-1">
              {editingCampaign ? 'Save Changes' : 'Create Campaign'}
            </Button>
          </div>
        </div>
      </Modal>

      <BottomNav />
    </MobileWrapper>
  );
}

function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  showDeleteConfirm,
  onConfirmDelete,
  onCancelDelete,
}: {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onToggleFeatured: () => void;
  showDeleteConfirm: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const Icon = campaignTypeIcons[campaign.campaign_type] || Megaphone;

  return (
    <Card className="relative">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-coral-light flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-coral" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-ink truncate">{campaign.title}</h3>
            {campaign.is_featured && (
              <Star className="w-4 h-4 text-yellow fill-yellow flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default">{campaignTypeLabels[campaign.campaign_type]}</Badge>
            {campaign.start_date && (
              <span className="text-xs text-grey">
                {new Date(campaign.start_date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}
                {campaign.end_date && (
                  <>
                    {' - '}
                    {new Date(campaign.end_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </>
                )}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleFeatured}
            className={`p-2 rounded-lg ${
              campaign.is_featured ? 'bg-yellow/20 text-yellow' : 'bg-grey-light text-grey'
            }`}
            title={campaign.is_featured ? 'Remove featured' : 'Make featured'}
          >
            <Star className={`w-4 h-4 ${campaign.is_featured ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 bg-sky-light text-sky rounded-lg"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-coral-light text-coral rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white rounded-card flex items-center justify-center gap-3 p-4">
          <p className="text-sm text-ink">Delete this campaign?</p>
          <Button size="sm" variant="danger" onClick={onConfirmDelete}>
            Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancelDelete}>
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}
