import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  DollarSign,
  Bell,
  Building,
  BarChart3,
  Plus,
  Users,
  UserPlus,
  X,
  Trash2,
  List,
  Grid3X3,
  Printer,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';
import pepperoniLogo from '../assets/pepperoni-test 1 (1).svg';
import { orderService, driverService, realtimeService } from '../services/database';

interface User {
  username: string;
  role: 'admin' | 'staff' | 'driver';
  location?: string;
  location_id?: string;
}

interface Order {
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

interface Driver {
  id: string;
  name: string;
  phone: string;
  status: 'i_lire' | 'ne_delivery';
  location_id: string;
  locations?: { name: string };
}

interface StaffDashboardProps {
  user: User | null;
  onLogout: () => void;
}

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const AlertPopup: React.FC<AlertProps> = ({ isOpen, onClose, title, message, type }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`max-w-md w-full mx-4 bg-white rounded-lg shadow-xl border ${getBgColor()}`}>
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="ml-3 w-0 flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600">
                {message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={onClose}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getButtonColor()}`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3 w-0 flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600">
                {message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={onClose}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium bg-gray-300 hover:bg-gray-400 text-gray-700 transition-colors"
            >
              Anulo
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Fshi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'drivers' | 'reports'>('orders');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban'); // Default to kanban
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Alert state
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setAlert({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const showConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (user?.location_id) {
          const [ordersData, driversData] = await Promise.all([
            orderService.getByLocation(user.location_id),
            driverService.getByLocation(user.location_id)
          ]);
          setOrders(ordersData);
          setDrivers(driversData);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Gabim në ngarkimin e të dhënave');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up enhanced real-time subscriptions
    if (user?.location_id) {
      const locationId = user.location_id;
  
      
      // Subscribe to location-specific updates
      const locationSubscription = realtimeService.subscribeToLocationUpdates(locationId, (payload) => {
        // Refresh data based on the type of change
        if (payload.table === 'orders') {
          orderService.getByLocation(locationId).then(setOrders).catch(err => {
            console.error('Error refreshing orders:', err);
          });
        } else if (payload.table === 'drivers') {
          driverService.getByLocation(locationId).then(setDrivers).catch(err => {
            console.error('Error refreshing drivers:', err);
          });
        }
      });

      // Also subscribe to all updates to catch cross-location changes
      const allUpdatesSubscription = realtimeService.subscribeToAllUpdates((payload) => {
        // Refresh data for any order or driver changes
        if (payload.table === 'orders') {
          orderService.getByLocation(locationId).then(setOrders).catch(err => {
            console.error('Error refreshing orders from all updates:', err);
          });
        } else if (payload.table === 'drivers') {
          driverService.getByLocation(locationId).then(setDrivers).catch(err => {
            console.error('Error refreshing drivers from all updates:', err);
          });
        }
      });

      return () => {
        if (locationSubscription) {
          locationSubscription.unsubscribe();
        }
        if (allUpdatesSubscription) {
          allUpdatesSubscription.unsubscribe();
        }
      };
    }
  }, [user?.location_id]);

  const openDriverModal = (order: Order) => {
    setSelectedOrder(order);
    setShowDriverModal(true);
  };

  const assignOrderToDriver = async (driverId: string) => {
    if (!selectedOrder) return;

    try {
      // Update local state immediately for better UX
      const driver = drivers.find(d => d.id === driverId);
      
      setOrders(prev => prev.map(order => 
        order.id === selectedOrder.id ? { 
          ...order, 
          status: 'konfirmuar',
          assigned_driver_id: driverId,
          drivers: driver
        } : order
      ));
      
      // Don't change driver status automatically - let driver manage their own status
      // Driver can accept multiple orders and manage their delivery status independently
      
      // Update database - only order status, not driver status
      await Promise.all([
        orderService.assignDriver(selectedOrder.id, driverId),
        orderService.updateStatus(selectedOrder.id, 'konfirmuar')
        // Removed driverService.updateStatus - driver manages their own status
      ]);
      
      showAlert(
        'Shoferi u caktua me sukses!',
        `Porosia #${selectedOrder.order_number} u caktua tek shoferi ${driver?.name}. Shoferi mund të marrë porosi të tjera gjatë kohës që dorëzon këtë porosi.`,
        'success'
      );
      setShowDriverModal(false);
      setSelectedOrder(null);
      
      // Force refresh data to ensure real-time updates
      if (user?.location_id) {
        setTimeout(() => {
          orderService.getByLocation(user.location_id!).then(setOrders);
          driverService.getByLocation(user.location_id!).then(setDrivers);
        }, 500);
      }
    } catch (err) {
      console.error('Error assigning driver:', err);
      showAlert('Gabim në caktimin e shoferit', 'Ndodhi një gabim gjatë caktimit të shoferit. Ju lutem provoni përsëri.', 'error');
      
      // Reload data if update failed
      if (user?.location_id) {
        orderService.getByLocation(user.location_id).then(setOrders);
        driverService.getByLocation(user.location_id).then(setDrivers);
      }
    }
  };

  const deleteOrder = async (orderId: string, orderNumber: number) => {
    showConfirmDialog(
      'Fshij porosinë',
      `A jeni të sigurt që dëshironi ta fshini porosinë #${orderNumber}? Kjo veprim nuk mund të kthehet mbrapsht.`,
      async () => {
        try {
          // Update local state immediately for better UX
          setOrders(prev => prev.filter(order => order.id !== orderId));
          
          // Delete from database
          await orderService.delete(orderId);
          showAlert('Porosia u fshi me sukses!', `Porosia #${orderNumber} u fshi nga sistemi.`, 'success');
        } catch (err) {
          console.error('Error deleting order:', err);
          showAlert('Gabim në fshirjen e porosisë', 'Ndodhi një gabim gjatë fshirjes së porosisë. Ju lutem provoni përsëri.', 'error');
          
          // Reload data if deletion failed
          if (user?.location_id) {
            orderService.getByLocation(user.location_id).then(setOrders);
          }
        }
      }
    );
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pranuar': return 'bg-yellow-100 text-yellow-800';
      case 'konfirmuar': return 'bg-blue-100 text-blue-800';
      case 'ne_delivery': return 'bg-purple-100 text-purple-800';
      case 'perfunduar': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pranuar': return 'Pranuar';
      case 'konfirmuar': return 'Konfirmuar';
      case 'ne_delivery': return 'Në delivery';
      case 'perfunduar': return 'Përfunduar';
      default: return 'E panjohur';
    }
  };

  const getDriverStatusColor = (status: Driver['status']) => {
    switch (status) {
      case 'i_lire': return 'bg-green-100 text-green-800';
      case 'ne_delivery': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDriverStatusText = (status: Driver['status']) => {
    switch (status) {
      case 'i_lire': return 'I lirë';
      case 'ne_delivery': return 'Në delivery';
      default: return 'E panjohur';
    }
  };

  const printInvoice = (order: Order) => {
    const subtotal = order.total - 1.00;
    const invoiceContent = `
      PEPPERONI PIZZA - FATURA
      =========================
      Numri i porosisë: #${order.order_number}
      Data: ${new Date(order.created_at).toLocaleDateString()}
      Ora: ${new Date(order.created_at).toLocaleTimeString()}
      
      KLIENTI:
      Emri: ${order.customer_name}
      Telefoni: ${order.customer_phone}
      Adresa: ${order.address}
      
      PRODUKTET:
      ${order.items.map(item => `${item.quantity}x ${item.name} - ${(item.price * item.quantity).toFixed(2)}€`).join('\n')}
      
      =========================
      Nëntotali: ${subtotal.toFixed(2)}€
      Transporti: 1.00€
      =========================
      TOTALI: ${order.total.toFixed(2)}€
      =========================
      
      Faleminderit për porosinë!
      VETËM KESH
    `;

    showAlert('Fatura po printohet...', 'Fatura po përgatitet për printim. Ju lutem prisni...', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Duke ngarkuar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md"
          >
            Provoni përsëri
          </button>
        </div>
      </div>
    );
  }

  const pranuarOrders = orders.filter(order => order.status === 'pranuar');
  const konfirmuarOrders = orders.filter(order => order.status === 'konfirmuar');
  const neDeliveryOrders = orders.filter(order => order.status === 'ne_delivery');
  const perfunduarOrders = orders.filter(order => order.status === 'perfunduar');

  const freeDrivers = drivers.filter(driver => driver.status === 'i_lire');
  const busyDrivers = drivers.filter(driver => driver.status === 'ne_delivery');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src={pepperoniLogo}
                alt="Pepperoni Pizza Logo" 
                className="h-8 w-auto mr-4"
              />
              <h1 className="text-xl font-semibold text-gray-900">Staff Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{user?.location || 'Pepperoni Pizza - Arbëri'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Mirë se vini, {user?.username}!</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Dilni</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pranuar</p>
                <p className="text-2xl font-semibold text-gray-900">{pranuarOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Konfirmuar</p>
                <p className="text-2xl font-semibold text-gray-900">{konfirmuarOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Në delivery</p>
                <p className="text-2xl font-semibold text-gray-900">{neDeliveryOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Përfunduar</p>
                <p className="text-2xl font-semibold text-gray-900">{perfunduarOrders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                1. Porositë (me aksione)
              </button>
              <button
                onClick={() => setActiveTab('drivers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'drivers'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                2. Shoferët
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                3. Raportet ditore
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Porositë për këtë pikë</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('kanban')}
                      className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nuk ka porosi</h3>
                    <p className="text-gray-500">Nuk ka porosi për këtë pikë në këtë moment.</p>
                  </div>
                ) : viewMode === 'list' ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klienti</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porosia</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Totali</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statusi</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shoferi</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksionet</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.order_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                                <div className="text-sm text-gray-500">{order.customer_phone}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {order.items?.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center py-1">
                                    <span className="font-bold">{item.quantity}x {item.name}</span>
                                    <span className="font-medium text-gray-600">{(item.price * item.quantity).toFixed(2)}€</span>
                                  </div>
                                ))}
                                <div className="border-t border-gray-200 mt-2 pt-2 text-xs">
                                  <div className="flex justify-between">
                                    <span>Nëntotali:</span>
                                    <span>{(order.total - 1.00).toFixed(2)}€</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Transporti:</span>
                                    <span>1.00€</span>
                                  </div>
                                  <div className="flex justify-between font-bold">
                                    <span>TOTALI:</span>
                                    <span>{order.total.toFixed(2)}€</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.total.toFixed(2)}€
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.drivers?.name || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                {order.status === 'pranuar' && (
                                  <button
                                    onClick={() => openDriverModal(order)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                                  >
                                    Cakto shofer
                                  </button>
                                )}
                                {order.status === 'perfunduar' && (
                                  <button
                                    onClick={() => printInvoice(order)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors flex items-center space-x-1"
                                    title="Print fatura"
                                  >
                                    <Printer className="w-4 h-4" />
                                    <span>Print</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteOrder(order.id, order.order_number)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors flex items-center space-x-1"
                                  title="Fshij porosinë"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Fshi</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Pranuar ({pranuarOrders.length})</h3>
                      <div className="space-y-3">
                        {pranuarOrders.map((order) => (
                          <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-sm font-medium">#{order.order_number}</span>
                              <button
                                onClick={() => deleteOrder(order.id, order.order_number)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                              >
                                Fshi
                              </button>
                            </div>
                            <div className="space-y-2 mb-3">
                              <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                              <div className="text-xs text-gray-500">{order.customer_phone}</div>
                              <div className="text-xs text-gray-600">{order.address}</div>
                            </div>
                            <div className="text-xs text-gray-700 mb-3 p-2 bg-gray-50 rounded">
                              <div className="font-bold mb-1">Porosia:</div>
                              {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-1">
                                  <span className="flex-1 font-bold">{item.quantity}x {item.name}</span>
                                  <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                                </div>
                              ))}
                              <div className="border-t border-gray-200 mt-2 pt-2">
                                <div className="flex justify-between font-bold text-sm">
                                  <span>TOTALI:</span>
                                  <span>{order.total.toFixed(2)}€</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => openDriverModal(order)}
                              className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 flex items-center justify-center space-x-2"
                            >
                              <Users className="w-4 h-4" />
                              <span>Cakto shofer</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Konfirmuar ({konfirmuarOrders.length})</h3>
                      <div className="space-y-3">
                        {konfirmuarOrders.map((order) => (
                          <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-sm font-medium">#{order.order_number}</span>
                              <button
                                onClick={() => deleteOrder(order.id, order.order_number)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                              >
                                Fshi
                              </button>
                            </div>
                            <div className="space-y-2 mb-3">
                              <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                              <div className="text-xs text-gray-500">{order.customer_phone}</div>
                              <div className="text-xs text-gray-600">{order.address}</div>
                            </div>
                            <div className="text-xs text-gray-700 mb-3 p-2 bg-gray-50 rounded">
                              <div className="font-bold mb-1">Porosia:</div>
                              {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-1">
                                  <span className="flex-1 font-bold">{item.quantity}x {item.name}</span>
                                  <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                                </div>
                              ))}
                              <div className="border-t border-gray-200 mt-2 pt-2">
                                <div className="flex justify-between font-bold text-sm">
                                  <span>TOTALI:</span>
                                  <span>{order.total.toFixed(2)}€</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-blue-600 font-medium">
                              Shoferi: {order.drivers?.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Në delivery ({neDeliveryOrders.length})</h3>
                      <div className="space-y-3">
                        {neDeliveryOrders.map((order) => (
                          <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-sm font-medium">#{order.order_number}</span>
                              <button
                                onClick={() => deleteOrder(order.id, order.order_number)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                              >
                                Fshi
                              </button>
                            </div>
                            <div className="space-y-2 mb-3">
                              <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                              <div className="text-xs text-gray-500">{order.customer_phone}</div>
                              <div className="text-xs text-gray-600">{order.address}</div>
                            </div>
                            <div className="text-xs text-gray-700 mb-3 p-2 bg-gray-50 rounded">
                              <div className="font-bold mb-1">Porosia:</div>
                              {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-1">
                                  <span className="flex-1 font-bold">{item.quantity}x {item.name}</span>
                                  <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                                </div>
                              ))}
                              <div className="border-t border-gray-200 mt-2 pt-2">
                                <div className="flex justify-between font-bold text-sm">
                                  <span>TOTALI:</span>
                                  <span>{order.total.toFixed(2)}€</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-purple-600 font-medium">
                              Shoferi: {order.drivers?.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Përfunduar ({perfunduarOrders.length})</h3>
                      <div className="space-y-3">
                        {perfunduarOrders.map((order) => (
                          <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-sm font-medium">#{order.order_number}</span>
                              <button
                                onClick={() => deleteOrder(order.id, order.order_number)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                              >
                                Fshi
                              </button>
                            </div>
                            <div className="space-y-2 mb-3">
                              <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                              <div className="text-xs text-gray-500">{order.customer_phone}</div>
                              <div className="text-xs text-gray-600">{order.address}</div>
                            </div>
                            <div className="text-xs text-gray-700 mb-3 p-2 bg-gray-50 rounded">
                              <div className="font-bold mb-1">Porosia:</div>
                              {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-1">
                                  <span className="flex-1 font-bold">{item.quantity}x {item.name}</span>
                                  <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                                </div>
                              ))}
                              <div className="border-t border-gray-200 mt-2 pt-2">
                                <div className="flex justify-between font-bold text-sm">
                                  <span>TOTALI:</span>
                                  <span>{order.total.toFixed(2)}€</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-green-600 font-medium mb-2">
                              Shoferi: {order.drivers?.name}
                            </div>
                            <button
                              onClick={() => printInvoice(order)}
                              className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 flex items-center justify-center space-x-2"
                            >
                              <Printer className="w-4 h-4" />
                              <span>Print fatura</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'drivers' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Shoferët për këtë pikë</h2>
                
                {drivers.length === 0 ? (
                  <div className="text-center py-12">
                    <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nuk ka shoferë</h3>
                    <p className="text-gray-500">Nuk ka shoferë të regjistruar për këtë pikë.</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emri</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefoni</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statusi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksionet</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {drivers.map((driver) => (
                            <tr key={driver.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {driver.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {driver.phone}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDriverStatusColor(driver.status)}`}>
                                  {getDriverStatusText(driver.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => window.open(`tel:${driver.phone}`, '_self')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors flex items-center space-x-1"
                                    title={`Thirr ${driver.phone}`}
                                  >
                                    <Phone className="w-4 h-4" />
                                    <span>Thirr</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="font-medium text-green-900 mb-2">Shoferët e lirë ({freeDrivers.length})</h3>
                        <div className="space-y-2">
                          {freeDrivers.length === 0 ? (
                            <p className="text-sm text-gray-500">Nuk ka shoferë të lirë</p>
                          ) : (
                            freeDrivers.map((driver) => (
                              <div key={driver.id} className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-sm font-medium">{driver.name}</span>
                                <span className="text-xs text-green-600">I lirë</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-4">
                        <h3 className="font-medium text-orange-900 mb-2">Shoferët në delivery ({busyDrivers.length})</h3>
                        <div className="space-y-2">
                          {busyDrivers.length === 0 ? (
                            <p className="text-sm text-gray-500">Nuk ka shoferë në delivery</p>
                          ) : (
                            busyDrivers.map((driver) => (
                              <div key={driver.id} className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-sm font-medium">{driver.name}</span>
                                <span className="text-xs text-orange-600">Në delivery</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Raportet ditore për këtë pikë</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Sot</h3>
                    <div className="text-3xl font-bold text-green-600">{orders.length}</div>
                    <p className="text-sm text-gray-600 mt-2">Porosi totale</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span>Pranuar: {pranuarOrders.length}</span>
                        <span>Konfirmuar: {konfirmuarOrders.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Në delivery: {neDeliveryOrders.length}</span>
                        <span>Përfunduar: {perfunduarOrders.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Shoferët</h3>
                    <div className="text-3xl font-bold text-blue-600">{drivers.length}</div>
                    <p className="text-sm text-gray-600 mt-2">Shoferët total</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span>I lirë: {freeDrivers.length}</span>
                        <span>Në delivery: {busyDrivers.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Totali</h3>
                    <div className="text-3xl font-bold text-purple-600">
                      {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}€
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Vlera totale</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span>Mesatarja: {(orders.reduce((sum, order) => sum + order.total, 0) / (orders.length || 1)).toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Driver Assignment Modal */}
      {showDriverModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Cakto shofer për porosinë #{selectedOrder.order_number}</h3>
                <button
                  onClick={() => setShowDriverModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
                             <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                 <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Klienti:</span> {selectedOrder.customer_name}</p>
                 <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Telefoni:</span> {selectedOrder.customer_phone}</p>
                 <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Adresa:</span> {selectedOrder.address}</p>
                 <div className="border-t border-gray-200 pt-2 mt-2">
                   <p className="text-sm font-bold text-gray-900 mb-1">Porosia:</p>
                   {selectedOrder.items?.map((item, index) => (
                     <div key={index} className="flex justify-between text-sm text-gray-600">
                       <span className="font-bold">{item.quantity}x {item.name}</span>
                       <span>{(item.price * item.quantity).toFixed(2)}€</span>
                     </div>
                   ))}
                   <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                     <div className="flex justify-between text-sm">
                       <span>Nëntotali:</span>
                       <span>{(selectedOrder.total - 1.00).toFixed(2)}€</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span>Transporti:</span>
                       <span>1.00€</span>
                     </div>
                     <div className="flex justify-between text-sm font-bold">
                       <span>TOTALI:</span>
                       <span>{selectedOrder.total.toFixed(2)}€</span>
                     </div>
                   </div>
                 </div>
               </div>

              <div className="space-y-4">
                {/* Shoferët e lirë */}
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Shoferët e lirë - nuk kanë porosi ({freeDrivers.length})</h4>
                  {freeDrivers.length === 0 ? (
                    <p className="text-sm text-red-600">Nuk ka shoferë të lirë!</p>
                  ) : (
                    <div className="space-y-2">
                      {freeDrivers.map((driver) => (
                        <button
                          key={driver.id}
                          onClick={() => assignOrderToDriver(driver.id)}
                          className="w-full flex items-center justify-between p-3 border border-green-200 rounded-lg hover:bg-green-50 bg-green-50"
                        >
                          <div className="flex items-center space-x-3">
                            <Users className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                              <p className="text-xs text-gray-500">{driver.phone}</p>
                            </div>
                          </div>
                          <Check className="w-4 h-4 text-green-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shoferët në delivery - mund të marrin porosi të tjera */}
                <div>
                  <h4 className="font-medium text-orange-900 mb-2">Shoferët në delivery - mund të marrin porosi të tjera ({busyDrivers.length})</h4>
                  {busyDrivers.length === 0 ? (
                    <p className="text-sm text-gray-500">Nuk ka shoferë në delivery</p>
                  ) : (
                    <div className="space-y-2">
                      {busyDrivers.map((driver) => (
                        <button
                          key={driver.id}
                          onClick={() => assignOrderToDriver(driver.id)}
                          className="w-full flex items-center justify-between p-3 border border-orange-200 rounded-lg hover:bg-orange-50 bg-orange-50"
                        >
                          <div className="flex items-center space-x-3">
                            <Truck className="w-4 h-4 text-orange-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                              <p className="text-xs text-gray-500">{driver.phone}</p>
                              <p className="text-xs text-orange-600">Në delivery - mund të marrë porosi të tjera</p>
                            </div>
                          </div>
                          <Check className="w-4 h-4 text-orange-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Popup */}
      <AlertPopup
        isOpen={alert.isOpen}
        onClose={closeAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </div>
  );
};

export default StaffDashboard; 