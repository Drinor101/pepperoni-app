import React from "react";
import { MapPin, Clock } from "lucide-react";
import porosiaJuajSVG from "../assets/porosia-juaj.svg";
import locationSVG from "../assets/location.svg";
import clockSVG from "../assets/clock.svg";
import porositDickaSVG from "../assets/porosit-dicka.svg";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, newQuantity: number) => void;
  removeFromCart: (id: string) => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  formatPrice: (price: number) => string;
  onCheckout: () => void;
  showCoupon?: boolean;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  subtotal,
  deliveryFee,
  total,
  formatPrice,
  onCheckout,
  showCoupon,
}) => {
  return (
    <div className="bg-white rounded-[8px] max-h-[720px] h-fit overflow-hidden w-full max-w-[390px] border-2 border-[#F0592B] pt-[38px]  shadow-lg flex flex-col">
      <img src={porosiaJuajSVG} alt="porosia juaj" className="mx-auto" />

      <div className="pt-[14px]">
        <div className="flex items-center justify-center gap-[4px]">
          <img src={locationSVG} alt="location icon" />
          <span className="font-semibold text-[22px]">PEPPERONI - ARBËRI</span>
        </div>
        <div className="flex items-center justify-center gap-[2px]">
          <img src={clockSVG} alt="clock icon" />
          <span className="text-[18px] font-semibold">09:30 - 01:45</span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 px-[21px] max-h-[300px] overflow-auto mt-[14px]">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Shporta është bosh</p>
            <p className="text-sm">Shto produkte për të vazhduar</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="bg-[#FEF4EE] rounded-lg">
              <div className="flex gap-[16px]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[102px] h-[102px] -rotate-[3deg] -mt-[2px] ml-[3px]"
                />
                <div className="flex flex-col gap-[20px] py-[20px] pr-[15px] w-full">
                  <h3 className="font-semibold text-[18px]">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-[8px] text-base">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                      <p className="font-semibold text-[#FF7B1F]">
                        {item.quantity}
                      </p>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                    </div>
                    <div className="px-[10px] max-h-[30px] flex items-center py-[5px] font-semibold text-[18px] bg-[#37B34A] w-fit rotate-[-5deg] text-white">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-orange-500 font-bold text-lg hover:text-orange-600"
                  >
                    +
                  </button>
                  <span className="font-bold text-orange-500">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-gray-400 font-bold text-lg hover:text-gray-600"
                  >
                    −
                  </button>
                </div>
                <div className="bg-green-500 text-white px-3 py-1 rounded font-bold">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div> */}
            </div>
          ))
        )}
      </div>

      {/* Coupon Section */}
      {showCoupon && (
        <div className="px-[21px] w-full flex gap-[4px] mt-4">
          <input placeholder="Vendos kuponin" className="border p-2 w-full" />
          <button className="p-2 bg-black text-white px-8">Apliko</button>
        </div>
      )}

      {/* Total Section */}
      <div className="flex flex-col items-end w-full px-[21px] pb-[50px] mt-[14px]">
        <div className="text-2xl font-bold text-black italic">
          TOTALI: {formatPrice(total)}
        </div>
        <div className="text-base font-medium text-[#211E1F] italic">
          Delivery: {formatPrice(deliveryFee)}
        </div>
      </div>

      {/* Order Button */}
      <div className="h-[67px] bg-[#F0592B] w-full relative">
        <button onClick={onCheckout} disabled={cartItems.length === 0}>
          <img
            src={porositDickaSVG}
            alt="porosit dicka icon"
            className="absolute left-[50px] w-[265px] max-w-[265px] max-h-[62px] -top-[30px]"
          />
        </button>
      </div>
    </div>
  );
};

export default Cart;
