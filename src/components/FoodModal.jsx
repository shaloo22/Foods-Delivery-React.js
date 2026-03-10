import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';
import { FaMotorcycle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/CartSlice';
import FoodData from '../data/FoodData';
import { motion, AnimatePresence } from 'framer-motion';

const FoodModal = ({ food, onClose, handleToast }) => {
    const dispatch = useDispatch();

    if (!food) return null;

    // Find suggested items based on the suggestions IDs in FoodData
    const suggestedItems = food.suggestions
        ? FoodData.filter(item => food.suggestions.includes(item.id))
        : [];

    const handleAddToCart = (item) => {
        const normalizedItem = {
            ...item,
            id: item._id || item.id,
            img: item.img || item.image
        };
        dispatch(addToCart({ ...normalizedItem, qty: 1 }));
        handleToast(item.name);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-800 hover:bg-gray-100 transition-all shadow-sm"
                    >
                        <IoCloseOutline size={24} />
                    </button>

                    <div className="flex flex-col md:flex-row">
                        {/* Left: Image */}
                        <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                            <img
                                src={food.image || food.img}
                                alt={food.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Right: Details */}
                        <div className="md:w-1/2 p-8 flex flex-col gap-4">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-3xl font-black text-gray-900 leading-tight">{food.name}</h2>
                                    <span className="text-2xl font-black text-orange-500">₹{food.price}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm font-bold">
                                    <div className="flex items-center bg-orange-50 text-orange-600 px-3 py-1 rounded-full">
                                        <AiFillStar className="mr-1" />
                                        {food.rating}
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <FaMotorcycle className="mr-2 text-orange-400" />
                                        {food.time || "25-35 min"}
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-500 leading-relaxed italic">
                                "{food.description || food.desc}"
                            </p>

                            <button
                                onClick={() => handleAddToCart(food)}
                                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-200 active:scale-95 text-lg"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    {/* Suggestions Section */}
                    {suggestedItems.length > 0 && (
                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-orange-500 rounded-full"></span>
                                Frequently Paired With
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {suggestedItems.map(item => (
                                    <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-200 hover:border-orange-200 transition-all group scale-100 hover:scale-[1.02]">
                                        <div className="flex items-center gap-3">
                                            <img src={item.image || item.img} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                                                <p className="text-orange-500 font-bold text-sm">₹{item.price}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all font-bold text-xs"
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FoodModal;
