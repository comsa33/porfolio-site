'use client';

import React, { useEffect, useRef } from 'react';
import styles from './FooterBackground.module.css';

const FooterBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Gradient wave parameters
    let time = 0;
    let animationFrame: number;

    const animate = () => {
      time += 0.005;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw single simplified wave layer
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += 5) {
        const y =
          canvas.height / 2 +
          Math.sin(x * 0.002 + time) * 50 +
          Math.cos(x * 0.001 + time * 0.7) * 25;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Complete the path
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      // Solid color fill (no gradient)
      ctx.fillStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.fill();

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default FooterBackground;
