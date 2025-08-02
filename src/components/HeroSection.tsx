import React, { useState } from "react";
import PizzaMeatball from "../assets/pizza-meatball.jpg";
import ApprovedCool from "../assets/approved-cool.jpg";
import OrderYourTaste from "../assets/order-your-taste.jpg";
import FireIcon from "../assets/fire.svg";
import BeefBurger from "../assets/hebs-beef-burger.png";
import SandwichMix from "../assets/sandwich-mix.png";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface HeroSectionProps {
  addToCart: (item: CartItem) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState("New offers!");

  const categories = [
    "New offers!",
    "Pizza",
    "Sandwich",
    "Samun",
    "Super sosa",
    "Pije freskuese",
    "Qipsa",
  ];

  const products = [
    {
      id: "1",
      name: "Hamburger Classic",
      price: 2.5,
      image: BeefBurger,
      category: "New offers!",
    },
    {
      id: "2",
      name: "Sandwich Mix",
      price: 2.5,
      image: SandwichMix,
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
      name: "Pizza Pepperoni",
      price: 4.0,
      image:
        "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
      category: "Pizza",
    },
    {
      id: "5",
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
    <main className="min-h-screen flex flex-col gap-[13px] w-full">
      {/* Hero Images Section */}

      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
          {/* Pizza new Meatball Card */}
          <img
            src={PizzaMeatball}
            alt="Pizza new Meatball"
            className="rounded-lg"
          />

          {/* APPROVED COOOL Card */}
          <img src={ApprovedCool} alt="APPROVED COOOL" className="rounded-lg" />

          <img
            src={OrderYourTaste}
            alt="#order #your #taste"
            className="rounded-lg"
          />
        </div>
      </section>

      {/* Menu Section */}
      <section className="container mx-auto w-full">
        <div className="flex flex-col gap-[12px] w-full">
          {/* Category Navigation */}
          <div className="flex flex-wrap gap-[8px]">
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

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[419px_420px] gap-[20px] w-full">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#FEF4EE] h-[156px] w-fit rounded-lg w-full shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center h-full justify-between">
                  <div className="flex items-start justify-between w-full h-full gap-[40px]">
                    <div className="p-[10px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[136px] h-[136px]"
                      />
                    </div>
                    <div className="flex flex-col gap-[25px] items-end h-full p-[20px]">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h3>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-[#37B34A] hover:bg-green-600 text-white text-[24px] px-[10px] py-[5px] font-semibold transition-colors -rotate-[5deg] max-h-[41px] flex items-center justify-center"
                      >
                        {product.price.toFixed(2)}€
                      </button>
                    </div>
                  </div>
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
