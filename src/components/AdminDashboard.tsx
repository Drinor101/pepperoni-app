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
  AlertCircle,
  Info,
  Filter,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';
import { pepperoniLogo } from '../assets';
import { authService, locationService, orderService, driverService, realtimeService, useOptimizedRealtimeData } from '../services';

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

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-yellow-500" />
          <h3 className="ml-3 text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Anulo
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Fshi
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'staff' | 'drivers' | 'orders' | 'reports'>('staff');
  const [locations, setLocations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [staffLocationFilter, setStaffLocationFilter] = useState<string>('');
  const [driversLocationFilter, setDriversLocationFilter] = useState<string>('');
  const [ordersLocationFilter, setOrdersLocationFilter] = useState<string>('');
  const [reportsLocationFilter, setReportsLocationFilter] = useState<string>('');
  const [reportsDateFilter, setReportsDateFilter] = useState<string>('today');

  // Modal states
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ username: '', password: '', name: '', phone: '', location_id: '' });
  const [newDriver, setNewDriver] = useState({ username: '', password: '', name: '', phone: '', location_id: '' });
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [editingDriver, setEditingDriver] = useState<any>(null);

  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  // Confirmation dialog states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmOnConfirm, setConfirmOnConfirm] = useState<(() => void) | null>(null);

  // Use optimized real-time data hooks
  const { data: ordersData, loading: ordersLoading, error: ordersError, optimisticUpdate: optimisticUpdateOrders } = useOptimizedRealtimeData(
    orderService.getAll,
    { table: 'orders' }
  );

  const { data: driversData, loading: driversLoading, error: driversError, optimisticUpdate: optimisticUpdateDrivers } = useOptimizedRealtimeData(
    driverService.getAll,
    { table: 'drivers' }
  );

  const { data: staffData, loading: staffLoading, error: staffError, optimisticUpdate: optimisticUpdateStaff } = useOptimizedRealtimeData(
    authService.getAllStaff,
    { table: 'staff' }
  );

  // Load locations once (they don't change often)
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationsData = await locationService.getAll();
        setLocations(locationsData);
      } catch (err) {
        console.error('Error loading locations:', err);
      }
    };
    loadLocations();
  }, []);

  // Update local state when data changes
  useEffect(() => {
    setOrders(ordersData);
  }, [ordersData]);

  useEffect(() => {
    setDrivers(driversData);
  }, [driversData]);

  useEffect(() => {
    setStaff(staffData);
  }, [staffData]);

  // Handle loading and error states
  useEffect(() => {
    setLoading(ordersLoading || driversLoading || staffLoading);
  }, [ordersLoading, driversLoading, staffLoading]);

  useEffect(() => {
    setError(ordersError || driversError || staffError);
  }, [ordersError, driversError, staffError]);

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
      optimisticUpdateStaff(prev => [...prev, staffData]);
      setShowAddStaffModal(false);
      setNewStaff({ username: '', password: '', name: '', phone: '', location_id: '' });
      
      setAlertTitle('Stafi u shtua me sukses!');
      setAlertMessage('Stafi u shtua me sukses!');
      setAlertType('success');
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Error adding staff:', err);
      setAlertTitle('Gabim në shtimin e stafit');
      setAlertMessage('Gabim në shtimin e stafit');
      setAlertType('error');
      setShowErrorAlert(true);
    }
  };

  const handleAddDriver = async () => {
    try {
      const driverData = await driverService.create(newDriver);
      
      // Update local state immediately for better UX
      optimisticUpdateDrivers(prev => [...prev, driverData]);
      setShowAddDriverModal(false);
      setNewDriver({ username: '', password: '', name: '', phone: '', location_id: '' });
      
      setAlertTitle('Shoferi u shtua me sukses!');
      setAlertMessage('Shoferi u shtua me sukses!');
      setAlertType('success');
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Error adding driver:', err);
      setAlertTitle('Gabim në shtimin e shoferit');
      setAlertMessage('Gabim në shtimin e shoferit');
      setAlertType('error');
      setShowErrorAlert(true);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    setConfirmTitle('Fshirja e stafit');
    setConfirmMessage(`A jeni të sigurt që dëshironi ta fshini këtë staf?`);
    setConfirmOnConfirm(() => async () => {
      try {
        // Update local state immediately for better UX
        optimisticUpdateStaff(prev => prev.filter(staff => staff.id !== staffId));
        
        await authService.deleteStaff(staffId);
        setAlertTitle('Stafi u fshi me sukses!');
        setAlertMessage('Stafi u fshi me sukses!');
        setAlertType('success');
        setShowSuccessAlert(true);
      } catch (err) {
        console.error('Error deleting staff:', err);
        setAlertTitle('Gabim në fshirjen e stafit');
        setAlertMessage('Gabim në fshirjen e stafit');
        setAlertType('error');
        setShowErrorAlert(true);
        // Reload staff data if deletion failed
        authService.getAllStaff().then(setStaff);
      }
    });
    setShowConfirmDialog(true);
  };

  const handleDeleteDriver = async (driverId: string) => {
    setConfirmTitle('Fshirja e shoferit');
    setConfirmMessage(`A jeni të sigurt që dëshironi ta fshini këtë shofer?`);
    setConfirmOnConfirm(() => async () => {
      try {
        // Update local state immediately for better UX
        optimisticUpdateDrivers(prev => prev.filter(driver => driver.id !== driverId));
        
        await driverService.delete(driverId);
        setAlertTitle('Shoferi u fshi me sukses!');
        setAlertMessage('Shoferi u fshi me sukses!');
        setAlertType('success');
        setShowSuccessAlert(true);
      } catch (err) {
        console.error('Error deleting driver:', err);
        setAlertTitle('Gabim në fshirjen e shoferit');
        setAlertMessage('Gabim në fshirjen e shoferit');
        setAlertType('error');
        setShowErrorAlert(true);
        // Reload drivers data if deletion failed
        driverService.getAll().then(setDrivers);
      }
    });
    setShowConfirmDialog(true);
  };

  const handleEditStaff = (staffMember: any) => {
    setEditingStaff({
      id: staffMember.id,
      username: staffMember.username,
      password: '', // Empty for security
      name: staffMember.name,
      phone: staffMember.phone,
      location_id: staffMember.location_id
    });
    setShowEditStaffModal(true);
  };

  const handleEditDriver = (driver: any) => {
    setEditingDriver({
      id: driver.id,
      username: driver.username,
      password: '', // Empty for security
      name: driver.name,
      phone: driver.phone,
      location_id: driver.location_id
    });
    setShowEditDriverModal(true);
  };

  const handleUpdateStaff = async () => {
    try {
      const updateData: any = {
        name: editingStaff.name,
        phone: editingStaff.phone,
        location_id: editingStaff.location_id
      };

      // Only include password if it's not empty
      if (editingStaff.password.trim()) {
        updateData.password = editingStaff.password;
      }

      await authService.updateStaff(editingStaff.id, updateData);
      
      // Update local state
      optimisticUpdateStaff(prev => prev.map(s => 
        s.id === editingStaff.id 
          ? { ...s, name: editingStaff.name, phone: editingStaff.phone, location_id: editingStaff.location_id }
          : s
      ));
      
      setShowEditStaffModal(false);
      setEditingStaff(null);
      
      setAlertTitle('Stafi u përditësua me sukses!');
      setAlertMessage('Të dhënat e stafit u përditësuan me sukses!');
      setAlertType('success');
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Error updating staff:', err);
      setAlertTitle('Gabim në përditësimin e stafit');
      setAlertMessage('Gabim në përditësimin e stafit');
      setAlertType('error');
      setShowErrorAlert(true);
    }
  };

  const handleUpdateDriver = async () => {
    try {
      const updateData: any = {
        name: editingDriver.name,
        phone: editingDriver.phone,
        location_id: editingDriver.location_id
      };

      // Only include password if it's not empty
      if (editingDriver.password.trim()) {
        updateData.password = editingDriver.password;
      }

      await driverService.update(editingDriver.id, updateData);
      
      // Update local state
      optimisticUpdateDrivers(prev => prev.map(d => 
        d.id === editingDriver.id 
          ? { ...d, name: editingDriver.name, phone: editingDriver.phone, location_id: editingDriver.location_id }
          : d
      ));
      
      setShowEditDriverModal(false);
      setEditingDriver(null);
      
      setAlertTitle('Shoferi u përditësua me sukses!');
      setAlertMessage('Të dhënat e shoferit u përditësuan me sukses!');
      setAlertType('success');
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Error updating driver:', err);
      setAlertTitle('Gabim në përditësimin e shoferit');
      setAlertMessage('Gabim në përditësimin e shoferit');
      setAlertType('error');
      setShowErrorAlert(true);
    }
  };

  // Filtered data
  const filteredStaff = staffLocationFilter 
    ? staff.filter(s => s.location_id === staffLocationFilter)
    : staff;

  const filteredDrivers = driversLocationFilter 
    ? drivers.filter(d => d.location_id === driversLocationFilter)
    : drivers;

  const filteredOrders = ordersLocationFilter 
    ? orders.filter(o => o.location_id === ordersLocationFilter)
    : orders;

  // Reports data
  const getReportsData = () => {
    let reportOrders = orders;
    
    // Filter by location
    if (reportsLocationFilter) {
      reportOrders = reportOrders.filter(o => o.location_id === reportsLocationFilter);
    }
    
    // Filter by date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (reportsDateFilter) {
      case 'today':
        reportOrders = reportOrders.filter(o => new Date(o.created_at) >= today);
        break;
      case 'yesterday':
        reportOrders = reportOrders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate >= yesterday && orderDate < today;
        });
        break;
      case 'this_week':
        reportOrders = reportOrders.filter(o => new Date(o.created_at) >= thisWeek);
        break;
      case 'this_month':
        reportOrders = reportOrders.filter(o => new Date(o.created_at) >= thisMonth);
        break;
    }

    return reportOrders;
  };

  const reportsData = getReportsData();

  // Calculate reports metrics
  const totalRevenue = reportsData.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = reportsData.length;
  const completedOrders = reportsData.filter(o => o.status === 'perfunduar').length;
  const pendingOrders = reportsData.filter(o => o.status === 'pranuar' || o.status === 'konfirmuar').length;
  const inDeliveryOrders = reportsData.filter(o => o.status === 'ne_delivery').length;

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
            <div className="flex items-center">
              <img src={pepperoniLogo} alt="Pepperoni Pizza" className="h-8 w-auto mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Mirë se vini, {user.username}!</p>
              </div>
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
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Raportet
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
                
                {/* Staff Filter */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filtro sipas lokacionit:</span>
                  </div>
                  <select
                    value={staffLocationFilter}
                    onChange={(e) => setStaffLocationFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Të gjitha lokacionet</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
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
                          Aksionet
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStaff.map((staffMember) => (
                        <tr key={staffMember.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{staffMember.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {staffMember.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {staffMember.locations?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEditStaff(staffMember)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                            >
                              Edito
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staffMember.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
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

                {/* Drivers Filter */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filtro sipas lokacionit:</span>
                  </div>
                  <select
                    value={driversLocationFilter}
                    onChange={(e) => setDriversLocationFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Të gjitha lokacionet</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksionet
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDrivers.map((driver) => (
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEditDriver(driver)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                            >
                              Edito
                            </button>
                            <button
                              onClick={() => handleDeleteDriver(driver.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
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

                {/* Orders Filter */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filtro sipas lokacionit:</span>
                  </div>
                  <select
                    value={ordersLocationFilter}
                    onChange={(e) => setOrdersLocationFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Të gjitha lokacionet</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
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
                      {filteredOrders.map((order: any) => (
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

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Raportet</h2>
                </div>

                {/* Reports Filters */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filtro:</span>
                  </div>
                  <select
                    value={reportsLocationFilter}
                    onChange={(e) => setReportsLocationFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Të gjitha lokacionet</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={reportsDateFilter}
                    onChange={(e) => setReportsDateFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="today">Sot</option>
                    <option value="yesterday">Dje</option>
                    <option value="this_week">Këtë javë</option>
                    <option value="this_month">Këtë muaj</option>
                    <option value="all">Të gjitha</option>
                  </select>
                </div>

                {/* Reports Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Të ardhurat</p>
                        <p className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(2)}€</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Porosi totale</p>
                        <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
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
                        <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Në pritje</p>
                        <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reports Table */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Detajet e porosive</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
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
                        {reportsData.map((order: any) => (
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

      {/* Edit Staff Modal */}
      {showEditStaffModal && editingStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edito Staf</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editingStaff.username}
                  onChange={(e) => setEditingStaff({ ...editingStaff, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password (lëreni bosh për të mos ndryshuar)
                </label>
                <input
                  type="password"
                  value={editingStaff.password}
                  onChange={(e) => setEditingStaff({ ...editingStaff, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="password i ri (opsional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emri i plotë
                </label>
                <input
                  type="text"
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
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
                  value={editingStaff.phone}
                  onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="049 123 456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokacioni
                </label>
                <select
                  value={editingStaff.location_id}
                  onChange={(e) => setEditingStaff({ ...editingStaff, location_id: e.target.value })}
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
                onClick={() => {
                  setShowEditStaffModal(false);
                  setEditingStaff(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Anulo
              </button>
              <button
                onClick={handleUpdateStaff}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Përditëso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {showEditDriverModal && editingDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edito Shofer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editingDriver.username}
                  onChange={(e) => setEditingDriver({ ...editingDriver, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password (lëreni bosh për të mos ndryshuar)
                </label>
                <input
                  type="password"
                  value={editingDriver.password}
                  onChange={(e) => setEditingDriver({ ...editingDriver, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="password i ri (opsional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emri
                </label>
                <input
                  type="text"
                  value={editingDriver.name}
                  onChange={(e) => setEditingDriver({ ...editingDriver, name: e.target.value })}
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
                  value={editingDriver.phone}
                  onChange={(e) => setEditingDriver({ ...editingDriver, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="049 123 456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokacioni
                </label>
                <select
                  value={editingDriver.location_id}
                  onChange={(e) => setEditingDriver({ ...editingDriver, location_id: e.target.value })}
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
                onClick={() => {
                  setShowEditDriverModal(false);
                  setEditingDriver(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Anulo
              </button>
              <button
                onClick={handleUpdateDriver}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Përditëso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {showSuccessAlert && (
        <AlertPopup
          isOpen={showSuccessAlert}
          onClose={() => setShowSuccessAlert(false)}
          title={alertTitle}
          message={alertMessage}
          type="success"
        />
      )}

      {/* Error Alert */}
      {showErrorAlert && (
        <AlertPopup
          isOpen={showErrorAlert}
          onClose={() => setShowErrorAlert(false)}
          title={alertTitle}
          message={alertMessage}
          type="error"
        />
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && confirmOnConfirm && (
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={confirmOnConfirm}
          title={confirmTitle}
          message={confirmMessage}
        />
      )}
    </div>
  );
};

export default AdminDashboard; 