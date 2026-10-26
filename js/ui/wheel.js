import { $ } from './dom.js';
import { ui } from '../core/state.js';
import { playSound } from '../core/audio.js';

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 131;
const WIDTH = 18;
const TOP = -Math.PI / 2;
const TAU = Math.PI * 2;
const MIN_VISIBLE_DEG = 1.6;

export function setupCanvas() {
  const canvas = $('wheel-canvas');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = SIZE * dpr;
  canvas.height = SIZE * dpr;
  canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  $('wheel-arm').style.transform = `rotate(${ui.wheelAngle}deg)`;
}

function drawTicks(ctx) {
  for (let i = 0; i < 100; i++) {
    const a = TOP + (i / 100) * TAU;
    const long = i % 10 === 0;
    const r1 = RADIUS + WIDTH / 2 + 2;
    const r2 = r1 + (long ? 7 : 3.5);
    ctx.beginPath();
    ctx.moveTo(CENTER + Math.cos(a) * r1, CENTER + Math.sin(a) * r1);
    ctx.lineTo(CENTER + Math.cos(a) * r2, CENTER + Math.sin(a) * r2);
    ctx.strokeStyle = long ? 'rgba(255,210,31,.5)' : 'rgba(148,163,184,.2)';
    ctx.lineWidth = long ? 1.5 : 1;
    ctx.stroke();
  }
}

function drawTrack(ctx) {
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, RADIUS, 0, TAU);
  ctx.strokeStyle = '#1a1c23';
  ctx.lineWidth = WIDTH;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, RADIUS + WIDTH / 2 + 1, 0, TAU);
  ctx.strokeStyle = '#272a33';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawWinZone(ctx, chance) {
  const exact = (chance / 100) * TAU;
  const drawn = Math.max(exact, (MIN_VISIBLE_DEG * Math.PI) / 180);
  const start = Math.PI / 2 - drawn / 2;
  const end = start + drawn;
  const gradient = ctx.createLinearGradient(0, CENTER - RADIUS, 0, CENTER + RADIUS);
  gradient.addColorStop(0, '#ffe033');
  gradient.addColorStop(0.58, '#ffd21f');
  gradient.addColorStop(0.84, '#ff8a18');
  gradient.addColorStop(1, '#ff3b30');

  ctx.save();
  ctx.shadowColor = 'rgba(255,190,30,.5)';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, RADIUS, start, end);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = WIDTH;
  ctx.lineCap = 'butt';
  ctx.stroke();
  ctx.restore();

  if (drawn >= TAU - 0.001) return;
  [start, end].forEach((a) => {
    const inner = RADIUS - WIDTH / 2 - 3;
    const outer = RADIUS + WIDTH / 2 + 3;
    ctx.beginPath();
    ctx.moveTo(CENTER + Math.cos(a) * inner, CENTER + Math.sin(a) * inner);
    ctx.lineTo(CENTER + Math.cos(a) * outer, CENTER + Math.sin(a) * outer);
    ctx.strokeStyle = '#fff7c2';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

export function drawWheel(chance) {
  ui.lastChance = chance;
  const ctx = $('wheel-canvas').getContext('2d');
  ctx.clearRect(0, 0, SIZE, SIZE);
  drawTicks(ctx);
  drawTrack(ctx);
  if (chance > 0) drawWinZone(ctx, chance);
}

export function spinArrow(rollDeg, chance, onDone) {
  const arm = $('wheel-arm');
  const start = ui.wheelAngle;
  const targetDeg = rollDeg + 180 - chance * 1.8;
  const currentAngle = ((start % 360) + 360) % 360;
  const targetAngle = ((targetDeg % 360) + 360) % 360;
  const delta = -(((currentAngle - targetAngle + 360) % 360) + 6 * 360);
  const end = start + delta;
  const duration = 5200;
  const t0 = performance.now();
  let lastTickIndex = -1;
  let lastTickTime = 0;

  function frame(now) {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    const angle = start + delta * eased;
    arm.style.transform = `rotate(${angle}deg)`;

    const tickIndex = Math.floor(angle / 7.2);
    if (tickIndex !== lastTickIndex && now - lastTickTime > 40) {
      playSound('tick');
      lastTickTime = now;
    }
    lastTickIndex = tickIndex;

    if (p < 1) {
      requestAnimationFrame(frame);
      return;
    }
    ui.wheelAngle = end;
    arm.style.transform = `rotate(${end}deg)`;
    const endAngle = ((end % 360) + 360) % 360;
    const returnDelta = ((180 - endAngle + 540) % 360) - 180;
    const homeAngle = end + returnDelta;
    arm.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1)';
    requestAnimationFrame(() => {
      arm.style.transform = `rotate(${homeAngle}deg)`;
    });
    window.setTimeout(() => {
      arm.style.transition = '';
      arm.style.transform = 'rotate(180deg)';
      ui.wheelAngle = 180;
      onDone();
    }, 440);
  }

  requestAnimationFrame(frame);
}
