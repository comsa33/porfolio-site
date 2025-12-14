'use client';

import React, { useEffect, useRef } from 'react';
import styles from './TimelineBackground.module.css';

const TimelineBackground: React.FC = () => {
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

    // Minimal Grid Pattern
    const gridSize = 40; // Distance between dots
    const dotRadius = 1;
    const baseOpacity = 0.15;

    let animationFrame: number;
    let time = 0;

    const drawGrid = () => {
      time += 0.005;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate grid dimensions
      const cols = Math.ceil(canvas.width / gridSize) + 1;
      const rows = Math.ceil(canvas.height / gridSize) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * gridSize;
          const y = row * gridSize;

          // Subtle wave effect for slight animation
          const wave = Math.sin(time + col * 0.1 + row * 0.1) * 0.5 + 0.5;
          const opacity = baseOpacity * (0.7 + wave * 0.3);

          // Draw dot
          ctx.fillStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrame = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default TimelineBackground;
