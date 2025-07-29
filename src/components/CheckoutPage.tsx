import React, { useState } from 'react';
import { MapPin, Clock, X } from 'lucide-react';
import pepperoniLogo from '../assets/pepperoni-test 1 (1).svg';

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
    name: 'Blerjan Gashi',
    address: 'Bajram Kelmendi Nr.20',
    phone: '049500600',
    email: 'support@pepperoni-ks.com',
    notes: '',
    createAccount: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOrderComplete(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-6 gap-8">
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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rruga *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon (opsionale)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresë email (opsionale)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shënime porosie (opsionale)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="createAccount"
                checked={formData.createAccount}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Të krijohet një llogari?
              </label>
            </div>

            <button
              type="submit"
              disabled={cartItems.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              POROSIT TANI
            </button>
          </form>
        </div>

        {/* Cart Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-lg border-2 border-orange-400 p-6 sticky top-6">
            {/* Header */}
            <div className="bg-green-500 text-white text-center py-3 rounded-lg mb-6">
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
              {cartItems.map((item) => (
                <div key={item.id} className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-400 font-bold text-lg hover:text-gray-600"
                      >
                        −
                      </button>
                      <span className="font-bold text-orange-500 text-lg">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-orange-500 font-bold text-lg hover:text-orange-600"
                      >
                        +
                      </button>
                    </div>
                    <div className="bg-green-500 text-white px-4 py-2 rounded font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-black italic mb-2">
                TOTAL: {formatPrice(total)}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Produkte: {formatPrice(subtotal)}</div>
                <div>Transporti: {formatPrice(deliveryFee)}</div>
              </div>
            </div>

            {/* Order Button */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 rounded-lg">
              <div className="font-bold text-sm leading-tight">
                POROSIT DIÇKA<br />
                SE PE SHOH JE UNTU!!!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;