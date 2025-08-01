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

import MobileLayout from './components/MobileLayout';
import DatabaseTest from './components/DatabaseTest';
import { authService } from './services/database';

type AppState = 'home' | 'cart' | 'checkout' | 'thankyou' | 'login' | 'admin' | 'staff' | 'driver' | 'test';

interface User {
  username: string;
  role: 'admin' | 'staff' | 'driver';
  location?: string;
  location_id?: string;
  id?: string;
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

  const [orderData, setOrderData] = useState<any>(null);

  const handleLogin = async (username: string, password: string) => {
    try {
      // For now, we'll use a simple check against hardcoded users
      // In production, you'd use proper password verification
      const userData = await authService.login(username, password);
      
      setUser({ 
        username: userData.username, 
        role: userData.role, 
        location: userData.locations?.name,
        location_id: userData.location_id,
        id: userData.id
      });
      
      if (userData.role === 'admin') {
        setCurrentPage('admin');
      } else if (userData.role === 'staff') {
        setCurrentPage('staff');
      } else if (userData.role === 'driver') {
        setCurrentPage('driver');
      }
    } catch (error) {
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



  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
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
      {currentPage === 'test' && (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <DatabaseTest />
            <div className="mt-6 text-center">
              <button
                onClick={() => setCurrentPage('home')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

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



      {['home', 'cart', 'checkout', 'thankyou'].includes(currentPage) && (
        <>
                     <Navbar
             cartTotal={`${(totalPrice + 2.00).toFixed(2)}€`}
             totalItems={totalItems}
             onLogin={handleGoToLogin}
             onCartClick={() => setCurrentPage('cart')}
           />

          {currentPage === 'home' && (
            <HeroSection
              addToCart={addToCart}
            />
          )}

                     {currentPage === 'cart' && (
             <div className="flex justify-center items-start min-h-screen bg-gray-50 pt-20">
                            <Cart
               cartItems={cartItems}
               updateQuantity={updateQuantity}
               removeFromCart={removeFromCart}
               subtotal={totalPrice}
               deliveryFee={2.00}
               total={totalPrice + 2.00}
               formatPrice={(price: number) => `${price.toFixed(2)}€`}
               onCheckout={() => setCurrentPage('checkout')}
               onBackToMenu={() => setCurrentPage('home')}
             />
             </div>
           )}

          {currentPage === 'checkout' && (
            <CheckoutPage
              cartItems={cartItems}
              subtotal={totalPrice}
              deliveryFee={2.00}
              total={totalPrice + 2.00}
              formatPrice={(price: number) => `${price.toFixed(2)}€`}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
                             onOrderComplete={(orderData) => {
                 console.log('Order completed:', orderData);
                 // Store order data for ThankYouPage
                 setOrderData(orderData);
                 setCurrentPage('thankyou');
               }}
              onBack={() => setCurrentPage('cart')}
            />
          )}

                     {currentPage === 'thankyou' && orderData && (
             <ThankYouPage
               orderData={orderData}
               cartItems={cartItems}
               onNewOrder={() => {
                 setOrderData(null);
                 clearCart();
                 setCurrentPage('home');
               }}
             />
           )}
        </>
      )}
    </div>
  );
}

export default App;