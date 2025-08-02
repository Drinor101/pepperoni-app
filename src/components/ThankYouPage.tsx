import React from "react";
import { Clock, MapPin, User, Building } from "lucide-react";
import locationSVG from "../assets/location.svg";
import clockSVG from "../assets/clock.svg";

interface ThankYouPageProps {
  orderData: any;
  onNewOrder: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({
  orderData,
  onNewOrder,
}) => {
  const copyOrderLink = () => {
    const orderLink = `https://pepperoni-pizza.com/order/${orderData.orderNumber}`;
    navigator.clipboard.writeText(orderLink);
    alert("Linku i porosisë u kopjua!");
  };

  const downloadInvoice = () => {
    alert("Fatura po shkarkohet...");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className=" w-full">
        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#F0592B] mb-4">
            FALEMINDERIT PËR POROSINË TUAJ, {orderData.name.toUpperCase()}! ❤️
          </h1>
          <div className="flex items-center justify-center font-bold mb-2 gap-[4px]">
          <img src={clockSVG} alt="clock icon" className="w-[24px] h-[24px]" />

            <span>Do pranoni porosinë brenda 45 minutave</span>
          </div>
          <div className="flex items-center gap-[4px] justify-center font-bold">
          <img src={locationSVG} alt="location icon" className="w-[24px] h-[24px]" />

            <span>{orderData.address}</span>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#f8e7da]  p-8 mb-8 w-fit mx-auto -rotate-[3deg] relative">
          {/* Pizza Icon */}
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🍕</span>
            </div>
          </div>

          {/* Order Number */}
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">Numri i porosisë</div>
            <div className="text-6xl font-bold text-[#37B34A]">
              #{orderData.orderNumber}
            </div>
          </div>

          {/* Order Details Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#F0592B]">
              Detaje të porosisë
            </h2>
          </div>

          {/* Customer and Restaurant Info */}
          <div className="bg-black text-white p-4 mb-6">
            <div className="grid grid-cols-2 gap-[50px]">
              <div>
                <div className="text-sm  mb-1">Klienti</div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{orderData.name}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-end mb-1">Shitësi</div>
                <div className="flex items-center">
                  {/* <Building className="w-4 h-4 mr-2" /> */}
                  <span>Pepperoni Pizza</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2 mb-6  border-b border-[#F0592B] pb-[10px]">
            {orderData.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-bold text-sm">
                  {item.name} <sup>(11)</sup>
                </span>
                <span className="font-bold">
                  {(item.price * item.quantity).toFixed(2)}€
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className=" w-full flex items-end flex-col gap-[4px]">
            <div className="bg-[#F0592B] text-white w-fit  text-center p-[10px] font-bold text-lg">
              TOTALI: {orderData.total}
            </div>
            <p className="font-bold">VETËM KESH</p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center sm:flex-row gap-4 mb-8 mt-[60px] mx-auto">
          <button
            onClick={copyOrderLink}
            className=" bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-8  transition-colors"
          >
            Kopjo linkun e porosisë
          </button>
          <button
            onClick={downloadInvoice}
            className=" bg-[#37B34A] hover:bg-green-600 text-white font-bold py-4 px-8  transition-colors"
          >
            Shkarko faturën
          </button>
        </div>

        {/* New Order Button */}
        {/* <div className="text-center">
          <button
            onClick={onNewOrder}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Porosit Përsëri
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ThankYouPage;
