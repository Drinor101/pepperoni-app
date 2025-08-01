import React, { useState, useEffect } from 'react';
import { orderService, driverService, authService, locationService, realtimeService } from '../services/database';

const DatabaseTest: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [realtimeLogs, setRealtimeLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setRealtimeLogs(prev => [...prev, `${timestamp}: ${message}`]);
  };

  const testRealtime = async () => {
    addLog('Setting up real-time subscriptions...');
    
    // Test orders subscription
    const ordersSubscription = realtimeService.subscribeToOrders((payload) => {
      addLog(`Orders update: ${payload.event} on order ${payload.new?.id || payload.old?.id}`);
      orderService.getAll().then(setOrders);
    });

    // Test drivers subscription
    const driversSubscription = realtimeService.subscribeToDrivers((payload) => {
      addLog(`Drivers update: ${payload.event} on driver ${payload.new?.id || payload.old?.id}`);
      driverService.getAll().then(setDrivers);
    });

    // Test all updates subscription
    const allUpdatesSubscription = realtimeService.subscribeToAllUpdates((payload) => {
      addLog(`All updates: ${payload.event} on ${payload.table} ${payload.new?.id || payload.old?.id}`);
    });

    // Cleanup after 30 seconds
    setTimeout(() => {
      addLog('Cleaning up real-time subscriptions...');
      ordersSubscription.unsubscribe();
      driversSubscription.unsubscribe();
      allUpdatesSubscription.unsubscribe();
    }, 30000);

    return () => {
      ordersSubscription.unsubscribe();
      driversSubscription.unsubscribe();
      allUpdatesSubscription.unsubscribe();
    };
  };

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersData, driversData, staffData, locationsData] = await Promise.all([
        orderService.getAll(),
        driverService.getAll(),
        authService.getAllStaff(),
        locationService.getAll()
      ]);
      setOrders(ordersData);
      setDrivers(driversData);
      setStaff(staffData);
      setLocations(locationsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Gabim në ngarkimin e të dhënave');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Database Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Display */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Orders ({orders.length})</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {orders.map(order => (
                <div key={order.id} className="p-2 bg-gray-50 rounded text-sm">
                  #{order.order_number} - {order.customer_name} - {order.status}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Drivers ({drivers.length})</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {drivers.map(driver => (
                <div key={driver.id} className="p-2 bg-gray-50 rounded text-sm">
                  {driver.name} - {driver.status}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Staff ({staff.length})</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {staff.map(staffMember => (
                <div key={staffMember.id} className="p-2 bg-gray-50 rounded text-sm">
                  {staffMember.name} - {staffMember.role}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Locations ({locations.length})</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {locations.map(location => (
                <div key={location.id} className="p-2 bg-gray-50 rounded text-sm">
                  {location.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Test */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Real-time Test</h2>
            <button
              onClick={testRealtime}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
              Start Real-time Test (30s)
            </button>
            <div className="bg-gray-100 p-3 rounded max-h-80 overflow-y-auto">
              <h3 className="font-semibold mb-2">Real-time Logs:</h3>
              {realtimeLogs.length === 0 ? (
                <p className="text-gray-500">No real-time events yet. Click the button above to start testing.</p>
              ) : (
                <div className="space-y-1">
                  {realtimeLogs.map((log, index) => (
                    <div key={index} className="text-xs font-mono bg-white p-1 rounded">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={loadAllData}
                disabled={loading}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh All Data'}
              </button>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest; 