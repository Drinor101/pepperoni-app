import { createClient } from '@supabase/supabase-js'

// Try multiple ways to get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY



// Validate environment variables
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is not defined in environment variables')
  throw new Error('VITE_SUPABASE_URL is required. Please check your environment variables.')
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not defined in environment variables')
  throw new Error('VITE_SUPABASE_ANON_KEY is required. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'pepperoni-pizza-app'
    }
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password: string
          role: 'admin' | 'staff' | 'driver'
          location_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          password: string
          role: 'admin' | 'staff' | 'driver'
          location_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          password?: string
          role?: 'admin' | 'staff' | 'driver'
          location_id?: string
          created_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          manager: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          manager: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          manager?: string
          created_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          username: string
          password: string
          name: string
          phone: string
          status: 'i_lire' | 'ne_delivery'
          location_id: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          password: string
          name: string
          phone: string
          status?: 'i_lire' | 'ne_delivery'
          location_id: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          password?: string
          name?: string
          phone?: string
          status?: 'i_lire' | 'ne_delivery'
          location_id?: string
          created_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          username: string
          password: string
          name: string
          phone: string
          location_id: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          password: string
          name: string
          phone: string
          location_id: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          password?: string
          name?: string
          phone?: string
          location_id?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: number
          customer_name: string
          customer_phone: string
          address: string
          location_id: string
          total: number
          status: 'pranuar' | 'konfirmuar' | 'ne_delivery' | 'perfunduar'
          assigned_driver_id?: string
          created_at: string
          estimated_delivery: string
        }
        Insert: {
          id?: string
          order_number: number
          customer_name: string
          customer_phone: string
          address: string
          location_id: string
          total: number
          status?: 'pranuar' | 'konfirmuar' | 'ne_delivery' | 'perfunduar'
          assigned_driver_id?: string
          created_at?: string
          estimated_delivery: string
        }
        Update: {
          id?: string
          order_number?: number
          customer_name?: string
          customer_phone?: string
          address?: string
          location_id?: string
          total?: number
          status?: 'pranuar' | 'konfirmuar' | 'ne_delivery' | 'perfunduar'
          assigned_driver_id?: string
          created_at?: string
          estimated_delivery?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          name: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          name: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          name?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
    }
  }
} 