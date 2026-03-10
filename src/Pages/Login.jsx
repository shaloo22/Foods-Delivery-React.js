import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('password123');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/users/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            toast.success('LoggedIn Successfully!');
            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login Failed');
        }
    };

    const handleGuestAdmin = async () => {
        try {
            const { data } = await API.post('/users/login', { email: 'admin@example.com', password: 'password123' });
            localStorage.setItem('user', JSON.stringify(data));
            toast.success('Admin LoggedIn!');
            navigate('/admin');
        } catch (error) {
            toast.error('Admin Login Failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-orange-600 italic">Chaska Foods</h1>
                    <p className="text-gray-500 mt-2">Welcome back! Please login to your account.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-200"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 italic">
                    <p className="text-center text-gray-400 mb-4">Are you a recruiter / demo user?</p>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleLogin}
                            className="w-full py-3 bg-orange-50 text-orange-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border border-orange-100"
                        >
                            Login as Demo User
                        </button>
                        <button
                            onClick={handleGuestAdmin}
                            className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                        >
                            Login as Demo Admin
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
