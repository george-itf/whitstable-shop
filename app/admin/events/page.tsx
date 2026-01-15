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
  Calendar,
  Clock,
  MapPin,
  Repeat,
  Star,
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time_start: string | null;
  time_end: string | null;
  location: string | null;
  is_recurring: boolean;
  recurrence_rule: string | null;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  image_url: string | null;
  created_at: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time_start: '',
    time_end: '',
    location: '',
    is_recurring: false,
    recurrence_rule: '',
    status: 'approved' as 'pending' | 'approved' | 'rejected',
    is_featured: false,
    image_url: '',
  });

  useEffect(() => {
    fetchData();
  }, [router]);

  async function fetchData() {
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirect=/admin/events');
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
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Group events by upcoming/past
  const now = new Date();
  const upcomingEvents = filteredEvents.filter((e) => new Date(e.date) >= now);
  const pastEvents = filteredEvents.filter((e) => new Date(e.date) < now);

  function openCreateModal() {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time_start: '',
      time_end: '',
      location: '',
      is_recurring: false,
      recurrence_rule: '',
      status: 'approved',
      is_featured: false,
      image_url: '',
    });
    setIsModalOpen(true);
  }

  function openEditModal(event: Event) {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time_start: event.time_start || '',
      time_end: event.time_end || '',
      location: event.location || '',
      is_recurring: event.is_recurring,
      recurrence_rule: event.recurrence_rule || '',
      status: event.status,
      is_featured: event.is_featured,
      image_url: event.image_url || '',
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!formData.title || !formData.date) return;

    setIsSaving(true);
    try {
      const supabase = createClient();

      const eventData = {
        title: formData.title,
        description: formData.description || null,
        date: formData.date,
        time_start: formData.time_start || null,
        time_end: formData.time_end || null,
        location: formData.location || null,
        is_recurring: formData.is_recurring,
        recurrence_rule: formData.is_recurring ? formData.recurrence_rule : null,
        status: formData.status,
        is_featured: formData.is_featured,
        image_url: formData.image_url || null,
      };

      if (editingEvent) {
        await supabase.from('events').update(eventData).eq('id', editingEvent.id);
      } else {
        await supabase.from('events').insert(eventData);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(eventId: string) {
    try {
      const supabase = createClient();
      await supabase.from('events').delete().eq('id', eventId);
      setShowDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  if (isLoading) {
    return (
      <MobileWrapper>
        <div className="bg-sky px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-white font-bold text-xl">what&apos;s on</h1>
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
              <h1 className="text-white font-bold text-xl">what&apos;s on</h1>
              <p className="text-white/80 text-xs">{events.length} events</p>
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
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </Select>
      </div>

      {/* Events List */}
      <div className="px-4 py-4 space-y-6 pb-24">
        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div>
            <h2 className="font-bold text-ink mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky" />
              Upcoming Events
            </h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => openEditModal(event)}
                  onDelete={() => setShowDeleteConfirm(event.id)}
                  showDeleteConfirm={showDeleteConfirm === event.id}
                  onConfirmDelete={() => handleDelete(event.id)}
                  onCancelDelete={() => setShowDeleteConfirm(null)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="font-bold text-grey mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Past Events
            </h2>
            <div className="space-y-3 opacity-60">
              {pastEvents.slice(0, 10).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => openEditModal(event)}
                  onDelete={() => setShowDeleteConfirm(event.id)}
                  showDeleteConfirm={showDeleteConfirm === event.id}
                  onConfirmDelete={() => handleDelete(event.id)}
                  onCancelDelete={() => setShowDeleteConfirm(null)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-grey-light mx-auto mb-3" />
            <p className="text-grey">No events found</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Add New Event'}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Event Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Oyster Festival"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the event..."
            rows={3}
          />

          <Input
            label="Date *"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              value={formData.time_start}
              onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
            />
            <Input
              label="End Time"
              type="time"
              value={formData.time_end}
              onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
            />
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Whitstable Harbour"
            leftIcon={<MapPin className="w-4 h-4" />}
          />

          <Input
            label="Image URL"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://..."
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_recurring}
              onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
              className="w-5 h-5 rounded border-grey-light text-sky focus:ring-sky"
            />
            <span className="text-sm text-ink">Recurring Event</span>
          </label>

          {formData.is_recurring && (
            <Select
              label="Recurrence"
              value={formData.recurrence_rule}
              onChange={(e) => setFormData({ ...formData, recurrence_rule: e.target.value })}
            >
              <option value="">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          )}

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as 'approved' | 'pending' })
            }
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </Select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 rounded border-grey-light text-sky focus:ring-sky"
            />
            <span className="text-sm text-ink">Featured Event</span>
          </label>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} isLoading={isSaving} className="flex-1">
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </div>
      </Modal>

      <BottomNav />
    </MobileWrapper>
  );
}

function EventCard({
  event,
  onEdit,
  onDelete,
  showDeleteConfirm,
  onConfirmDelete,
  onCancelDelete,
  formatDate,
}: {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  showDeleteConfirm: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  formatDate: (date: string) => string;
}) {
  return (
    <Card className="relative">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-sky-light flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-sky">
            {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric' })}
          </span>
          <span className="text-[10px] text-sky uppercase">
            {new Date(event.date).toLocaleDateString('en-GB', { month: 'short' })}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-ink truncate">{event.title}</h3>
            {event.is_recurring && <Repeat className="w-4 h-4 text-sky flex-shrink-0" />}
            {event.is_featured && <Star className="w-4 h-4 text-yellow fill-yellow flex-shrink-0" />}
          </div>
          <p className="text-sm text-grey truncate">{event.location}</p>
          <div className="flex items-center gap-2 mt-1">
            {event.time_start && (
              <span className="text-xs text-grey flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.time_start}
                {event.time_end && ` - ${event.time_end}`}
              </span>
            )}
            <Badge
              variant={event.status === 'approved' ? 'success' : 'warning'}
            >
              {event.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1">
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
          <p className="text-sm text-ink">Delete this event?</p>
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
