import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  amp: number;
  phase: number;
  speed: number;
  hue: string;
}

interface Rock {
  orbit: number;
  angle: number;
  period: number;
  size: number;
  alpha: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const STAR_HUES = ["#ffffff", "#cfe4ff", "#ffe9c4", "#bcd9ff", "#ffd9d0", "#c4fff2"];

/**
 * Ambient deep-space backdrop: layered parallax starfield, faint nebulae,
 * the asteroid belt (kept in sync with the simulation clock) and the
 * occasional meteor. Honors prefers-reduced-motion with a static frame.
 */
export default function Starfield({
  simRef,
  reduced,
}: {
  simRef: { current: number };
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let layers: Star[][] = [];
    let rocks: Rock[] = [];
    const meteors: Meteor[] = [];
    let nextMeteorAt = 3;
    let raf = 0;
    let lastT = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const R = Math.hypot(w, h) / 2 + 60;
      const area = w * h;
      const densities = [0.00011, 0.000065, 0.000032];
      const sizes: Array<[number, number]> = [
        [0.4, 0.9],
        [0.6, 1.2],
        [0.9, 1.8],
      ];

      layers = densities.map((d, li) => {
        const count = Math.round(area * d);
        const stars: Star[] = [];
        for (let i = 0; i < count; i++) {
          let x = 0;
          let y = 0;
          do {
            x = rand(-R, R);
            y = rand(-R, R);
          } while (x * x + y * y > R * R);
          stars.push({
            x,
            y,
            r: rand(sizes[li][0], sizes[li][1]),
            base: rand(0.25, 0.7),
            amp: rand(0.15, 0.45),
            phase: rand(0, Math.PI * 2),
            speed: rand(0.4, 1.6),
            hue: STAR_HUES[Math.floor(Math.random() * STAR_HUES.length)],
          });
        }
        return stars;
      });

      rocks = [];
      for (let i = 0; i < 160; i++) {
        rocks.push({
          orbit: 256 + (Math.random() + Math.random() - 1) * 21,
          angle: rand(0, Math.PI * 2),
          period: rand(1250, 2600),
          size: rand(0.6, 1.7),
          alpha: rand(0.2, 0.65),
        });
      }
    };

    const nebula = (x: number, y: number, r: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };

    const frame = (now: number) => {
      const t = now / 1000;
      const dt = Math.min(Math.max(t - lastT, 0), 0.1);
      lastT = t;

      // deep space wash
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#050916");
      bg.addColorStop(0.55, "#060a1d");
      bg.addColorStop(1, "#0b0e26");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const M = Math.max(w, h);
      nebula(w * 0.2, h * 0.26, M * 0.42, "rgba(62,96,190,0.11)");
      nebula(w * 0.84, h * 0.74, M * 0.48, "rgba(146,72,158,0.075)");
      nebula(w * 0.74, h * 0.12, M * 0.3, "rgba(44,148,158,0.07)");

      const s = Math.min(w, h) / 1000;
      nebula(w / 2, h / 2, 330 * s, "rgba(255,170,70,0.10)");

      // parallax easing
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;

      // star layers — slow counter-rotation + twinkle
      const depths = [5, 11, 19];
      const rots = [0.0016, -0.0011, 0.0007];
      layers.forEach((layer, li) => {
        ctx.save();
        ctx.translate(w / 2 + mouse.x * depths[li], h / 2 + mouse.y * depths[li]);
        if (!reduced) ctx.rotate(t * rots[li]);
        for (const st of layer) {
          const tw = reduced ? st.base : st.base + st.amp * Math.sin(t * st.speed + st.phase);
          ctx.globalAlpha = Math.max(0.06, tw);
          ctx.fillStyle = st.hue;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      ctx.globalAlpha = 1;

      // asteroid belt, driven by the same clock as the planets
      const days = simRef.current;
      ctx.save();
      ctx.translate(w / 2 + mouse.x * 8, h / 2 + mouse.y * 8);
      ctx.fillStyle = "#9aa4b8";
      for (const rk of rocks) {
        const a = rk.angle + (Math.PI * 2 * days) / rk.period;
        const r = rk.orbit * s;
        ctx.globalAlpha = rk.alpha;
        ctx.fillRect(Math.cos(a) * r, Math.sin(a) * r, rk.size, rk.size);
      }
      ctx.restore();
      ctx.globalAlpha = 1;

      // meteors
      if (!reduced) {
        if (t > nextMeteorAt && meteors.length < 3) {
          const dir = Math.random() < 0.5 ? -1 : 1;
          meteors.push({
            x: rand(0.15, 0.85) * w,
            y: rand(-0.02, 0.3) * h,
            vx: dir * rand(320, 560),
            vy: rand(170, 300),
            life: 0,
            maxLife: rand(0.7, 1.15),
          });
          nextMeteorAt = t + rand(3.5, 8.5);
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.life += dt;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          if (m.life >= m.maxLife) {
            meteors.splice(i, 1);
            continue;
          }
          const a = Math.sin((m.life / m.maxLife) * Math.PI);
          const tx = m.x - m.vx * 0.14;
          const ty = m.y - m.vy * 0.14;
          const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
          g.addColorStop(0, `rgba(255,240,214,${0.9 * a})`);
          g.addColorStop(1, "rgba(255,240,214,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }
      }
    };

    build();

    const onResize = () => {
      build();
      if (reduced) frame(1234567);
    };
    const onMouse = (e: MouseEvent) => {
      mouse.tx = (e.clientX / Math.max(w, 1) - 0.5) * 2;
      mouse.ty = (e.clientY / Math.max(h, 1) - 0.5) * 2;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);

    if (reduced) {
      // static, fully-composed frame — no animation loop
      frame(1234567);
    } else {
      const loop = (now: number) => {
        frame(now);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [reduced, simRef]);

  return <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />;
}
