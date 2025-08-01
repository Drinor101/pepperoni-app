import React, { useState } from 'react';
import { Clock, MapPin, User, Building, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ThankYouPageProps {
  orderData: any;
  cartItems: CartItem[];
  onNewOrder: () => void;
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

const ThankYouPage: React.FC<ThankYouPageProps> = ({ orderData, cartItems, onNewOrder }) => {
  const [alert, setAlert] = useState<AlertProps>({
    isOpen: false,
    onClose: () => setAlert({ ...alert, isOpen: false }),
    title: '',
    message: '',
    type: 'info'
  });

  const downloadInvoice = () => {
    setAlert({
      isOpen: true,
      onClose: () => setAlert({ ...alert, isOpen: false }),
      title: 'Fatura po shkarkohet...',
      message: 'Fatura po përgatitet për shkarkim.',
      type: 'info'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-4">
            FALEMINDERIT PËR POROSINË TUAJ, {orderData.name?.toUpperCase()}! ❤️
          </h1>
          <div className="flex items-center justify-center text-gray-600 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            <span>Do pranoni porosinë brenda 45 minutave</span>
          </div>
          <div className="flex items-center justify-center text-gray-600 mb-2">
            <span>🚚 Shoferi do t'ju telefonojë kur të arrijë</span>
          </div>
          <div className="flex items-center justify-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{orderData.address}</span>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-orange-100 rounded-lg p-8 mb-8 relative">
          {/* Pizza Icon */}
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🍕</span>
            </div>
          </div>

          {/* Order Number */}
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">Numri i porosisë</div>
            <div className="text-4xl font-bold text-green-500">#{orderData.orderNumber}</div>
          </div>

          {/* Order Details Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-orange-500">Detaje të porosisë</h2>
          </div>

          {/* Customer and Restaurant Info */}
          <div className="bg-black text-white rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-300 mb-1">Klienti</div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-semibold">{orderData.name}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-1">Shitësi</div>
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Pepperoni Pizza</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2 mb-6">
            {cartItems.map((item: CartItem, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span>{item.name} <sup>({item.quantity})</sup></span>
                <span className="font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-300 pt-4 space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Nëntotali:</span>
              <span>{(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tarifa e dorëzimit:</span>
              <span>1.00€</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
              <span>TOTALI:</span>
              <span>{(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 1.00).toFixed(2)}€</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 mt-2">
            VETËM KESH
          </div>

          <div className="text-center text-sm text-gray-600 mt-2">
            VETËM KESH
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-8">
          <button
            onClick={downloadInvoice}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-colors"
          >
            Shkarko faturën
          </button>
        </div>

        {/* New Order Button */}
        <div className="text-center">
          <button
            onClick={onNewOrder}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Porosit Përsëri
          </button>
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

export default ThankYouPage;