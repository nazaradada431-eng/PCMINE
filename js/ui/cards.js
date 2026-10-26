import { specs } from '../data/items.js';
import { fmt } from '../core/format.js';

const COMPONENT_ASSETS = {
  gpu: 'gpu.svg', cpu: 'cpu.svg', ram: 'ram.svg', cooler: 'cooler.svg',
  psu: 'psu.svg', mobo: 'motherboard.svg'
};

export function componentImage(item, className = 'component-art') {
  const file = COMPONENT_ASSETS[item?.category];
  return file ? `<img src="assets/${file}" class="${className}" alt="${item.name}" draggable="false">` : '';
}

export function specText(item) {
  const s = specs(item);
  return `${s.isPsu ? 'CAP' : 'TDP'} ${s.watt}W · ${s.hash.toFixed(1)} MH/s`;
}

export function specLine(item) {
  const s = specs(item);
  return `<div class="mono text-[9px] text-slate-500 flex justify-between"><span>${s.isPsu ? 'CAP' : 'TDP'} ${s.watt}W</span><span>${s.hash.toFixed(1)} MH/s</span></div>`;
}

export function cardInner(item, extra = '') {
  return `
    <div class="flex justify-between items-start">
      ${componentImage(item, 'component-art component-art-card')}
      <span class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-black/50 text-slate-300">${item.rarity}</span>
    </div>
    <div class="my-2">
      <div class="text-xs font-bold text-white truncate">${item.name}</div>
      <div class="mono text-[10px] text-amber-400 font-semibold">${fmt(item.price)} 🪙</div>
      ${specLine(item)}
    </div>${extra}`;
}
