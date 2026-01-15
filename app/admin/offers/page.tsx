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
  Tag,
  Calendar,
  Store,
  Percent,
  Gift,
  Package,
  CreditCard,
} from 'lucide-react';
import { EmptyState, AdminSkeleton } from '@/components/admin';

interface Shop {
  id: string;
  name: string;
  slug: string;
}

interface Offer {
  id: string;
  shop_id: string | null;
  shop?: Shop;
  title: string;
  description: string | null;
  valid_from: string;
  valid_until: string | null;
  is_ongoing: boolean;
  terms: string | null;
  offer_type: 'discount' | 'freebie' | 'bundle' | 'loyalty';
  is_active: boolean;
  view_count: number;
  created_at: string;
}

const offerTypeIcons: Record<string, React.ElementType> = {
  discount: Percent,
  freebie: Gift,
  bundle: Package,
  loyalty: CreditCard,
};

const offerTypeLabels: Record<string, string> = {
  discount: 'Discount',
  freebie: 'Freebie',
  bundle: 'Bundle Deal',
  loyalty: 'Loyalty',
};

export default function OffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    shop_id: '',
    title: '',
    description: '',
    valid_from: '',
    valid_until: '',
    is_ongoing: false,
    terms: '',
    offer_type: 'discount' as 'discount' | 'freebie' | 'bundle' | 'loyalty',
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
        router.push('/auth/login?redirect=/admin/offers');
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

      const [offersRes, shopsRes] = await Promise.all([
        supabase
          .from('offers')
          .select('*, shop:shops(id, name, slug)')
          .order('created_at', { ascending: false }),
        supabase.from('shops').select('id, name, slug').eq('status', 'approved').order('name'),
      ]);

      setOffers(offersRes.data || []);
      setShops(shopsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.shop?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || offer.offer_type === filterType;
    return matchesSearch && matchesType;
  });

  // Separate active and expired offers
  const now = new Date();
  const activeOffers = filteredOffers.filter(
    (o) => o.is_active && (o.is_ongoing || !o.valid_until || new Date(o.valid_until) >= now)
  );
  const expiredOffers = filteredOffers.filter(
    (o) => !o.is_active || (!o.is_ongoing && o.valid_until && new Date(o.valid_until) < now)
  );

  function openCreateModal() {
    setEditingOffer(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      shop_id: '',
      title: '',
      description: '',
      valid_from: today,
      valid_until: '',
      is_ongoing: false,
      terms: '',
      offer_type: 'discount',
      is_active: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(offer: Offer) {
    setEditingOffer(offer);
    setFormData({
      shop_id: offer.shop_id || '',
      title: offer.title,
      description: offer.description || '',
      valid_from: offer.valid_from,
      valid_until: offer.valid_until || '',
      is_ongoing: offer.is_ongoing,
      terms: offer.terms || '',
      offer_type: offer.offer_type,
      is_active: offer.is_active,
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!formData.title || !formData.shop_id) return;

    setIsSaving(true);
    try {
      const supabase = createClient();

      const offerData = {
        shop_id: formData.shop_id,
        title: formData.title,
        description: formData.description || null,
        valid_from: formData.valid_from,
        valid_until: formData.is_ongoing ? null : formData.valid_until || null,
        is_ongoing: formData.is_ongoing,
        terms: formData.terms || null,
        offer_type: formData.offer_type,
        is_active: formData.is_active,
      };

      if (editingOffer) {
        await supabase.from('offers').update(offerData).eq('id', editingOffer.id);
      } else {
        await supabase.from('offers').insert(offerData);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving offer:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(offerId: string) {
    try {
      const supabase = createClient();
      await supabase.from('offers').delete().eq('id', offerId);
      setShowDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  }

  async function toggleActive(offer: Offer) {
    try {
      const supabase = createClient();
      await supabase.from('offers').update({ is_active: !offer.is_active }).eq('id', offer.id);
      fetchData();
    } catch (error) {
      console.error('Error updating offer:', error);
    }
  }

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-yellow px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-ink">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-ink font-bold text-xl">offers & deals</h1>
          </div>
        </div>
        <div className="px-4 py-6">
          <AdminSkeleton variant="list" count={4} />
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-yellow px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-ink">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-ink font-bold text-xl">offers & deals</h1>
              <p className="text-ink/70 text-xs">{offers.length} total offers</p>
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
          placeholder="Search offers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
        <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="discount">Discounts</option>
          <option value="freebie">Freebies</option>
          <option value="bundle">Bundle Deals</option>
          <option value="loyalty">Loyalty</option>
        </Select>
      </div>

      {/* Offers List */}
      <div className="px-4 py-4 space-y-6 pb-24">
        {/* Active Offers */}
        {activeOffers.length > 0 && (
          <div>
            <h2 className="font-bold text-ink mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-green" />
              Active Offers ({activeOffers.length})
            </h2>
            <div className="space-y-3">
              {activeOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onEdit={() => openEditModal(offer)}
                  onDelete={() => setShowDeleteConfirm(offer.id)}
                  onToggleActive={() => toggleActive(offer)}
                  showDeleteConfirm={showDeleteConfirm === offer.id}
                  onConfirmDelete={() => handleDelete(offer.id)}
                  onCancelDelete={() => setShowDeleteConfirm(null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Expired/Inactive Offers */}
        {expiredOffers.length > 0 && (
          <div>
            <h2 className="font-bold text-grey mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Expired/Inactive ({expiredOffers.length})
            </h2>
            <div className="space-y-3 opacity-60">
              {expiredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onEdit={() => openEditModal(offer)}
                  onDelete={() => setShowDeleteConfirm(offer.id)}
                  onToggleActive={() => toggleActive(offer)}
                  showDeleteConfirm={showDeleteConfirm === offer.id}
                  onConfirmDelete={() => handleDelete(offer.id)}
                  onCancelDelete={() => setShowDeleteConfirm(null)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredOffers.length === 0 && (
          <EmptyState
            icon={Tag}
            title="No offers found"
            description={searchQuery || filterType !== 'all' ? "Try adjusting your filters" : "Create your first offer to attract customers"}
            action={!searchQuery && filterType === 'all' ? { label: "Add Offer", onClick: openCreateModal } : undefined}
          />
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOffer ? 'Edit Offer' : 'Add New Offer'}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Select
            label="Shop *"
            value={formData.shop_id}
            onChange={(e) => setFormData({ ...formData, shop_id: e.target.value })}
          >
            <option value="">Select a shop</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </Select>

          <Input
            label="Offer Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. 10% off Tuesday lunches"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the offer..."
            rows={2}
          />

          <Select
            label="Offer Type"
            value={formData.offer_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                offer_type: e.target.value as 'discount' | 'freebie' | 'bundle' | 'loyalty',
              })
            }
          >
            <option value="discount">Discount</option>
            <option value="freebie">Freebie</option>
            <option value="bundle">Bundle Deal</option>
            <option value="loyalty">Loyalty</option>
          </Select>

          <Input
            label="Valid From"
            type="date"
            value={formData.valid_from}
            onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_ongoing}
              onChange={(e) => setFormData({ ...formData, is_ongoing: e.target.checked })}
              className="w-5 h-5 rounded border-grey-light text-yellow focus:ring-yellow"
            />
            <span className="text-sm text-ink">Ongoing (no end date)</span>
          </label>

          {!formData.is_ongoing && (
            <Input
              label="Valid Until"
              type="date"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
            />
          )}

          <Textarea
            label="Terms & Conditions"
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            placeholder="e.g. Not valid with other offers..."
            rows={2}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-grey-light text-green focus:ring-green"
            />
            <span className="text-sm text-ink">Active (visible on site)</span>
          </label>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="coral" onClick={handleSave} isLoading={isSaving} className="flex-1">
              {editingOffer ? 'Save Changes' : 'Create Offer'}
            </Button>
          </div>
        </div>
      </Modal>

      <BottomNav />
    </MobileWrapper>
  );
}

function OfferCard({
  offer,
  onEdit,
  onDelete,
  onToggleActive,
  showDeleteConfirm,
  onConfirmDelete,
  onCancelDelete,
}: {
  offer: Offer;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  showDeleteConfirm: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const Icon = offerTypeIcons[offer.offer_type] || Tag;

  return (
    <Card className="relative">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-yellow/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-yellow" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink truncate">{offer.title}</h3>
          <p className="text-sm text-grey truncate flex items-center gap-1">
            <Store className="w-3 h-3" />
            {offer.shop?.name || 'Unknown shop'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default">{offerTypeLabels[offer.offer_type]}</Badge>
            {offer.is_ongoing ? (
              <span className="text-xs text-green">Ongoing</span>
            ) : offer.valid_until ? (
              <span className="text-xs text-grey">
                Until {new Date(offer.valid_until).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleActive}
            className={`p-2 rounded-lg ${
              offer.is_active ? 'bg-green/20 text-green' : 'bg-grey-light text-grey'
            }`}
            title={offer.is_active ? 'Deactivate' : 'Activate'}
          >
            <div className={`w-4 h-4 rounded-full border-2 ${offer.is_active ? 'bg-green border-green' : 'border-grey'}`} />
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
          <p className="text-sm text-ink">Delete this offer?</p>
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
