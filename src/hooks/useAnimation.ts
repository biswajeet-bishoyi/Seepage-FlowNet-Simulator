import { useEffect, useRef } from 'react';
import { FlowLineGeometry } from '../lib/types';

interface Particle {
  lineIndex: number;
  progress: number; // 0 to 1 along the line
  speed: number;
  size: number;
  opacity: number;
}

export function useParticleAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  flowLines: FlowLineGeometry[],
  isRunning: boolean,
  speedMultiplier: number,
  hydraulicGradient: number,
  hydraulicConductivity: number
) {
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Initialize or re-populate particles when flowLines count changes
  useEffect(() => {
    if (!flowLines || flowLines.length === 0) {
      particlesRef.current = [];
      return;
    }

    const particlesPerLine = 6;
    const newParticles: Particle[] = [];

    flowLines.forEach((_, lineIndex) => {
      for (let p = 0; p < particlesPerLine; p++) {
        newParticles.push({
          lineIndex,
          progress: (p + Math.random() * 0.8) / particlesPerLine,
          speed: 0.05 + Math.random() * 0.02,
          size: 2.5 + Math.random() * 1.5,
          opacity: 0.6 + Math.random() * 0.4,
        });
      }
    });

    particlesRef.current = newParticles;
  }, [flowLines.length]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Clear previous canvas frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isRunning && flowLines.length > 0) {
        // Base velocity scaled by physical seepage principles (Darcy's v = k * i)
        // Normalized so it looks natural and responsive
        const physicalFactor = Math.max(0.2, Math.min(3.0, (hydraulicConductivity / 0.01) * (hydraulicGradient / 0.075)));
        const effectiveSpeed = 0.12 * speedMultiplier * physicalFactor;

        // Draw each particle
        particlesRef.current.forEach((particle) => {
          // Advance progress
          particle.progress += effectiveSpeed * particle.speed * dt;
          if (particle.progress > 1.0) {
            particle.progress -= 1.0;
          }

          const line = flowLines[particle.lineIndex];
          if (!line || line.points.length < 2) return;

          // Find coordinates along points array
          const totalPoints = line.points.length;
          const floatIndex = particle.progress * (totalPoints - 1);
          const idxA = Math.floor(floatIndex);
          const idxB = Math.min(idxA + 1, totalPoints - 1);
          const blend = floatIndex - idxA;

          const pA = line.points[idxA];
          const pB = line.points[idxB];

          const x = pA.x + (pB.x - pA.x) * blend;
          const y = pA.y + (pB.y - pA.y) * blend;

          // Draw glowing water bead
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.restore();
        });
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    lastTimeRef.current = performance.now();
    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [
    canvasRef,
    flowLines,
    isRunning,
    speedMultiplier,
    hydraulicGradient,
    hydraulicConductivity,
  ]);
}
