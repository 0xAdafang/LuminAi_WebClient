"use client";

import { motion } from "framer-motion";

export default function StarBackground() {
    return (
        <div className="fixed inset<0 z-[-1] bg-[#030712] overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <motion.div
                key={i}
                className="absolute bg-white rounded-full opacity-20"
                style={{
                    width: Math.random() * 3 + "px",
                    height: Math.random() * 3 + "px",
                    top: Math.random() * 100 + "%",
                    left: Math.random() * 100 + "%",
                }}
                animate={{
                opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                }}
                transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-[#030712]" />
        </div>
    );
}