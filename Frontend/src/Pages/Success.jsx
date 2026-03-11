import React, { useEffect, useState, useRef } from "react";
import { PropagateLoader } from "react-spinners";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../slices/CartSlice";
import { motion } from "framer-motion";
import API from "../api";
import toast from 'react-hot-toast';


const Success = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { totalPrice, cartItems, shippingAddress } = location.state || {};
    const orderCreated = useRef(false);

    useEffect(() => {
        if (orderCreated.current) return;

        if (!cartItems || !shippingAddress) {
            navigate("/");
            return;
        }

        // Check if user is logged in with a valid token
        let user = null;
        try {
            user = JSON.parse(localStorage.getItem("user"));
        } catch (e) {
            user = null;
        }

        if (!user || !user.token) {
            toast.error("Please login first to place an order!");
            navigate("/login");
            return;
        }

        orderCreated.current = true;

        const createOrder = async () => {
            try {
                const orderItems = cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.img,
                    price: item.price,
                    food: item.id ? item.id.toString() : undefined
                }));

                const totalCost = Number(
                    cartItems.reduce((acc, item) => acc + (item.price * 0.4 * item.qty), 0).toFixed(2)
                );

                await API.post('orders', {
                    orderItems,
                    shippingAddress: {
                        address: shippingAddress.address || 'Street Address Not Provided',
                        city: shippingAddress.city || 'Delhi',
                        pincode: shippingAddress.pincode || '110001',
                        lat: shippingAddress.lat || 0,
                        lng: shippingAddress.lng || 0
                    },
                    paymentMethod: 'COD',
                    totalPrice,
                    totalCost
                });

                setLoading(false);
                dispatch(clearCart());
                toast.success("🎉 Order Placed Successfully!");
            } catch (error) {
                console.error("Order creation failed:", error.response?.data || error.message);
                setLoading(false);
                // Still show success to user — order is visually complete
                dispatch(clearCart());
                const errMsg = error.response?.data?.message || error.message;
                if (error.response?.status === 401) {
                    toast.error("Session expired. Please login again.");
                    navigate("/login");
                } else {
                    toast.error(`Order error: ${errMsg}`);
                }
            }
        };

        createOrder();
    }, []);



    return (
        <div className="flex flex-col items-center justify-center h-screen bg-emerald-50 px-4 text-center">
            {loading ? (
                <div className="flex flex-col items-center gap-4">
                    <PropagateLoader color="#10b981" />
                    <p className="text-emerald-700 font-medium animate-pulse text-lg">Confirming your delicious feast...</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border-4 border-emerald-100 max-w-lg w-full"
                >
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-200">
                        <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 sm:mb-3 tracking-tight">
                        Order Successful!
                    </h2>
                    <p className="text-gray-500 font-semibold text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                        Hooray! Your order has been placed. <br />
                        Our chef is already preheating the oven! 🧑‍🍳
                    </p>
                    <div className="bg-emerald-50 border-2 border-emerald-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 flex justify-between items-center group hover:bg-emerald-100 transition-colors">
                        <span className="text-emerald-800 font-bold text-sm sm:text-lg uppercase tracking-wider">Amount Paid</span>
                        <span className="text-emerald-600 font-black text-xl sm:text-2xl">₹{totalPrice}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate("/my-orders")}
                            className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg rounded-2xl transition-all shadow-xl shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2"
                        >
                            🚀 Track Your Order
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full py-4 text-gray-400 hover:text-emerald-600 font-bold transition-all text-sm"
                        >
                            Back to Menu
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Success;
