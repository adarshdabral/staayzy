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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          monthly_rent: number
          notes: string | null
          owner_id: string
          room_id: string
          security_deposit: number | null
          start_date: string
          status: Database["public"]["Enums"]["booking_status"] | null
          tenant_id: string
          token_fee: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          monthly_rent: number
          notes?: string | null
          owner_id: string
          room_id: string
          security_deposit?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          tenant_id: string
          token_fee?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          monthly_rent?: number
          notes?: string | null
          owner_id?: string
          room_id?: string
          security_deposit?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          tenant_id?: string
          token_fee?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      buzz_posts: {
        Row: {
          author_id: string | null
          category: Database["public"]["Enums"]["buzz_category"] | null
          comments_count: number | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          is_anonymous: boolean | null
          is_verified: boolean | null
          likes_count: number | null
          location_city: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: Database["public"]["Enums"]["buzz_category"] | null
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          is_verified?: boolean | null
          likes_count?: number | null
          location_city?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: Database["public"]["Enums"]["buzz_category"] | null
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          is_verified?: boolean | null
          likes_count?: number | null
          location_city?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          id: string
          net_amount: number
          notes: string | null
          payer_id: string
          payment_method: string | null
          payment_type: string
          platform_commission: number | null
          receiver_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          id?: string
          net_amount: number
          notes?: string | null
          payer_id: string
          payment_method?: string | null
          payment_type: string
          platform_commission?: number | null
          receiver_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          id?: string
          net_amount?: number
          notes?: string | null
          payer_id?: string
          payment_method?: string | null
          payment_type?: string
          platform_commission?: number | null
          receiver_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      room_favorites: {
        Row: {
          created_at: string
          id: string
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_favorites_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          availability: Database["public"]["Enums"]["room_availability"] | null
          created_at: string
          description: string | null
          facilities: string[] | null
          house_rules: string[] | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          location_address: string
          location_city: string
          location_lat: number | null
          location_lng: number | null
          location_state: string | null
          owner_id: string
          rating: number | null
          rent_amount: number
          review_count: number | null
          security_deposit: number | null
          title: string
          updated_at: string
        }
        Insert: {
          availability?: Database["public"]["Enums"]["room_availability"] | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          house_rules?: string[] | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          location_address: string
          location_city: string
          location_lat?: number | null
          location_lng?: number | null
          location_state?: string | null
          owner_id: string
          rating?: number | null
          rent_amount: number
          review_count?: number | null
          security_deposit?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          availability?: Database["public"]["Enums"]["room_availability"] | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          house_rules?: string[] | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          location_address?: string
          location_city?: string
          location_lat?: number | null
          location_lng?: number | null
          location_state?: string | null
          owner_id?: string
          rating?: number | null
          rent_amount?: number
          review_count?: number | null
          security_deposit?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_verified: boolean | null
          location_city: string | null
          name: string
          price_range: string | null
          provider_id: string | null
          rating: number | null
          review_count: number | null
          updated_at: string
        }
        Insert: {
          category: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          location_city?: string | null
          name: string
          price_range?: string | null
          provider_id?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          location_city?: string | null
          name?: string
          price_range?: string | null
          provider_id?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "property_owner" | "tenant"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      buzz_category: "tip" | "warning" | "question" | "review" | "general"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      room_availability: "available" | "occupied" | "maintenance"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "property_owner", "tenant"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      buzz_category: ["tip", "warning", "question", "review", "general"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      room_availability: ["available", "occupied", "maintenance"],
    },
  },
} as const
