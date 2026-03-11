import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTag, FaFireAlt, FaGift, FaCopy } from 'react-icons/fa';
import API from '../api';
import { toast } from 'react-hot-toast';

const PromoFlyer = () => {
    const [promos, setPromos] = React.useState([
        {
            id: 'static-1',
            title: "Get 20% OFF on your first order!",
            subtitle: "Use code: CHASKA20",
            code: "CHASKA20",
            iconType: 'Gift',
            bg: "bg-pink-50",
            border: "border-pink-100",
            text: "text-pink-700"
        }
    ]);
    const [index, setIndex] = React.useState(0);
    const [copied, setCopied] = React.useState(false);

    const iconMap = {
        'Gift': <FaGift className="text-pink-500" />,
        'Fire': <FaFireAlt className="text-orange-500" />,
        'Tag': <FaTag className="text-blue-500" />
    };

    const handleCopy = (promoCode) => {
        if (!promoCode) return;
        const actualCode = promoCode.trim();
        navigator.clipboard.writeText(actualCode).then(() => {
            setCopied(true);
            toast.success(`✅ Code "${actualCode}" copied to clipboard!`);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            // Fallback for browsers that block clipboard
            const el = document.createElement('textarea');
            el.value = actualCode;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            toast.success(`✅ Code "${actualCode}" copied!`);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    React.useEffect(() => {
        const fetchPromos = async () => {
            try {
                const { data } = await API.get('promotions');
                if (data && data.length > 0) {
                    setPromos(data);
                }
            } catch (error) {
                console.error("Error fetching promos", error);
            }
        };
        fetchPromos();

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % promos.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [promos.length]);

    const currentPromo = promos[index];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-6 mt-2">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm border border-dashed border-gray-200" style={{ minHeight: '80px' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPromo._id || currentPromo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                        className={`flex items-center p-3 sm:p-5 gap-3 sm:gap-4 ${currentPromo.bg}`}
                    >
                        {/* Icon */}
                        <div className="p-2.5 sm:p-3 rounded-2xl bg-white shadow-sm flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center overflow-hidden">
                            {currentPromo.image ? (
                                <img src={currentPromo.image} alt="" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                iconMap[currentPromo.iconType] || iconMap['Gift']
                            )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-sm sm:text-base truncate ${currentPromo.text}`}>
                                {currentPromo.title}
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm font-medium truncate">
                                {currentPromo.subtitle}
                            </p>
                        </div>

                        {/* Copy Button — always visible on all screen sizes */}
                        <button
                            onClick={() => handleCopy(currentPromo.code)}
                            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white border 
                                ${currentPromo.border} ${currentPromo.text} font-bold text-xs 
                                hover:shadow-md transition-all active:scale-95 flex-shrink-0
                                ${copied ? 'opacity-70 scale-95' : ''}`}
                        >
                            <FaCopy size={11} />
                            <span className="hidden xs:inline sm:inline">{copied ? 'Copied!' : 'Copy Code'}</span>
                            <span className="xs:hidden sm:hidden">{copied ? '✓' : 'Copy'}</span>
                        </button>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PromoFlyer;
