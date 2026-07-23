export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cleaning_jobs: {
        Row: {
          cleaner_id: string | null
          created_at: string | null
          estimated_end: string | null
          id: string
          progress: number
          services: string[] | null
          start_time: string | null
          status: string
          steps: Json
          vehicle_id: string
        }
        Insert: {
          cleaner_id?: string | null
          created_at?: string | null
          estimated_end?: string | null
          id?: string
          progress?: number
          services?: string[] | null
          start_time?: string | null
          status?: string
          steps?: Json
          vehicle_id: string
        }
        Update: {
          cleaner_id?: string | null
          created_at?: string | null
          estimated_end?: string | null
          id?: string
          progress?: number
          services?: string[] | null
          start_time?: string | null
          status?: string
          steps?: Json
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cleaning_jobs_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cleaning_jobs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_issues: {
        Row: {
          icon: string
          id: string
          label: string
        }
        Insert: {
          icon: string
          id: string
          label: string
        }
        Update: {
          icon?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          created_at_iso: string | null
          description: string | null
          id: string
          issue_id: string
          status: string
          vehicle_id: string
        }
        Insert: {
          created_at_iso?: string | null
          description?: string | null
          id?: string
          issue_id: string
          status?: string
          vehicle_id: string
        }
        Update: {
          created_at_iso?: string | null
          description?: string | null
          id?: string
          issue_id?: string
          status?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "complaint_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at_iso: string | null
          id: string
          read: boolean
          service_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at_iso?: string | null
          id?: string
          read?: boolean
          service_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at_iso?: string | null
          id?: string
          read?: boolean
          service_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          expo_push_token: string | null
          id: string
          name: string
          phone: string
          role: string
          society_id: string | null
        }
        Insert: {
          created_at?: string | null
          expo_push_token?: string | null
          id: string
          name: string
          phone: string
          role: string
          society_id?: string | null
        }
        Update: {
          created_at?: string | null
          expo_push_token?: string | null
          id?: string
          name?: string
          phone?: string
          role?: string
          society_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_society_id_fkey"
            columns: ["society_id"]
            isOneToOne: false
            referencedRelation: "societies"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          id: string
          interior_clean_day: string | null
          is_paused: boolean
          paused_from_iso: string | null
          paused_until_iso: string | null
          pending_interior_clean_day: string | null
          preferred_slot: string
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          id?: string
          interior_clean_day?: string | null
          is_paused?: boolean
          paused_from_iso?: string | null
          paused_until_iso?: string | null
          pending_interior_clean_day?: string | null
          preferred_slot: string
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          id?: string
          interior_clean_day?: string | null
          is_paused?: boolean
          paused_from_iso?: string | null
          paused_until_iso?: string | null
          pending_interior_clean_day?: string | null
          preferred_slot?: string
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_records: {
        Row: {
          cleaner_name: string
          date_iso: string
          id: string
          rating: number
          status: string
          time: string
          type: string
          vehicle_id: string
        }
        Insert: {
          cleaner_name: string
          date_iso?: string
          id?: string
          rating?: number
          status: string
          time: string
          type?: string
          vehicle_id: string
        }
        Update: {
          cleaner_name?: string
          date_iso?: string
          id?: string
          rating?: number
          status?: string
          time?: string
          type?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      societies: {
        Row: {
          city: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          city?: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          features: string[]
          id: string
          name: string
          popular: boolean
          price_per_month_inr: number
        }
        Insert: {
          features?: string[]
          id: string
          name: string
          popular?: boolean
          price_per_month_inr: number
        }
        Update: {
          features?: string[]
          id?: string
          name?: string
          popular?: boolean
          price_per_month_inr?: number
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          active: boolean
          end_date: string
          id: string
          plan_id: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          start_date: string
          user_id: string
        }
        Insert: {
          active?: boolean
          end_date: string
          id?: string
          plan_id: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          start_date?: string
          user_id: string
        }
        Update: {
          active?: boolean
          end_date?: string
          id?: string
          plan_id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string | null
          health_score: number
          id: string
          name: string
          owner_id: string
          parking_slot: string
          registration_number: string
          society_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          health_score?: number
          id?: string
          name: string
          owner_id: string
          parking_slot: string
          registration_number: string
          society_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          health_score?: number
          id?: string
          name?: string
          owner_id?: string
          parking_slot?: string
          registration_number?: string
          society_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_society_id_fkey"
            columns: ["society_id"]
            isOneToOne: false
            referencedRelation: "societies"
            referencedColumns: ["id"]
          },
        ]
      }
      wash_photo_sets: {
        Row: {
          after_url: string
          before_url: string
          id: string
          service_id: string
          taken_at_iso: string
        }
        Insert: {
          after_url: string
          before_url: string
          id?: string
          service_id: string
          taken_at_iso?: string
        }
        Update: {
          after_url?: string
          before_url?: string
          id?: string
          service_id?: string
          taken_at_iso?: string
        }
        Relationships: [
          {
            foreignKeyName: "wash_photo_sets_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: true
            referencedRelation: "service_records"
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
