import React from 'react';
import { motion } from 'framer-motion';
import { MdDeliveryDining } from 'react-icons/md';

const DeliveryAnimation = () => {
    return (
        <div className="absolute bottom-0 left-0 w-full h-[14px] overflow-hidden bg-orange-50/20 pointer-events-none">
            <motion.div
                className="flex items-center gap-2 h-full"
                animate={{
                    x: ['-20%', '110%'],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                }}
            >
                <div className="relative flex items-center">
                    <MdDeliveryDining className="text-orange-500 mb-1" size={36} />

                    {/* Speed Lines */}
                    <div className="absolute right-full mr-1 flex flex-col gap-0.5 items-end mb-1">
                        <span className="w-5 h-0.5 bg-orange-400 rounded-full animate-pulse opacity-80"></span>
                        <span className="w-3 h-0.5 bg-orange-300 rounded-full animate-pulse delay-75 opacity-60"></span>
                    </div>
                </div>
            </motion.div>

            {/* The Track Line */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-100/50"></div>
        </div>
    );
};

export default DeliveryAnimation;
