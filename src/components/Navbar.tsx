import React from 'react';
import { Gamepad2, ShoppingCart } from 'lucide-react';
import { pepperoniLogo } from '../assets';
import { gamingIcon, frameIcon } from '../assets';

interface NavbarProps {
  cartTotal: string;
  totalItems: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartTotal, totalItems }) => {
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

          {/* Price/Cart Section - Informational Only */}
          <div className="flex items-center space-x-2 bg-white bg-opacity-15 rounded-md px-3 py-1.5 backdrop-blur-sm">
            <img 
              src={frameIcon}
              alt="Shopping Cart" 
              className="w-5 h-5"
            />
            <span className="text-white font-bold text-lg">{cartTotal}</span>
            {totalItems > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;