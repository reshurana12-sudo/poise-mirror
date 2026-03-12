import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const MirrorVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      time += 0.008;
      const w = canvas.width;
      const h = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // Background radial
      const grad = ctx.createRadialGradient(
        w * mx, h * my, 0,
        w * 0.5, h * 0.5, w * 0.6
      );
      grad.addColorStop(0, "rgba(45, 180, 160, 0.08)");
      grad.addColorStop(0.5, "rgba(45, 180, 160, 0.02)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Concentric rings
      const cx = w * 0.5 + (mx - 0.5) * w * 0.1;
      const cy = h * 0.5 + (my - 0.5) * h * 0.1;

      for (let i = 0; i < 6; i++) {
        const radius = 60 + i * 50 + Math.sin(time + i * 0.5) * 15;
        const alpha = 0.12 - i * 0.015;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(45, 180, 160, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Face-like oval outline
      ctx.beginPath();
      ctx.ellipse(cx, cy - 10, 80 + Math.sin(time) * 4, 110 + Math.cos(time * 0.7) * 5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(45, 180, 160, 0.18)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cross-hair lines
      const lineLen = 30;
      ctx.strokeStyle = "rgba(45, 180, 160, 0.12)";
      ctx.lineWidth = 1;
      // horizontal
      ctx.beginPath();
      ctx.moveTo(cx - lineLen - 90, cy);
      ctx.lineTo(cx - 90, cy);
      ctx.moveTo(cx + 90, cy);
      ctx.lineTo(cx + lineLen + 90, cy);
      ctx.stroke();
      // vertical
      ctx.beginPath();
      ctx.moveTo(cx, cy - lineLen - 120);
      ctx.lineTo(cx, cy - 120);
      ctx.moveTo(cx, cy + 120);
      ctx.lineTo(cx, cy + lineLen + 120);
      ctx.stroke();

      // Floating data points
      const points = [
        { x: cx - 100, y: cy - 60, label: "symmetry" },
        { x: cx + 95, y: cy - 40, label: "structure" },
        { x: cx - 70, y: cy + 80, label: "posture" },
        { x: cx + 80, y: cy + 60, label: "presence" },
      ];
      points.forEach((p, i) => {
        const px = p.x + Math.sin(time * 0.8 + i) * 6;
        const py = p.y + Math.cos(time * 0.6 + i) * 6;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 180, 160, ${0.4 + Math.sin(time + i) * 0.2})`;
        ctx.fill();
      });

      // Scan line
      const scanY = (Math.sin(time * 0.5) * 0.5 + 0.5) * h;
      const scanGrad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
      scanGrad.addColorStop(0, "transparent");
      scanGrad.addColorStop(0.5, "rgba(45, 180, 160, 0.06)");
      scanGrad.addColorStop(1, "transparent");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(cx - 150, scanY - 20, 300, 40);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
      className="relative w-full aspect-square max-w-md mx-auto"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-full"
        style={{ filter: "blur(0.5px)" }}
      />
      <div className="absolute inset-0 rounded-full border border-primary/10" />
      <div className="absolute inset-4 rounded-full border border-primary/5" />
    </motion.div>
  );
};

export default MirrorVisual;
