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
  Search,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Globe,
  Instagram,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  MoreVertical,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface Shop {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category_id: string | null;
  category?: Category;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  address_line1: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: Record<string, { open: string; close: string }> | null;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  is_verified: boolean;
  created_at: string;
}

const defaultOpeningHours = {
  monday: { open: '09:00', close: '17:00' },
  tuesday: { open: '09:00', close: '17:00' },
  wednesday: { open: '09:00', close: '17:00' },
  thursday: { open: '09:00', close: '17:00' },
  friday: { open: '09:00', close: '17:00' },
  saturday: { open: '09:00', close: '17:00' },
  sunday: { open: '10:00', close: '16:00' },
};

export default function DirectoryPage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    category_id: '',
    phone: '',
    email: '',
    website: '',
    instagram: '',
    address_line1: '',
    postcode: '',
    latitude: '',
    longitude: '',
    status: 'approved' as 'pending' | 'approved' | 'rejected',
    is_featured: false,
    opening_hours: defaultOpeningHours as Record<string, { open: string; close: string }>,
  });

  useEffect(() => {
    fetchData();
  }, [router]);

  async function fetchData() {
    try {
      const supabase = createClient();

      // Check admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirect=/admin/directory');
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

      // Fetch shops and categories
      const [shopsRes, categoriesRes] = await Promise.all([
        supabase
          .from('shops')
          .select('*, category:categories(id, name, slug, icon)')
          .order('name'),
        supabase.from('categories').select('*').order('sort_order'),
      ]);

      setShops(shopsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.address_line1?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || shop.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || shop.category_id === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  function openCreateModal() {
    setEditingShop(null);
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      description: '',
      category_id: '',
      phone: '',
      email: '',
      website: '',
      instagram: '',
      address_line1: '',
      postcode: '',
      latitude: '',
      longitude: '',
      status: 'approved',
      is_featured: false,
      opening_hours: defaultOpeningHours,
    });
    setIsModalOpen(true);
  }

  function openEditModal(shop: Shop) {
    setEditingShop(shop);
    setFormData({
      name: shop.name,
      slug: shop.slug,
      tagline: shop.tagline || '',
      description: shop.description || '',
      category_id: shop.category_id || '',
      phone: shop.phone || '',
      email: shop.email || '',
      website: shop.website || '',
      instagram: shop.instagram || '',
      address_line1: shop.address_line1 || '',
      postcode: shop.postcode || '',
      latitude: shop.latitude?.toString() || '',
      longitude: shop.longitude?.toString() || '',
      status: shop.status,
      is_featured: shop.is_featured,
      opening_hours: shop.opening_hours || defaultOpeningHours,
    });
    setIsModalOpen(true);
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleSave() {
    if (!formData.name) return;

    setIsSaving(true);
    try {
      const supabase = createClient();

      const shopData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        tagline: formData.tagline || null,
        description: formData.description || null,
        category_id: formData.category_id || null,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        instagram: formData.instagram || null,
        address_line1: formData.address_line1 || null,
        postcode: formData.postcode || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        status: formData.status,
        is_featured: formData.is_featured,
        opening_hours: formData.opening_hours,
      };

      if (editingShop) {
        await supabase.from('shops').update(shopData).eq('id', editingShop.id);
      } else {
        await supabase.from('shops').insert(shopData);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving shop:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(shopId: string) {
    try {
      const supabase = createClient();
      await supabase.from('shops').delete().eq('id', shopId);
      setShowDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  }

  async function toggleFeatured(shop: Shop) {
    try {
      const supabase = createClient();
      await supabase
        .from('shops')
        .update({ is_featured: !shop.is_featured })
        .eq('id', shop.id);
      fetchData();
    } catch (error) {
      console.error('Error updating shop:', error);
    }
  }

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-coral px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-white font-bold text-xl">local directory</h1>
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
              <h1 className="text-white font-bold text-xl">local directory</h1>
              <p className="text-white/80 text-xs">{shops.length} businesses</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 bg-white border-b border-grey-light space-y-3">
        <Input
          placeholder="Search shops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
        <div className="flex gap-2">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </Select>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Shops List */}
      <div className="px-4 py-4 space-y-3 pb-24">
        {filteredShops.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-grey-light mx-auto mb-3" />
            <p className="text-grey">No shops found</p>
          </div>
        ) : (
          filteredShops.map((shop) => (
            <Card key={shop.id} className="relative">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-coral-light flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{shop.category?.icon || '🏪'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink truncate">{shop.name}</h3>
                    {shop.is_featured && (
                      <Star className="w-4 h-4 text-yellow fill-yellow flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-grey truncate">{shop.tagline || shop.address_line1}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant={
                        shop.status === 'approved'
                          ? 'success'
                          : shop.status === 'pending'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {shop.status}
                    </Badge>
                    <span className="text-xs text-grey">{shop.category?.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFeatured(shop)}
                    className={`p-2 rounded-lg ${
                      shop.is_featured ? 'bg-yellow/20 text-yellow' : 'bg-grey-light text-grey'
                    }`}
                    title={shop.is_featured ? 'Remove featured' : 'Make featured'}
                  >
                    <Star className={`w-4 h-4 ${shop.is_featured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => openEditModal(shop)}
                    className="p-2 bg-sky-light text-sky rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(shop.id)}
                    className="p-2 bg-coral-light text-coral rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm === shop.id && (
                <div className="absolute inset-0 bg-white rounded-card flex items-center justify-center gap-3 p-4">
                  <p className="text-sm text-ink">Delete this shop?</p>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(shop.id)}>
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
        title={editingShop ? 'Edit Shop' : 'Add New Shop'}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Shop Name *"
            value={formData.name}
            onChange={(e) => {
              setFormData({
                ...formData,
                name: e.target.value,
                slug: editingShop ? formData.slug : generateSlug(e.target.value),
              });
            }}
            placeholder="e.g. Wheeler's Oyster Bar"
          />

          <Input
            label="URL Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="wheelers-oyster-bar"
            helperText="Auto-generated from name"
          />

          <Input
            label="Tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="A short catchy phrase"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the shop..."
            rows={3}
          />

          <Select
            label="Category"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01227 123456"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="hello@shop.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://..."
            />
            <Input
              label="Instagram"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="@handle"
            />
          </div>

          <Input
            label="Address"
            value={formData.address_line1}
            onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
            placeholder="123 High Street"
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Postcode"
              value={formData.postcode}
              onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
              placeholder="CT5 1BQ"
            />
            <Input
              label="Latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              placeholder="51.36"
            />
            <Input
              label="Longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              placeholder="1.02"
            />
          </div>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as 'approved' | 'pending' | 'rejected' })
            }
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </Select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 rounded border-grey-light text-coral focus:ring-coral"
            />
            <span className="text-sm text-ink">Featured Shop</span>
          </label>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="coral" onClick={handleSave} isLoading={isSaving} className="flex-1">
              {editingShop ? 'Save Changes' : 'Create Shop'}
            </Button>
          </div>
        </div>
      </Modal>

      <BottomNav />
    </MobileWrapper>
  );
}
