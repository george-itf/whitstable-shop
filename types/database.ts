// Database type definitions for whitstable.shop

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          is_public: boolean;
          is_local: boolean;
          joined_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          is_public?: boolean;
          is_local?: boolean;
          joined_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          is_public?: boolean;
          is_local?: boolean;
          joined_at?: string;
          updated_at?: string;
        };
      };
      shops: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          category: string;
          subcategory: string | null;
          address: string | null;
          street: string | null;
          postcode: string | null;
          latitude: number | null;
          longitude: number | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          instagram: string | null;
          facebook: string | null;
          image_url: string | null;
          gallery_urls: string[] | null;
          opening_hours: Json | null;
          is_active: boolean;
          is_verified: boolean;
          is_featured: boolean;
          save_count: number;
          review_count: number;
          average_rating: number;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          category: string;
          subcategory?: string | null;
          address?: string | null;
          street?: string | null;
          postcode?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          image_url?: string | null;
          gallery_urls?: string[] | null;
          opening_hours?: Json | null;
          is_active?: boolean;
          is_verified?: boolean;
          is_featured?: boolean;
          save_count?: number;
          review_count?: number;
          average_rating?: number;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          category?: string;
          subcategory?: string | null;
          address?: string | null;
          street?: string | null;
          postcode?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          image_url?: string | null;
          gallery_urls?: string[] | null;
          opening_hours?: Json | null;
          is_active?: boolean;
          is_verified?: boolean;
          is_featured?: boolean;
          save_count?: number;
          review_count?: number;
          average_rating?: number;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          start_date: string;
          end_date: string | null;
          start_time: string | null;
          end_time: string | null;
          is_recurring: boolean;
          recurrence_rule: string | null;
          location: string | null;
          venue: string | null;
          shop_id: string | null;
          price: string | null;
          booking_url: string | null;
          image_url: string | null;
          category: string | null;
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          start_date: string;
          end_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          is_recurring?: boolean;
          recurrence_rule?: string | null;
          location?: string | null;
          venue?: string | null;
          shop_id?: string | null;
          price?: string | null;
          booking_url?: string | null;
          image_url?: string | null;
          category?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          is_recurring?: boolean;
          recurrence_rule?: string | null;
          location?: string | null;
          venue?: string | null;
          shop_id?: string | null;
          price?: string | null;
          booking_url?: string | null;
          image_url?: string | null;
          category?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          shop_id: string;
          rating: number;
          content: string | null;
          is_verified_purchase: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shop_id: string;
          rating: number;
          content?: string | null;
          is_verified_purchase?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          shop_id?: string;
          rating?: number;
          content?: string | null;
          is_verified_purchase?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      photo_competitions: {
        Row: {
          id: string;
          month: string;
          title: string;
          theme: string | null;
          prize_description: string;
          prize_shop_id: string | null;
          prize_value: string | null;
          submissions_open: string;
          submissions_close: string;
          voting_open: string;
          voting_close: string;
          winner_id: string | null;
          runner_up_id: string | null;
          status: 'upcoming' | 'submissions' | 'voting' | 'judging' | 'complete';
          created_at: string;
        };
        Insert: {
          id?: string;
          month: string;
          title: string;
          theme?: string | null;
          prize_description: string;
          prize_shop_id?: string | null;
          prize_value?: string | null;
          submissions_open: string;
          submissions_close: string;
          voting_open: string;
          voting_close: string;
          winner_id?: string | null;
          runner_up_id?: string | null;
          status?: 'upcoming' | 'submissions' | 'voting' | 'judging' | 'complete';
          created_at?: string;
        };
        Update: {
          id?: string;
          month?: string;
          title?: string;
          theme?: string | null;
          prize_description?: string;
          prize_shop_id?: string | null;
          prize_value?: string | null;
          submissions_open?: string;
          submissions_close?: string;
          voting_open?: string;
          voting_close?: string;
          winner_id?: string | null;
          runner_up_id?: string | null;
          status?: 'upcoming' | 'submissions' | 'voting' | 'judging' | 'complete';
          created_at?: string;
        };
      };
      photo_entries: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          title: string;
          description: string | null;
          location: string | null;
          shop_id: string | null;
          competition_month: string;
          status: 'pending' | 'approved' | 'rejected' | 'winner' | 'runner_up';
          vote_count: number;
          camera_info: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          title: string;
          description?: string | null;
          location?: string | null;
          shop_id?: string | null;
          competition_month: string;
          status?: 'pending' | 'approved' | 'rejected' | 'winner' | 'runner_up';
          vote_count?: number;
          camera_info?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          title?: string;
          description?: string | null;
          location?: string | null;
          shop_id?: string | null;
          competition_month?: string;
          status?: 'pending' | 'approved' | 'rejected' | 'winner' | 'runner_up';
          vote_count?: number;
          camera_info?: string | null;
          created_at?: string;
        };
      };
      photo_votes: {
        Row: {
          id: string;
          user_id: string;
          photo_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          photo_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          photo_id?: string;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string | null;
          report_type: 'shop_closed' | 'wrong_hours' | 'wrong_info' | 'new_shop' | 'event_suggestion' | 'local_tip' | 'issue' | 'other';
          shop_id: string | null;
          title: string;
          description: string;
          image_url: string | null;
          status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
          admin_notes: string | null;
          resolved_at: string | null;
          was_helpful: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          report_type: 'shop_closed' | 'wrong_hours' | 'wrong_info' | 'new_shop' | 'event_suggestion' | 'local_tip' | 'issue' | 'other';
          shop_id?: string | null;
          title: string;
          description: string;
          image_url?: string | null;
          status?: 'pending' | 'reviewing' | 'resolved' | 'rejected';
          admin_notes?: string | null;
          resolved_at?: string | null;
          was_helpful?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          report_type?: 'shop_closed' | 'wrong_hours' | 'wrong_info' | 'new_shop' | 'event_suggestion' | 'local_tip' | 'issue' | 'other';
          shop_id?: string | null;
          title?: string;
          description?: string;
          image_url?: string | null;
          status?: 'pending' | 'reviewing' | 'resolved' | 'rejected';
          admin_notes?: string | null;
          resolved_at?: string | null;
          was_helpful?: boolean | null;
          created_at?: string;
        };
      };
      user_contributions: {
        Row: {
          user_id: string;
          reports_submitted: number;
          reports_helpful: number;
          reviews_written: number;
          photos_submitted: number;
          photos_approved: number;
          photos_won: number;
          questions_answered: number;
          answers_accepted: number;
          contribution_score: number;
          badge: 'newcomer' | 'contributor' | 'regular' | 'local_expert' | 'whitstable_legend';
          updated_at: string;
        };
        Insert: {
          user_id: string;
          reports_submitted?: number;
          reports_helpful?: number;
          reviews_written?: number;
          photos_submitted?: number;
          photos_approved?: number;
          photos_won?: number;
          questions_answered?: number;
          answers_accepted?: number;
          contribution_score?: number;
          badge?: 'newcomer' | 'contributor' | 'regular' | 'local_expert' | 'whitstable_legend';
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          reports_submitted?: number;
          reports_helpful?: number;
          reviews_written?: number;
          photos_submitted?: number;
          photos_approved?: number;
          photos_won?: number;
          questions_answered?: number;
          answers_accepted?: number;
          contribution_score?: number;
          badge?: 'newcomer' | 'contributor' | 'regular' | 'local_expert' | 'whitstable_legend';
          updated_at?: string;
        };
      };
      charities: {
        Row: {
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
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          donation_url?: string | null;
          current_campaign?: string | null;
          target_amount?: number | null;
          raised_amount?: number;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          donation_url?: string | null;
          current_campaign?: string | null;
          target_amount?: number | null;
          raised_amount?: number;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
        };
      };
      charity_events: {
        Row: {
          id: string;
          charity_id: string | null;
          title: string;
          description: string | null;
          date: string;
          time_start: string | null;
          time_end: string | null;
          location: string | null;
          signup_url: string | null;
          max_participants: number | null;
          current_participants: number;
          event_type: 'cleanup' | 'fundraiser' | 'volunteer' | 'awareness' | 'other' | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          charity_id?: string | null;
          title: string;
          description?: string | null;
          date: string;
          time_start?: string | null;
          time_end?: string | null;
          location?: string | null;
          signup_url?: string | null;
          max_participants?: number | null;
          current_participants?: number;
          event_type?: 'cleanup' | 'fundraiser' | 'volunteer' | 'awareness' | 'other' | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          charity_id?: string | null;
          title?: string;
          description?: string | null;
          date?: string;
          time_start?: string | null;
          time_end?: string | null;
          location?: string | null;
          signup_url?: string | null;
          max_participants?: number | null;
          current_participants?: number;
          event_type?: 'cleanup' | 'fundraiser' | 'volunteer' | 'awareness' | 'other' | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      shop_charity_links: {
        Row: {
          id: string;
          shop_id: string;
          charity_id: string;
          partnership_type: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          charity_id: string;
          partnership_type?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          charity_id?: string;
          partnership_type?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      notification_preferences: {
        Row: {
          user_id: string;
          weekly_digest: boolean;
          new_reviews_on_saved: boolean;
          competition_reminders: boolean;
          event_reminders: boolean;
          push_enabled: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          weekly_digest?: boolean;
          new_reviews_on_saved?: boolean;
          competition_reminders?: boolean;
          event_reminders?: boolean;
          push_enabled?: boolean;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          weekly_digest?: boolean;
          new_reviews_on_saved?: boolean;
          competition_reminders?: boolean;
          event_reminders?: boolean;
          push_enabled?: boolean;
          updated_at?: string;
        };
      };
      shop_weekly_stats: {
        Row: {
          id: string;
          shop_id: string;
          week_start: string;
          views: number;
          saves: number;
          reviews: number;
          photo_tags: number;
          direction_clicks: number;
          call_clicks: number;
          engagement_score: number;
          rank: number | null;
          rank_change: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          week_start: string;
          views?: number;
          saves?: number;
          reviews?: number;
          photo_tags?: number;
          direction_clicks?: number;
          call_clicks?: number;
          engagement_score?: number;
          rank?: number | null;
          rank_change?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          week_start?: string;
          views?: number;
          saves?: number;
          reviews?: number;
          photo_tags?: number;
          direction_clicks?: number;
          call_clicks?: number;
          engagement_score?: number;
          rank?: number | null;
          rank_change?: number | null;
          created_at?: string;
        };
      };
      shop_badges: {
        Row: {
          id: string;
          shop_id: string;
          badge_type: string;
          awarded_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          badge_type: string;
          awarded_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          badge_type?: string;
          awarded_at?: string;
        };
      };
      offers: {
        Row: {
          id: string;
          shop_id: string;
          title: string;
          description: string | null;
          valid_from: string;
          valid_until: string | null;
          is_ongoing: boolean;
          terms: string | null;
          offer_type: 'discount' | 'freebie' | 'bundle' | 'loyalty' | 'event' | 'other' | null;
          is_active: boolean;
          view_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          title: string;
          description?: string | null;
          valid_from: string;
          valid_until?: string | null;
          is_ongoing?: boolean;
          terms?: string | null;
          offer_type?: 'discount' | 'freebie' | 'bundle' | 'loyalty' | 'event' | 'other' | null;
          is_active?: boolean;
          view_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          title?: string;
          description?: string | null;
          valid_from?: string;
          valid_until?: string | null;
          is_ongoing?: boolean;
          terms?: string | null;
          offer_type?: 'discount' | 'freebie' | 'bundle' | 'loyalty' | 'event' | 'other' | null;
          is_active?: boolean;
          view_count?: number;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          user_id: string | null;
          question: string;
          context: string | null;
          status: 'open' | 'answered' | 'closed';
          answer_count: number;
          view_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          question: string;
          context?: string | null;
          status?: 'open' | 'answered' | 'closed';
          answer_count?: number;
          view_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          question?: string;
          context?: string | null;
          status?: 'open' | 'answered' | 'closed';
          answer_count?: number;
          view_count?: number;
          created_at?: string;
        };
      };
      answers: {
        Row: {
          id: string;
          question_id: string;
          user_id: string | null;
          answer: string;
          upvotes: number;
          is_accepted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          user_id?: string | null;
          answer: string;
          upvotes?: number;
          is_accepted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          user_id?: string | null;
          answer?: string;
          upvotes?: number;
          is_accepted?: boolean;
          created_at?: string;
        };
      };
      answer_votes: {
        Row: {
          id: string;
          user_id: string | null;
          answer_id: string;
          vote: number;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          answer_id: string;
          vote: number;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          answer_id?: string;
          vote?: number;
        };
      };
      campaigns: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string;
          hero_image_url: string | null;
          content: Json | null;
          campaign_type: 'awards' | 'guide' | 'competition' | 'seasonal' | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          hero_image_url?: string | null;
          content?: Json | null;
          campaign_type?: 'awards' | 'guide' | 'competition' | 'seasonal' | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          hero_image_url?: string | null;
          content?: Json | null;
          campaign_type?: 'awards' | 'guide' | 'competition' | 'seasonal' | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      saved_shops: {
        Row: {
          id: string;
          user_id: string;
          shop_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shop_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          shop_id?: string;
          created_at?: string;
        };
      };
      visited_shops: {
        Row: {
          id: string;
          user_id: string;
          shop_id: string;
          visited_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shop_id: string;
          visited_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          shop_id?: string;
          visited_at?: string;
        };
      };
      weekly_digest: {
        Row: {
          id: string;
          week_start: string;
          new_shops: Json | null;
          trending_shops: Json | null;
          new_reviews_count: number | null;
          photo_competition_status: string | null;
          upcoming_events: Json | null;
          featured_content: Json | null;
          generated_at: string;
        };
        Insert: {
          id?: string;
          week_start: string;
          new_shops?: Json | null;
          trending_shops?: Json | null;
          new_reviews_count?: number | null;
          photo_competition_status?: string | null;
          upcoming_events?: Json | null;
          featured_content?: Json | null;
          generated_at?: string;
        };
        Update: {
          id?: string;
          week_start?: string;
          new_shops?: Json | null;
          trending_shops?: Json | null;
          new_reviews_count?: number | null;
          photo_competition_status?: string | null;
          upcoming_events?: Json | null;
          featured_content?: Json | null;
          generated_at?: string;
        };
      };
    };
  };
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Shop = Database['public']['Tables']['shops']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type PhotoCompetition = Database['public']['Tables']['photo_competitions']['Row'];
export type PhotoEntry = Database['public']['Tables']['photo_entries']['Row'];
export type PhotoVote = Database['public']['Tables']['photo_votes']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];
export type UserContributions = Database['public']['Tables']['user_contributions']['Row'];
export type Charity = Database['public']['Tables']['charities']['Row'];
export type CharityEvent = Database['public']['Tables']['charity_events']['Row'];
export type ShopCharityLink = Database['public']['Tables']['shop_charity_links']['Row'];
export type NotificationPreferences = Database['public']['Tables']['notification_preferences']['Row'];
export type ShopWeeklyStats = Database['public']['Tables']['shop_weekly_stats']['Row'];
export type ShopBadge = Database['public']['Tables']['shop_badges']['Row'];
export type Offer = Database['public']['Tables']['offers']['Row'];
export type Question = Database['public']['Tables']['questions']['Row'];
export type Answer = Database['public']['Tables']['answers']['Row'];
export type AnswerVote = Database['public']['Tables']['answer_votes']['Row'];
export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type SavedShop = Database['public']['Tables']['saved_shops']['Row'];
export type VisitedShop = Database['public']['Tables']['visited_shops']['Row'];
export type WeeklyDigest = Database['public']['Tables']['weekly_digest']['Row'];

// Extended types with relations
export interface PhotoEntryWithUser extends PhotoEntry {
  profiles: Pick<Profile, 'display_name' | 'avatar_url'> | null;
  shops: Pick<Shop, 'name' | 'slug'> | null;
}

export interface ReviewWithUser extends Review {
  profiles: Pick<Profile, 'display_name' | 'avatar_url'> | null;
}

export interface AnswerWithUser extends Answer {
  profiles: Pick<Profile, 'display_name' | 'avatar_url' | 'is_local'> | null;
}

export interface QuestionWithAnswers extends Question {
  profiles: Pick<Profile, 'display_name' | 'avatar_url'> | null;
  answers: AnswerWithUser[];
}

export interface ShopWithBadges extends Shop {
  shop_badges: ShopBadge[];
  shop_charity_links: (ShopCharityLink & { charities: Pick<Charity, 'name' | 'slug'> })[];
}

export interface CharityWithEvents extends Charity {
  charity_events: CharityEvent[];
  shop_charity_links: (ShopCharityLink & { shops: Pick<Shop, 'name' | 'slug' | 'image_url'> })[];
}

// Report types for the form
export const REPORT_TYPES = {
  shop_closed: { label: 'Shop has closed', description: 'Report a shop that has permanently closed' },
  wrong_hours: { label: 'Wrong opening hours', description: 'The listed hours are incorrect' },
  wrong_info: { label: 'Incorrect information', description: 'Phone, address, or other details are wrong' },
  new_shop: { label: 'New shop suggestion', description: 'Suggest a new shop to add' },
  event_suggestion: { label: 'Event suggestion', description: 'Suggest an event to list' },
  local_tip: { label: 'Local tip', description: 'Share insider knowledge' },
  issue: { label: 'Website issue', description: 'Report a problem with the site' },
  other: { label: 'Other', description: 'Something else' },
} as const;

// Badge descriptions
export const USER_BADGES = {
  newcomer: { label: 'Newcomer', description: 'Welcome to the community!' },
  contributor: { label: 'Contributor', description: '3+ helpful reports' },
  regular: { label: 'Regular', description: '10+ contributions or 5+ approved photos' },
  local_expert: { label: 'Local Expert', description: '25+ helpful contributions' },
  whitstable_legend: { label: 'Whitstable Legend', description: '50+ contributions + photo winner' },
} as const;

export const SHOP_BADGES = {
  trending_weekly: { label: 'Trending', description: 'Top 3 this week' },
  trending_monthly: { label: 'Hot This Month', description: 'Top 3 this month' },
  most_saved: { label: 'Most Saved', description: 'Most saved in category' },
  review_star: { label: 'Review Star', description: '10+ reviews with 4.5+ average' },
  photo_favourite: { label: 'Photo Favourite', description: 'Most tagged in photos' },
  community_choice: { label: 'Community Choice', description: 'Won monthly vote' },
  local_legend: { label: 'Local Legend', description: 'Top 10 for 3+ months' },
  new_favourite: { label: 'New Favourite', description: 'Fastest rising newcomer' },
} as const;

// Shop categories
export const SHOP_CATEGORIES = [
  'Food & Drink',
  'Retail',
  'Health & Beauty',
  'Services',
  'Art & Culture',
  'Accommodation',
  'Activities',
  'Other',
] as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];
