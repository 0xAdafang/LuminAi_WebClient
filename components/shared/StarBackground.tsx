"use client";
import { useEffect, useState } from "react";

interface Star {
    size: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
}

export default function StarBackground() {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        setStars(
            [...Array(60)].map(() => ({
                size: Math.random() * 2.5 + 0.5,
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 4,
                duration: Math.random() * 3 + 2,
            }))
        );
    }, []);

    if (stars.length === 0) return <div className="fixed inset-0 z-[-1] bg-[#030712]" />;

    return (
        <div className="fixed inset-0 z-[-1] bg-[#030712] overflow-hidden">
            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.15; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.4); }
                }
            `}</style>

            {stars.map((star, i) => (
                <div
                    key={i}
                    className="absolute bg-white rounded-full"
                    style={{
                        width: star.size,
                        height: star.size,
                        top: `${star.y}%`,
                        left: `${star.x}%`,
                        animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite`,
                    }}
                />
            ))}

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-[#030712]" />
        </div>
    );
}