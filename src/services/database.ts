import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type User = Database['public']['Tables']['users']['Row']
type Location = Database['public']['Tables']['locations']['Row']
type Driver = Database['public']['Tables']['drivers']['Row']
type Order = Database['public']['Tables']['orders']['Row']
type OrderItem = Database['public']['Tables']['order_items']['Row']

// User Authentication and Management
export const authService = {
  async login(username: string, password: string) {
    // Check in users table (admin)
    let { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single()

    if (data) {
      return { ...data, role: 'admin' }
    }

    // Check in staff table
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select(`
        *,
        locations(name)
      `)
      .eq('username', username)
      .eq('password', password)
      .single()

    if (staffData) {
      return { ...staffData, role: 'staff' }
    }

    // Check in drivers table
    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .select(`
        *,
        locations(name)
      `)
      .eq('username', username)
      .eq('password', password)
      .single()

    if (driverData) {
      return { ...driverData, role: 'driver' }
    }

    throw new Error('Invalid credentials')
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async getAllStaff() {
    const { data, error } = await supabase
      .from('staff')
      .select(`
        *,
        locations(name)
      `)
      .order('username')

    if (error) throw error
    return data
  },

  async createStaff(staff: { username: string; password: string; name: string; phone: string; location_id: string }) {
    const { data, error } = await supabase
      .from('staff')
      .insert(staff)
      .select(`
        *,
        locations(name)
      `)
      .single()

    if (error) throw error
    return data
  },

  async deleteStaff(id: string) {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Locations
export const locationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }
}

// Drivers
export const driverService = {
  async getAll() {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        locations(name)
      `)
      .order('name')

    if (error) throw error
    return data
  },

  async getByLocation(locationId: string) {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        locations(name)
      `)
      .eq('location_id', locationId)
      .order('name')

    if (error) throw error
    return data
  },

  async create(driver: { username: string; password: string; name: string; phone: string; location_id: string; status?: 'i_lire' | 'ne_delivery' }) {
    const { data, error } = await supabase
      .from('drivers')
      .insert(driver)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: 'i_lire' | 'ne_delivery') {
    const { data, error } = await supabase
      .from('drivers')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Orders
export const orderService = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        locations(name),
        drivers(name, phone),
        order_items(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getByLocation(locationId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        locations(name),
        drivers(name, phone),
        order_items(*)
      `)
      .eq('location_id', locationId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getByDriver(driverId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        locations(name),
        drivers(name, phone),
        order_items(*)
      `)
      .eq('assigned_driver_id', driverId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getByStatus(status: Order['status']) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        locations(name),
        drivers(name, phone),
        order_items(*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async create(order: Omit<Order, 'id' | 'created_at' | 'order_number'>, items: Omit<OrderItem, 'id' | 'created_at'>[]) {
    // Start a transaction
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = items.map(item => ({
      ...item,
      order_id: orderData.id
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return orderData
  },

  async updateStatus(id: string, status: Order['status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async assignDriver(orderId: string, driverId: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        assigned_driver_id: driverId,
        status: 'konfirmuar'
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getDeliveredOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        locations(name),
        drivers(name, phone),
        order_items(*)
      `)
      .eq('status', 'perfunduar')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// Real-time subscriptions
export const realtimeService = {
  subscribeToOrders(callback: (payload: any) => void) {
    return supabase
      .channel('orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        callback
      )
      .subscribe()
  },

  subscribeToDrivers(callback: (payload: any) => void) {
    return supabase
      .channel('drivers')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'drivers' }, 
        callback
      )
      .subscribe()
  }
} 