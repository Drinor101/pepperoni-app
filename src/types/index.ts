// User types
export interface User {
  username: string;
  role: 'admin' | 'staff' | 'driver';
  location?: string;
  location_id?: string;
  id?: string;
}

// Cart types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Order types
export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  location_id: string;
  locations?: { name: string };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pranuar' | 'konfirmuar' | 'ne_delivery' | 'perfunduar';
  created_at: string;
  estimated_delivery: string;
  assigned_driver_id?: string;
  drivers?: {
    id: string;
    name: string;
    phone: string;
  };
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  order_id: string;
}

// Driver types
export interface Driver {
  id: string;
  username: string;
  name: string;
  phone: string;
  status: 'i_lire' | 'ne_delivery';
  location_id: string;
  locations?: { name: string };
}

// Staff types
export interface Staff {
  id: string;
  username: string;
  name: string;
  phone: string;
  location_id: string;
  locations?: { name: string };
}

// Location types
export interface Location {
  id: string;
  name: string;
  address: string;
}

// Alert types
export interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

// App state types
export type AppState = 'home' | 'checkout' | 'thankyou' | 'login' | 'admin' | 'staff' | 'driver'; 