'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { Button, Card, Input, Modal, Textarea, Badge, ProgressBar } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Plus,
  Search,
  Edit2,
  Trash2,
  Heart,
  Globe,
  ExternalLink,
  Target,
  Star,
} from 'lucide-react';

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  donation_url: string | null;
  current_campaign: string | null;
  target_amount: number | null;
  raised_amount: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export default function CharitiesPage() {
  const router = useRouter();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState<Charity | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logo_url: '',
    website: '',
    donation_url: '',
    current_campaign: '',
    target_amount: '',
    raised_amount: '',
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, [router]);

  async function fetchData() {
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirect=/admin/charities');
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
        .from('charities')
        .select('*')
        .order('name');

      setCharities(data || []);
    } catch (error) {
      console.error('Error fetching charities:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredCharities = charities.filter((charity) =>
    charity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function openCreateModal() {
    setEditingCharity(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      logo_url: '',
      website: '',
      donation_url: '',
      current_campaign: '',
      target_amount: '',
      raised_amount: '',
      is_featured: false,
      is_active: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(charity: Charity) {
    setEditingCharity(charity);
    setFormData({
      name: charity.name,
      slug: charity.slug,
      description: charity.description || '',
      logo_url: charity.logo_url || '',
      website: charity.website || '',
      donation_url: charity.donation_url || '',
      current_campaign: charity.current_campaign || '',
      target_amount: charity.target_amount?.toString() || '',
      raised_amount: charity.raised_amount?.toString() || '0',
      is_featured: charity.is_featured,
      is_active: charity.is_active,
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!formData.name) return;

    setIsSaving(true);
    try {
      const supabase = createClient();

      const charityData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || null,
        logo_url: formData.logo_url || null,
        website: formData.website || null,
        donation_url: formData.donation_url || null,
        current_campaign: formData.current_campaign || null,
        target_amount: formData.target_amount ? parseFloat(formData.target_amount) : null,
        raised_amount: formData.raised_amount ? parseFloat(formData.raised_amount) : 0,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
      };

      if (editingCharity) {
        await supabase.from('charities').update(charityData).eq('id', editingCharity.id);
      } else {
        await supabase.from('charities').insert(charityData);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving charity:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(charityId: string) {
    try {
      const supabase = createClient();
      await supabase.from('charities').delete().eq('id', charityId);
      setShowDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting charity:', error);
    }
  }

  async function toggleFeatured(charity: Charity) {
    try {
      const supabase = createClient();
      await supabase
        .from('charities')
        .update({ is_featured: !charity.is_featured })
        .eq('id', charity.id);
      fetchData();
    } catch (error) {
      console.error('Error updating charity:', error);
    }
  }

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-green px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-white font-bold text-xl">charities</h1>
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
      <div className="bg-green px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-white font-bold text-xl">charities</h1>
              <p className="text-white/80 text-xs">{charities.length} charity partners</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 bg-white border-b border-grey-light">
        <Input
          placeholder="Search charities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Charities List */}
      <div className="px-4 py-4 space-y-3 pb-24">
        {filteredCharities.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-grey-light mx-auto mb-3" />
            <p className="text-grey">No charities found</p>
          </div>
        ) : (
          filteredCharities.map((charity) => (
            <Card key={charity.id} className="relative">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0">
                  {charity.logo_url ? (
                    <img
                      src={charity.logo_url}
                      alt={charity.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <Heart className="w-6 h-6 text-green" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink truncate">{charity.name}</h3>
                    {charity.is_featured && (
                      <Star className="w-4 h-4 text-yellow fill-yellow flex-shrink-0" />
                    )}
                    {!charity.is_active && (
                      <Badge variant="danger">Inactive</Badge>
                    )}
                  </div>
                  {charity.current_campaign && (
                    <p className="text-sm text-green font-medium truncate">
                      {charity.current_campaign}
                    </p>
                  )}
                  {charity.target_amount && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-grey mb-1">
                        <span>£{charity.raised_amount.toLocaleString()} raised</span>
                        <span>£{charity.target_amount.toLocaleString()} goal</span>
                      </div>
                      <ProgressBar
                        value={(charity.raised_amount / charity.target_amount) * 100}
                        variant="success"
                        size="sm"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFeatured(charity)}
                    className={`p-2 rounded-lg ${
                      charity.is_featured ? 'bg-yellow/20 text-yellow' : 'bg-grey-light text-grey'
                    }`}
                    title={charity.is_featured ? 'Remove featured' : 'Make featured'}
                  >
                    <Star className={`w-4 h-4 ${charity.is_featured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => openEditModal(charity)}
                    className="p-2 bg-sky-light text-sky rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(charity.id)}
                    className="p-2 bg-coral-light text-coral rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showDeleteConfirm === charity.id && (
                <div className="absolute inset-0 bg-white rounded-card flex items-center justify-center gap-3 p-4">
                  <p className="text-sm text-ink">Delete this charity?</p>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(charity.id)}>
                    Delete
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowDeleteConfirm(null)}>
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCharity ? 'Edit Charity' : 'Add New Charity'}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Charity Name *"
            value={formData.name}
            onChange={(e) => {
              setFormData({
                ...formData,
                name: e.target.value,
                slug: editingCharity ? formData.slug : generateSlug(e.target.value),
              });
            }}
            placeholder="e.g. RNLI Whitstable"
          />

          <Input
            label="URL Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="rnli-whitstable"
            helperText="Auto-generated from name"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the charity and its mission..."
            rows={3}
          />

          <Input
            label="Logo URL"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            placeholder="https://..."
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://..."
              leftIcon={<Globe className="w-4 h-4" />}
            />
            <Input
              label="Donation URL"
              value={formData.donation_url}
              onChange={(e) => setFormData({ ...formData, donation_url: e.target.value })}
              placeholder="https://..."
              leftIcon={<ExternalLink className="w-4 h-4" />}
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold text-ink mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-green" />
              Fundraising Campaign
            </h4>

            <Input
              label="Campaign Name"
              value={formData.current_campaign}
              onChange={(e) => setFormData({ ...formData, current_campaign: e.target.value })}
              placeholder="e.g. 2025 Lifeboat Fund"
            />

            <div className="grid grid-cols-2 gap-3 mt-3">
              <Input
                label="Target Amount (£)"
                type="number"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                placeholder="10000"
              />
              <Input
                label="Raised Amount (£)"
                type="number"
                value={formData.raised_amount}
                onChange={(e) => setFormData({ ...formData, raised_amount: e.target.value })}
                placeholder="5000"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 rounded border-grey-light text-green focus:ring-green"
              />
              <span className="text-sm text-ink">Featured Charity</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-grey-light text-green focus:ring-green"
              />
              <span className="text-sm text-ink">Active (visible on site)</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="coral" onClick={handleSave} isLoading={isSaving} className="flex-1">
              {editingCharity ? 'Save Changes' : 'Create Charity'}
            </Button>
          </div>
        </div>
      </Modal>

      <BottomNav />
    </MobileWrapper>
  );
}
