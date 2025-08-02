import React from 'react';
import { Gamepad2, ShoppingCart } from 'lucide-react';
import pepperoniLogo from '../assets/pepperoni-test 1 (1).svg';
import gamingIcon from '../assets/gaming 1.svg';
import cartIcon from '../assets/Frame.svg';

interface NavbarProps {
  cartTotal: string;
}

const Navbar: React.FC<NavbarProps> = ({ cartTotal }) => {
  return (
    <nav className="shadow-lg flex items-center justify-between h-[86px] bg-[#37B34A]">
        {/* Logo Section */}
        <div className="flex items-center pt-[30px] pl-[20px]">
          <img 
            src={pepperoniLogo}
            alt="Pepperoni Pizza Logo" 
            className="h-[103px] w-[180px]"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6 pr-4">
          {/* Gaming Message */}
          <div className="flex items-center space-x-3 text-white">
            <img 
              src={gamingIcon}
              alt="Gaming Controller" 
              className="w-[35px] h-[35px]"
            />
            <span className="font-semibold text-[24px] italic">
              LOJA: KUSH PAGUN?
            </span>
          </div>

          {/* Price/Cart Section */}
          <div className="flex items-center space-x-2 rounded-md px-3 py-1.5 backdrop-blur-sm">
            <img 
              src={cartIcon}
              alt="Shopping Cart" 
              className="w-[50px] h-[50px]"
            />
            <span className="text-white font-semibold text-[34px]">{cartTotal}</span>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;