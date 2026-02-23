/**
 * Framer Motion Animation Variants
 * Reusable animation configurations for consistent motion design
 */

import type { Variants } from 'framer-motion';

// ========== FADE ANIMATIONS ==========

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3, ease: 'easeOut' }
    }
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
};

export const blurIn: Variants = {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' }
    }
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
};

// ========== SCALE ANIMATIONS ==========

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }
    }
};

export const scaleInSpring: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20
        }
    }
};

// ========== SLIDE ANIMATIONS ==========

export const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
};

export const slideInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
};

// ========== STAGGER ANIMATIONS ==========

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
};

// ========== PAGE TRANSITIONS ==========

export const pageTransition: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: { duration: 0.2, ease: 'easeIn' }
    }
};

export const pageSlide: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3, ease: 'easeIn' }
    }
};

// ========== CARD ANIMATIONS ==========

export const cardHover: Variants = {
    rest: { scale: 1, y: 0 },
    hover: {
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' }
    }
};

export const cardTap: Variants = {
    tap: { scale: 0.98 }
};

// ========== SWIPE ANIMATIONS (for match cards) ==========

export const swipeVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.5,
        rotate: direction > 0 ? 45 : -45
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
        rotate: 0
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.5,
        rotate: direction < 0 ? 45 : -45,
        transition: {
            duration: 0.3
        }
    })
};

// ========== MODAL ANIMATIONS ==========

export const modalBackdrop: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.2 }
    }
};

export const modalContent: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25
        }
    }
};

// ========== DRAWER ANIMATIONS ==========

export const drawerSlide: Variants = {
    hidden: { x: '100%' },
    visible: {
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30
        }
    }
};

// ========== BUTTON ANIMATIONS ==========

export const buttonTap = {
    scale: 0.95,
    transition: { duration: 0.1 }
};

export const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
};

// ========== LOADING ANIMATIONS ==========

export const pulseAnimation: Variants = {
    pulse: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

export const spinAnimation: Variants = {
    spin: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

// ========== NUMBER COUNTER ANIMATION ==========

export const counterAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

// ========== FLOATING ANIMATION ==========

export const floatingAnimation: Variants = {
    float: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

// ========== SHAKE ANIMATION (for errors) ==========

export const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
};

// ========== CONFETTI ANIMATION ==========

export const confettiPop: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: [0, 1.2, 1],
        opacity: [0, 1, 1],
        transition: {
            duration: 0.5,
            times: [0, 0.6, 1],
            ease: 'easeOut'
        }
    }
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Generate stagger delay for child elements
 */
export const generateStagger = (index: number, baseDelay: number = 0.1) => ({
    transition: { delay: index * baseDelay }
});

/**
 * Spring configuration presets
 */
export const springConfig = {
    gentle: { stiffness: 100, damping: 15 },
    medium: { stiffness: 200, damping: 20 },
    snappy: { stiffness: 300, damping: 25 },
    bouncy: { stiffness: 400, damping: 10 }
};
