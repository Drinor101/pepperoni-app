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
  Navigation,
  Star,
  Check,
  X,
  AlertCircle,
  Info,
  Menu,
  Home,
  List
} from 'lucide-react';
import pepperoniLogo from '../assets/pepperoni-test 1 (1).svg';
import { orderService, driverService, realtimeService } from '../services/database';

interface User {
  username: string;
  role: 'admin' | 'staff' | 'driver';
  location?: string;
  location_id?: string;
  id?: string;
}

interface DeliveryOrder {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pranuar' | 'konfirmuar' | 'ne_delivery' | 'perfunduar';
  created_at: string;
  estimated_delivery: string;
  assigned_driver_id: string;
  locations?: { name: string };
}

interface DriverDashboardProps {
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

const AlertPopup: React.FC<AlertProps> = ({ isOpen, onClose, title, message, type }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
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
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${getBgColor()} border rounded-lg p-6 max-w-md w-full mx-4`}>
        <div className="flex items-center mb-4">
          {getIcon()}
          <h3 className="ml-3 text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`${getButtonColor()} text-white px-4 py-2 rounded-md transition-colors`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, onLogout }) => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDelivered, setShowDelivered] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>('Prishtinë Qendër');
  const [alert, setAlert] = useState<AlertProps>({
    isOpen: false,
    onClose: () => setAlert({ ...alert, isOpen: false }),
    title: '',
    message: '',
    type: 'info',
  });

  // Load driver's orders from database
  useEffect(() => {
    const loadDriverOrders = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const ordersData = await orderService.getByDriver(user.id);
          setDeliveries(ordersData);
        }
      } catch (err) {
        console.error('Error loading driver orders:', err);
        setError('Gabim në ngarkimin e porosive');
      } finally {
        setLoading(false);
      }
    };

    loadDriverOrders();

    // Set up enhanced real-time subscription for driver's orders
    if (user?.id) {
      const driverId = user.id;
  
      
      // Subscribe to driver-specific updates
      const driverSubscription = realtimeService.subscribeToDriverUpdates(driverId, (payload) => {
        // Refresh driver's orders
        orderService.getByDriver(driverId).then(setDeliveries).catch(err => {
          console.error('Error refreshing driver orders:', err);
        });
      });

      // Also subscribe to all updates to catch any order changes
      const allUpdatesSubscription = realtimeService.subscribeToAllUpdates((payload) => {
        // Refresh driver's orders for any order changes
        if (payload.table === 'orders') {
          orderService.getByDriver(driverId).then(setDeliveries).catch(err => {
            console.error('Error refreshing driver orders from all updates:', err);
          });
        }
      });

      return () => {
        if (driverSubscription) {
          driverSubscription.unsubscribe();
        }
        if (allUpdatesSubscription) {
          allUpdatesSubscription.unsubscribe();
        }
      };
    }
  }, [user?.id]);

  // Get driver's current location
  useEffect(() => {
    if (user?.location) {
      setCurrentLocation(user.location);
    }
  }, [user?.location]);

  const acceptOrder = async (deliveryId: string) => {
    try {
      // Update local state immediately for better UX
      setDeliveries(prev => prev.map(delivery => 
        delivery.id === deliveryId ? { ...delivery, status: 'ne_delivery' } : delivery
      ));
      
      // Update database
      await orderService.updateStatus(deliveryId, 'ne_delivery');
      
      setAlert({
        isOpen: true,
        onClose: () => setAlert({ ...alert, isOpen: false }),
        title: 'Porosia u pranua!',
        message: 'Statusi u ndryshua në "Në delivery" dhe stafi do ta shohë në kanban view.',
        type: 'success',
      });
      
      // Force refresh data to ensure real-time updates
      if (user?.id) {
        setTimeout(() => {
          orderService.getByDriver(user.id!).then(setDeliveries);
        }, 500);
      }
    } catch (err) {
      console.error('Error accepting order:', err);
      setAlert({
        isOpen: true,
        onClose: () => setAlert({ ...alert, isOpen: false }),
        title: 'Gabim në pranimin e porosisë',
        message: 'Gabim në pranimin e porosisë',
        type: 'error',
      });
      
      // Reload data if update failed
      if (user?.id) {
        orderService.getByDriver(user.id).then(setDeliveries);
      }
    }
  };

  const deliverOrder = async (deliveryId: string) => {
    try {
      // Update local state immediately for better UX
      setDeliveries(prev => prev.map(delivery => 
        delivery.id === deliveryId ? { ...delivery, status: 'perfunduar' } : delivery
      ));
      
      // Update database - both order status and driver status
      await Promise.all([
        orderService.updateStatus(deliveryId, 'perfunduar'),
        driverService.updateStatus(user?.id || '', 'i_lire')
      ]);
      
      setAlert({
        isOpen: true,
        onClose: () => setAlert({ ...alert, isOpen: false }),
        title: 'Porosia u dorëzua!',
        message: 'Statusi u ndryshua në "Përfunduar" dhe stafi do ta shohë në kanban view.',
        type: 'success',
      });
      
      // Force refresh data to ensure real-time updates
      if (user?.id) {
        setTimeout(() => {
          orderService.getByDriver(user.id!).then(setDeliveries);
        }, 500);
      }
    } catch (err) {
      console.error('Error delivering order:', err);
      setAlert({
        isOpen: true,
        onClose: () => setAlert({ ...alert, isOpen: false }),
        title: 'Gabim në dorëzimin e porosisë',
        message: 'Gabim në dorëzimin e porosisë',
        type: 'error',
      });
      
      // Reload data if update failed
      if (user?.id) {
        orderService.getByDriver(user.id).then(setDeliveries);
      }
    }
  };

  const getStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'pranuar': return 'bg-yellow-100 text-yellow-800';
      case 'konfirmuar': return 'bg-blue-100 text-blue-800';
      case 'ne_delivery': return 'bg-purple-100 text-purple-800';
      case 'perfunduar': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'pranuar': return 'Pranuar';
      case 'konfirmuar': return 'Konfirmuar nga stafi';
      case 'ne_delivery': return 'Në delivery';
      case 'perfunduar': return 'Përfunduar';
      default: return 'E panjohur';
    }
  };

  const callCustomer = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const openMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  // Filter deliveries based on showDelivered state
  const filteredDeliveries = showDelivered 
    ? deliveries 
    : deliveries.filter(delivery => delivery.status !== 'perfunduar');

  // Sort by oldest first (oldest orders first)
  const sortedDeliveries = filteredDeliveries.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const pranuarCount = deliveries.filter(d => d.status === 'pranuar').length;
  const konfirmuarCount = deliveries.filter(d => d.status === 'konfirmuar').length;
  const neDeliveryCount = deliveries.filter(d => d.status === 'ne_delivery').length;
  const perfunduarCount = deliveries.filter(d => d.status === 'perfunduar').length;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={pepperoniLogo}
                alt="Pepperoni Pizza Logo" 
                className="h-8 w-auto"
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Driver</h1>
                <p className="text-xs text-gray-500">Mirë se vini, {user?.username}!</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="text-sm">Dilni</span>
            </button>
          </div>
        </div>
      </div>

      {/* Location and Status Bar */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{currentLocation}</p>
                <p className="text-xs text-gray-500">Lokacioni juaj</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600">GPS Aktiv</span>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{neDeliveryCount}</p>
              <p className="text-xs text-gray-500">Në delivery</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{perfunduarCount}</p>
              <p className="text-xs text-gray-500">Dorëzuar</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">
                {deliveries.reduce((sum, order) => sum + order.total, 0).toFixed(0)}€
              </p>
              <p className="text-xs text-gray-500">Fitimet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Toggle Button - Not in header */}
      <div className="px-4 py-3 bg-gray-50">
        <button
          onClick={() => setShowDelivered(!showDelivered)}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            showDelivered 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-blue-500 text-white border border-blue-500 shadow-sm hover:bg-blue-600'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{showDelivered ? 'Fshi porositë e dorëzuara' : 'Shfaq porositë e dorëzuara'}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Porositë për ju</h2>
              {perfunduarCount > 0 && (
                <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700">{perfunduarCount} dorëzuar</span>
                </div>
              )}
            </div>

            {sortedDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-2">Nuk ka porosi</h3>
                <p className="text-sm text-gray-500">Nuk ka porosi për ju. Stafi do t'ju caktojë porosi kur të jenë të lirë.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedDeliveries.map((delivery) => (
                  <div key={delivery.id} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">#{delivery.order_number}</h3>
                        <p className="text-xs text-gray-500">{delivery.locations?.name}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {getStatusText(delivery.status)}
                      </span>
                    </div>
                    
                    {/* Customer Info */}
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Klienti</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600"><span className="font-medium">Emri:</span> {delivery.customer_name}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Telefoni:</span> {delivery.customer_phone}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Adresa:</span> {delivery.address}</p>
                      </div>
                    </div>
                    
                    {/* Order Details */}
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Porosia</h4>
                      <div className="space-y-1">
                        {delivery.items?.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span className="text-sm text-gray-600">{item.quantity}x {item.name}</span>
                            <span className="text-sm font-medium text-gray-900">{(item.price * item.quantity).toFixed(2)}€</span>
                          </div>
                        ))}
                        <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Nëntotali:</span>
                            <span>{(delivery.total - 1.00).toFixed(2)}€</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Transporti:</span>
                            <span>1.00€</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-1">
                            <span>TOTALI:</span>
                            <span>{delivery.total.toFixed(2)}€</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button
                        onClick={() => callCustomer(delivery.customer_phone)}
                        className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 flex-1 justify-center"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Thirr</span>
                      </button>
                      <button
                        onClick={() => openMaps(delivery.address)}
                        className="flex items-center space-x-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 flex-1 justify-center"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Harta</span>
                      </button>
                    </div>
                    
                    {/* Status Actions */}
                    <div className="flex gap-2">
                      {delivery.status === 'konfirmuar' && (
                        <button
                          onClick={() => acceptOrder(delivery.id)}
                          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 w-full justify-center"
                        >
                          <Check className="w-4 h-4" />
                          <span>Prano porosinë</span>
                        </button>
                      )}
                      {delivery.status === 'ne_delivery' && (
                        <button
                          onClick={() => deliverOrder(delivery.id)}
                          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 w-full justify-center"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Dorëzo porosinë</span>
                        </button>
                      )}
                      {delivery.status === 'perfunduar' && (
                        <div className="flex items-center space-x-2 text-green-600 w-full justify-center py-2">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Porosia u dorëzua!</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2 text-sm">Si funksionon:</h3>
          <div className="text-xs text-blue-800 space-y-1">
            <p>1. Stafi ju cakton porosinë → shfaqet si "Konfirmuar nga stafi"</p>
            <p>2. Ju klikoni "Prano" → shfaqet si "Në delivery"</p>
            <p>3. Ju klikoni "Dorëzo" → shfaqet si "Përfunduar"</p>
          </div>
        </div>
      </div>
      
      <AlertPopup
        isOpen={alert.isOpen}
        onClose={alert.onClose}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
};

export default DriverDashboard; 