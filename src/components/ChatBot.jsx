import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChatbubbleEllipses, IoClose, IoSend } from 'react-icons/io5';
import API from '../api';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hi! I am Chaska AI. How can I help you today? 🍔' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Prepare history for API (Gemini format)
            // Note: Gemini uses 'user' and 'model' roles
            const history = messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));

            let user = null;
            try {
                user = JSON.parse(localStorage.getItem('user'));
            } catch (e) { }

            const { data } = await API.post('chat', {
                message: input,
                history: history,
                role: user?.role || 'user'
            });

            setMessages(prev => [...prev, { role: 'model', text: data.message }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to my brain. Please try again! 🤖" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-wrapper fixed bottom-24 right-4 z-50 transition-opacity duration-300">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
                    >
                        {/* Header */}
                        <div className="bg-orange-500 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <IoChatbubbleEllipses size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Chaska AI Assistant</h3>
                                    <p className="text-[10px] text-orange-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg">
                                <IoClose size={24} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
                        >
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                        ? 'bg-orange-500 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me about food..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all shadow-md shadow-orange-100"
                            >
                                <IoSend size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 ${isOpen ? 'bg-gray-800 text-white' : 'bg-orange-500 text-white'
                    }`}
            >
                {isOpen ? <IoClose size={32} /> : <IoChatbubbleEllipses size={32} />}
            </motion.button>
        </div>
    );
};

export default ChatBot;
