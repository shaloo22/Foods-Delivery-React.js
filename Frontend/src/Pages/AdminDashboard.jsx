import React, { useState, useEffect, useRef } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { FaBox, FaUsers, FaArrowUp, FaArrowDown, FaUtensils, FaWallet, FaTimesCircle, FaPlus, FaEdit, FaTrash, FaBullhorn, FaGift, FaFireAlt, FaTag } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import API from '../api';
import FoodData from '../data/FoodData';
import PromoFlyer from '../components/PromoFlyer';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProfit: 0,
        totalUsers: 0
    });
    const [chartData, setChartData] = useState([]);
    const [orders, setOrders] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFoodForm, setShowFoodForm] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [foodFormData, setFoodFormData] = useState({
        name: '', price: '', image: '', category: '', rating: 4.5, costPrice: ''
    });
    const [promos, setPromos] = useState([]);
    const [showPromoForm, setShowPromoForm] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const [promoFormData, setPromoFormData] = useState({
        title: '', subtitle: '', code: '', iconType: 'Gift', bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', image: ''
    });
    const [showAllFoods, setShowAllFoods] = useState(false);
    const [timeRange, setTimeRange] = useState('7d');
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

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

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [statsRes, ordersRes, foodsRes, promosRes] = await Promise.all([
                    API.get(`dashboard/stats?range=${timeRange}`),
                    API.get('orders'),
                    API.get('foods'),
                    API.get('promotions')
                ]);

                setStats({
                    totalOrders: statsRes.data.totalOrders,
                    totalRevenue: statsRes.data.totalRevenue,
                    totalProfit: statsRes.data.totalProfit,
                    totalUsers: statsRes.data.totalUsers
                });
                setPromos(promosRes.data);

                // Sound notification logic
                if (ordersRes.data.length > orders.length && orders.length > 0) {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                    audio.play().catch(e => console.log("Audio play blocked"));
                    toast.success("🔔 New Order Received!", {
                        duration: 5000,
                        style: { background: '#f472b6', color: '#fff', fontWeight: 'bold' }
                    });
                }

                setChartData(statsRes.data.dailyStats);
                setOrders(ordersRes.data);
                setFoods(foodsRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching admin data", error);
                setLoading(false);
                if (error.response?.status === 401) {
                    toast.error("Admin session expired or unauthorized. Please login.");
                    window.location.href = '/login';
                }
            }
        };
        fetchAllData();
    }, [timeRange]);

    const handleFoodSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFood) {
                const { data } = await API.put(`foods/${editingFood._id}`, foodFormData);
                setFoods(foods.map(f => f._id === editingFood._id ? data : f));
                toast.success("Food updated successfully!");
            } else {
                const { data } = await API.post('foods', foodFormData);
                setFoods([...foods, data]);
                toast.success("New food added!");
            }
            setShowFoodForm(false);
            setEditingFood(null);
            setFoodFormData({ name: '', price: '', image: '', category: '', rating: 4.5, costPrice: '' });
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleDeleteFood = async (id) => {
        if (window.confirm('Delete this item?')) {
            try {
                await API.delete(`foods/${id}`);
                setFoods(foods.filter(f => f._id !== id));
                toast.success("Item removed");
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    const handlePromoSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPromo) {
                const { data } = await API.put(`promotions/${editingPromo._id}`, promoFormData);
                setPromos(promos.map(p => p._id === editingPromo._id ? data : p));
                toast.success("Flyer updated!");
            } else {
                const { data } = await API.post('promotions', promoFormData);
                setPromos([...promos, data]);
                toast.success("New flyer added!");
            }
            setShowPromoForm(false);
            setEditingPromo(null);
            setPromoFormData({
                title: '', subtitle: '', code: '', iconType: 'Gift', bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', image: ''
            });
        } catch (error) {
            toast.error("Promo update failed");
        }
    };

    const handleDeletePromo = async (id) => {
        if (window.confirm('Delete this flyer?')) {
            try {
                await API.delete(`promotions/${id}`);
                setPromos(promos.filter(p => p._id !== id));
                toast.success("Flyer removed");
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await API.put(`orders/${id}/status`, { status });
            setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
            toast.success(`Order #${id.slice(-4)} marked as ${status}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const handleCancelOrder = async (id) => {
        if (window.confirm('Cancel this order?')) {
            try {
                await API.put(`orders/${id}/cancel`);
                setOrders(orders.map(o => o._id === id ? { ...o, status: 'Cancelled' } : o));
                toast.success(`Order #${id.slice(-4)} cancelled successfully`);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to cancel order");
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-orange-500 italic">Connecting to business database...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 leading-tight">Control Center</h1>
                        <p className="text-gray-400 text-[10px] sm:text-sm font-medium">Real-time business insights</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="relative" ref={notifRef}>
                            <div
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 sm:p-2.5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all group"
                            >
                                <FaBullhorn className="text-pink-500 group-hover:scale-110 transition-transform text-sm sm:text-base" />
                                {orders.filter(o => o.status === 'Pending').length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] sm:text-[10px] text-white font-bold">
                                        {orders.filter(o => o.status === 'Pending').length}
                                    </span>
                                )}
                            </div>

                            {showNotifications && (
                                <div className="absolute right-[-10px] sm:right-0 top-full mt-3 w-[calc(100vw-40px)] max-w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="p-3 sm:p-4 bg-pink-50 border-b border-pink-100">
                                        <h3 className="font-bold text-gray-800 text-xs sm:text-sm">🔔 Action Required</h3>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Pending orders waiting to be prepared</p>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {orders.filter(o => o.status === 'Pending').length === 0 ? (
                                            <div className="p-6 text-center text-gray-400 text-sm">
                                                No pending orders.
                                            </div>
                                        ) : (
                                            orders.filter(o => o.status === 'Pending').map((order) => (
                                                <div
                                                    key={order._id}
                                                    onClick={() => setShowNotifications(false)}
                                                    className="flex flex-col gap-1 p-3 hover:bg-gray-50 border-b border-gray-50 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-xs font-bold text-gray-700">Order #{order._id.slice(-6)}</p>
                                                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold tracking-wider">NEW</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 font-medium">{order.user?.name || 'Guest'} • {order.orderItems.length} items • ₹{order.totalPrice}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 px-2 sm:ml-6 text-center sm:text-left">Live Flyer Preview (Customer View)</h3>
                    <PromoFlyer />
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Orders" value={stats.totalOrders} icon={<FaBox />} trend="+12%" color="bg-blue-500" />
                    <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={<FaWallet />} trend="+18%" color="bg-orange-500" />
                    <StatCard title="Total Profit" value={`₹${stats.totalProfit}`} icon={<FaArrowUp />} trend="+5%" color="bg-green-500" />
                    <StatCard title="Active Users" value={stats.totalUsers} icon={<FaUsers />} trend="+8%" color="bg-purple-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Revenue Overview</h3>
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="bg-gray-100 border-none rounded-lg px-3 py-1.5 text-xs font-bold outline-none cursor-pointer text-orange-600"
                            >
                                <option value="7d">Last 7 Days</option>
                                <option value="1m">Last 1 Month</option>
                                <option value="3m">Last 3 Months</option>
                                <option value="6m">Last 6 Months</option>
                            </select>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Order Growth</h3>
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="bg-gray-100 border-none rounded-lg px-3 py-1.5 text-xs font-bold outline-none cursor-pointer text-blue-600"
                            >
                                <option value="7d">Last 7 Days</option>
                                <option value="1m">Last 1 Month</option>
                                <option value="3m">Last 3 Months</option>
                                <option value="6m">Last 6 Months</option>
                            </select>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* --- PROMOTIONAL FLYER CMS --- */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaBullhorn className="text-pink-500" /> Promotional Flyer CMS
                        </h3>
                        <button
                            onClick={() => {
                                setEditingPromo(null);
                                setPromoFormData({
                                    title: '', subtitle: '', code: '', iconType: 'Gift', bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', image: ''
                                });
                                setShowPromoForm(true);
                            }}
                            className="bg-pink-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-pink-600 transition-all shadow-md shadow-pink-100"
                        >
                            <FaPlus /> Add New Flyer
                        </button>
                    </div>

                    {showPromoForm && (
                        <div className="mb-8 p-6 bg-pink-50/30 rounded-2xl border border-pink-100">
                            <h4 className="font-bold mb-4 text-pink-700">{editingPromo ? 'Edit Flyer' : 'Add New Flyer'}</h4>
                            <form onSubmit={handlePromoSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    placeholder="Main Title (e.g. 20% OFF)"
                                    value={promoFormData.title}
                                    onChange={e => setPromoFormData({ ...promoFormData, title: e.target.value })}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-sm md:col-span-2"
                                    required
                                />
                                <input
                                    placeholder="Promo Code"
                                    value={promoFormData.code}
                                    onChange={e => setPromoFormData({ ...promoFormData, code: e.target.value })}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-sm"
                                    required
                                />
                                <input
                                    placeholder="Subtitle/Details"
                                    value={promoFormData.subtitle}
                                    onChange={e => setPromoFormData({ ...promoFormData, subtitle: e.target.value })}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-sm md:col-span-2"
                                    required
                                />
                                <input
                                    placeholder="Image URL (Optional)"
                                    value={promoFormData.image}
                                    onChange={e => setPromoFormData({ ...promoFormData, image: e.target.value })}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-sm"
                                />
                                <select
                                    value={promoFormData.iconType}
                                    onChange={e => setPromoFormData({ ...promoFormData, iconType: e.target.value })}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-sm"
                                >
                                    <option value="Gift">Icon: Gift</option>
                                    <option value="Fire">Icon: Fire</option>
                                    <option value="Tag">Icon: Tag</option>
                                </select>
                                <select
                                    value={`${promoFormData.bg}|${promoFormData.border}|${promoFormData.text}`}
                                    onChange={e => {
                                        const [bg, border, text] = e.target.value.split('|');
                                        setPromoFormData({ ...promoFormData, bg, border, text });
                                    }}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-sm"
                                >
                                    <option value="bg-pink-50|border-pink-100|text-pink-700">Theme: Pink Delight</option>
                                    <option value="bg-orange-50|border-orange-100|text-orange-700">Theme: Sunset Orange</option>
                                    <option value="bg-blue-50|border-blue-100|text-blue-700">Theme: Ocean Blue</option>
                                    <option value="bg-emerald-50|border-emerald-100|text-emerald-700">Theme: Fresh Emerald</option>
                                    <option value="bg-amber-50|border-amber-100|text-amber-700">Theme: Golden Amber</option>
                                    <option value="bg-indigo-50|border-indigo-100|text-indigo-700">Theme: Royal Indigo</option>
                                </select>

                                <div className="flex gap-2 md:col-span-3">
                                    <button type="submit" className="flex-1 bg-pink-600 text-white p-3 rounded-xl font-bold hover:bg-pink-700 transition-all">
                                        {editingPromo ? 'Update Flyer' : 'Go Live'}
                                    </button>
                                    <button type="button" onClick={() => setShowPromoForm(false)} className="px-5 bg-white border border-gray-200 rounded-xl font-bold hover:bg-gray-100">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promos.map((promo, i) => (
                            <div key={i} className={`p-5 rounded-2xl border ${promo.border} ${promo.bg} group relative overflow-hidden`}>
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        {promo.iconType === 'Fire' ? <FaFireAlt className="text-orange-500" /> :
                                            promo.iconType === 'Tag' ? <FaTag className="text-blue-500" /> :
                                                <FaGift className="text-pink-500" />}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => {
                                            setEditingPromo(promo);
                                            setPromoFormData({
                                                title: promo.title,
                                                subtitle: promo.subtitle,
                                                code: promo.code,
                                                iconType: promo.iconType,
                                                bg: promo.bg,
                                                border: promo.border,
                                                text: promo.text,
                                                image: promo.image || ''
                                            });
                                            setShowPromoForm(true);
                                        }} className="p-1.5 bg-white rounded-lg text-blue-500 shadow-sm hover:scale-110"><FaEdit size={14} /></button>
                                        <button onClick={() => handleDeletePromo(promo._id)} className="p-1.5 bg-white rounded-lg text-red-500 shadow-sm hover:scale-110"><FaTrash size={14} /></button>
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <h4 className={`font-bold ${promo.text}`}>{promo.title}</h4>
                                    <p className="text-gray-500 text-xs font-medium">{promo.subtitle}</p>
                                    {promo.image && <img src={promo.image} alt="" className="w-full h-20 object-cover rounded-lg mt-2 mb-2" />}
                                    <div className={`mt-3 text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/50 inline-block rounded-md ${promo.text}`}>
                                        Code: {promo.code}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- ORDERS MANAGEMENT SECTION --- */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <FaBox className="text-orange-500" /> Live Order Management
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="pb-4 font-medium">Order ID</th>
                                    <th className="pb-4 font-medium">Customer</th>
                                    <th className="pb-4 font-medium">Items</th>
                                    <th className="pb-4 font-medium">Total</th>
                                    <th className="pb-4 font-medium">Status</th>
                                    <th className="pb-4 font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm">
                                {orders.length > 0 ? orders.map((order, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all">
                                        <td className="py-4 font-bold text-gray-400">#{order._id.slice(-4)}</td>
                                        <td className="py-4 font-semibold">{order.user?.name || 'Guest'}</td>
                                        <td className="py-4">{order.orderItems.map(item => `${item.name} (x${item.qty})`).join(', ')}</td>
                                        <td className="py-4 text-orange-600 font-bold">₹{order.totalPrice}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                                                ${order.status === 'Pending' ? 'bg-blue-100 text-blue-600' :
                                                    order.status === 'Preparing' ? 'bg-orange-100 text-orange-600' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                            'bg-green-100 text-green-600'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <select
                                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                    value={order.status}
                                                    className="bg-gray-100 border-none rounded-lg px-2 py-1 text-xs font-bold outline-none cursor-pointer"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Preparing">Preparing</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                                                    title="Cancel"
                                                >
                                                    <FaTimesCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="py-10 text-center text-gray-400 italic">No orders found in database.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- MENU MANAGEMENT SECTION --- */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaUtensils className="text-orange-500" /> Menu Management
                        </h3>
                        <button
                            onClick={() => {
                                setEditingFood(null);
                                setFoodFormData({ name: '', price: '', image: '', category: '', rating: 4.5, costPrice: '' });
                                setShowFoodForm(true);
                            }}
                            className="bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-100"
                        >
                            <FaPlus /> Add New Item
                        </button>
                    </div>

                    {showFoodForm && (
                        <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <h4 className="font-bold mb-4 text-gray-700">{editingFood ? 'Edit Food Item' : 'Add New Food Item'}</h4>
                            <form onSubmit={handleFoodSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    placeholder="Name"
                                    value={foodFormData.name}
                                    onChange={e => setFoodFormData({ ...foodFormData, name: e.target.value })}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-sm"
                                    required
                                />
                                <input
                                    placeholder="Price"
                                    type="number"
                                    value={foodFormData.price}
                                    onChange={e => setFoodFormData({ ...foodFormData, price: e.target.value })}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-sm"
                                    required
                                />
                                <input
                                    placeholder="Category (e.g. Breakfast)"
                                    value={foodFormData.category}
                                    onChange={e => setFoodFormData({ ...foodFormData, category: e.target.value })}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-sm"
                                    required
                                />
                                <input
                                    placeholder="Image URL"
                                    value={foodFormData.image}
                                    onChange={e => setFoodFormData({ ...foodFormData, image: e.target.value })}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-sm"
                                    required
                                />
                                <input
                                    placeholder="Cost Price (Business Internal)"
                                    type="number"
                                    value={foodFormData.costPrice}
                                    onChange={e => setFoodFormData({ ...foodFormData, costPrice: e.target.value })}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-sm"
                                    required
                                />
                                <div className="flex gap-2">
                                    <button type="submit" className="flex-1 bg-gray-900 text-white p-3 rounded-xl font-bold hover:bg-black transition-all">
                                        {editingFood ? 'Update' : 'Save'}
                                    </button>
                                    <button type="button" onClick={() => setShowFoodForm(false)} className="px-5 bg-white border border-gray-200 rounded-xl font-bold hover:bg-gray-100">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="pb-4 font-medium">Image</th>
                                    <th className="pb-4 font-medium">Name</th>
                                    <th className="pb-4 font-medium">Category</th>
                                    <th className="pb-4 font-medium">Price</th>
                                    <th className="pb-4 font-medium">Rating</th>
                                    <th className="pb-4 font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm">
                                {foods.length > 0 ? (showAllFoods ? foods : foods.slice(0, 8)).map((food, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all">
                                        <td className="py-4">
                                            <img src={food.image || food.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop"} alt={food.name} className="w-10 h-10 rounded-xl object-cover" />
                                        </td>
                                        <td className="py-4 font-bold">{food.name}</td>
                                        <td className="py-4">
                                            <span className="bg-gray-100 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">{food.category}</span>
                                        </td>
                                        <td className="py-4 font-bold text-orange-600">₹{food.price} <span className="text-[10px] text-gray-400 block font-normal">Cost: ₹{food.costPrice}</span></td>
                                        <td className="py-4">⭐ {food.rating}</td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingFood(food);
                                                        setFoodFormData({
                                                            name: food.name,
                                                            price: food.price,
                                                            image: food.image || food.img,
                                                            category: food.category,
                                                            rating: food.rating,
                                                            costPrice: food.costPrice || ''
                                                        });
                                                        setShowFoodForm(true);
                                                    }}
                                                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-all"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFood(food._id)}
                                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="py-10 text-center text-gray-400 italic">No food items found in menu.</td></tr>
                                )}
                            </tbody>
                        </table>
                        {foods.length > 8 && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setShowAllFoods(!showAllFoods)}
                                    className="text-orange-500 font-bold hover:underline"
                                >
                                    {showAllFoods ? 'Show Less' : `Show All (${foods.length})`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>


                {/* --- PROFIT ANALYSIS --- */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Business Profit Analysis</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="pb-4">Food Item</th>
                                    <th className="pb-4">Selling Price</th>
                                    <th className="pb-4">Cost Price</th>
                                    <th className="pb-4">Net Profit</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm">
                                {FoodData.slice(0, 10).map((food, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all">
                                        <td className="py-4 font-bold flex items-center gap-2"><FaUtensils className="text-orange-500" /> {food.name}</td>
                                        <td className="py-4">₹{food.price}</td>
                                        <td className="py-4">₹{Math.floor(food.price * 0.4)}</td>
                                        <td className="py-4 text-green-500 font-bold">+₹{Math.floor(food.price * 0.6)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >
        </div >
    );
};

const StatCard = ({ title, value, icon, trend, color }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
        <div className={`absolute -right-4 -top-4 w-20 h-20 ${color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color} text-white text-xl`}>
                {icon}
            </div>
            <span className="text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg">
                {trend}
            </span>
        </div>
        <h4 className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</h4>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
    </div>
);

export default AdminDashboard;
