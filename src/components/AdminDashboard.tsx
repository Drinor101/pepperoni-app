import React, { useState } from 'react';
import { 
  LogOut, 
  CheckCircle, 
  Building,
  DollarSign,
  Bell,
  Grid3X3,
  List
} from 'lucide-react';
import pepperoniLogo from '../assets/pepperoni-test 1 (1).svg';

interface User {
  username: string;
  role: 'admin' | 'staff' | 'driver';
  location?: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  activeOrders: number;
  totalOrders: number;
}

interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  address: string;
  location: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pranuar' | 'konfirmuar' | 'ne_delivery' | 'perfunduar';
  createdAt: string;
  estimatedDelivery: string;
  assignedDriver?: {
    id: string;
    name: string;
    phone: string;
  };
  assignedAt?: string;
}

interface AdminDashboardProps {
  user: User | null;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Mock locations data
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Pepperoni Pizza - Arbëri',
      address: 'Rr. Arbëri, Prishtinë',
      phone: '049500600',
      manager: 'Blerjan Gashi',
      activeOrders: 5,
      totalOrders: 24
    },
    {
      id: '2',
      name: 'Pepperoni Pizza - Qendra',
      address: 'Rr. Nëna Terezë, Prishtinë',
      phone: '044123456',
      manager: 'Ardian Krasniqi',
      activeOrders: 3,
      totalOrders: 18
    },
    {
      id: '3',
      name: 'Pepperoni Pizza - Ulpianë',
      address: 'Rr. Ilir Konushevci, Prishtinë',
      phone: '049789012',
      manager: 'Elda Berisha',
      activeOrders: 2,
      totalOrders: 12
    }
  ]);

  // Mock orders data - only delivered orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 601,
      customerName: 'Blerjan Gashi',
      customerPhone: '049500600',
      address: 'Bajram Kelmendi Nr.20',
      location: 'Pepperoni Pizza - Arbëri',
      items: [
        { name: 'Pizza Margherita', quantity: 1, price: 3.50 },
        { name: 'Hamburger Classic', quantity: 2, price: 2.50 }
      ],
      total: 8.50,
      status: 'perfunduar',
      createdAt: '2024-01-15T14:30:00',
      estimatedDelivery: '2024-01-15T15:15:00'
    },
    {
      id: '2',
      orderNumber: 602,
      customerName: 'Ardian Krasniqi',
      customerPhone: '044123456',
      address: 'Rr. Nëna Terezë 15',
      location: 'Pepperoni Pizza - Qendra',
      items: [
        { name: 'Pizza Pepperoni', quantity: 1, price: 4.00 },
        { name: 'Samun Special', quantity: 1, price: 2.80 }
      ],
      total: 6.80,
      status: 'perfunduar',
      createdAt: '2024-01-15T14:25:00',
      estimatedDelivery: '2024-01-15T15:10:00',
      assignedDriver: {
        id: '1',
        name: 'Ardian Krasniqi',
        phone: '044123456'
      },
      assignedAt: '2024-01-15T14:35:00'
    },
    {
      id: '3',
      orderNumber: 603,
      customerName: 'Elda Berisha',
      customerPhone: '049789012',
      address: 'Rr. Ilir Konushevci 8',
      location: 'Pepperoni Pizza - Ulpianë',
      items: [
        { name: 'Sandwich Mix', quantity: 2, price: 2.50 }
      ],
      total: 5.00,
      status: 'perfunduar',
      createdAt: '2024-01-15T14:20:00',
      estimatedDelivery: '2024-01-15T15:05:00',
      assignedDriver: {
        id: '2',
        name: 'Blerim Berisha',
        phone: '049789012'
      },
      assignedAt: '2024-01-15T14:30:00'
    }
  ]);

  const filteredOrders = selectedLocation === 'all' 
    ? orders.filter(order => order.status === 'perfunduar')
    : orders.filter(order => 
        order.location === locations.find(loc => loc.id === selectedLocation)?.name && 
        order.status === 'perfunduar'
      );

  const perfunduarOrders = filteredOrders;

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
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Porosi të dorëzuara</p>
                <p className="text-2xl font-semibold text-gray-900">{perfunduarOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lokacione</p>
                <p className="text-2xl font-semibold text-gray-900">{locations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totali sot</p>
                <p className="text-2xl font-semibold text-gray-900">{perfunduarOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Porositë e dorëzuara</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Të gjitha lokacionet</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
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
            </div>

            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klienti</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokacioni</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porosia</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Totali</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.customerPhone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.location}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items.map((item, index) => (
                              <div key={index}>
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.total.toFixed(2)}€
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Porositë e dorëzuara ({perfunduarOrders.length})</h3>
                  <div className="space-y-3">
                    {perfunduarOrders.map((order) => (
                      <div key={order.id} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">#{order.orderNumber}</span>
                          <span className="text-sm text-gray-500">{order.total.toFixed(2)}€</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.location}</div>
                        <div className="text-xs text-gray-700">
                          {order.items.map((item, index) => (
                            <div key={index}>{item.quantity}x {item.name}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 