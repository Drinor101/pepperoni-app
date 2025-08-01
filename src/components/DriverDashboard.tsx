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
  X
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

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, onLogout }) => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDelivered, setShowDelivered] = useState(false);

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
      const driverSubscription = realtimeService.subscribeToDriverUpdates(driverId, (payload) => {
        console.log('Driver real-time update received:', payload);
        
        // Refresh driver's orders
        orderService.getByDriver(driverId).then(setDeliveries);
      });

      return () => {
        driverSubscription.unsubscribe();
      };
    }
  }, [user?.id]);

  const acceptOrder = async (deliveryId: string) => {
    try {
      // Update local state immediately for better UX
      setDeliveries(prev => prev.map(delivery => 
        delivery.id === deliveryId ? { ...delivery, status: 'ne_delivery' } : delivery
      ));
      
      // Update database
      await orderService.updateStatus(deliveryId, 'ne_delivery');
      
      alert('Porosia u pranua! Statusi u ndryshua në "Në delivery" dhe stafi do ta shohë në kanban view.');
    } catch (err) {
      console.error('Error accepting order:', err);
      alert('Gabim në pranimin e porosisë');
      
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
      
      alert('Porosia u dorëzua! Statusi u ndryshua në "Përfunduar" dhe stafi do ta shohë në kanban view.');
    } catch (err) {
      console.error('Error delivering order:', err);
      alert('Gabim në dorëzimin e porosisë');
      
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
              <h1 className="text-xl font-semibold text-gray-900">Driver Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDelivered(!showDelivered)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  showDelivered 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{showDelivered ? 'Fshi porositë e dorëzuara' : 'Shfaq porositë e dorëzuara'}</span>
              </button>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Mirë se vini, {user?.username}!</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Dil</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Status Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Prishtinë Qendër</p>
                <p className="text-xs text-gray-500">Lokacioni aktual</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Navigation className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">GPS Aktiv</p>
                <p className="text-xs text-gray-500">Tracking aktiv</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {deliveries.reduce((sum, order) => sum + order.total, 0).toFixed(2)}€
                </p>
                <p className="text-xs text-gray-500">Fitimet sot</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{perfunduarCount}</p>
                <p className="text-xs text-gray-500">Porosi të dorëzuara</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <p className="text-2xl font-semibold text-gray-900">{pranuarCount}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{konfirmuarCount}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{neDeliveryCount}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{perfunduarCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Porositë për ju</h2>

            {sortedDeliveries.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nuk ka porosi</h3>
                <p className="text-gray-500">Nuk ka porosi për ju. Stafi do t'ju caktojë porosi kur të jenë të lirë.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedDeliveries.map((delivery) => (
                  <div key={delivery.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">#{delivery.order_number}</h3>
                        <p className="text-sm text-gray-500">{delivery.locations?.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                        {getStatusText(delivery.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Informacionet e klientit</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600"><span className="font-medium">Emri:</span> {delivery.customer_name}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Telefoni:</span> {delivery.customer_phone}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Adresa:</span> {delivery.address}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Detajet e porosisë</h4>
                        <div className="space-y-1">
                          {delivery.items?.map((item, index) => (
                            <p key={index} className="text-sm text-gray-600">
                              {item.quantity}x {item.name} - {item.price.toFixed(2)}€
                            </p>
                          ))}
                          <div className="border-t pt-2 mt-2">
                            <p className="text-sm font-medium text-gray-900">Totali: {delivery.total.toFixed(2)}€</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      <button
                        onClick={() => callCustomer(delivery.customer_phone)}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Thirr klientin</span>
                      </button>
                      <button
                        onClick={() => openMaps(delivery.address)}
                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Hap hartën</span>
                      </button>
                    </div>
                    
                    <div className="flex gap-3">
                      {delivery.status === 'konfirmuar' && (
                        <button
                          onClick={() => acceptOrder(delivery.id)}
                          className="flex items-center space-x-2 bg-green-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-600"
                        >
                          <Check className="w-4 h-4" />
                          <span>Prano</span>
                        </button>
                      )}
                      {delivery.status === 'ne_delivery' && (
                        <button
                          onClick={() => deliverOrder(delivery.id)}
                          className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-orange-600"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Dorëzo</span>
                        </button>
                      )}
                      {delivery.status === 'perfunduar' && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Porosia u dorëzua me sukses!</span>
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
          <h3 className="font-medium text-blue-900 mb-2">Si funksionon:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>1. Stafi ju cakton porosinë → shfaqet si "Konfirmuar nga stafi"</p>
            <p>2. Ju klikoni "Prano" → shfaqet si "Në delivery" (stafi e sheh në kanban)</p>
            <p>3. Ju klikoni "Dorëzo" → shfaqet si "Përfunduar" (stafi e sheh si dorëzuar)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard; 