import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimesCircle, FaUtensils, FaMapMarkerAlt } from 'react-icons/fa';
import API from '../api';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const { data } = await API.get('orders/myorders');

                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders", error);
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    const handleCancelOrder = async (id) => {
        if (window.confirm('Are you sure you want to cancel this delicious order?')) {
            try {
                await API.put(`orders/${id}/cancel`);

                setOrders(orders.map(order =>
                    order._id === id ? { ...order, status: 'Cancelled' } : order
                ));
            } catch (error) {
                alert(error.response?.data?.message || "Failed to cancel order");
            }
        }
    };

    const handleRemoveItem = async (orderId, itemId, itemPrice, itemQty) => {
        if (window.confirm('Remove this item from your order?')) {
            try {
                const updatedPrice = itemPrice * itemQty;
                const { data } = await API.put(`orders/${orderId}/remove-item`, {
                    itemId,
                    priceReduction: updatedPrice
                });

                // Update local state with the modified order from response
                setOrders(orders.map(order =>
                    order._id === orderId ? data : order
                ).filter(order => order.orderItems.length > 0)); // Remove order from view if empty

            } catch (error) {
                alert(error.response?.data?.message || "Failed to remove item");
            }
        }
    };

    const handleDeleteOrder = async (id) => {
        if (window.confirm('Delete this from history completely?')) {
            try {
                await API.delete(`orders/${id}`);
                setOrders(orders.filter(order => order._id !== id));
            } catch (error) {
                alert(error.response?.data?.message || "Failed to delete order entry");
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-blue-500 bg-blue-50';
            case 'Preparing': return 'text-orange-500 bg-orange-50';
            case 'Delivered': return 'text-green-500 bg-green-50';
            case 'Cancelled': return 'text-red-500 bg-red-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <FaClock className="mr-2" />;
            case 'Preparing': return <FaUtensils className="mr-2" />;
            case 'Delivered': return <FaCheckCircle className="mr-2" />;
            case 'Cancelled': return <FaTimesCircle className="mr-2" />;
            default: return null;
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-orange-500 italic">Finding your orders...</div>;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-10 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My History</h1>

                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="bg-white p-10 rounded-3xl text-center shadow-sm border border-gray-100 italic">
                                You haven't ordered anything yet. Go find some delicious food!
                            </div>
                        ) : (
                            orders.map((order, index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={order._id}
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </span>
                                                    <span className="text-gray-400 text-sm font-medium">
                                                        ID: #{order._id.slice(-6)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 text-sm">
                                                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>

                                            <div className="space-y-3 mt-4">
                                                {order.orderItems.map((item, itemIdx) => (
                                                    <div key={item._id || itemIdx} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            {item.image && (
                                                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                                                            )}
                                                            <div>
                                                                <h4 className="font-bold text-gray-800">{item.name}</h4>
                                                                <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="font-bold text-gray-700">₹{item.qty * item.price}</span>
                                                            {order.status === 'Pending' && (
                                                                <button
                                                                    onClick={() => handleRemoveItem(order._id, item._id, item.price, item.qty)}
                                                                    className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                                                                    title="Remove Item"
                                                                >
                                                                    <FaTimesCircle />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {order.shippingAddress && (
                                                <div className="mt-4 p-3 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                                                    <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                                        <FaMapMarkerAlt size={10} /> Delivery Address
                                                    </p>
                                                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                                        {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 min-w-[120px]">
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Amount</p>
                                            <p className="text-2xl font-black text-orange-500 mb-2">
                                                ₹{order.totalPrice}
                                            </p>
                                            {order.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="w-full px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs border border-red-100 active:scale-95 flex justify-center"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}

                                            {order.status === 'Cancelled' && (
                                                <button
                                                    onClick={() => handleDeleteOrder(order._id)}
                                                    className="w-full px-6 py-2.5 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-all text-xs border border-gray-200 active:scale-95 flex justify-center mt-2 group"
                                                >
                                                    <FaTimesCircle className="mr-2 group-hover:text-red-500" /> Remove from History
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyOrders;
