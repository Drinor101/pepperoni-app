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

interface User {
  username: string;
  role: 'admin' | 'staff' | 'driver';
  location?: string;
}

interface DeliveryOrder {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pranuar' | 'konfirmuar' | 'ne_delivery' | 'perfunduar';
  createdAt: string;
  estimatedDelivery: string;
  assignedDriverId: string;
  location: string;
}

interface DriverDashboardProps {
  user: User | null;
  onLogout: () => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, onLogout }) => {
  // Mock delivery data - filtered for current driver and sorted by oldest first
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([
    {
      id: '1',
      orderNumber: 601,
      customerName: 'Blerjan Gashi',
      customerPhone: '049500600',
      address: 'Bajram Kelmendi Nr.20, Prishtinë',
      items: [
        { name: 'Pizza Margherita', quantity: 1, price: 3.50 },
        { name: 'Hamburger Classic', quantity: 2, price: 2.50 }
      ],
      total: 8.50,
      status: 'konfirmuar', // This order was assigned by staff
      createdAt: '2024-01-15T14:20:00',
      estimatedDelivery: '2024-01-15T15:15:00',
      assignedDriverId: 'driver',
      location: 'Pepperoni Pizza - Arbëri'
    },
    {
      id: '2',
      orderNumber: 602,
      customerName: 'Ardian Krasniqi',
      customerPhone: '044123456',
      address: 'Rr. Nëna Terezë 15, Prishtinë',
      items: [
        { name: 'Pizza Pepperoni', quantity: 1, price: 4.00 }
      ],
      total: 4.00,
      status: 'ne_delivery', // This order was accepted by driver
      createdAt: '2024-01-15T14:25:00',
      estimatedDelivery: '2024-01-15T15:10:00',
      assignedDriverId: 'driver',
      location: 'Pepperoni Pizza - Qendra'
    }
  ]);

  // Simulate real-time updates from staff
  useEffect(() => {
    const interval = setInterval(() => {
      // This would normally be a WebSocket or API call to check for new orders
      // For demo purposes, we'll simulate new orders being assigned
      console.log('Checking for new orders...');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const acceptOrder = (deliveryId: string) => {
    // When driver accepts order, automatically goes to delivery
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId ? { ...delivery, status: 'ne_delivery' } : delivery
    ));
    
    // In a real app, this would update the staff dashboard via API
    // For now, we'll just show an alert
    alert('Porosia u pranua dhe u vendos në delivery! Stafi do ta shohë në kanban view.');
  };

  const deliverOrder = (deliveryId: string) => {
    // When driver delivers order, automatically shows to staff as delivered
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId ? { ...delivery, status: 'perfunduar' } : delivery
    ));
    
    // In a real app, this would update the staff dashboard via API
    // For now, we'll just show an alert
    alert('Porosia u dorëzua! Automatikisht i doli stafit si "dorëzuar" në kanban view.');
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

  // Filter and sort orders by oldest first
  const filteredDeliveries = deliveries
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const pranuarCount = deliveries.filter(d => d.status === 'pranuar').length;
  const konfirmuarCount = deliveries.filter(d => d.status === 'konfirmuar').length;
  const neDeliveryCount = deliveries.filter(d => d.status === 'ne_delivery').length;
  const perfunduarCount = deliveries.filter(d => d.status === 'perfunduar').length;

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
                <p className="text-sm font-medium text-gray-900">45.20€</p>
                <p className="text-xs text-gray-500">Fitimet sot</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">4.8</p>
                <p className="text-xs text-gray-500">Vlerësimi mesatar</p>
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

            {filteredDeliveries.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nuk ka porosi</h3>
                <p className="text-gray-500">Nuk ka porosi për ju. Stafi do t'ju caktojë porosi kur të jenë të lirë.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDeliveries.map((delivery) => (
                  <div key={delivery.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">#{delivery.orderNumber}</h3>
                        <p className="text-sm text-gray-500">{delivery.location}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                        {getStatusText(delivery.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Informacionet e klientit</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600"><span className="font-medium">Emri:</span> {delivery.customerName}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Telefoni:</span> {delivery.customerPhone}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Adresa:</span> {delivery.address}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Detajet e porosisë</h4>
                        <div className="space-y-1">
                          {delivery.items.map((item, index) => (
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
                        onClick={() => callCustomer(delivery.customerPhone)}
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