export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          code: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          code?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coin_ledger: {
        Row: {
          created_at: string
          delta: number
          id: string
          reason: string
          site_id: string | null
          trail_slug: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          delta: number
          id?: string
          reason: string
          site_id?: string | null
          trail_slug?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          delta?: number
          id?: string
          reason?: string
          site_id?: string | null
          trail_slug?: string | null
          user_id?: string
        }
        Relationships: []
      }
      echo_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "echo_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "echo_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "echo_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "echo_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      echo_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: []
      }
      echo_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "echo_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "echo_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      echo_posts: {
        Row: {
          author_id: string
          caption: string | null
          category: string | null
          comments_count: number
          created_at: string
          id: string
          likes_count: number
          location: string | null
          media: Json
          media_type: string
          saves_count: number
          state: string | null
          story: string | null
          submitted_to_library: boolean
          submitted_to_library_at: string | null
          tags: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          caption?: string | null
          category?: string | null
          comments_count?: number
          created_at?: string
          id?: string
          likes_count?: number
          location?: string | null
          media?: Json
          media_type?: string
          saves_count?: number
          state?: string | null
          story?: string | null
          submitted_to_library?: boolean
          submitted_to_library_at?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          caption?: string | null
          category?: string | null
          comments_count?: number
          created_at?: string
          id?: string
          likes_count?: number
          location?: string | null
          media?: Json
          media_type?: string
          saves_count?: number
          state?: string | null
          story?: string | null
          submitted_to_library?: boolean
          submitted_to_library_at?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      echo_saves: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "echo_saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "echo_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      heritage_sites: {
        Row: {
          coin_reward: number
          id: string
          lat: number
          lng: number
          name: string
          place: string
          radius_m: number
          stop_index: number
          trail_slug: string
        }
        Insert: {
          coin_reward?: number
          id?: string
          lat: number
          lng: number
          name: string
          place: string
          radius_m?: number
          stop_index: number
          trail_slug: string
        }
        Update: {
          coin_reward?: number
          id?: string
          lat?: number
          lng?: number
          name?: string
          place?: string
          radius_m?: number
          stop_index?: number
          trail_slug?: string
        }
        Relationships: []
      }
      library_story_bodies: {
        Row: {
          body: string
          created_at: string
          story_id: string
        }
        Insert: {
          body: string
          created_at?: string
          story_id: string
        }
        Update: {
          body?: string
          created_at?: string
          story_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          heritage_origins: string[] | null
          id: string
          interests: string[] | null
          languages: string[] | null
          location: string | null
          social_links: Json | null
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          heritage_origins?: string[] | null
          id: string
          interests?: string[] | null
          languages?: string[] | null
          location?: string | null
          social_links?: Json | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          heritage_origins?: string[] | null
          id?: string
          interests?: string[] | null
          languages?: string[] | null
          location?: string | null
          social_links?: Json | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          coins_spent: number
          created_at: string
          id: string
          reward_code: string
          reward_id: string
          user_id: string
        }
        Insert: {
          coins_spent: number
          created_at?: string
          id?: string
          reward_code: string
          reward_id: string
          user_id: string
        }
        Update: {
          coins_spent?: number
          created_at?: string
          id?: string
          reward_code?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          active: boolean
          category: string
          code: string
          coins_required: number
          created_at: string
          description: string
          id: string
          image_emoji: string | null
          stock: number | null
          title: string
        }
        Insert: {
          active?: boolean
          category: string
          code: string
          coins_required: number
          created_at?: string
          description: string
          id?: string
          image_emoji?: string | null
          stock?: number | null
          title: string
        }
        Update: {
          active?: boolean
          category?: string
          code?: string
          coins_required?: number
          created_at?: string
          description?: string
          id?: string
          image_emoji?: string | null
          stock?: number | null
          title?: string
        }
        Relationships: []
      }
      trail_progress: {
        Row: {
          checked_in_at: string
          distance_m: number | null
          id: string
          lat: number | null
          lng: number | null
          method: string
          site_id: string
          trail_slug: string
          user_id: string
        }
        Insert: {
          checked_in_at?: string
          distance_m?: number | null
          id?: string
          lat?: number | null
          lng?: number | null
          method?: string
          site_id: string
          trail_slug: string
          user_id: string
        }
        Update: {
          checked_in_at?: string
          distance_m?: number | null
          id?: string
          lat?: number | null
          lng?: number | null
          method?: string
          site_id?: string
          trail_slug?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_progress_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "heritage_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      user_coins: {
        Row: {
          balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          categories: string[]
          onboarded: boolean
          regions: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          categories?: string[]
          onboarded?: boolean
          regions?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          categories?: string[]
          onboarded?: boolean
          regions?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_saves: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      checkin_at_site: {
        Args: { _force?: boolean; _lat: number; _lng: number; _site_id: string }
        Returns: Json
      }
      redeem_reward: { Args: { _reward_id: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
