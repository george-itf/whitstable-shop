'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function ManageEventsPage() {
  const [showForm, setShowForm] = useState(false);

  // Mock events data
  const events = [
    {
      id: '1',
      title: 'Oyster Tasting Evening',
      date: '2025-08-15',
      time_start: '18:00',
      status: 'approved',
    },
    {
      id: '2',
      title: 'Live Jazz Friday',
      date: '2025-08-22',
      time_start: '19:00',
      status: 'pending',
    },
  ];

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-sky px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-white">
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
            <h1 className="text-white font-bold text-xl">events</h1>
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
      <div className="px-4 py-6 space-y-6">
        {/* Add event form */}
        {showForm && (
          <Card className="border-sky border-2">
            <h2 className="font-semibold text-ink mb-4">New Event</h2>
            <form className="space-y-4">
              <Input label="Event Title" id="title" placeholder="e.g., Wine Tasting Evening" required />
              <Input label="Date" id="date" type="date" required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start Time" id="start" type="time" />
                <Input label="End Time" id="end" type="time" />
              </div>
              <div>
                <label className="block text-sm font-medium text-grey-dark mb-1.5">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-grey-light rounded-button text-ink placeholder:text-grey focus:outline-none focus:ring-2 focus:ring-sky resize-none"
                  rows={3}
                  placeholder="Tell people about your event..."
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                create event
              </Button>
            </form>
          </Card>
        )}

        {/* Events list */}
        <div className="space-y-3">
          <h2 className="font-semibold text-ink">Your Events</h2>

          {events.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-grey">No events yet. Create your first event!</p>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 text-center">
                  <div className="bg-coral-light rounded-lg py-2">
                    <div className="text-coral text-xs font-medium">
                      {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                    </div>
                    <div className="text-coral text-xl font-bold">
                      {new Date(event.date).getDate()}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">{event.title}</h3>
                  <p className="text-sm text-grey">{event.time_start}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-pill font-medium ${
                    event.status === 'approved'
                      ? 'bg-green-light text-green'
                      : 'bg-yellow/10 text-yellow'
                  }`}
                >
                  {event.status}
                </span>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
