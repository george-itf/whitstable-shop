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
  Camera,
  Calendar,
  Trophy,
  Image,
  Users,
  Vote,
  CheckCircle,
} from 'lucide-react';

interface PhotoCompetition {
  id: string;
  month: string;
  theme: string;
  description: string | null;
  prize_description: string | null;
  prize_shop_id: string | null;
  submissions_open: string;
  submissions_close: string;
  voting_open: string;
  voting_close: string;
  status: 'upcoming' | 'submissions' | 'voting' | 'judging' | 'complete';
  winner_id: string | null;
  entry_count?: number;
  created_at: string;
}

interface Shop {
  id: string;
  name: string;
}

export default function PhotosPage() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<PhotoCompetition[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<PhotoCompetition | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    month: '',
    theme: '',
    description: '',
    prize_description: '',
    prize_shop_id: '',
    submissions_open: '',
    submissions_close: '',
    voting_open: '',
    voting_close: '',
    status: 'upcoming' as 'upcoming' | 'submissions' | 'voting' | 'judging' | 'complete',
  });

  useEffect(() => {
    fetchData();
  }, [router]);

  async function fetchData() {
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirect=/admin/photos');
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

      const [competitionsRes, shopsRes, entriesRes] = await Promise.all([
        supabase.from('photo_competitions').select('*').order('month', { ascending: false }),
        supabase.from('shops').select('id, name').eq('status', 'approved').order('name'),
        supabase.from('photo_entries').select('competition_month'),
      ]);

      // Count entries per competition
      const entryCountMap: Record<string, number> = {};
      entriesRes.data?.forEach((entry: { competition_month: string }) => {
        entryCountMap[entry.competition_month] = (entryCountMap[entry.competition_month] || 0) + 1;
      });

      const competitionsWithCounts = (competitionsRes.data || []).map((comp: PhotoCompetition) => ({
        ...comp,
        entry_count: entryCountMap[comp.month] || 0,
      }));

      setCompetitions(competitionsWithCounts);
      setShops(shopsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateModal() {
    setEditingCompetition(null);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const monthStr = nextMonth.toISOString().slice(0, 7);

    setFormData({
      month: monthStr,
      theme: '',
      description: '',
      prize_description: '',
      prize_shop_id: '',
      submissions_open: `${monthStr}-01`,
      submissions_close: `${monthStr}-20`,
      voting_open: `${monthStr}-21`,
      voting_close: `${monthStr}-28`,
      status: 'upcoming',
    });
    setIsModalOpen(true);
  }

  function openEditModal(competition: PhotoCompetition) {
    setEditingCompetition(competition);
    setFormData({
      month: competition.month,
      theme: competition.theme,
      description: competition.description || '',
      prize_description: competition.prize_description || '',
      prize_shop_id: competition.prize_shop_id || '',
      submissions_open: competition.submissions_open,
      submissions_close: competition.submissions_close,
      voting_open: competition.voting_open,
      voting_close: competition.voting_close,
      status: competition.status,
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!formData.month || !formData.theme) return;

    setIsSaving(true);
    try {
      const supabase = createClient();

      const competitionData = {
        month: formData.month,
        theme: formData.theme,
        description: formData.description || null,
        prize_description: formData.prize_description || null,
        prize_shop_id: formData.prize_shop_id || null,
        submissions_open: formData.submissions_open,
        submissions_close: formData.submissions_close,
        voting_open: formData.voting_open,
        voting_close: formData.voting_close,
        status: formData.status,
      };

      if (editingCompetition) {
        await supabase.from('photo_competitions').update(competitionData).eq('id', editingCompetition.id);
      } else {
        await supabase.from('photo_competitions').insert(competitionData);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving competition:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(competitionId: string) {
    try {
      const supabase = createClient();
      await supabase.from('photo_competitions').delete().eq('id', competitionId);
      setShowDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting competition:', error);
    }
  }

  function formatMonth(monthStr: string) {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }

  const statusColors: Record<string, string> = {
    upcoming: 'bg-grey-light text-grey',
    submissions: 'bg-sky-light text-sky',
    voting: 'bg-yellow/20 text-yellow',
    judging: 'bg-purple-100 text-purple-600',
    complete: 'bg-green/10 text-green',
  };

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-pink-500 px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-white font-bold text-xl">photo competitions</h1>
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
      <div className="bg-pink-500 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-white font-bold text-xl">photo competitions</h1>
              <p className="text-white/80 text-xs">{competitions.length} competitions</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Competitions List */}
      <div className="px-4 py-4 space-y-3 pb-24">
        {competitions.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="w-12 h-12 text-grey-light mx-auto mb-3" />
            <p className="text-grey">No competitions found</p>
          </div>
        ) : (
          competitions.map((competition) => (
            <Card key={competition.id} className="relative">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink">{formatMonth(competition.month)}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${statusColors[competition.status]}`}>
                      {competition.status}
                    </span>
                  </div>
                  <p className="text-sm text-pink-500 font-medium truncate">
                    Theme: {competition.theme}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-grey">
                    <span className="flex items-center gap-1">
                      <Image className="w-3 h-3" />
                      {competition.entry_count} entries
                    </span>
                    {competition.prize_description && (
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Prize set
                      </span>
                    )}
                    {competition.winner_id && (
                      <span className="flex items-center gap-1 text-green">
                        <CheckCircle className="w-3 h-3" />
                        Winner selected
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(competition)}
                    className="p-2 bg-sky-light text-sky rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(competition.id)}
                    className="p-2 bg-coral-light text-coral rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showDeleteConfirm === competition.id && (
                <div className="absolute inset-0 bg-white rounded-card flex items-center justify-center gap-3 p-4">
                  <p className="text-sm text-ink">Delete this competition?</p>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(competition.id)}>
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
        title={editingCompetition ? 'Edit Competition' : 'Add New Competition'}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Month *"
            type="month"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
          />

          <Input
            label="Theme *"
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            placeholder="e.g. Sunset Views"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what you're looking for..."
            rows={2}
          />

          <div className="border-t pt-4">
            <h4 className="font-semibold text-ink mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Submissions Open"
                type="date"
                value={formData.submissions_open}
                onChange={(e) => setFormData({ ...formData, submissions_open: e.target.value })}
              />
              <Input
                label="Submissions Close"
                type="date"
                value={formData.submissions_close}
                onChange={(e) => setFormData({ ...formData, submissions_close: e.target.value })}
              />
              <Input
                label="Voting Open"
                type="date"
                value={formData.voting_open}
                onChange={(e) => setFormData({ ...formData, voting_open: e.target.value })}
              />
              <Input
                label="Voting Close"
                type="date"
                value={formData.voting_close}
                onChange={(e) => setFormData({ ...formData, voting_close: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-ink mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Prize
            </h4>
            <Textarea
              label="Prize Description"
              value={formData.prize_description}
              onChange={(e) => setFormData({ ...formData, prize_description: e.target.value })}
              placeholder="e.g. £50 voucher for Wheeler's Oyster Bar"
              rows={2}
            />
            <Select
              label="Prize Shop (optional)"
              value={formData.prize_shop_id}
              onChange={(e) => setFormData({ ...formData, prize_shop_id: e.target.value })}
              className="mt-3"
            >
              <option value="">No specific shop</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </Select>
          </div>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'upcoming' | 'submissions' | 'voting' | 'judging' | 'complete',
              })
            }
          >
            <option value="upcoming">Upcoming</option>
            <option value="submissions">Accepting Submissions</option>
            <option value="voting">Voting Open</option>
            <option value="judging">Judging</option>
            <option value="complete">Complete</option>
          </Select>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="coral" onClick={handleSave} isLoading={isSaving} className="flex-1">
              {editingCompetition ? 'Save Changes' : 'Create Competition'}
            </Button>
          </div>
        </div>
      </Modal>

      <BottomNav />
    </MobileWrapper>
  );
}
