import React from 'react';
import { Gamepad2, ShoppingCart, LogIn } from 'lucide-react';
import pepperoniLogo from '../assets/pepperoni-test 1 (1).svg';
import gamingIcon from '../assets/gaming 1.svg';
import cartIcon from '../assets/Frame.svg';

interface NavbarProps {
  cartTotal: string;
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartTotal, onLogin }) => {
  return (
    <nav className="px-4 py-3 shadow-lg" style={{ backgroundColor: '#37B34A' }}>
      <div className="w-full flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center pl-2">
          <img 
            src={pepperoniLogo}
            alt="Pepperoni Pizza Logo" 
            className="h-14 w-auto"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6 pr-4">
          {/* Gaming Message */}
          <div className="flex items-center space-x-3 text-white">
            <img 
              src={gamingIcon}
              alt="Gaming Controller" 
              className="w-5 h-5"
            />
            <span className="font-medium text-base italic">
              LOJA: KUSH PAGUN?
            </span>
          </div>

          {/* Login Button */}
          <button
            onClick={onLogin}
            className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            <span className="font-medium">Admin/Driver</span>
          </button>

          {/* Price/Cart Section */}
          <div className="flex items-center space-x-2 bg-white bg-opacity-15 rounded-md px-3 py-1.5 backdrop-blur-sm">
            <img 
              src={cartIcon}
              alt="Shopping Cart" 
              className="w-5 h-5"
            />
            <span className="text-white font-bold text-lg">{cartTotal}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;