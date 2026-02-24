import { useEffect, useRef, useState } from 'react';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
];

export default function SpinWheel({ players, onSpinComplete }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const animRef = useRef(null);
  const startAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const startTimeRef = useRef(null);
  const durationRef = useRef(3000);

  const numSlices = players.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  function drawWheel(currentAngle) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 8;

    ctx.clearRect(0, 0, size, size);

    // Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.restore();

    players.forEach((player, i) => {
      const start = currentAngle + i * sliceAngle;
      const end = start + sliceAngle;

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#1a1a2e';
      ctx.font = `bold ${Math.min(14, radius / (numSlices * 0.6))}px Inter, sans-serif`;
      ctx.shadowColor = 'rgba(255,255,255,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(player.name, radius - 12, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pointer (right side)
    const px = size - 4;
    ctx.beginPath();
    ctx.moveTo(px, cy - 14);
    ctx.lineTo(px - 26, cy);
    ctx.lineTo(px, cy + 14);
    ctx.closePath();
    ctx.fillStyle = '#e94560';
    ctx.shadowColor = '#e94560';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  useEffect(() => {
    drawWheel(angle);
  }, [players, angle]);

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function spin() {
    if (spinning) return;
    setSpinning(true);

    const extraSpins = 5 + Math.random() * 5;
    const randomStop = Math.random() * 2 * Math.PI;
    const total = extraSpins * 2 * Math.PI + randomStop;

    startAngleRef.current = angle;
    targetAngleRef.current = angle + total;
    startTimeRef.current = null;
    durationRef.current = 3000 + Math.random() * 1500;

    function animate(timestamp) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / durationRef.current, 1);
      const eased = easeOut(progress);
      const current = startAngleRef.current + total * eased;

      setAngle(current);
      drawWheel(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        // Figure out which slice the pointer landed on
        // Pointer is at angle=0 (right side), wheel rotated by current
        const normalized = ((current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        // Pointer at 0 rad: which slice is at 0?
        const pointerAngle = (2 * Math.PI - normalized) % (2 * Math.PI);
        const index = Math.floor(pointerAngle / sliceAngle) % numSlices;
        onSpinComplete(players[index]);
      }
    }

    animRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="wheel-container">
      <div className="wheel-wrapper">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{ display: 'block', margin: '0 auto' }}
        />
      </div>
      <button
        className={`spin-btn ${spinning ? 'spinning' : ''}`}
        onClick={spin}
        disabled={spinning || players.length < 2}
      >
        {spinning ? (
          <span className="spin-text">
            <span className="dot-anim">Spinning</span>
          </span>
        ) : (
          '🎲 SPIN!'
        )}
      </button>
    </div>
  );
}
