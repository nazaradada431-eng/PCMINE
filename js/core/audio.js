import { game } from './state.js';

let ctx = null;

function getContext() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

const SOUNDS = {
  click(osc, gain, t) {
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.05);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    return 0.05;
  },
  pick(osc, gain, t) {
    osc.type = 'square';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.setValueAtTime(780, t + 0.05);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    return 0.12;
  },
  tick(osc, gain, t) {
    osc.frequency.setValueAtTime(220, t);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    return 0.02;
  },
  win(osc, gain, t) {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.setValueAtTime(500, t + 0.1);
    osc.frequency.setValueAtTime(800, t + 0.2);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    return 0.4;
  },
  lose(osc, gain, t) {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(250, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.3);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    return 0.3;
  }
};

export function playSound(type) {
  if (!game.audioEnabled || !SOUNDS[type]) return;
  const ac = getContext();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    const duration = SOUNDS[type](osc, gain, ac.currentTime);
    osc.start();
    osc.stop(ac.currentTime + duration);
  } catch (e) {
    return;
  }
}
