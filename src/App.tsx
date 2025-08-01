import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Cart from './components/Cart';
import CheckoutPage from './components/CheckoutPage';
import ThankYouPage from './components/ThankYouPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import DriverDashboard from './components/DriverDashboard';
import StaffDashboard from './components/StaffDashboard';
import OrderTracking from './components/OrderTracking';
import MobileLayout from './components/MobileLayout';

type AppState = 'home' | 'cart' | 'checkout' | 'thankyou' | 'login' | 'admin' | 'staff' | 'driver' | 'tracking';

interface User {
  username: string;
  role: 'admin' | 'staff' | 'driver';
  location?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');

  const handleLogin = (username: string, password: string) => {
    // Mock authentication with role-based access
    if (username === 'admin' && password === 'admin') {
      setUser({ username: 'admin', role: 'admin' });
      setCurrentPage('admin');
    } else if (username === 'staff' && password === 'staff') {
      setUser({ username: 'staff', role: 'staff', location: 'Pepperoni Pizza - Arbëri' });
      setCurrentPage('staff');
    } else if (username === 'driver' && password === 'driver') {
      setUser({ username: 'driver', role: 'driver' });
      setCurrentPage('driver');
    } else {
      alert('Invalid credentials! Try:\n- admin/admin\n- staff/staff\n- driver/driver');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleGoToLogin = () => {
    setCurrentPage('login');
  };

  const handleGoToTracking = (orderNumber: string) => {
    setTrackingOrderNumber(orderNumber);
    setCurrentPage('tracking');
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Check if mobile
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    return (
      <MobileLayout
        currentPage={currentPage}
        cartItems={cartItems}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
        onCheckout={() => setCurrentPage('checkout')}
        onBackToHome={() => setCurrentPage('home')}
        onOrderComplete={() => setCurrentPage('thankyou')}
        onLogin={handleGoToLogin}
      />
    );
  }

  return (
    <div className="App">
      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onBack={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'admin' && user?.role === 'admin' && (
        <AdminDashboard
          user={user}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'staff' && user?.role === 'staff' && (
        <StaffDashboard
          user={user}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'driver' && user?.role === 'driver' && (
        <DriverDashboard
          user={user}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'tracking' && (
        <OrderTracking
          orderNumber={trackingOrderNumber}
          onBack={() => setCurrentPage('home')}
        />
      )}

      {['home', 'cart', 'checkout', 'thankyou'].includes(currentPage) && (
        <>
          <Navbar
            currentPage={currentPage}
            cartItems={cartItems}
            totalItems={totalItems}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
            onCheckout={() => setCurrentPage('checkout')}
            onBackToHome={() => setCurrentPage('home')}
            onLogin={handleGoToLogin}
          />

          {currentPage === 'home' && (
            <HeroSection
              onAddToCart={addToCart}
              onViewCart={() => setCurrentPage('cart')}
            />
          )}

          {currentPage === 'cart' && (
            <Cart
              cartItems={cartItems}
              totalPrice={totalPrice}
              onRemoveFromCart={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onClearCart={clearCart}
              onCheckout={() => setCurrentPage('checkout')}
              onBackToHome={() => setCurrentPage('home')}
            />
          )}

          {currentPage === 'checkout' && (
            <CheckoutPage
              cartItems={cartItems}
              totalPrice={totalPrice}
              onOrderComplete={() => setCurrentPage('thankyou')}
              onBackToCart={() => setCurrentPage('cart')}
            />
          )}

          {currentPage === 'thankyou' && (
            <ThankYouPage
              onBackToHome={() => setCurrentPage('home')}
              onTrackOrder={handleGoToTracking}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;