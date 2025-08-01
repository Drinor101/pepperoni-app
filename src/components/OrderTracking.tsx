import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import pepperoniLogo from '../assets/pepperoni-test 1 (1).svg';

interface OrderStatus {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'assigned' | 'picked_up' | 'out_for_delivery' | 'delivered';
  timestamp: string;
  description: string;
}

interface OrderTrackingProps {
  orderNumber: string;
  onBack: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderNumber, onBack }) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus['status']>('confirmed');
  const [estimatedDelivery, setEstimatedDelivery] = useState('15:30');
  const [driverInfo, setDriverInfo] = useState({
    name: 'Ardian Krasniqi',
    phone: '044123456',
    vehicle: 'Motorcycle',
    eta: '10 min'
  });

  // Mock order status timeline
  const [orderTimeline, setOrderTimeline] = useState<OrderStatus[]>([
    {
      status: 'pending',
      timestamp: '14:25',
      description: 'Porosia u bë'
    },
    {
      status: 'confirmed',
      timestamp: '14:26',
      description: 'Porosia u konfirmua'
    },
    {
      status: 'preparing',
      timestamp: '14:30',
      description: 'Duke përgatitur'
    },
    {
      status: 'ready',
      timestamp: '14:45',
      description: 'Gati për dorëzim'
    },
    {
      status: 'assigned',
      timestamp: '14:47',
      description: 'Shoferi u caktua'
    }
  ]);

  const getStatusIcon = (status: OrderStatus['status']) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <Package className="w-6 h-6" />;
      case 'preparing':
        return <Clock className="w-6 h-6" />;
      case 'ready':
        return <CheckCircle className="w-6 h-6" />;
      case 'assigned':
      case 'picked_up':
      case 'out_for_delivery':
        return <Truck className="w-6 h-6" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: OrderStatus['status'], isActive: boolean = false) => {
    if (isActive) return 'text-green-600 bg-green-100';
    
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 'text-gray-600 bg-gray-100';
      case 'preparing':
        return 'text-blue-600 bg-blue-100';
      case 'ready':
        return 'text-green-600 bg-green-100';
      case 'assigned':
      case 'picked_up':
      case 'out_for_delivery':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const callDriver = () => {
    window.open(`tel:${driverInfo.phone}`, '_self');
  };

  const callRestaurant = () => {
    window.open('tel:049500600', '_self');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Kthehu
            </button>
            <img 
              src={pepperoniLogo}
              alt="Pepperoni Pizza Logo" 
              className="h-8 w-auto"
            />
            <div className="w-8"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Order Number */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Porosia #{orderNumber}
          </h1>
          <p className="text-gray-600">
            Dorëzuar deri: {estimatedDelivery}
          </p>
        </div>

        {/* Current Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${getStatusColor(currentStatus, true)}`}>
              {getStatusIcon(currentStatus)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentStatus === 'out_for_delivery' ? 'Duke dorëzuar' : 
                 currentStatus === 'picked_up' ? 'Marrë nga shoferi' :
                 currentStatus === 'assigned' ? 'Shoferi u caktua' :
                 currentStatus === 'ready' ? 'Gati për dorëzim' :
                 currentStatus === 'preparing' ? 'Duke përgatitur' :
                 currentStatus === 'confirmed' ? 'U konfirmua' : 'Në pritje'}
              </h2>
              <p className="text-gray-600">
                {currentStatus === 'out_for_delivery' ? `Shoferi do të mbërrijë për ${driverInfo.eta}` :
                 currentStatus === 'picked_up' ? 'Shoferi ka marrë porosinë' :
                 currentStatus === 'assigned' ? 'Shoferi po vjen për të marrë porosinë' :
                 currentStatus === 'ready' ? 'Porosia është gati për të marrë' :
                 currentStatus === 'preparing' ? 'Po përgatitet porosia juaj' :
                 'Porosia po procesohet'}
              </p>
            </div>
          </div>
        </div>

        {/* Driver Info (if assigned) */}
        {(currentStatus === 'assigned' || currentStatus === 'picked_up' || currentStatus === 'out_for_delivery') && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Shoferi juaj
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{driverInfo.name}</p>
                <p className="text-sm text-gray-600">{driverInfo.vehicle}</p>
                <p className="text-sm text-gray-600">ETA: {driverInfo.eta}</p>
              </div>
              <button
                onClick={callDriver}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Thirr</span>
              </button>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Statusi i porosisë
          </h3>
          <div className="space-y-4">
            {orderTimeline.map((status, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${getStatusColor(status.status)}`}>
                  {getStatusIcon(status.status)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{status.description}</p>
                  <p className="text-sm text-gray-500">{status.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={callRestaurant}
            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2"
          >
            <Phone className="w-4 h-4" />
            <span>Thirr restorantin</span>
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600"
          >
            Porosit përsëri
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking; 