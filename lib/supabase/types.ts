export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'realtor' | 'developer'
export type ProjectLifecycle = 'draft' | 'pending_approval' | 'published' | 'archived'
export type ListingStatus = 'registration' | 'selling' | 'sold_out' | 'coming_soon' | 'complete'
export type ConstructionStatus = 'preconstruction' | 'under_construction' | 'complete'
export type OwnershipType = 'condominium' | 'freehold' | 'mixed' | 'co_op'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          display_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: UserRole
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          display_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      realtor_profiles: {
        Row: {
          user_id: string
          first_name: string | null
          last_name: string | null
          reco_number: string | null
          email: string | null
          phone: string | null
          photo_url: string | null
          brokerage_name: string | null
          referral_slug: string | null
          ad_credit_balance: number
          is_featured: boolean
          is_verified: boolean
        }
        Insert: {
          user_id: string
          first_name?: string | null
          last_name?: string | null
          reco_number?: string | null
          email?: string | null
          phone?: string | null
          photo_url?: string | null
          brokerage_name?: string | null
          referral_slug?: string | null
          ad_credit_balance?: number
          is_featured?: boolean
          is_verified?: boolean
        }
        Update: {
          first_name?: string | null
          last_name?: string | null
          reco_number?: string | null
          email?: string | null
          phone?: string | null
          photo_url?: string | null
          brokerage_name?: string | null
          referral_slug?: string | null
          ad_credit_balance?: number
          is_featured?: boolean
          is_verified?: boolean
        }
        Relationships: []
      }
      pending_projects: {
        Row: {
          id: string
          submitted_by: string
          submitted_at: string
          status: 'pending' | 'approved' | 'rejected'
          reviewed_by: string | null
          reviewed_at: string | null
          rejection_reason: string | null
          proposed_name: string
          proposed_slug: string
          proposed_developer: string | null
          proposed_address: string | null
          proposed_city: string | null
          proposed_province: string | null
          proposed_neighbourhood: string | null
          proposed_price_from: number | null
          proposed_price_to: number | null
          proposed_description: string | null
          proposed_drive_folder_url: string | null
          proposed_payload: Json | null
        }
        Insert: {
          id?: string
          submitted_by: string
          submitted_at?: string
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
          proposed_name: string
          proposed_slug: string
          proposed_developer?: string | null
          proposed_address?: string | null
          proposed_city?: string | null
          proposed_province?: string | null
          proposed_neighbourhood?: string | null
          proposed_price_from?: number | null
          proposed_price_to?: number | null
          proposed_description?: string | null
          proposed_drive_folder_url?: string | null
          proposed_payload?: Json | null
        }
        Update: {
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      v_public_developments: {
        Row: {
          id: string
          name: string
          slug: string
          city: string | null
          neighbourhood: string | null
          price_from: number | null
          price_to: number | null
          headline: string | null
          description: string | null
          developer_name: string | null
          listing_status: ListingStatus | null
          construction_status: ConstructionStatus | null
          ownership_type: OwnershipType | null
          lifecycle: ProjectLifecycle | null
          created_at: string
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      project_lifecycle: ProjectLifecycle
      listing_status: ListingStatus
      construction_status: ConstructionStatus
      ownership_type: OwnershipType
    }
    CompositeTypes: Record<string, never>
  }
}
