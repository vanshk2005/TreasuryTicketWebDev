import React, { useRef, useEffect, useCallback } from 'react';
import './Background.css';

const PARTICLE_COUNT = 35;
const PARTICLE_MIN_SIZE = 0.8;
const PARTICLE_MAX_SIZE = 2;
const PARTICLE_MIN_OPACITY = 0.08;
const PARTICLE_MAX_OPACITY = 0.2;
const PARTICLE_SPEED = 0.15;

const Background = React.memo(() => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  const initParticles = useCallback((width, height) => {
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: PARTICLE_MIN_SIZE + Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE),
        opacity: PARTICLE_MIN_OPACITY + Math.random() * (PARTICLE_MAX_OPACITY - PARTICLE_MIN_OPACITY),
        vx: (Math.random() - 0.5) * PARTICLE_SPEED,
        vy: (Math.random() - 0.5) * PARTICLE_SPEED,
        opacityBase: PARTICLE_MIN_OPACITY + Math.random() * (PARTICLE_MAX_OPACITY - PARTICLE_MIN_OPACITY),
        opacityPhase: Math.random() * Math.PI * 2,
        opacitySpeed: 0.003 + Math.random() * 0.005,
      });
    }
    particlesRef.current = particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      /* Update position */
      p.x += p.vx;
      p.y += p.vy;

      /* Wrap around screen edges */
      if (p.x < -5) p.x = width + 5;
      if (p.x > width + 5) p.x = -5;
      if (p.y < -5) p.y = height + 5;
      if (p.y > height + 5) p.y = -5;

      /* Oscillate opacity */
      p.opacityPhase += p.opacitySpeed;
      p.opacity = p.opacityBase + Math.sin(p.opacityPhase) * 0.05;

      /* Draw particle */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      initParticles(window.innerWidth, window.innerHeight);
    };

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [initParticles, animate]);

  return (
    <div className="background" aria-hidden="true">
      {/* Gradient orbs */}
      <div className="background__gradients">
        <div className="background__orb background__orb--1" />
        <div className="background__orb background__orb--2" />
        <div className="background__orb background__orb--3" />
        <div className="background__orb background__orb--4" />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="background__canvas"
      />
    </div>
  );
});

Background.displayName = 'Background';

export default Background;
