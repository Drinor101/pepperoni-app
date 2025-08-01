import React, { useState, useEffect } from 'react';
import { locationService, orderService, driverService } from '../services/database';

const DatabaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    locations: any[];
    orders: any[];
    drivers: any[];
    error?: string;
  }>({ locations: [], orders: [], drivers: [] });
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      const [locations, orders, drivers] = await Promise.all([
        locationService.getAll(),
        orderService.getAll(),
        driverService.getAll()
      ]);

      setTestResults({ locations, orders, drivers });
    } catch (error) {
      console.error('Database test failed:', error);
      setTestResults(prev => ({ ...prev, error: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Database Connection Test</h2>
      
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Testing database connection...</p>
        </div>
      )}

      {testResults.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          <strong>Error:</strong> {testResults.error}
          <p className="text-sm mt-1">
            Make sure you have:
            <br />1. Created a Supabase project
            <br />2. Run the SQL schema
            <br />3. Set up environment variables
          </p>
        </div>
      )}

      {!loading && !testResults.error && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Locations</h3>
              <p className="text-2xl font-bold text-green-600">{testResults.locations.length}</p>
              <p className="text-sm text-green-600">✅ Connected</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Orders</h3>
              <p className="text-2xl font-bold text-blue-600">{testResults.orders.length}</p>
              <p className="text-sm text-blue-600">✅ Connected</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800">Drivers</h3>
              <p className="text-2xl font-bold text-purple-600">{testResults.drivers.length}</p>
              <p className="text-sm text-purple-600">✅ Connected</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Sample Data:</h3>
            <div className="text-sm space-y-2">
              <div>
                <strong>Locations:</strong> {testResults.locations.map(l => l.name).join(', ')}
              </div>
              <div>
                <strong>Orders:</strong> {testResults.orders.length > 0 ? `#${testResults.orders[0].order_number}` : 'None'}
              </div>
              <div>
                <strong>Drivers:</strong> {testResults.drivers.map(d => d.name).join(', ')}
              </div>
            </div>
          </div>

          <button
            onClick={runTests}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Run Test Again
          </button>
        </div>
      )}
    </div>
  );
};

export default DatabaseTest; 