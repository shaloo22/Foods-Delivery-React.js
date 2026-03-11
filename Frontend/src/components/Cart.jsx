import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaShoppingBag } from "react-icons/fa";
import ItemCard from "./ItemCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaTicketAlt } from "react-icons/fa";

const AddressSelector = React.lazy(() => import("./AddressSelector"));

const Cart = () => {
  const [activeCart, setActiveCart] = useState(false);

  const cartItems = useSelector((state) => state.cart.cart);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);

  useEffect(() => {
    if (activeCart) {
      document.body.classList.add('hide-chatbot');
    } else {
      document.body.classList.remove('hide-chatbot');
    }
    return () => document.body.classList.remove('hide-chatbot');
  }, [activeCart]);

  const totalQty = cartItems.reduce((totalQty, item) => totalQty + item.qty, 0);
  const subTotal = cartItems.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (code === "CHASKA20") {
      setDiscount(subTotal * 0.20);
      toast.success("Promo Applied! 20% Discounted.");
    } else if (code === "MAGIC100" && subTotal >= 500) {
      setDiscount(100);
      toast.success("Promo Applied! ₹100 Discounted.");
    } else if (code === "") {
      toast.error("Please enter a code");
    } else {
      toast.error("Invalid or inapplicable code");
      setDiscount(0);
    }
  };

  const totalPrice = subTotal - discount;

  const navigate = useNavigate();

  const handleCheckout = () => {
    let user = null;
    try { user = JSON.parse(localStorage.getItem("user")); } catch (e) { }

    if (!user || !user.token) {
      navigate("/login");
      return;
    }

    if (!shippingAddress) {
      setShowAddressModal(true);
      return;
    }

    navigate("/success", { state: { totalPrice, cartItems, shippingAddress } });
  };

  return (
    <>
      <div
        className={`fixed right-0 top-0 w-full sm:w-[380px] lg:w-[22vw] h-full p-4 sm:p-5 bg-white mb-3 ${activeCart ? "translate-x-0" : "translate-x-full"
          } transition-all duration-500 z-50 overflow-y-auto`}
      >
        <div className="flex justify-between items-center my-3">
          <span className="text-xl font-bold text-gray-800">My Order</span>
          <IoMdClose
            onClick={() => setActiveCart(!activeCart)}
            className="border-2 border-gray-600 text-gray-600 font-bold  p-1 text-xl  rounded-md hover:text-red-300 hover:border-red-300 cursor-pointer"
          />
        </div>

        {cartItems.length > 0 ? (
          cartItems.map((food) => {
            return (
              <ItemCard
                key={food.id}
                id={food.id}
                name={food.name}
                price={food.price}
                img={food.img}
                qty={food.qty}
              />
            );
          })
        ) : (
          <h2 className="text-center text-xl font-bold text-gray-800">
            Your cart is empty
          </h2>
        )}

        <div className="absolute bottom-0 w-full pr-10">
          {/* Promo Code Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <button
              onClick={handleApplyPromo}
              className="bg-gray-800 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all"
            >
              Apply
            </button>
          </div>

          <div className="space-y-1 mb-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">₹{subTotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span className="flex items-center gap-1"><FaTicketAlt size={12} /> Discount</span>
                <span className="font-semibold">-₹{discount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2 text-orange-600">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(0)}</span>
            </div>
          </div>

          <hr className="my-2" />
          <button
            onClick={handleCheckout}
            className="bg-orange-500 hover:bg-orange-600 transition-all font-bold px-3 text-white py-3 rounded-xl w-full mb-5 shadow-lg shadow-orange-200 active:scale-95 flex items-center justify-center gap-2"
          >
            Checkout <FaShoppingBag size={18} />
          </button>

        </div>
      </div>

      <div
        onClick={() => setActiveCart(!activeCart)}
        className={`fixed bottom-4 right-4 w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xl cursor-pointer transition-all hover:scale-105 active:scale-95 z-50 ${totalQty > 0 && "animate-bounce"
          }`}
      >
        <FaShoppingBag size={28} />
        {totalQty > 0 && (
          <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {totalQty}
          </span>
        )}
      </div>
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
            >
              <IoMdClose size={24} />
            </button>
            <h2 className="text-2xl font-black text-gray-800 mb-6 mt-2">Delivery Details</h2>

            <React.Suspense fallback={<div className="h-40 bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">Loading Address Map...</div>}>
              <AddressSelector onAddressSelect={(addr) => setShippingAddress(addr)} />
            </React.Suspense>

            <button
              onClick={handleCheckout}
              disabled={!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.pincode}
              className={`w-full mt-8 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2
                ${(shippingAddress?.address && shippingAddress?.city && shippingAddress?.pincode)
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              Confirm & Pay ₹{totalPrice.toFixed(0)}
            </button>
          </div>
        </div>
      )}

    </>
  );
};

export default Cart;
