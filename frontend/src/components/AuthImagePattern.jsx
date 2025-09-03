'use client';

import { useEffect, useRef } from 'react';

/**
 * Minimal, robust version:
 * - No dependencies other than React
 * - No CSS variables or DaisyUI lookups
 * - Handles SSR safely
 * - DPR scaling, resize-safe, pointer repel + click burst
 */
const AuthImagePattern = ({ title, subtitle }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Guard: only run in browser
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = true;

    // Fit canvas to container with device pixel ratio
    const fit = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    fit();
    const onResize = () => fit();
    window.addEventListener('resize', onResize);

    // Palette (sleek)
    const dot1 = (a) => `rgba(34, 211, 238, ${a})`; // cyan-400
    const dot2 = (a) => `rgba(20, 184, 166, ${a})`; // teal-500
    const dot3 = (a) => `rgba(148, 163, 184, ${a})`; // slate-400
      // slate-400

    // Helpers
    const rnd = (min, max) => Math.random() * (max - min) + min;
    const bounds = () => {
      // Use CSS pixels (after ctx.setTransform we draw in CSS px)
      const rect = container.getBoundingClientRect();
      return { w: Math.max(1, Math.floor(rect.width)), h: Math.max(1, Math.floor(rect.height)) };
    };

    // Particles
    const particles = [];
    const { w: iw } = bounds();
    const count = Math.min(72, Math.max(28, Math.floor(iw / 18)));
    const palette = [dot1, dot2, dot3];

    for (let i = 0; i < count; i++) {
      const { w, h } = bounds();
      const r = rnd(6, 14);
      particles.push({
        x: rnd(0, w),
        y: rnd(0, h),
        vx: rnd(-0.4, 0.4),
        vy: rnd(-0.4, 0.4),
        r,
        baseR: r,
        color: palette[i % palette.length],
      });
    }

    // Pointer handling
    const pointer = { x: -9999, y: -9999, active: false };
    const toLocal = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e) => {
      pointer.active = true;
      const p = toLocal(e);
      pointer.x = p.x; pointer.y = p.y;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999; pointer.y = -9999;
    };
    const onDown = () => {
      for (const pt of particles) {
        const dx = pt.x - pointer.x;
        const dy = pt.y - pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 160) {
          const f = (160 - d) / 160;
          pt.vx += (dx / d) * (2.0 * f);
          pt.vy += (dy / d) * (2.0 * f);
        }
      }
    };

    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerleave', onLeave);
    container.addEventListener('pointerdown', onDown);

    // Animation loop
    const draw = () => {
      const { w, h } = bounds();
      ctx.clearRect(0, 0, w, h);

      // Soft glows
      ctx.globalCompositeOperation = 'lighter';
      for (const pt of particles) {
        // Move
        pt.x += pt.vx;
        pt.y += pt.vy;

        // Light drag
        pt.vx *= 0.996;
        pt.vy *= 0.996;

        // Pointer repel
        if (pointer.active) {
          const dx = pt.x - pointer.x;
          const dy = pt.y - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          const influence = 120;
          if (d < influence) {
            const force = (influence - d) / influence;
            const push = 0.6 * force;
            pt.vx += (dx / d) * push;
            pt.vy += (dy / d) * push;
            pt.r = pt.baseR + 4 * force;
          } else {
            pt.r += (pt.baseR - pt.r) * 0.08;
          }
        }

        // Edge bounce
        if (pt.x < pt.r) { pt.x = pt.r; pt.vx *= -0.9; }
        else if (pt.x > w - pt.r) { pt.x = w - pt.r; pt.vx *= -0.9; }
        if (pt.y < pt.r) { pt.y = pt.r; pt.vy *= -0.9; }
        else if (pt.y > h - pt.r) { pt.y = h - pt.r; pt.vy *= -0.9; }

        // Draw orb
        const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.r * 1.6);
        g.addColorStop(0, pt.color(0.55));
        g.addColorStop(0.6, pt.color(0.18));
        g.addColorStop(1, pt.color(0.00));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Subtle connector lines
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 110) {
            const alpha = ((110 - d) / 110) * 0.18;
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative hidden lg:flex flex-col items-center justify-center bg-base-200 overflow-hidden p-12 text-center min-h-screen"
    >
      {/* Text */}
      <div className="relative z-10 max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-base-content">{title}</h2>
        <p className="text-base-content/60 max-w-xs mx-auto">{subtitle}</p>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

      {/* Very light grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30
        [background-image:linear-gradient(to_right,theme(colors.base-300/_0.12)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.base-300/_0.12)_1px,transparent_1px)]
        [background-size:48px_48px]"
        aria-hidden
      />
    </div>
  );
};

export default AuthImagePattern;
