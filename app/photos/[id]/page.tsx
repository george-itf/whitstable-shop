import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Heart, MapPin, Store, Calendar, Camera, Share2, Flag } from "lucide-react";
import { Button, Card, Badge, Avatar } from "@/components/ui";
import { VoteButton } from "@/components/photos";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import type { PhotoEntryWithUser } from "@/types/database";

// Mock data - in production this would come from Supabase using the [id] param
const mockPhoto: PhotoEntryWithUser = {
  id: "1",
  user_id: "user1",
  image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200",
  title: "Sunset over the Harbour",
  description: "Caught this magical golden hour moment at Whitstable Harbour. The fishing boats were coming in and the light was just perfect. Love how the colours reflect off the water.",
  location: "Whitstable Harbour",
  shop_id: null,
  competition_month: "2025-01-01",
  status: "approved",
  vote_count: 42,
  camera_info: "iPhone 15 Pro",
  created_at: "2025-01-10T14:30:00Z",
  profiles: { display_name: "Sarah M.", avatar_url: null },
  shops: null,
};

const mockRelatedPhotos: PhotoEntryWithUser[] = [
  {
    id: "2",
    user_id: "user2",
    image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    title: "Winter Morning Light",
    description: null,
    location: "Tankerton Slopes",
    shop_id: null,
    competition_month: "2025-01-01",
    status: "approved",
    vote_count: 38,
    camera_info: null,
    created_at: "2025-01-09T08:15:00Z",
    profiles: { display_name: "James K.", avatar_url: null },
    shops: null,
  },
  {
    id: "3",
    user_id: "user3",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    title: "The Old Neptune",
    description: null,
    location: "Marine Terrace",
    shop_id: null,
    competition_month: "2025-01-01",
    status: "approved",
    vote_count: 35,
    camera_info: null,
    created_at: "2025-01-08T16:45:00Z",
    profiles: { display_name: "Local Lens", avatar_url: null },
    shops: null,
  },
];

export const metadata = {
  title: "Sunset over the Harbour",
  description: "View photo by Sarah M. in the Whitstable photo gallery",
};

export default function PhotoDetailPage() {
  const photo = mockPhoto;
  const hasVoted = false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/photos">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Gallery
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Image */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/3] bg-oyster-900 rounded-2xl overflow-hidden">
            <Image
              src={photo.image_url}
              alt={photo.title}
              fill
              className="object-contain"
              priority
            />

            {/* Status Badge */}
            {photo.status === "winner" && (
              <Badge
                variant="warning"
                className="absolute top-4 left-4"
              >
                Winner
              </Badge>
            )}
            {photo.status === "runner_up" && (
              <Badge
                variant="info"
                className="absolute top-4 left-4"
              >
                Runner Up
              </Badge>
            )}
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="space-y-6">
          {/* Title & Vote */}
          <div>
            <h1 className="text-2xl font-bold text-oyster-900 mb-4">
              {photo.title}
            </h1>
            <VoteButton
              voteCount={photo.vote_count}
              hasVoted={hasVoted}
              onVote={() => {}}
              size="lg"
            />
          </div>

          {/* Author */}
          <Card>
            <div className="flex items-center gap-3">
              <Avatar
                src={photo.profiles?.avatar_url}
                fallback={photo.profiles?.display_name || "U"}
                size="lg"
              />
              <div>
                <p className="font-semibold text-oyster-900">
                  {photo.profiles?.display_name || "Anonymous"}
                </p>
                <p className="text-sm text-oyster-500">
                  {formatRelativeTime(photo.created_at)}
                </p>
              </div>
            </div>
          </Card>

          {/* Description */}
          {photo.description && (
            <Card>
              <h2 className="font-semibold text-oyster-900 mb-2">About this photo</h2>
              <p className="text-oyster-600">{photo.description}</p>
            </Card>
          )}

          {/* Details */}
          <Card>
            <h2 className="font-semibold text-oyster-900 mb-3">Details</h2>
            <div className="space-y-3">
              {photo.location && (
                <div className="flex items-center gap-3 text-oyster-600">
                  <MapPin className="h-5 w-5 text-oyster-400" />
                  <span>{photo.location}</span>
                </div>
              )}
              {photo.shops && (
                <div className="flex items-center gap-3 text-oyster-600">
                  <Store className="h-5 w-5 text-oyster-400" />
                  <Link href={`/shops/${photo.shops.slug}`} className="text-ocean-600 hover:underline">
                    {photo.shops.name}
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-3 text-oyster-600">
                <Calendar className="h-5 w-5 text-oyster-400" />
                <span>{formatDate(photo.created_at, "dd MMMM yyyy")}</span>
              </div>
              {photo.camera_info && (
                <div className="flex items-center gap-3 text-oyster-600">
                  <Camera className="h-5 w-5 text-oyster-400" />
                  <span>{photo.camera_info}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" leftIcon={<Share2 className="h-4 w-4" />}>
              Share
            </Button>
            <Button variant="ghost" leftIcon={<Flag className="h-4 w-4" />}>
              Report
            </Button>
          </div>
        </div>
      </div>

      {/* More from this competition */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-oyster-900">
            More from this month
          </h2>
          <Link href="/photos/competition" className="text-ocean-600 hover:text-ocean-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRelatedPhotos.map((relatedPhoto) => (
            <Link key={relatedPhoto.id} href={`/photos/${relatedPhoto.id}`}>
              <Card hoverable padding="none" className="overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={relatedPhoto.image_url}
                    alt={relatedPhoto.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-oyster-900 truncate">
                    {relatedPhoto.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-oyster-500">
                      {relatedPhoto.profiles?.display_name}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-oyster-500">
                      <Heart className="h-4 w-4" />
                      {relatedPhoto.vote_count}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
