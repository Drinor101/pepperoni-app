import React, { useState } from 'react';
import { MapPin, Clock, X, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { pepperoniLogo } from '../assets';
import { orderService, locationService } from '../services';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutPageProps {
  onBack: () => void;
  onOrderComplete: (orderData: any) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, newQuantity: number) => void;
  removeFromCart: (id: string) => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  formatPrice: (price: number) => string;
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

const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  onBack, 
  onOrderComplete, 
  cartItems, 
  updateQuantity, 
  removeFromCart, 
  subtotal, 
  deliveryFee, 
  total, 
  formatPrice 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    notes: '',
    location_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [alert, setAlert] = useState<AlertProps>({
    isOpen: false,
    onClose: () => setAlert({ ...alert, isOpen: false }),
    title: '',
    message: '',
    type: 'info'
  });

  // Load locations on component mount
  React.useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationsData = await locationService.getAll();
        setLocations(locationsData);
        if (locationsData.length > 0) {
          setFormData(prev => ({ ...prev, location_id: locationsData[0].id }));
        }
      } catch (error) {
        console.error('Error loading locations:', error);
      }
    };
    loadLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order in database
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        address: formData.address,
        location_id: formData.location_id,
        total: total,
        status: 'pranuar' as const,
        estimated_delivery: new Date(Date.now() + 45 * 60 * 1000).toISOString() // 45 minutes from now
      };

      const orderItems = cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        order_id: '', // This will be set by the database service
        created_at: new Date().toISOString()
      }));

      const newOrder = await orderService.create(orderData, orderItems);
      
      // Call the callback with order data
      onOrderComplete({
        ...formData,
        orderNumber: newOrder.order_number,
        orderId: newOrder.id
      });
    } catch (error) {
      console.error('Error creating order:', error);
      setAlert({
        isOpen: true,
        onClose: () => setAlert({ ...alert, isOpen: false }),
        title: 'Gabim',
        message: 'Gabim në krijimin e porosisë. Provoni përsëri.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <nav className="px-4 py-3 shadow-lg" style={{ backgroundColor: '#37B34A' }}>
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-white hover:text-gray-200">
            ← Back
          </button>
          <img 
            src={pepperoniLogo}
            alt="Pepperoni Pizza Logo" 
            className="h-12 w-auto"
          />
          <div className="flex items-center space-x-2 text-white">
            <span className="font-bold text-lg">{formatPrice(total)}</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row p-6 gap-8">
        {/* Checkout Form */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Të dhënat e porosisë</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emri *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Shkruani emrin tuaj të plotë"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefoni *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="049 123 456"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresa *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Shkruani adresën tuaj të plotë"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokacioni *
              </label>
              <select
                name="location_id"
                value={formData.location_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Zgjidh lokacionin</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="email@example.com (opsionale)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shënime shtesë
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Shënime të veçanta për porosinë..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.location_id}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Duke krijuar porosinë...' : 'Konfirmo porosinë'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Përmbledhja e porosisë</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">Sasia: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nëntotali:</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tarifa e dorëzimit:</span>
                <span className="font-medium">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-200 pt-2">
                <span>Totali:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Koha e dorëzimit</span>
              </div>
              <p className="text-sm text-gray-600">45-60 minuta</p>
            </div>
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

export default CheckoutPage;