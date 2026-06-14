import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
};

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip on touch / coarse pointers
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    let lastX = 0;
    let lastY = 0;
    let hasPointer = false;
    let lastSpawn = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const x = e.clientX;
      const y = e.clientY;
      if (!hasPointer) {
        lastX = x;
        lastY = y;
        hasPointer = true;
      }
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      // throttle spawn
      if (now - lastSpawn < 12 && dist < 4) return;
      lastSpawn = now;

      const count = Math.min(3, 1 + Math.floor(dist / 14));
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const px = lastX + dx * t + (Math.random() - 0.5) * 3;
        const py = lastY + dy * t + (Math.random() - 0.5) * 3;
        particles.push({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.25 - Math.random() * 0.4,
          life: 0,
          maxLife: 600 + Math.random() * 500,
          size: 1.2 + Math.random() * 2.2,
          hue: 28 + Math.random() * 22, // amber/orange range
        });
      }
      lastX = x;
      lastY = y;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.0015 * dt; // gentle float up

        const k = 1 - p.life / p.maxLife;
        const alpha = Math.pow(k, 1.6) * 0.55;
        const r = p.size * (1 + (1 - k) * 1.2);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6);
        grad.addColorStop(0, `hsla(${p.hue}, 95%, 70%, ${alpha})`);
        grad.addColorStop(0.4, `hsla(${p.hue - 6}, 90%, 55%, ${alpha * 0.35})`);
        grad.addColorStop(1, `hsla(${p.hue - 10}, 90%, 45%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
