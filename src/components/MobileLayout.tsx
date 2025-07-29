import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface MobileLayoutProps {
  cartTotal: string;
  onCartClick: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  cartItems: CartItem[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ cartTotal, onCartClick, addToCart, cartItems }) => {
  const [activeCategory, setActiveCategory] = useState('New offers!');

  const categories = [
    'New offers!',
    'Pizza', 
    'Sandwich',
    'Samun'
  ];

  const products = [
    {
      id: '1',
      name: 'Hamburger Classic',
      price: 2.50,
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
      category: 'New offers!'
    },
    {
      id: '2',
      name: 'Sandwich Mix',
      price: 2.50,
      image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
      category: 'Sandwich'
    },
    {
      id: '3',
      name: 'Pizza Margherita',
      price: 3.50,
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
      category: 'Pizza'
    },
    {
      id: '4',
      name: 'Samun Special',
      price: 2.80,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
      category: 'Samun'
    }
  ];

  const filteredProducts = products.filter(product => 
    activeCategory === 'New offers!' ? true : product.category === activeCategory
  );

  return (
    <div className="md:hidden">
      {/* Mobile Navbar */}
      <nav className="px-4 py-3 shadow-lg" style={{ backgroundColor: '#37B34A' }}>
        <div className="flex items-center justify-between">
          <img 
            src="/src/assets/pepperoni-test 1 (1).svg" 
            alt="Pepperoni Pizza Logo" 
            className="h-12 w-auto"
          />
          <div className="flex items-center space-x-2 text-white">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold text-lg">{cartTotal}</span>
          </div>
        </div>
      </nav>

      {/* Hero Images */}
      <section className="px-4 py-6">
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden relative">
            <img 
              src="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400&h=192&fit=crop" 
              alt="Pizza new Meatball" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <div className="bg-orange-500 text-white px-3 py-1 rounded">
                <span className="text-xs font-bold">Pizza new</span><br />
                <span className="text-sm font-bold">Meatball</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden relative">
            <img 
              src="https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400&h=192&fit=crop" 
              alt="APPROVED COOOL" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <div className="bg-green-500 text-white px-3 py-1 rounded">
                <span className="text-xs font-bold">APPROVED</span><br />
                <span className="text-sm font-bold">COOOL</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden relative">
            <img 
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=192&fit=crop" 
              alt="#order #your #taste" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <div className="bg-orange-500 text-white px-3 py-1 rounded">
                <span className="text-xs font-bold">#order</span><br />
                <span className="text-sm font-bold">#your #taste</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="px-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Product List */}
      <section className="px-4 pb-24">
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-bold transition-colors"
                >
                  {product.price.toFixed(2)}€
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fixed Bottom Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-orange-500 text-white p-4 md:hidden">
        <button 
          onClick={onCartClick}
          disabled={cartItems.length === 0}
          className="w-full flex items-center justify-between text-lg font-bold disabled:opacity-50"
        >
          <span>POROSIA</span>
          <div className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span>{cartTotal}</span>
          </div>
        </button>
        {cartItems.length === 0 && (
          <p className="text-center text-sm mt-2 opacity-75">
            Shto produkte për të vazhduar
          </p>
        )}
      </div>
    </div>
  );
};

export default MobileLayout;