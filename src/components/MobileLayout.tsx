import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import pepperoniLogo from "../assets/pepperoni-test 1 (1).svg";
import cartIcon from "../assets/Frame.svg";
import PizzaMeatball from "../assets/pizza-meatball.jpg";
import ApprovedCool from "../assets/approved-cool.jpg";
import OrderYourTaste from "../assets/order-your-taste.jpg";

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
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  cartItems: CartItem[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  cartTotal,
  onCartClick,
  addToCart,
  cartItems,
}) => {
  const [activeCategory, setActiveCategory] = useState("New offers!");

  const categories = ["New offers!", "Pizza", "Sandwich", "Samun"];

  const products = [
    {
      id: "1",
      name: "Hamburger Classic",
      price: 2.5,
      image:
        "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      category: "New offers!",
    },
    {
      id: "2",
      name: "Sandwich Mix",
      price: 2.5,
      image:
        "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      category: "Sandwich",
    },
    {
      id: "3",
      name: "Pizza Margherita",
      price: 3.5,
      image:
        "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      category: "Pizza",
    },
    {
      id: "4",
      name: "Samun Special",
      price: 2.8,
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      category: "Samun",
    },
  ];

  const filteredProducts = products.filter((product) =>
    activeCategory === "New offers!"
      ? true
      : product.category === activeCategory
  );

  return (
    <div className="md:hidden">
      {/* Mobile Navbar */}
      <nav
        className="shadow-lg h-[60px]"
        style={{ backgroundColor: "#37B34A" }}
      >
        <div className="flex items-center h-full justify-between">
          <img
            src={pepperoniLogo}
            alt="Pepperoni Pizza Logo"
            className="h-[63px] w-[110px] mt-4 ml-4"
          />
          <div className="flex items-center space-x-2 text-white pr-4">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold text-lg">{cartTotal}</span>
          </div>
        </div>
      </nav>

      {/* Hero Images */}
      <section className="px-4 py-6">
        <div className="flex flex-wrap gap-[8px]">
          {/* <img 
              src="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400&h=192&fit=crop" 
              alt="Pizza new Meatball" 
              className="w-full h-48 object-cover"
            /> */}
          <img
            src={PizzaMeatball}
            alt="Pizza new Meatball"
            className="rounded-lg max-h-[217px]"
          />

          <img
            src={ApprovedCool}
            alt="APPROVED COOOL"
            className="rounded-lg  max-h-[217px]"
          />

          <img
            src={OrderYourTaste}
            alt="#order #your #taste"
            className="rounded-lg  max-h-[217px]"
          />
        </div>
      </section>

      {/* Category Navigation */}
      <section className="w-full px-[20px]">
        <div className="flex flex-wrap gap-[8px] w-full">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-[15px] rounded-lg font-medium text-[22px]  hover:bg-[#F0592B] hover:text-white font-semibold transition-colors ${
                activeCategory === category &&
                "bg-[#F0592B] text-white py-[10px]"
              }`}
            >
              {category === "Super sosa" ? (
                <div className="flex items-center gap-[2px]">
                  {category}
                  <img src={FireIcon} alt="Fire" className="w-6 h-6" />
                </div>
              ) : (
                category
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Product List */}
      <section className="px-[20px] pb-24">
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            // <div key={product.id} className="bg-white rounded-lg shadow-sm p-4">
            //   <div className="flex items-center justify-between">
            //     <div className="flex items-center flex-1">
            //       <img
            //         src={product.image}
            //         alt={product.name}
            //         className="w-16 h-16 rounded-lg object-cover mr-4"
            //       />
            //       <div>
            //         <h3 className="text-lg font-semibold text-gray-800">
            //           {product.name}
            //         </h3>
            //       </div>
            //     </div>
            //     <button
            //       onClick={() => addToCart(product)}
            //       className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-bold transition-colors"
            //     >
            //       {product.price.toFixed(2)}€
            //     </button>
            //   </div>
            // </div>
            <div
              key={product.id}
              className="bg-[#FEF4EE] w-full rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center h-full justify-between">
                <div className="flex items-start justify-between w-full h-full gap-[18px]">
                  <div className="p-[10px]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[106px] h-[106px]"
                    />
                  </div>
                  <div className="flex flex-col gap-[25px] items-end h-full p-[20px]">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-[#37B34A] hover:bg-green-600 text-white text-[22px] px-[10px] py-[5px] font-semibold transition-colors -rotate-[5deg] max-h-[41px] flex items-center justify-center"
                    >
                      {product.price.toFixed(2)}€
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fixed Bottom Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F0592B] text-white px-[20px] py-[14px] md:hidden">
        <button
          onClick={onCartClick}
          disabled={cartItems.length === 0}
          className="w-full flex items-center justify-between text-lg font-bold disabled:opacity-50"
        >
          <span className="text-[22px] font-semibold">POROSIA</span>
          <div className="flex items-center gap-[5px]">
            <img
              src={cartIcon}
              alt="Shopping Cart"
              className="w-[32px] h-[32px]"
            />
            <span className="font-semibold text-[22px]">{cartTotal}</span>
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
