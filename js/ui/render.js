import { $ } from './dom.js';
import { icons } from './icons.js';
import { cardInner, specLine, specText } from './cards.js';
import { ITEMS_DB, SLOTS, specs } from '../data/items.js';
import { fmt } from '../core/format.js';
import { game, ui } from '../core/state.js';

export const TABS = [
  { id: 'upgrade', label: 'Апгрейдер', short: 'Апгрейд', icon: 'zap' },
  { id: 'rig', label: 'Майнинг ПК', short: 'Ферма', icon: 'cpu' },
  { id: 'shop', label: 'Магазин железа', short: 'Магазин', icon: 'shopping-cart' },
  { id: 'tap', label: 'Разгон (тап)', short: 'Разгон', icon: 'mouse-pointer-click' }
];

export function renderTabs(active) {
  TABS.forEach((t) => {
    const b = $(`tab-btn-${t.id}`);
    const on = t.id === active;
    b.className =
      'px-5 py-2.5 font-bold text-sm flex items-center gap-2 transition shrink-0 rounded-xl ' +
      (on ? 'btn-main' : 'bg-[#13141a] text-slate-300 hover:text-white');
    b.innerHTML = `<i data-lucide="${t.icon}" class="w-4 h-4"></i>${t.label}`;
  });

  const navButton = (t) =>
    `<button data-action="tab" data-tab="${t.id}" class="${t.id === active ? 'on' : ''}"><i data-lucide="${t.icon}" class="w-5 h-5"></i>${t.short}</button>`;
  const promoButton = `<button data-action="promo-open"><i data-lucide="gift" class="w-5 h-5"></i>Промокод</button>`;
  const upgradeFab = `<button class="fab ${active === 'upgrade' ? 'on' : ''}" data-action="tab" data-tab="upgrade" aria-label="Апгрейд"><i data-lucide="zap" class="w-6 h-6"></i></button>`;
  $('bottom-nav').innerHTML = promoButton + navButton(TABS[1]) + upgradeFab + navButton(TABS[2]) + navButton(TABS[3]);
  icons();
}

export function showView(tab) {
  TABS.forEach((t) => $(`view-${t.id}`).classList.toggle('hidden', t.id !== tab));
  renderTabs(tab);
  window.scrollTo({ top: 0 });
}

export function renderBalance() {
  $('user-balance').innerText = fmt(game.coins);
  $('click-power-val').innerText = fmt(game.clickPower);
}

export function renderInventory() {
  const grid = $('inventory-grid');
  $('inventory-count').innerText = game.inventory.length;

  if (!game.inventory.length) {
    grid.innerHTML = `<div class="col-span-full py-8 text-center text-xs text-slate-500">Инвентарь пуст. Заработайте монеты или купите деталь в магазине.</div>`;
    return;
  }

  grid.innerHTML = game.inventory
    .map((item) => {
      const inSlot = ui.inputIds.includes(item.instanceId);
      const extra = `
        ${inSlot ? '<div class="text-[10px] font-bold text-amber-400 text-center mb-1">✓ В апгрейдере</div>' : ''}
        <button data-action="sell" data-id="${item.instanceId}" class="w-full py-1 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-[10px] font-bold transition">Продать</button>`;
      return `
        <div data-drag="inv" data-id="${item.instanceId}" class="drag-card rarity-${item.rarity} border p-2.5 flex flex-col justify-between transition hover:-translate-y-0.5 relative ${inSlot ? 'ring-2 ring-amber-400 glow-yellow-sm' : ''}">
          ${cardInner(item, extra)}
        </div>`;
    })
    .join('');
  icons();
}

export function renderTargets() {
  const category = $('filter-category').value;
  const list = category === 'all' ? ITEMS_DB : ITEMS_DB.filter((i) => i.category === category);
  $('target-shop-grid').innerHTML = list
    .map((item) => {
      const selected = ui.target && ui.target.id === item.id;
      const extra = `<div class="w-full py-1 rounded-lg bg-white/5 text-slate-300 text-[11px] font-semibold text-center">${selected ? 'Выбрано' : 'Цель'}</div>`;
      return `
        <div data-drag="target" data-id="${item.id}" class="drag-card rarity-${item.rarity} border p-2.5 flex flex-col justify-between transition hover:-translate-y-0.5 ${selected ? 'ring-2 ring-emerald-400' : ''}">
          ${cardInner(item, extra)}
        </div>`;
    })
    .join('');
  icons();
}

export function renderShop() {
  $('main-shop-grid').innerHTML = ITEMS_DB.map((item) => {
    const can = game.coins >= item.price;
    return `
      <div class="rarity-${item.rarity} border p-3 sm:p-4 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start mb-2">
            <i data-lucide="${item.icon}" class="w-6 h-6 text-slate-200"></i>
            <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-black/60 text-slate-300">${item.rarity}</span>
          </div>
          <div class="font-bold text-sm text-white">${item.name}</div>
          <div class="text-xs text-amber-400 font-semibold mt-0.5 mono">+${item.income} 🪙/сек</div>
          <div class="mono text-[10px] text-slate-500 mt-1">${specText(item)}</div>
        </div>
        <div class="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
          <div class="mono text-xs font-extrabold text-amber-400">${fmt(item.price)} 🪙</div>
          <button data-action="buy" data-id="${item.id}" ${can ? '' : 'disabled'} class="w-full py-2 font-bold text-xs ${can ? 'btn-main' : 'bg-[#1c1e26] text-slate-600 cursor-not-allowed'} transition">Купить</button>
        </div>
      </div>`;
  }).join('');
  icons();
}

export function renderSlots(items) {
  $('input-count').innerText = items.length;
  const slots = $('input-slots');

  if (!items.length) {
    slots.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center gap-1.5 text-center px-1">
        <i data-lucide="chevrons-down" class="w-10 h-10 text-amber-400/50"></i>
        <span class="text-xs font-semibold text-slate-300">Выберите предметы и/или баланс для использования</span>
        <span class="text-[11px] text-slate-500">Можно выбрать несколько предметов</span>
      </div>`;
  } else {
    slots.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-1.5">${items
      .map(
        (it) => `
        <div class="rarity-${it.rarity} border px-2 py-1.5 relative flex items-center gap-2 min-w-0">
          <i data-lucide="${it.icon}" class="w-4 h-4 text-amber-400 shrink-0"></i>
          <div class="min-w-0 flex-1">
            <div class="text-[11px] font-bold text-white truncate">${it.name}</div>
            <div class="mono text-[10px] text-amber-400 font-semibold">${fmt(it.price)} 🪙</div>
          </div>
          <button data-action="remove-input" data-id="${it.instanceId}" class="w-6 h-6 rounded-md flex items-center justify-center bg-black/50 hover:bg-red-500 text-slate-300 hover:text-white transition shrink-0"><i data-lucide="x" class="w-3 h-3"></i></button>
        </div>`
      )
      .join('')}</div>`;
  }

  const display = $('target-item-display');
  if (ui.target) {
    const t = ui.target;
    display.innerHTML = `
      <div class="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rarity-${t.rarity} border flex items-center justify-center text-amber-400"><i data-lucide="${t.icon}" class="w-8 h-8 lg:w-12 lg:h-12"></i></div>
      <span class="text-xs sm:text-sm font-bold text-white leading-tight px-1">${t.name}</span>
      <span class="mono text-sm text-amber-400 font-bold">${fmt(t.price)} 🪙</span>`;
  } else {
    display.innerHTML = `<i data-lucide="chevrons-up" class="w-10 h-10 text-amber-400/50"></i><span class="text-xs font-semibold text-slate-300">Выберите предмет для апгрейда</span>`;
  }
  icons();
}

export function renderHistory() {
  const feed = $('live-feed');
  if (!game.upgradeHistory.length) {
    feed.innerHTML = `<div class="text-xs text-slate-500 py-3 text-center w-full">Вы ещё не совершали апгрейдов</div>`;
    return;
  }
  feed.innerHTML = game.upgradeHistory
    .map(
      (h) => `
      <div class="p-2.5 rounded-xl bg-[#13141a] border-l-4 ${h.isWin ? 'border-emerald-500' : 'border-red-500'} text-xs flex flex-col gap-0.5 shrink-0 w-[190px] lg:w-full">
        <div class="flex items-center justify-between gap-2">
          <span class="font-bold text-white truncate">${h.itemName}</span>
          <span class="text-[10px] font-extrabold ${h.isWin ? 'text-emerald-400' : 'text-red-400'}">${h.isWin ? 'УСПЕХ' : 'ПРОВАЛ'}</span>
        </div>
        <div class="flex items-center justify-between text-[11px] text-slate-400 mono"><span>Шанс ${h.chance}</span><span>${h.timestamp}</span></div>
        ${h.roll ? `<div class="text-[10px] text-slate-500 mono">бросок ${h.roll}</div>` : ''}
      </div>`
    )
    .join('');
}

export function renderRig() {
  const rigs = game.rigs || [];
  $('rig-slots').innerHTML = rigs.map((rig, index) => {
    const parts = Object.values(rig.slots);
    const complete = parts.every(Boolean);
    const income = parts.reduce((sum, it) => sum + (it ? it.income : 0), 0);
    return `<section class="col-span-full bg-[#0d0e12] border border-[#242630] rounded-xl p-3 sm:p-4">
      <div class="flex justify-between items-center gap-3 mb-3"><div><div class="font-bold text-white">Компьютер ${index + 1}</div><div class="text-xs text-slate-400 mt-0.5">${complete ? '<span class="text-emerald-400">Собран · бонус +10%</span>' : 'Соберите все 6 компонентов для бонуса +10%'}</div></div><div class="text-right text-amber-400 font-bold mono text-sm">+${(income * (complete ? 1.1 : 1)).toFixed(1)}/с</div></div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">${SLOTS.map((slot) => {
        const eq = rig.slots[slot.cat];
        return `<div class="bg-[#13141a] rounded-xl p-2.5 flex flex-col items-center justify-between min-h-[145px]"><span class="label text-center">${slot.label}</span><div class="my-2 text-center flex flex-col items-center min-w-0 w-full">${eq ? `<i data-lucide="${eq.icon}" class="w-7 h-7 text-amber-400 mb-1"></i><span class="text-[11px] font-bold text-white truncate max-w-full">${eq.name}</span><span class="text-[10px] text-amber-400 font-semibold mono">+${eq.income}/с</span>` : `<i data-lucide="${slot.icon}" class="w-7 h-7 text-slate-600 mb-1"></i><span class="text-xs text-slate-500">Пусто</span>`}</div>${eq ? `<button data-action="unequip" data-rig="${rig.id}" data-cat="${slot.cat}" class="w-full py-1.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold transition">Снять</button>` : `<button data-action="equip-open" data-rig="${rig.id}" data-cat="${slot.cat}" class="w-full py-1.5 bg-[#1c1e26] hover:bg-[#262831] text-slate-200 text-xs font-semibold transition">Выбрать деталь</button>`}</div>`;
      }).join('')}</div></section>`;
  }).join('') + `<button data-action="rig-add" class="col-span-full py-3 bg-[#13141a] hover:bg-[#1c1e26] border border-dashed border-[#3a3d48] rounded-xl text-slate-200 font-bold text-sm transition">＋ Добавить компьютер</button>`;
  icons();
}
export function renderRigStats() {
  let income = 0;
  let hash = 0;
  let draw = 0;
  let cap = 0;
  (game.rigs || []).forEach((rig) => {
    const parts = Object.values(rig.slots);
    const multiplier = parts.every(Boolean) ? 1.1 : 1;
    parts.forEach((it) => {
      if (!it) return;
      income += it.income * multiplier;
      hash += it.income * 1.7 * multiplier;
      const s = specs(it);
      if (s.isPsu) cap += s.watt;
      else draw += s.watt;
    });
  });

  $('stat-income-rate').innerText = income.toFixed(1);
  $('stat-hash').innerText = hash.toFixed(1);
  $('rig-total-income').innerText = income.toFixed(1);
  $('rig-hash').innerText = hash.toFixed(1);
  $('rig-power').innerText = draw;
  $('rig-eff').innerText = draw > 0 ? (hash / draw).toFixed(2) : '0.00';

  const pct = cap > 0 ? Math.min(100, (draw / cap) * 100) : draw > 0 ? 100 : 0;
  const bar = $('rig-load-bar');
  bar.style.width = pct + '%';
  bar.className = 'h-full transition-all ' + (pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-400' : 'bg-emerald-400');
  $('rig-load-text').innerText = cap > 0 ? `${draw} W / ${cap} W · ${pct.toFixed(0)}%` : draw > 0 ? `${draw} W / нет БП` : '— / —';
}
export function renderEquipList(category, rigId) {
  const items = game.inventory.filter((i) => i.category === category);
  $('equip-modal-list').innerHTML = items.length
    ? items
        .map(
          (item) => `
          <div data-action="equip" data-rig="${rigId}" data-cat="${category}" data-id="${item.instanceId}" class="rarity-${item.rarity} border p-2.5 cursor-pointer hover:border-amber-400 flex flex-col justify-between">
            <div class="text-xs font-bold text-white truncate">${item.name}</div>
            <div class="text-[11px] text-amber-400 font-semibold mt-1 mono">+${item.income} 🪙/сек</div>
            ${specLine(item)}
          </div>`
        )
        .join('')
    : `<div class="col-span-2 py-6 text-center text-xs text-slate-500">Нет подходящих комплектующих в инвентаре.</div>`;
}

export function setPanel(panel) {
  $('panel-inv').classList.toggle('hidden', panel !== 'inv');
  $('panel-target').classList.toggle('hidden', panel !== 'target');
  $('ptab-inv').classList.toggle('on', panel === 'inv');
  $('ptab-target').classList.toggle('on', panel === 'target');
}

export function renderAudioIcon() {
  $('audio-toggle').innerHTML = game.audioEnabled
    ? `<i data-lucide="volume-2" class="w-4 h-4"></i>`
    : `<i data-lucide="volume-x" class="w-4 h-4 text-red-400"></i>`;
  icons();
}
