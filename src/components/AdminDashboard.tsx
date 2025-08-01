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
  X
} from 'lucide-react';
import pepperoniLogo from '../assets/pepperoni-test 1 (1).svg';
import { authService, locationService, orderService, driverService, realtimeService } from '../services/database';

interface Driver {
  id: string;
  name: string;
  phone: string;
  status: 'i_lire' | 'ne_delivery';
  location_id: string;
  locations?: { name: string };
}

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'staff' | 'drivers' | 'orders'>('staff');
  const [locations, setLocations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ username: '', password: '', name: '', phone: '', location_id: '' });
  const [newDriver, setNewDriver] = useState({ username: '', password: '', name: '', phone: '', location_id: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [locationsData, ordersData, driversData, staffData] = await Promise.all([
          locationService.getAll(),
          orderService.getAll(),
          driverService.getAll(),
          authService.getAllStaff()
        ]);

        setLocations(locationsData);
        setOrders(ordersData);
        setDrivers(driversData);
        setStaff(staffData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Gabim në ngarkimin e të dhënave');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time subscriptions for all tables
    const ordersSubscription = realtimeService.subscribeToOrders((payload) => {
      console.log('Orders changed:', payload);
      // Reload orders data
      orderService.getAll().then(setOrders);
    });

    const driversSubscription = realtimeService.subscribeToDrivers((payload) => {
      console.log('Drivers changed:', payload);
      // Reload drivers data
      driverService.getAll().then(setDrivers);
    });

    // Add staff subscription
    const staffSubscription = realtimeService.subscribeToStaff((payload) => {
      console.log('Staff changed:', payload);
      // Reload staff data
      authService.getAllStaff().then(setStaff);
    });

    // Cleanup subscriptions on unmount
    return () => {
      ordersSubscription.unsubscribe();
      driversSubscription.unsubscribe();
      staffSubscription.unsubscribe();
    };
  }, []);

    const handleAddStaff = async () => {
    try {
      const staffData = await authService.createStaff({
        username: newStaff.username,
        password: newStaff.password,
        name: newStaff.name,
        phone: newStaff.phone,
        location_id: newStaff.location_id
      });
      
      // Update local state immediately for better UX
      setStaff(prev => [...prev, staffData]);
      setShowAddStaffModal(false);
      setNewStaff({ username: '', password: '', name: '', phone: '', location_id: '' });
      
      alert('Stafi u shtua me sukses!');
    } catch (err) {
      console.error('Error adding staff:', err);
      alert('Gabim në shtimin e stafit');
    }
  };

  const handleAddDriver = async () => {
    try {
      const driverData = await driverService.create(newDriver);
      
      // Update local state immediately for better UX
      setDrivers(prev => [...prev, driverData]);
      setShowAddDriverModal(false);
      setNewDriver({ username: '', password: '', name: '', phone: '', location_id: '' });
      
      alert('Shoferi u shtua me sukses!');
    } catch (err) {
      console.error('Error adding driver:', err);
      alert('Gabim në shtimin e shoferit');
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (confirm('A jeni të sigurt që dëshironi ta fshini këtë staf?')) {
      try {
        // Update local state immediately for better UX
        setStaff(prev => prev.filter(staff => staff.id !== staffId));
        
        await authService.deleteStaff(staffId);
        alert('Stafi u fshi me sukses!');
      } catch (err) {
        console.error('Error deleting staff:', err);
        alert('Gabim në fshirjen e stafit');
        // Reload staff data if deletion failed
        authService.getAllStaff().then(setStaff);
      }
    }
  };

  const handleDeleteDriver = async (driverId: string) => {
    if (confirm('A jeni të sigurt që dëshironi ta fshini këtë shofer?')) {
      try {
        // Update local state immediately for better UX
        setDrivers(prev => prev.filter(driver => driver.id !== driverId));
        
        await driverService.delete(driverId);
        alert('Shoferi u fshi me sukses!');
      } catch (err) {
        console.error('Error deleting driver:', err);
        alert('Gabim në fshirjen e shoferit');
        // Reload drivers data if deletion failed
        driverService.getAll().then(setDrivers);
      }
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Mirë se vini, {user.username}!</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Dilni
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lokacione</p>
                <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Porosi</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shoferë</p>
                <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stafi</p>
                <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('staff')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'staff'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Stafi
              </button>
              <button
                onClick={() => setActiveTab('drivers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'drivers'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Shoferët
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Porositë
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Staff Tab */}
            {activeTab === 'staff' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Stafi</h2>
                  <button
                    onClick={() => setShowAddStaffModal(true)}
                    className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Shto Staf
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Përdoruesi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lokacioni
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksionet
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {staff.map((staffMember) => (
                        <tr key={staffMember.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{staffMember.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {staffMember.locations?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteStaff(staffMember.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Fshi
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Drivers Tab */}
            {activeTab === 'drivers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Shoferët</h2>
                  <button
                    onClick={() => setShowAddDriverModal(true)}
                    className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Shto Shofer
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Emri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefoni
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lokacioni
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statusi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {drivers.map((driver) => (
                        <tr key={driver.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {driver.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {driver.locations?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              driver.status === 'i_lire' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {driver.status === 'i_lire' ? 'I lirë' : 'Në delivery'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteDriver(driver.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Fshi
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Të gjitha porositë</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Klienti
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lokacioni
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Totali
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statusi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order: any) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{order.order_number}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                            <div className="text-sm text-gray-500">{order.customer_phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.locations?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.total.toFixed(2)}€
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'pranuar' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'konfirmuar' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'ne_delivery' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {order.status === 'pranuar' ? 'Pranuar' :
                               order.status === 'konfirmuar' ? 'Konfirmuar' :
                               order.status === 'ne_delivery' ? 'Në delivery' : 'Perfunduar'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('sq-AL')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Shto Staf të Ri</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={newStaff.username}
                  onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emri i plotë
                </label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Emri i plotë"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefoni
                </label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="049 123 456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokacioni
                </label>
                <select
                  value={newStaff.location_id}
                  onChange={(e) => setNewStaff({ ...newStaff, location_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Zgjidhni lokacionin</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Anulo
              </button>
              <button
                onClick={handleAddStaff}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Shto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddDriverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Shto Shofer të Ri</h3>
            <div className="space-y-4">
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Username
                 </label>
                 <input
                   type="text"
                   value={newDriver.username}
                   onChange={(e) => setNewDriver({ ...newDriver, username: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                   placeholder="username"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Password
                 </label>
                 <input
                   type="password"
                   value={newDriver.password}
                   onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                   placeholder="password"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Emri
                 </label>
                 <input
                   type="text"
                   value={newDriver.name}
                   onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                   placeholder="Emri i plotë"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Telefoni
                 </label>
                 <input
                   type="tel"
                   value={newDriver.phone}
                   onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                   placeholder="049 123 456"
                 />
               </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokacioni
                </label>
                <select
                  value={newDriver.location_id}
                  onChange={(e) => setNewDriver({ ...newDriver, location_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Zgjidhni lokacionin</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddDriverModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Anulo
              </button>
              <button
                onClick={handleAddDriver}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Shto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 