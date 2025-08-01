import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type User = Database['public']['Tables']['users']['Row']
type Location = Database['public']['Tables']['locations']['Row']
type Driver = Database['public']['Tables']['drivers']['Row']
type Order = Database['public']['Tables']['orders']['Row']
type OrderItem = Database['public']['Tables']['order_items']['Row']

// Utility function to check if data has changed
export const hasDataChanged = (oldData: any[], newData: any[]): boolean => {
  if (oldData.length !== newData.length) return true;
  
  // Check if any items have changed by comparing IDs and key fields
  for (let i = 0; i < oldData.length; i++) {
    const oldItem = oldData[i];
    const newItem = newData[i];
    
    if (oldItem.id !== newItem.id) return true;
    
    // For orders, check status and assigned_driver_id
    if (oldItem.status !== newItem.status || oldItem.assigned_driver_id !== newItem.assigned_driver_id) {
      return true;
    }
    
    // For drivers, check status
    if (oldItem.status !== newItem.status) {
      return true;
    }
  }
  
  return false;
};

// Utility function to check if user is active on the page
export const isUserActive = (): boolean => {
  return !document.hidden && document.hasFocus();
};

// Fallback refresh mechanism for when real-time fails
export const createFallbackRefresh = (
  refreshFunction: () => Promise<void>,
  intervalMs: number = 3000
) => {
  let intervalId: NodeJS.Timeout | null = null;
  
  const start = () => {
    if (intervalId) return; // Already running
    
    intervalId = setInterval(async () => {
      if (isUserActive()) {
        try {
          await refreshFunction();
        } catch (error) {
          console.error('Fallback refresh error:', error);
        }
      }
    }, intervalMs);
  };
  
  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  
  return { start, stop };
};

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
  },

  async updateStaff(id: string, updates: { name?: string; phone?: string; location_id?: string; password?: string }) {
    const { data, error } = await supabase
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        locations(name)
      `)
      .single()

    if (error) throw error
    return data
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

  async update(id: string, updates: { name?: string; phone?: string; location_id?: string; password?: string }) {
    const { data, error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        locations(name)
      `)
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
        order_items(name, quantity, price)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Transform the data to map order_items to items
    return data?.map(order => ({
      ...order,
      items: order.order_items || []
    })) || []
  },

  async getByLocation(locationId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        locations(name),
        drivers(name, phone),
        order_items(name, quantity, price)
      `)
      .eq('location_id', locationId)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Transform the data to map order_items to items
    const transformedData = data?.map(order => ({
      ...order,
      items: order.order_items || []
    })) || []
    

    
    return transformedData
  },

  async getByDriver(driverId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        locations(name),
        order_items(name, quantity, price)
      `)
      .eq('assigned_driver_id', driverId)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Transform the data to map order_items to items
    return data?.map(order => ({
      ...order,
      items: order.order_items || []
    })) || []
  },

  async getByStatus(status: 'pranuar' | 'konfirmuar' | 'ne_delivery' | 'perfunduar') {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        locations(name),
        drivers(name, phone),
        order_items(name, quantity, price)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Transform the data to map order_items to items
    return data?.map(order => ({
      ...order,
      items: order.order_items || []
    })) || []
  },

  async create(order: Omit<Order, 'id' | 'order_number' | 'created_at'>, items: Omit<OrderItem, 'id' | 'order_id'>[]) {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()

    if (orderError) throw orderError

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

  async updateStatus(id: string, status: 'pranuar' | 'konfirmuar' | 'ne_delivery' | 'perfunduar') {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async assignDriver(id: string, driverId: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ assigned_driver_id: driverId })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    // First delete order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id)

    if (itemsError) throw itemsError

    // Then delete the order
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (orderError) throw orderError
  }
}

// Real-time subscriptions
export const realtimeService = {
  subscribeToOrders(callback: (payload: any) => void) {
    const channel = supabase
      .channel(`orders-updates-${Date.now()}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('Orders real-time event:', payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log('Orders subscription status:', status);
      });
    
    return channel;
  },

  subscribeToDrivers(callback: (payload: any) => void) {
    const channel = supabase
      .channel(`drivers-updates-${Date.now()}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'drivers' }, 
        (payload) => {
          console.log('Drivers real-time event:', payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log('Drivers subscription status:', status);
      });
    
    return channel;
  },

  subscribeToStaff(callback: (payload: any) => void) {
    const channel = supabase
      .channel(`staff-updates-${Date.now()}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'staff' }, 
        (payload) => {
          console.log('Staff real-time event:', payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log('Staff subscription status:', status);
      });
    
    return channel;
  },

  // Enhanced subscription for location-specific updates
  subscribeToLocationUpdates(locationId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`location-${locationId}-updates-${Date.now()}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `location_id=eq.${locationId}`
        }, 
        (payload) => {
          console.log('Location orders real-time event:', payload);
          callback(payload);
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'drivers',
          filter: `location_id=eq.${locationId}`
        }, 
        (payload) => {
          console.log('Location drivers real-time event:', payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log('Location subscription status:', status);
      });
    
    return channel;
  },

  // Subscription for driver-specific updates
  subscribeToDriverUpdates(driverId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`driver-${driverId}-updates-${Date.now()}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `assigned_driver_id=eq.${driverId}`
        }, 
        (payload) => {
          console.log('Driver orders real-time event:', payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log('Driver subscription status:', status);
      });
    
    return channel;
  },

  // Comprehensive subscription for all order and driver changes
  subscribeToAllUpdates(callback: (payload: any) => void) {
    const channel = supabase
      .channel(`all-updates-${Date.now()}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('All updates - Orders event:', payload);
          callback(payload);
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'drivers' }, 
        (payload) => {
          console.log('All updates - Drivers event:', payload);
          callback(payload);
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'staff' }, 
        (payload) => {
          console.log('All updates - Staff event:', payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log('All updates subscription status:', status);
      });
    
    return channel;
  }
} 