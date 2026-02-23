import React, { useEffect, useRef } from 'react';
import './ParticleGrid.css';

const DOT_SPACING = 15;
const PROXIMITY_RADIUS = 800; // Increased from 600 for larger interaction area
const DOT_SIZE = 0.7; // Even smaller dots for high density

export const ParticleGrid: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cols = Math.ceil(canvas.width / DOT_SPACING);
            const rows = Math.ceil(canvas.height / DOT_SPACING);
            const offsetX = (canvas.width % DOT_SPACING) / 2;
            const offsetY = (canvas.height % DOT_SPACING) / 2;

            for (let i = 0; i <= cols; i++) {
                for (let j = 0; j <= rows; j++) {
                    const originX = i * DOT_SPACING + offsetX;
                    const originY = j * DOT_SPACING + offsetY;

                    const dx = mouse.current.x - originX;
                    const dy = mouse.current.y - originY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < PROXIMITY_RADIUS) {
                        const effect = 1 - distance / PROXIMITY_RADIUS;

                        // Smooth easing for a more premium feel (ease-out-quad)
                        const easeEffect = effect * effect;

                        // Discovery Effect (Opacity)
                        const opacity = easeEffect * 0.8;

                        // Magnetic Movement (Displacement towards mouse)
                        const moveX = dx * 0.3 * easeEffect;
                        const moveY = dy * 0.3 * easeEffect;

                        // Slow, fluid swaying effect instead of fast jiggle
                        const time = Date.now() * 0.006; // Increased from 0.003 for faster movement
                        const swayAmount = 8 * easeEffect; // Increased movement
                        const swayX = Math.sin(time + originX * 0.01) * swayAmount;
                        const swayY = Math.cos(time + originY * 0.01) * swayAmount;

                        // Scale Effect
                        const size = DOT_SIZE + easeEffect * 2.5;

                        ctx.beginPath();
                        ctx.arc(originX + moveX + swayX, originY + moveY + swayY, size, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
                        ctx.fill();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="particle-grid-canvas" />;
};
