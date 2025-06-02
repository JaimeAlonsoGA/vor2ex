export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      credentials: {
        Row: {
          amz_access_token: string | null
          amz_expires_at: string | null
          amz_refresh_token: string | null
          id: string
          user_id: string
        }
        Insert: {
          amz_access_token?: string | null
          amz_expires_at?: string | null
          amz_refresh_token?: string | null
          id?: string
          user_id: string
        }
        Update: {
          amz_access_token?: string | null
          amz_expires_at?: string | null
          amz_refresh_token?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      niches: {
        Row: {
          amazon_choice_count: number | null
          amazon_marketplace: string
          avg_alibaba_min_order_quantity: number | null
          avg_alibaba_price: number | null
          avg_alibaba_rating: number | null
          avg_amazon_buy_box_price: number | null
          avg_amazon_date: string | null
          avg_amazon_price: number | null
          avg_amazon_ranking: number | null
          avg_amazon_rating: number | null
          avg_amazon_reviews: number | null
          avg_amazon_sales_volume: number | null
          best_seller_count: number | null
          id: string
          keyword: string
          max_alibaba_min_order_quantity: number | null
          max_alibaba_price: number | null
          max_amazon_price: number | null
          max_amazon_ranking: number | null
          max_amazon_rating: number | null
          max_amazon_reviews: number | null
          min_alibaba_min_order_quantity: number | null
          min_alibaba_price: number | null
          min_amazon_price: number | null
          min_amazon_ranking: number | null
          min_amazon_rating: number | null
          min_amazon_reviews: number | null
          newest_amazon_date: string | null
          oldest_amazon_date: string | null
          prime_count: number | null
          searched_at: string
          top_amazon_brand: string | null
          top_category: string | null
          total_alibaba_products: number | null
          total_amazon_offer_count: number | null
          total_amazon_products: number | null
          total_amazon_reviews: number | null
          total_amazon_sales_volume: number | null
          total_amazon_sponsored: number | null
          total_guaranteed_suppliers: number | null
          total_verified_suppliers: number | null
          unique_alibaba_suppliers: number | null
          unique_amazon_brands: number | null
          unique_categories: number | null
        }
        Insert: {
          amazon_choice_count?: number | null
          amazon_marketplace?: string
          avg_alibaba_min_order_quantity?: number | null
          avg_alibaba_price?: number | null
          avg_alibaba_rating?: number | null
          avg_amazon_buy_box_price?: number | null
          avg_amazon_date?: string | null
          avg_amazon_price?: number | null
          avg_amazon_ranking?: number | null
          avg_amazon_rating?: number | null
          avg_amazon_reviews?: number | null
          avg_amazon_sales_volume?: number | null
          best_seller_count?: number | null
          id?: string
          keyword: string
          max_alibaba_min_order_quantity?: number | null
          max_alibaba_price?: number | null
          max_amazon_price?: number | null
          max_amazon_ranking?: number | null
          max_amazon_rating?: number | null
          max_amazon_reviews?: number | null
          min_alibaba_min_order_quantity?: number | null
          min_alibaba_price?: number | null
          min_amazon_price?: number | null
          min_amazon_ranking?: number | null
          min_amazon_rating?: number | null
          min_amazon_reviews?: number | null
          newest_amazon_date?: string | null
          oldest_amazon_date?: string | null
          prime_count?: number | null
          searched_at: string
          top_amazon_brand?: string | null
          top_category?: string | null
          total_alibaba_products?: number | null
          total_amazon_offer_count?: number | null
          total_amazon_products?: number | null
          total_amazon_reviews?: number | null
          total_amazon_sales_volume?: number | null
          total_amazon_sponsored?: number | null
          total_guaranteed_suppliers?: number | null
          total_verified_suppliers?: number | null
          unique_alibaba_suppliers?: number | null
          unique_amazon_brands?: number | null
          unique_categories?: number | null
        }
        Update: {
          amazon_choice_count?: number | null
          amazon_marketplace?: string
          avg_alibaba_min_order_quantity?: number | null
          avg_alibaba_price?: number | null
          avg_alibaba_rating?: number | null
          avg_amazon_buy_box_price?: number | null
          avg_amazon_date?: string | null
          avg_amazon_price?: number | null
          avg_amazon_ranking?: number | null
          avg_amazon_rating?: number | null
          avg_amazon_reviews?: number | null
          avg_amazon_sales_volume?: number | null
          best_seller_count?: number | null
          id?: string
          keyword?: string
          max_alibaba_min_order_quantity?: number | null
          max_alibaba_price?: number | null
          max_amazon_price?: number | null
          max_amazon_ranking?: number | null
          max_amazon_rating?: number | null
          max_amazon_reviews?: number | null
          min_alibaba_min_order_quantity?: number | null
          min_alibaba_price?: number | null
          min_amazon_price?: number | null
          min_amazon_ranking?: number | null
          min_amazon_rating?: number | null
          min_amazon_reviews?: number | null
          newest_amazon_date?: string | null
          oldest_amazon_date?: string | null
          prime_count?: number | null
          searched_at?: string
          top_amazon_brand?: string | null
          top_category?: string | null
          total_alibaba_products?: number | null
          total_amazon_offer_count?: number | null
          total_amazon_products?: number | null
          total_amazon_reviews?: number | null
          total_amazon_sales_volume?: number | null
          total_amazon_sponsored?: number | null
          total_guaranteed_suppliers?: number | null
          total_verified_suppliers?: number | null
          unique_alibaba_suppliers?: number | null
          unique_amazon_brands?: number | null
          unique_categories?: number | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          amazon_marketplace: string
          auth_id: string
          id: string
          language: string
          name: string
        }
        Insert: {
          amazon_marketplace?: string
          auth_id: string
          id?: string
          language?: string
          name?: string
        }
        Update: {
          amazon_marketplace?: string
          auth_id?: string
          id?: string
          language?: string
          name?: string
        }
        Relationships: []
      }
      strategies: {
        Row: {
          color: string
          description: string
          icon: string
          id: string
          name: string
          price_max: number
          price_min: number
          price_weight: number
          rating_optimum: number
          rating_weight: number
          reviews_good: number
          reviews_tense: number
          reviews_top: number
          reviews_weight: number
          sales_volume_optimum: number
          sales_weight: number
          selected: boolean
          user_id: string
        }
        Insert: {
          color: string
          description: string
          icon: string
          id?: string
          name: string
          price_max: number
          price_min: number
          price_weight: number
          rating_optimum: number
          rating_weight: number
          reviews_good: number
          reviews_tense: number
          reviews_top: number
          reviews_weight: number
          sales_volume_optimum?: number
          sales_weight: number
          selected?: boolean
          user_id: string
        }
        Update: {
          color?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          price_max?: number
          price_min?: number
          price_weight?: number
          rating_optimum?: number
          rating_weight?: number
          reviews_good?: number
          reviews_tense?: number
          reviews_top?: number
          reviews_weight?: number
          sales_volume_optimum?: number
          sales_weight?: number
          selected?: boolean
          user_id?: string
        }
        Relationships: []
      }
      users_niches: {
        Row: {
          id: string
          niche_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          niche_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          niche_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_niches_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
