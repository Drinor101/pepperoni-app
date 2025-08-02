import React, { useState } from "react";
import { MapPin, Clock, X } from "lucide-react";
import pepperoniLogo from "../assets/pepperoni-test 1 (1).svg";
import Cart from "./Cart";
import cartIcon from "../assets/Frame.svg";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutPageProps {
  onBack: () => void;
  onOrderComplete: (orderData: any) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, newQuantity: number) => void;
  removeFromCart: (id: string) => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  formatPrice: (price: number) => string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBack,
  onOrderComplete,
  cartItems,
  updateQuantity,
  removeFromCart,
  subtotal,
  deliveryFee,
  total,
  formatPrice,
}) => {
  const [formData, setFormData] = useState({
    name: "Blerjan Gashi",
    address: "Bajram Kelmendi Nr.20",
    phone: "049500600",
    email: "support@pepperoni-ks.com",
    notes: "",
    createAccount: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOrderComplete(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="shadow-lg bg-[#37B34A] h-[86px] flex items-center justify-between w-full">
        <div className="flex items-center w-full justify-between">
          {/* <button onClick={onBack} className="text-white hover:text-gray-200">
            ← Back
          </button> */}
          <div className="flex items-center pt-[30px] pl-[20px]">
            <img
              src={pepperoniLogo}
              alt="Pepperoni Pizza Logo"
              onClick={onBack}
              className="h-[103px] w-[180px]  cursor-pointer"
            />
          </div>
          <div className="flex items-center space-x-2 rounded-md px-3 py-1.5 backdrop-blur-sm">
            <img
              src={cartIcon}
              alt="Shopping Cart"
              className="w-[50px] h-[50px]"
            />
            <span className="text-white font-semibold text-[34px]">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row p-6 gap-8 2xl:container 2xl:mx-auto mt-[30px]">
        {/* Checkout Form */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Të dhënat e porosisë
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-2 border border-gray-300 rounded-lg">
              <label className="block text-sm font-medium opacity-40 mb-[2px]">
                Emri *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            <div className="p-2 border border-gray-300 rounded-lg ">
              <label className="block text-sm font-medium opacity-40 mb-[2px]">
                Rruga *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            <div className="p-2 border border-gray-300 rounded-lg">
              <label className="block text-sm font-medium opacity-40 mb-[2px]">
                Telefon (opsionale)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="p-2 border border-gray-300 rounded-lg">
              <label className="block text-sm font-medium opacity-40 mb-[2px]">
                Adresë email (opsionale)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full  outline-none"
              />
            </div>

            <div className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <label className="block text-sm font-medium opacity-40 mb-[2px]">
                Shënime porosie (opsionale)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full outline-none "
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="createAccount"
                checked={formData.createAccount}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <label className="ml-2 text-sm font-bold">
                Të krijohet një llogari?
              </label>
            </div>

            <button
              type="submit"
              disabled={cartItems.length === 0}
              className="w-full bg-[#F0592B] hover:bg-orange-600 text-white font-bold py-4 px-6 text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              POROSIT TANI
            </button>
          </form>
        </div>

        {/* Cart Summary */}

        <Cart
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          formatPrice={formatPrice}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
