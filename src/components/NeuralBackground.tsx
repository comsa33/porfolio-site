"use client";

import React, { useEffect, useRef } from 'react';
import styles from './NeuralBackground.module.css';

const NeuralBackground: React.FC = () => {
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

    // Matrix-style falling code
    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    let animationFrame: number;

    const animate = () => {
      // Fade effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '14px JetBrains Mono, monospace';
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Gradient color effect
        const gradient = ctx.createLinearGradient(
          i * 20, drops[i] * 20 - 40,
          i * 20, drops[i] * 20 + 20
        );
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.fillText(char, i * 20, drops[i] * 20);
        
        // Reset drop randomly
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i] += 0.3;
      }
      
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

export default NeuralBackground;
