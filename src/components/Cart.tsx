import React from 'react';
import { MapPin, Clock } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, newQuantity: number) => void;
  removeFromCart: (id: string) => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  formatPrice: (price: number) => string;
  onCheckout: () => void;
  onBackToMenu: () => void;
  showBackButton?: boolean; // New prop to control back button visibility
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,

  deliveryFee,
  total,
  formatPrice,
  onCheckout,
  onBackToMenu,
  showBackButton = false
}) => {
  return (
    <div className="h-full flex flex-col bg-white rounded-lg border-2 border-orange-400 p-4 shadow-lg">
      {/* Header */}
      <div className="bg-green-500 text-white text-center py-3 rounded-lg mb-4">
        <h2 className="text-xl font-bold italic">POROSIA JUAJ</h2>
      </div>

      {/* Location and Time */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="font-semibold">PEPPERONI - ARBËRI</span>
        </div>
        <div className="flex items-center justify-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>09:30 - 01:45</span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Shporta është bosh</p>
            <p className="text-sm">Shto produkte për të vazhduar</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="bg-orange-50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-lg object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-orange-500 font-bold text-lg hover:text-orange-600"
                  >
                    +
                  </button>
                  <span className="font-bold text-orange-500">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-gray-400 font-bold text-lg hover:text-gray-600"
                  >
                    −
                  </button>
                </div>
                <div className="bg-green-500 text-white px-3 py-1 rounded font-bold">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total Section */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-black italic mb-1">
          TOTAL: {formatPrice(total)}
        </div>
        <div className="text-sm text-gray-600 italic">
          Delivery: {formatPrice(deliveryFee)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={onCheckout}
          disabled={cartItems.length === 0}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-600 transition-colors"
        >
          <div className="font-bold text-sm leading-tight">
            POROSIT DIÇKA<br />
            SE PE SHOH JE UNTU!!!
          </div>
        </button>
        
        {showBackButton && (
          <button 
            onClick={onBackToMenu}
            className="w-full bg-gray-500 text-white text-center py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Kthehu në menunë
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;