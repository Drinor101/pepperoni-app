import React from 'react';
import { Clock, MapPin, User, Building } from 'lucide-react';

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

const ThankYouPage: React.FC<ThankYouPageProps> = ({ orderData, cartItems, onNewOrder }) => {


  const downloadInvoice = () => {
    alert('Fatura po shkarkohet...');
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

          {/* Total */}
          <div className="bg-orange-500 text-white text-center py-3 rounded-lg font-bold text-lg">
            TOTAL: {orderData.total}
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
    </div>
  );
};

export default ThankYouPage;