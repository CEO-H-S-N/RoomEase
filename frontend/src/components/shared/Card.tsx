import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

export interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'elevated';
    hover?: boolean;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    hover = false,
    className = '',
    onClick
}) => {
    const baseClass = 'card-modern';
    const variantClass = `card-${variant}`;
    const hoverClass = hover ? 'card-hover' : '';
    const clickableClass = onClick ? 'card-clickable' : '';
    const classes = `${baseClass} ${variantClass} ${hoverClass} ${clickableClass} ${className}`.trim();

    const hoverAnimation = hover ? {
        whileHover: { y: -4, transition: { duration: 0.2 } },
        whileTap: onClick ? { scale: 0.98 } : {}
    } : {};

    return (
        <motion.div
            className={classes}
            onClick={onClick}
            {...hoverAnimation}
        >
            {children}
        </motion.div>
    );
};
