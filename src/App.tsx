import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import { AlertCircle, Info, CheckCircle } from 'lucide-react';

type AppState = 'home' | 'checkout' | 'thankyou' | 'login' | 'admin' | 'staff' | 'driver' | 'test';

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

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [alert, setAlert] = useState<AlertProps>({
    isOpen: false,
    onClose: () => setAlert({ ...alert, isOpen: false }),
    title: '',
    message: '',
    type: 'info'
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('pepperoni_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
                       // Redirect to appropriate dashboard based on role
               if (userData.role === 'admin') {
                 navigate('/admin');
               } else if (userData.role === 'staff') {
                 navigate('/staff');
               } else if (userData.role === 'driver') {
                 navigate('/driver');
               }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('pepperoni_user');
      }
    }
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      // For now, we'll use a simple check against hardcoded users
      // In production, you'd use proper password verification
      const userData = await authService.login(username, password);
      
      const userInfo = { 
        username: userData.username, 
        role: userData.role, 
        location: userData.locations?.name,
        location_id: userData.location_id,
        id: userData.id
      };
      
      // Save user to localStorage for session persistence
      localStorage.setItem('pepperoni_user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'staff') {
        navigate('/staff');
      } else if (userData.role === 'driver') {
        navigate('/driver');
      }
    } catch (error) {
      setAlert({
        isOpen: true,
        onClose: () => setAlert({ ...alert, isOpen: false }),
        title: 'Kredencialet e gabuara',
        message: 'Përdoruesi ose fjalëkalimi është i gabuar. Ju lutem provoni përsëri.',
        type: 'error'
      });
    }
  };

  const handleLogout = () => {
    // Clear user from localStorage and state
    localStorage.removeItem('pepperoni_user');
    setUser(null);
    navigate('/');
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

  // For mobile, only show MobileLayout for the main customer-facing pages
  // Admin, staff, driver, and login pages should use the regular layout
  const shouldUseMobileLayout = isMobile && !['/login', '/admin', '/staff', '/driver', '/test'].includes(window.location.pathname);

  if (shouldUseMobileLayout) {
    return (
      <MobileLayout
        cartTotal={totalItems.toString()}
        onCartClick={() => setCurrentPage('home')}
        addToCart={addToCart}
        cartItems={cartItems}
      />
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Login Route */}
        <Route 
          path="/login" 
          element={
            <LoginPage onLogin={handleLogin} />
          } 
        />

        {/* Admin Dashboard Route */}
        <Route 
          path="/admin" 
          element={
            user?.role === 'admin' ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                  <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )
          } 
        />

        {/* Staff Dashboard Route */}
        <Route 
          path="/staff" 
          element={
            user?.role === 'staff' ? (
              <StaffDashboard user={user} onLogout={handleLogout} />
            ) : (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                  <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )
          } 
        />

        {/* Driver Dashboard Route */}
        <Route 
          path="/driver" 
          element={
            user?.role === 'driver' ? (
              <DriverDashboard user={user} onLogout={handleLogout} />
            ) : (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                  <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )
          } 
        />

        {/* Test Route */}
        <Route 
          path="/test" 
          element={
            <div className="min-h-screen bg-gray-50 p-8">
              <div className="max-w-4xl mx-auto">
                <DatabaseTest />
                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          } 
        />

        {/* Home Route - Default */}
        <Route 
          path="/" 
          element={
            currentPage === 'home' ? (
              <>
                <Navbar
                  cartTotal={`${(totalPrice + 1.00).toFixed(2)}€`}
                  totalItems={totalItems}
                />
                <div className="flex min-h-screen bg-gray-50">
                  {/* Main Content */}
                  <div className="flex-1">
                    <HeroSection addToCart={addToCart} />
                  </div>
                  {/* Fixed Cart Sidebar - Right Side (Smaller) */}
                  <div className="w-64 mr-4">
                    <Cart
                      cartItems={cartItems}
                      updateQuantity={updateQuantity}
                      removeFromCart={removeFromCart}
                      subtotal={totalPrice}
                      deliveryFee={1.00}
                      total={totalPrice + 1.00}
                      formatPrice={(price: number) => `${price.toFixed(2)}€`}
                      onCheckout={() => setCurrentPage('checkout')}
                      onBackToMenu={() => setCurrentPage('home')}
                      showBackButton={false}
                    />
                  </div>
                </div>
              </>
            ) : currentPage === 'checkout' ? (
              <>
                <Navbar
                  cartTotal={`${(totalPrice + 1.00).toFixed(2)}€`}
                  totalItems={totalItems}
                />
                <CheckoutPage
                  cartItems={cartItems}
                  subtotal={totalPrice}
                  deliveryFee={1.00}
                  total={totalPrice + 1.00}
                  formatPrice={(price: number) => `${price.toFixed(2)}€`}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  onOrderComplete={(orderData) => {
                    setOrderData(orderData);
                    setCurrentPage('thankyou');
                  }}
                  onBack={() => setCurrentPage('home')}
                />
              </>
            ) : currentPage === 'thankyou' && orderData ? (
              <>
                <Navbar
                  cartTotal={`${(totalPrice + 1.00).toFixed(2)}€`}
                  totalItems={totalItems}
                />
                <ThankYouPage
                  orderData={orderData}
                  cartItems={cartItems}
                  onNewOrder={() => {
                    setOrderData(null);
                    clearCart();
                    setCurrentPage('home');
                  }}
                />
              </>
            ) : (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )
          } 
        />
      </Routes>

      <AlertPopup
        isOpen={alert.isOpen}
        onClose={alert.onClose}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
}

export default App;