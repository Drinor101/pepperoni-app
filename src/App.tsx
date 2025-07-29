import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Cart from './components/Cart';
import MobileLayout from './components/MobileLayout';
import CheckoutPage from './components/CheckoutPage';
import ThankYouPage from './components/ThankYouPage';

type AppState = 'home' | 'checkout' | 'thankyou';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('home');
  const [orderData, setOrderData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Listen for window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 1.00;
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => `${price.toFixed(2)}€`;

  const handleCartClick = () => {
    if (cartItems.length === 0) {
      alert('Shto produkte në shportë për të vazhduar!');
      return;
    }
    setCurrentPage('checkout');
  };

  const handleOrderComplete = (data: any) => {
    const orderData = {
      ...data,
      orderNumber: Math.floor(Math.random() * 100) + 600,
      total: formatPrice(total),
      subtotal: formatPrice(subtotal),
      deliveryFee: formatPrice(deliveryFee),
      items: cartItems
    };
    setOrderData(orderData);
    setCurrentPage('thankyou');
  };

  const handleNewOrder = () => {
    setCurrentPage('home');
    setOrderData(null);
    setCartItems([]);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  // Render based on current page
  if (currentPage === 'checkout') {
    return (
      <CheckoutPage 
        onBack={handleBackToHome}
        onOrderComplete={handleOrderComplete}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        formatPrice={formatPrice}
      />
    );
  }

  if (currentPage === 'thankyou' && orderData) {
    return (
      <ThankYouPage 
        orderData={orderData}
        onNewOrder={handleNewOrder}
      />
    );
  }

  // Home page
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Layout */}
      {isMobile ? (
        <MobileLayout 
          cartTotal={formatPrice(total)}
          onCartClick={handleCartClick}
          addToCart={addToCart}
          cartItems={cartItems}
        />
      ) : (
        /* Desktop Layout */
        <>
          <Navbar cartTotal={formatPrice(total)} />
          <div className="flex">
            <div className="flex-1">
              <HeroSection addToCart={addToCart} />
            </div>
            <div className="w-96 p-6 bg-gray-50">
              <Cart 
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                formatPrice={formatPrice}
                onCheckout={handleCartClick}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;