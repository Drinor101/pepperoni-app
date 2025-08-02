import React, { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Cart from "./components/Cart";
import MobileLayout from "./components/MobileLayout";
import CheckoutPage from "./components/CheckoutPage";
import ThankYouPage from "./components/ThankYouPage";

type AppState = "home" | "checkout" | "thankyou";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>("home");
  const [orderData, setOrderData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Listen for window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add item to cart
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 1.0;
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => `${price.toFixed(2)}€`;

  const handleCartClick = () => {
    if (cartItems.length === 0) {
      alert("Shto produkte në shportë për të vazhduar!");
      return;
    }
    setCurrentPage("checkout");
  };

  const handleOrderComplete = (data: any) => {
    const orderData = {
      ...data,
      orderNumber: Math.floor(Math.random() * 100) + 600,
      total: formatPrice(total),
      subtotal: formatPrice(subtotal),
      deliveryFee: formatPrice(deliveryFee),
      items: cartItems,
    };
    setOrderData(orderData);
    setCurrentPage("thankyou");
  };

  const handleNewOrder = () => {
    setCurrentPage("home");
    setOrderData(null);
    setCartItems([]);
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
  };

  // Render based on current page
  if (currentPage === "checkout") {
    return (
      <CheckoutPage
        onBack={handleBackToHome}
        onOrderComplete={handleOrderComplete}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        formatPrice={formatPrice}
      />
    );
  }

  if (currentPage === "thankyou" && orderData) {
    return <ThankYouPage orderData={orderData} onNewOrder={handleNewOrder} />;
  }

  // Home page
  return (
    <div className="min-h-screen w-full">
      {/* Mobile Layout */}
      {isMobile ? (
        <MobileLayout
          cartTotal={formatPrice(total)}
          onCartClick={handleCartClick}
          addToCart={addToCart}
          cartItems={cartItems}
        />
      ) : (
        /* Desktop Layout */
        <>
          <Navbar cartTotal={formatPrice(total)} />
          <div className="2xl:container 2xl:mx-auto grid md:grid-cols-[1fr_393px] gap-[32px] py-[40px] px-[20px]">
            <HeroSection addToCart={addToCart} />
            <div className="flex flex-col gap-[50px]">

            <Cart
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              formatPrice={formatPrice}
              onCheckout={handleCartClick}
            />
            <Cart
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              formatPrice={formatPrice}
              onCheckout={handleCartClick}
              showCoupon
            />
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default App;
