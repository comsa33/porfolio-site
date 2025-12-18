'use client';

import React, { useEffect, useRef } from 'react';

interface WaveBackgroundProps {
  className?: string;
}

interface WaveLine {
  color: string;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  minThickness: number;
  maxThickness: number;
  thicknessSpeed: number;
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // All lines centered, with dramatic wave properties
    const waveLines: WaveLine[] = [
      {
        color: 'rgba(0, 240, 255, 0.25)',
        amplitude: 80,
        frequency: 0.004,
        speed: 0.025,
        phase: 0,
        minThickness: 0.3,
        maxThickness: 8,
        thicknessSpeed: 0.035,
      },
      {
        color: 'rgba(112, 0, 255, 0.2)',
        amplitude: 100,
        frequency: 0.003,
        speed: 0.02,
        phase: Math.PI * 0.5,
        minThickness: 0.3,
        maxThickness: 10,
        thicknessSpeed: 0.028,
      },
      {
        color: 'rgba(0, 200, 255, 0.15)',
        amplitude: 70,
        frequency: 0.005,
        speed: 0.03,
        phase: Math.PI,
        minThickness: 0.2,
        maxThickness: 6,
        thicknessSpeed: 0.045,
      },
      {
        color: 'rgba(150, 50, 255, 0.12)',
        amplitude: 120,
        frequency: 0.002,
        speed: 0.018,
        phase: Math.PI * 1.5,
        minThickness: 0.3,
        maxThickness: 12,
        thicknessSpeed: 0.022,
      },
      {
        color: 'rgba(0, 180, 255, 0.1)',
        amplitude: 90,
        frequency: 0.0035,
        speed: 0.028,
        phase: Math.PI * 0.3,
        minThickness: 0.2,
        maxThickness: 7,
        thicknessSpeed: 0.04,
      },
    ];

    let time = 0;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerY = height * 0.5;

      ctx.clearRect(0, 0, width, height);

      waveLines.forEach((wave, waveIndex) => {
        // Draw line as individual segments for varying thickness
        const segments: { x: number; y: number; thickness: number }[] = [];

        for (let x = 0; x <= width; x += 4) {
          // Primary wave - pulses up and down
          const primaryWave =
            Math.sin(x * wave.frequency + wave.phase) *
            wave.amplitude *
            Math.sin(time * wave.speed);

          // Secondary wave - adds complexity
          const secondaryWave =
            Math.sin(x * wave.frequency * 2 + wave.phase * 1.3) *
            (wave.amplitude * 0.4) *
            Math.cos(time * wave.speed * 1.3 + waveIndex);

          // Tertiary wave - subtle organic variation
          const tertiaryWave =
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.5) * (wave.amplitude * 0.2);

          const y = centerY + primaryWave + secondaryWave + tertiaryWave;

          // Dynamic thickness that pulses noticeably
          const thicknessFactor =
            (Math.sin(time * wave.thicknessSpeed + x * 0.005 + waveIndex) + 1) / 2;
          const thickness =
            wave.minThickness + thicknessFactor * (wave.maxThickness - wave.minThickness);

          segments.push({ x, y, thickness });
        }

        // Draw each segment with its own thickness
        for (let i = 1; i < segments.length; i++) {
          const prev = segments[i - 1];
          const curr = segments[i];

          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.strokeStyle = wave.color;
          ctx.lineWidth = (prev.thickness + curr.thickness) / 2;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      });

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6,
        filter: 'blur(1px)',
      }}
    />
  );
};

export default WaveBackground;
