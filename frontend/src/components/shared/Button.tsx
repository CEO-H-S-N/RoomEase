import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseClass = 'btn-modern';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;
    const fullWidthClass = fullWidth ? 'btn-full' : '';
    const classes = `${baseClass} ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`.trim();

    return (
        <motion.button
            className={classes}
            disabled={disabled || isLoading}
            whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {isLoading ? (
                <span className="btn-loader">
                    <span className="spinner" />
                    Loading...
                </span>
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
                    <span>{children}</span>
                    {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
                </>
            )}
        </motion.button>
    );
};
