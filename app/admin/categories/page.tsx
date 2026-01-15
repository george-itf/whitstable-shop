'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { Button, Card, Input, Modal } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  Tag,
  Store,
} from 'lucide-react';
import { EmptyState, AdminSkeleton } from '@/components/admin';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  shop_count?: number;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    color: '#6BA3BE',
    sort_order: 0,
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
        router.push('/auth/login?redirect=/admin/categories');
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

      // Fetch categories with shop counts
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      // Get shop counts per category
      const { data: shopCounts } = await supabase
        .from('shops')
        .select('category_id')
        .eq('status', 'approved');

      const countMap: Record<string, number> = {};
      shopCounts?.forEach((shop: { category_id: string | null }) => {
        if (shop.category_id) {
          countMap[shop.category_id] = (countMap[shop.category_id] || 0) + 1;
        }
      });

      const categoriesWithCounts = (categoriesData || []).map((cat: Category) => ({
        ...cat,
        shop_count: countMap[cat.id] || 0,
      }));

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function openCreateModal() {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      icon: '',
      color: '#6BA3BE',
      sort_order: categories.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      color: category.color,
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!formData.name) return;

    setIsSaving(true);
    try {
      const supabase = createClient();

      const categoryData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        icon: formData.icon || '🏪',
        color: formData.color,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
      };

      if (editingCategory) {
        await supabase.from('categories').update(categoryData).eq('id', editingCategory.id);
      } else {
        await supabase.from('categories').insert(categoryData);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(categoryId: string) {
    try {
      const supabase = createClient();
      await supabase.from('categories').delete().eq('id', categoryId);
      setShowDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }

  async function moveCategory(categoryId: string, direction: 'up' | 'down') {
    const index = categories.findIndex((c) => c.id === categoryId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categories.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const supabase = createClient();

    // Swap sort orders
    const currentCategory = categories[index];
    const swapCategory = categories[newIndex];

    await Promise.all([
      supabase
        .from('categories')
        .update({ sort_order: swapCategory.sort_order })
        .eq('id', currentCategory.id),
      supabase
        .from('categories')
        .update({ sort_order: currentCategory.sort_order })
        .eq('id', swapCategory.id),
    ]);

    fetchData();
  }

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-purple-600 px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-white font-bold text-xl">categories</h1>
          </div>
        </div>
        <div className="px-4 py-6">
          <AdminSkeleton variant="list" count={5} />
        </div>
        <BottomNav />
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-purple-600 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-white font-bold text-xl">categories</h1>
              <p className="text-white/80 text-xs">{categories.length} categories</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <div className="px-4 py-4 space-y-3 pb-24">
        {categories.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No categories found"
            description="Add your first category to organize shops"
            action={{ label: "Add Category", onClick: openCreateModal }}
          />
        ) : (
          categories.map((category, index) => (
            <Card key={category.id} className="relative">
              <div className="flex items-center gap-3">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveCategory(category.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-grey hover:text-ink disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveCategory(category.id, 'down')}
                    disabled={index === categories.length - 1}
                    className="p-1 text-grey hover:text-ink disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <span className="text-xl">{category.icon}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{category.name}</h3>
                    {!category.is_active && (
                      <span className="text-xs bg-grey-light text-grey px-2 py-0.5 rounded">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-grey flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    {category.shop_count} shop{category.shop_count !== 1 && 's'}
                  </p>
                </div>

                {/* Color Indicator */}
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: category.color }}
                />

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 bg-sky-light text-sky rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(category.id)}
                    className="p-2 bg-coral-light text-coral rounded-lg"
                    title="Delete"
                    disabled={(category.shop_count || 0) > 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showDeleteConfirm === category.id && (
                <div className="absolute inset-0 bg-white rounded-card flex items-center justify-center gap-3 p-4">
                  <p className="text-sm text-ink">Delete this category?</p>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(category.id)}>
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
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Category Name *"
            value={formData.name}
            onChange={(e) => {
              setFormData({
                ...formData,
                name: e.target.value,
                slug: editingCategory ? formData.slug : generateSlug(e.target.value),
              });
            }}
            placeholder="e.g. Café & Coffee"
          />

          <Input
            label="URL Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="cafe-coffee"
            helperText="Auto-generated from name"
          />

          <Input
            label="Icon (Emoji)"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="☕"
            helperText="Use an emoji like ☕ 🍽️ 📚"
          />

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-12 h-12 rounded-lg border border-grey-light cursor-pointer"
              />
              <Input
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#6BA3BE"
                className="flex-1"
              />
            </div>
          </div>

          <Input
            label="Sort Order"
            type="number"
            value={formData.sort_order.toString()}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            helperText="Lower numbers appear first"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-grey-light text-purple-600 focus:ring-purple-600"
            />
            <span className="text-sm text-ink">Active (visible on site)</span>
          </label>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="coral" onClick={handleSave} isLoading={isSaving} className="flex-1">
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </div>
      </Modal>

      <BottomNav />
    </MobileWrapper>
  );
}
