import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './ScrollCard.css';

interface ScrollCardProps {
    icon?: React.ReactNode;
    image?: string;
    title: string;
    description: string;
    index: number;
}

export const ScrollCard: React.FC<ScrollCardProps> = ({ icon, image, title, description, index }) => {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // 3D Rotation based on scroll progress
    const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);
    const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], index % 2 === 0 ? [-15, 0, 15] : [15, 0, -15]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Spring smoothing for natural movement
    const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
    const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });
    const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

    return (
        <motion.div
            ref={ref}
            style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                scale: springScale,
                opacity,
                perspective: 1000,
            }}
            className="scroll-card-container"
        >
            <div className="scroll-card glass hover-effect">
                <div className="scroll-card-visual">
                    {image ? (
                        <img src={image} alt={title} className="scroll-card-image" />
                    ) : (
                        <span className="scroll-card-icon">{icon}</span>
                    )}
                </div>
                <div className="scroll-card-content">
                    <h3 className="scroll-card-title">{title}</h3>
                    <p className="scroll-card-description">{description}</p>
                </div>

                {/* Glow effect */}
                <div className="scroll-card-glow" />
            </div>
        </motion.div>
    );
};
