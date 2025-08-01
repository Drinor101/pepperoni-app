import React, { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface HeroSectionProps {
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState('New offers!');

  const categories = [
    'New offers!',
    'Pizza', 
    'Sandwich',
    'Samun',
    'Super sosa🔥',
    'Pije freskuese',
    'Qipsa'
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
      name: 'Pizza Pepperoni',
      price: 4.00,
      image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
      category: 'Pizza'
    },
    {
      id: '5',
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
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Images Section */}
      <section className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Pizza new Meatball Card */}
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img 
              src="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400&h=320&fit=crop" 
              alt="Pizza new Meatball" 
              className="w-full h-80 object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <div className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-bold">Pizza new</span><br />
                <span className="text-lg font-bold">Meatball</span>
              </div>
            </div>
          </div>

          {/* APPROVED COOOL Card */}
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img 
              src="https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400&h=320&fit=crop" 
              alt="APPROVED COOOL" 
              className="w-full h-80 object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-bold">APPROVED</span><br />
                <span className="text-lg font-bold">COOOL</span>
              </div>
            </div>
          </div>

          {/* #order #your #taste Card */}
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img 
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=320&fit=crop" 
              alt="#order #your #taste" 
              className="w-full h-80 object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <div className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-bold">#order</span><br />
                <span className="text-lg font-bold">#your #taste</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Menu Section */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
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
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                  >
                    {product.price.toFixed(2)}€
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>
    </main>
  );
};

export default HeroSection;