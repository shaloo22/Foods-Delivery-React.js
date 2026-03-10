import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setSearch } from "../slices/SearchSlice";
import { useNavigate } from "react-router-dom";
import { FaBell, FaBars, FaTimes, FaShoppingBag, FaUser, FaSignOutAlt, FaMoon, FaSun, FaHome } from "react-icons/fa";
import DeliveryAnimation from "./DeliveryAnimation";
import API from "../api";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const notifRef = useRef(null);

    // Dark Mode Theme Setup
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
        user = null;
    }

    // Fetch recent orders for notifications
    useEffect(() => {
        if (!user?.token) return;
        const fetchOrders = async () => {
            try {
                const { data } = await API.get("orders/myorders");
                const deliveredOrders = data.filter(order => order.status === 'Delivered');
                const notifs = deliveredOrders.slice(0, 5).map((order) => ({
                    id: order._id,
                    message: `Order #${order._id.slice(-6)} — ${order.status}`,
                    time: new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                    }),
                    status: order.status,
                    amount: order.totalPrice,
                }));
                setNotifications(notifs);
                // Count recent delivered orders as "unread"
                setUnread(notifs.length);
            } catch (e) {
                // Not logged in or no orders
            }
        };
        fetchOrders();
    }, []);

    // Close notification panel on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-blue-500';
            case 'Preparing': return 'text-orange-500';
            case 'Delivered': return 'text-green-500';
            case 'Cancelled': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const statusEmoji = (status) => {
        switch (status) {
            case 'Pending': return '🕐';
            case 'Preparing': return '🍳';
            case 'Delivered': return '✅';
            case 'Cancelled': return '❌';
            default: return '📦';
        }
    };

    return (
        <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                <div className="flex items-center justify-between gap-3">

                    {/* Logo */}
                    <div
                        className="cursor-pointer flex-shrink-0"
                        onClick={() => navigate("/")}
                    >
                        <p className="text-[10px] sm:text-xs font-semibold text-orange-400 uppercase tracking-widest hidden sm:block">
                            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-orange-500 bg-clip-text text-transparent">
                            Chaska Foods
                        </h1>
                    </div>

                    {/* Search — desktop */}
                    <div className="relative hidden sm:block flex-1 max-w-xs lg:max-w-sm">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            placeholder="Search food..."
                            autoComplete="off"
                            onChange={(e) => dispatch(setSearch(e.target.value))}
                            className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-2xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm shadow-sm"
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2.5 bg-gray-50 text-gray-500 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all font-bold"
                            title="Toggle Theme"
                        >
                            {darkMode ? <FaSun className="text-orange-400" size={16} /> : <FaMoon size={16} />}
                        </button>

                        {/* Home Desktop Button */}
                        <button
                            onClick={() => navigate("/")}
                            className="hidden lg:flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all border border-gray-100 text-sm whitespace-nowrap"
                        >
                            <FaHome size={14} /> Home
                        </button>

                        {/* Notification Bell */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => { setShowNotifications(!showNotifications); setUnread(0); }}
                                className="relative p-2.5 bg-gray-50 text-gray-400 rounded-2xl border border-gray-100 cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition-all"
                            >
                                <FaBell size={16} />
                                {unread > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                                        {unread}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="p-4 bg-orange-50 border-b border-orange-100">
                                        <h3 className="font-bold text-gray-800 text-sm">🔔 Order Notifications</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Your recent order updates</p>
                                    </div>
                                    {notifications.length === 0 ? (
                                        <div className="p-6 text-center text-gray-400 text-sm">
                                            <FaShoppingBag className="mx-auto mb-2 text-gray-200" size={28} />
                                            No orders yet. Start ordering!
                                        </div>
                                    ) : (
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => { navigate("/my-orders"); setShowNotifications(false); }}
                                                    className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors"
                                                >
                                                    <span className="text-lg flex-shrink-0">{statusEmoji(n.status)}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-700">Order #{n.id.slice(-6)}</p>
                                                        <p className={`text-xs font-semibold ${statusColor(n.status)}`}>{n.status}</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">₹{n.amount} • {n.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="p-3 border-t border-gray-100">
                                        <button
                                            onClick={() => { navigate("/my-orders"); setShowNotifications(false); }}
                                            className="w-full py-2 text-center text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            View All Orders →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* My Orders — desktop only */}
                        <button
                            onClick={() => navigate("/my-orders")}
                            className="hidden lg:block px-4 py-2.5 bg-orange-50 text-orange-600 font-bold rounded-2xl hover:bg-orange-500 hover:text-white transition-all border border-orange-100 text-sm whitespace-nowrap"
                        >
                            My Orders
                        </button>

                        {/* Login / User — desktop */}
                        {user ? (
                            <div className="relative hidden lg:block">
                                <button
                                    onClick={() => setShowLogout(!showLogout)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all border border-gray-200 text-sm whitespace-nowrap"
                                >
                                    <FaUser size={12} /> {user.name?.split(' ')[0] || "User"}
                                </button>
                                {showLogout && (
                                    <button
                                        onClick={handleLogout}
                                        className="absolute top-14 right-0 z-50 flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all border border-red-100 text-sm whitespace-nowrap shadow-xl"
                                    >
                                        <FaSignOutAlt /> Logout
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="hidden lg:block px-4 py-2.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-md text-sm whitespace-nowrap"
                            >
                                Login
                            </button>
                        )}

                        {/* Hamburger — mobile only */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 bg-gray-100 rounded-2xl text-gray-600 border border-gray-200"
                        >
                            {mobileMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="sm:hidden mt-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            placeholder="Search food..."
                            autoComplete="off"
                            onChange={(e) => dispatch(setSearch(e.target.value))}
                            className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-2xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm shadow-sm"
                        />
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-3 pb-3 border-t border-gray-100 pt-3 space-y-2">
                        <button
                            onClick={() => { navigate("/"); setMobileMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 transition-all border border-gray-100 text-sm"
                        >
                            <FaHome /> Back to Home
                        </button>
                        <button
                            onClick={() => { navigate("/my-orders"); setMobileMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 font-bold rounded-2xl hover:bg-orange-500 hover:text-white transition-all border border-orange-100 text-sm"
                        >
                            <FaShoppingBag /> My Orders
                        </button>
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all border border-red-100 text-sm"
                            >
                                <FaSignOutAlt /> Logout ({user.name?.split(' ')[0] || "User"})
                            </button>
                        ) : (
                            <button
                                onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all text-sm"
                            >
                                <FaUser /> Login
                            </button>
                        )}
                    </div>
                )}
            </div>
            <DeliveryAnimation />
        </nav>
    );
};

export default Navbar;
