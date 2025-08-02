import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'
import { useState, useEffect, useCallback, useRef } from 'react';

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
  intervalMs: number = 10000, // Increased to 10 seconds to be less aggressive
  onNewData?: (data: any) => void
) => {
  let intervalId: NodeJS.Timeout | null = null;
  let lastDataHash: string = '';
  
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

// Optimized Real-time State Management
class RealtimeStateManager {
  private static instance: RealtimeStateManager;
  private subscriptions: Map<string, any> = new Map();
  private callbacks: Map<string, Set<(data: any) => void>> = new Map();
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  private constructor() {
    this.setupConnectionMonitoring();
  }

  static getInstance(): RealtimeStateManager {
    if (!RealtimeStateManager.instance) {
      RealtimeStateManager.instance = new RealtimeStateManager();
    }
    return RealtimeStateManager.instance;
  }

  private setupConnectionMonitoring() {
    // Monitor connection status - using channel events instead of realtime events
    const monitorChannel = supabase.channel('connection-monitor')
      .on('system', { event: 'connected' }, () => {
        console.log('Realtime connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      })
      .on('system', { event: 'disconnected' }, () => {
        console.log('Realtime disconnected');
        this.isConnected = false;
        this.attemptReconnect();
      })
      .subscribe();
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (!this.isConnected) {
        this.attemptReconnect();
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  // Subscribe to specific table changes with optimized filtering
  subscribeToTable(
    tableName: string, 
    callback: (payload: any) => void,
    filters?: { [key: string]: any }
  ): () => void {
    const subscriptionKey = `${tableName}-${JSON.stringify(filters || {})}`;
    
    console.log(`Setting up subscription for ${tableName} with filters:`, filters);
    
    // Add callback to the set
    if (!this.callbacks.has(subscriptionKey)) {
      this.callbacks.set(subscriptionKey, new Set());
    }
    this.callbacks.get(subscriptionKey)!.add(callback);

    // Create subscription if it doesn't exist
    if (!this.subscriptions.has(subscriptionKey)) {
      const filterString = filters ? this.buildFilterString(filters) : undefined;
      console.log(`Creating channel for ${tableName} with filter:`, filterString);
      
      const channel = supabase
        .channel(`table-${subscriptionKey}-${Date.now()}`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: tableName,
            ...(filterString && { filter: filterString })
          }, 
          (payload) => {
            console.log(`${tableName} real-time event received:`, payload);
            this.notifyCallbacks(subscriptionKey, payload);
          }
        )
        .subscribe((status) => {
          console.log(`${tableName} subscription status:`, status);
          if (status === 'SUBSCRIBED') {
            console.log(`Successfully subscribed to ${tableName} changes`);
          }
        });

      this.subscriptions.set(subscriptionKey, channel);
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(subscriptionKey);
      if (callbacks) {
        callbacks.delete(callback);
        
        // If no more callbacks, remove subscription
        if (callbacks.size === 0) {
          const subscription = this.subscriptions.get(subscriptionKey);
          if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(subscriptionKey);
          }
          this.callbacks.delete(subscriptionKey);
        }
      }
    };
  }

  private buildFilterString(filters: { [key: string]: any }): string {
    return Object.entries(filters)
      .map(([key, value]) => `${key}=eq.${value}`)
      .join(',');
  }

  private notifyCallbacks(subscriptionKey: string, payload: any) {
    const callbacks = this.callbacks.get(subscriptionKey);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error('Error in realtime callback:', error);
        }
      });
    }
  }

  // Cleanup all subscriptions
  cleanup() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
    this.callbacks.clear();
  }
}

// Test real-time connection
export const testRealtimeConnection = async () => {
  console.log('Testing real-time connection...');
  
  return new Promise((resolve) => {
    const channel = supabase
      .channel('test-connection')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders'
        }, 
        (payload) => {
          console.log('✅ Real-time is working! Received payload:', payload);
          channel.unsubscribe();
          resolve(true);
        }
      )
      .subscribe((status) => {
        console.log('Test subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to test channel');
          // Wait 3 seconds to see if we get any events
          setTimeout(() => {
            console.log('⚠️ No real-time events received. Replication might not be enabled.');
            channel.unsubscribe();
            resolve(false);
          }, 3000);
        } else if (status === 'CHANNEL_ERROR') {
          console.log('❌ Failed to subscribe to test channel');
          resolve(false);
        }
      });
  });
};

// Enhanced real-time service with fallback polling
export const realtimeService = {
  manager: RealtimeStateManager.getInstance(),

  // Test if real-time is working
  async testConnection() {
    return await testRealtimeConnection();
  },

  // Subscribe to orders with optional location filter
  subscribeToOrders(callback: (payload: any) => void, locationId?: string) {
    const filters = locationId ? { location_id: locationId } : undefined;
    return this.manager.subscribeToTable('orders', callback, filters);
  },

  // Subscribe to drivers with optional location filter
  subscribeToDrivers(callback: (payload: any) => void, locationId?: string) {
    const filters = locationId ? { location_id: locationId } : undefined;
    return this.manager.subscribeToTable('drivers', callback, filters);
  },

  // Subscribe to staff with optional location filter
  subscribeToStaff(callback: (payload: any) => void, locationId?: string) {
    const filters = locationId ? { location_id: locationId } : undefined;
    return this.manager.subscribeToTable('staff', callback, filters);
  },

  // Subscribe to driver-specific orders
  subscribeToDriverOrders(driverId: string, callback: (payload: any) => void) {
    return this.manager.subscribeToTable('orders', callback, { assigned_driver_id: driverId });
  },

  // Subscribe to all relevant tables (for admin dashboard)
  subscribeToAllUpdates(callback: (payload: any) => void) {
    const unsubscribers: (() => void)[] = [];
    
    unsubscribers.push(this.manager.subscribeToTable('orders', callback));
    unsubscribers.push(this.manager.subscribeToTable('drivers', callback));
    unsubscribers.push(this.manager.subscribeToTable('staff', callback));
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  },

  // Legacy methods for backward compatibility
  subscribeToLocationUpdates(locationId: string, callback: (payload: any) => void) {
    const unsubscribers: (() => void)[] = [];
    
    unsubscribers.push(this.manager.subscribeToTable('orders', callback, { location_id: locationId }));
    unsubscribers.push(this.manager.subscribeToTable('drivers', callback, { location_id: locationId }));
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  },

  subscribeToDriverUpdates(driverId: string, callback: (payload: any) => void) {
    return this.manager.subscribeToTable('orders', callback, { assigned_driver_id: driverId });
  },

  // Cleanup method
  cleanup() {
    this.manager.cleanup();
  }
}

// Custom Hook for Optimized State Management with Fallback Polling

export const useOptimizedRealtimeData = <T>(
  fetchFunction: () => Promise<T[]>,
  subscriptionConfig: {
    table: string;
    filters?: { [key: string]: any };
    onNewData?: (data: T) => void;
  },
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'testing' | 'working' | 'fallback'>('testing');
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<T[]>([]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const newData = await fetchFunction();
      
      // Only update if data has actually changed
      if (hasDataChanged(lastDataRef.current, newData)) {
        lastDataRef.current = newData;
        setData(newData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gabim në ngarkimin e të dhënave');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  // Optimistic update function
  const optimisticUpdate = useCallback((updater: (prevData: T[]) => T[]) => {
    setData(prevData => {
      const newData = updater(prevData);
      lastDataRef.current = newData;
      return newData;
    });
  }, []);

  // Setup fallback polling
  const setupPolling = useCallback(() => {
    console.log(`Setting up fallback polling for ${subscriptionConfig.table}`);
    setRealtimeStatus('fallback');
    
    // Poll every 3 seconds for faster updates
    pollingRef.current = setInterval(() => {
      if (isUserActive()) {
        console.log(`Polling ${subscriptionConfig.table} for updates...`);
        fetchData();
      }
    }, 3000);
  }, [subscriptionConfig.table, fetchData]);

  // Setup real-time subscription
  useEffect(() => {
    console.log(`Setting up real-time subscription for ${subscriptionConfig.table} with filters:`, subscriptionConfig.filters);
    
    // Initial data fetch
    fetchData();

    // Test real-time connection first
    const testAndSetup = async () => {
      try {
        const isRealtimeWorking = await realtimeService.testConnection();
        
        if (isRealtimeWorking) {
          console.log(`✅ Real-time is working for ${subscriptionConfig.table}`);
          setRealtimeStatus('working');
          
          // Setup real-time subscription
          const unsubscribe = realtimeService.manager.subscribeToTable(
            subscriptionConfig.table,
            (payload) => {
              console.log(`${subscriptionConfig.table} real-time update received:`, payload);
              console.log(`Event type: ${payload.eventType}, Table: ${payload.table}`);
              
              // Handle different event types immediately
              if (payload.eventType === 'INSERT' && subscriptionConfig.onNewData) {
                console.log('Calling onNewData callback with:', payload.new);
                subscriptionConfig.onNewData(payload.new);
              }
              
              // Immediately fetch fresh data for all events
              console.log('Fetching fresh data after real-time event...');
              fetchData();
            },
            subscriptionConfig.filters
          );

          unsubscribeRef.current = unsubscribe;
        } else {
          console.log(`⚠️ Real-time not working for ${subscriptionConfig.table}, using fallback polling`);
          console.log('💡 To enable real-time: Go to Supabase Dashboard → Table Editor → Select table → Replication → Enable INSERT/UPDATE/DELETE');
          setupPolling();
        }
      } catch (error) {
        console.error(`Error testing real-time for ${subscriptionConfig.table}:`, error);
        setupPolling();
      }
    };

    testAndSetup();

    // Cleanup function
    return () => {
      console.log(`Cleaning up subscription for ${subscriptionConfig.table}`);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [...dependencies, subscriptionConfig.table, JSON.stringify(subscriptionConfig.filters)]);

  return {
    data,
    loading,
    error,
    realtimeStatus,
    refetch: fetchData,
    optimisticUpdate
  };
}; 