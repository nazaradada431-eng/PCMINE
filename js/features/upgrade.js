import { confetti } from '../ui/effects.js';
import { $ } from '../ui/dom.js';
import { icons } from '../ui/icons.js';
import { drawWheel, spinArrow } from '../ui/wheel.js';
import { mountGlass } from '../ui/glass.js';
import {
  renderInventory,
  renderTargets,
  renderSlots,
  renderHistory,
  renderBalance,
  setPanel
} from '../ui/render.js';
import { ITEMS_DB } from '../data/items.js';
import { fmt, fmtChance, fmtMultiplier } from '../core/format.js';
import { game, ui, uid, hooks, saveGame } from '../core/state.js';
import { playSound } from '../core/audio.js';

const MAX_CHANCE = 95;
const QUICK_MULTIPLIERS = [
  { value: 2, color: 'green' },
  { value: 3, color: 'yellow' },
  { value: 8, color: 'red' }
];
const QUICK_PERCENTS = [
  { value: 25, color: 'red' },
  { value: 50, color: 'yellow' },
  { value: 75, color: 'green' }
];
const SHAPES = ['left', 'mid', 'right'];

function setUpgradeReady(ready) {
  const btn = $('btn-upgrade-action');
  btn.disabled = !ready;
  btn.classList.toggle('g-gold', ready);
  btn.classList.toggle('g-off', !ready);
}

export function selectedItems() {
  return ui.inputIds.map((id) => game.inventory.find((i) => i.instanceId === id)).filter(Boolean);
}

export function refreshSlots() {
  const items = selectedItems();
  ui.inputIds = items.map((i) => i.instanceId);
  renderSlots(items);
}

function afterSelectionChange() {
  clearQuick();
  renderInventory();
  refreshSlots();
  updateCalc();
}

export function addInput(id) {
  if (ui.spinning || ui.inputIds.includes(id)) return false;
  if (!game.inventory.some((i) => i.instanceId === id)) return false;
  ui.inputIds.push(id);
  afterSelectionChange();
  playSound('pick');
  return true;
}

export function removeInput(id) {
  if (ui.spinning) return;
  ui.inputIds = ui.inputIds.filter((x) => x !== id);
  afterSelectionChange();
  playSound('click');
}

export function toggleInput(id) {
  if (ui.inputIds.includes(id)) removeInput(id);
  else addInput(id);
}

export function clearInputs() {
  if (ui.spinning || !ui.inputIds.length) return;
  ui.inputIds = [];
  afterSelectionChange();
  playSound('click');
}

export function setTarget(itemId) {
  if (ui.spinning) return;
  ui.target = ITEMS_DB.find((i) => i.id === itemId) || null;
  clearQuick();
  renderTargets();
  refreshSlots();
  updateCalc();
  playSound('pick');
}

export function boxClick(which, event) {
  if (event && event.target.closest('button')) return;
  if (which === 'inv') {
    if (selectedItems().length) return;
    setPanel('inv');
  } else {
    setPanel('target');
  }
  $('items-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function onCoinsInput() {
  clearQuick();
  updateCalc();
}

export function calcUpgrade() {
  const items = selectedItems();
  const range = $('add-coins-range');
  const added = Math.min(parseInt(range.value, 10) || 0, Math.floor(game.coins));
  const itemsValue = items.reduce((s, i) => s + i.price, 0);
  const inputValue = itemsValue + added;
  const targetValue = ui.target ? ui.target.price : 0;
  let chance = 0;
  if (targetValue > 0 && inputValue > 0) chance = Math.min(MAX_CHANCE, (inputValue / targetValue) * 100);
  return { items, added, inputValue, targetValue, chance };
}

export function updateCalc() {
  if (ui.spinning) return;
  const range = $('add-coins-range');
  const maxCoins = Math.max(0, Math.floor(game.coins));
  range.max = maxCoins;
  range.step = Math.max(1, Math.floor(maxCoins / 2000));

  const c = calcUpgrade();
  $('add-coins-val').innerText = `+${fmt(c.added)} 🪙`;
  $('in-value').innerText = `${fmt(c.inputValue)} 🪙`;
  $('calc-chance').innerText = fmtChance(c.chance);
  $('calc-multiplier').innerText = fmtMultiplier(c.targetValue, c.inputValue);
  const spins = game.freeSpins || 0;
  $('free-spins').innerText = spins;
  $('free-spins-badge').classList.toggle('hidden', spins <= 0);

  setUpgradeReady(c.chance > 0 && !!ui.target);

  if (c.chance !== ui.lastChance) drawWheel(c.chance);
}

export function initQuick() {
  $('quick-mult').innerHTML = QUICK_MULTIPLIERS.map(
    (m, i) =>
      `<button class="gpiece qbtn g-${m.color}" data-shape="${SHAPES[i]}" data-action="quick" data-key="m${m.value}" data-ratio="${m.value}"><span>x${m.value}</span></button>`
  ).join('');
  $('quick-pct').innerHTML = QUICK_PERCENTS.map(
    (p, i) =>
      `<button class="gpiece qbtn g-${p.color}" data-shape="${SHAPES[i]}" data-action="quick" data-key="p${p.value}" data-ratio="${100 / p.value}"><span>${p.value}%</span></button>`
  ).join('');
  mountGlass($('quick-mult'));
  mountGlass($('quick-pct'));
  mountGlass($('btn-upgrade-action'));
}

export function clearQuick() {
  ui.quick = null;
  document.querySelectorAll('.qbtn.on').forEach((b) => b.classList.remove('on'));
  $('quick-msg').innerText = '';
}

function setQuickMessage(text, error) {
  const el = $('quick-msg');
  el.className = `text-xs text-center mt-2 min-h-[16px] ${error ? 'text-red-400' : 'text-slate-400'}`;
  el.innerText = text;
}

export function quickPick(key, ratio) {
  if (ui.spinning) return;
  const c = calcUpgrade();
  if (c.inputValue <= 0) {
    setQuickMessage('Сначала добавьте предметы или монеты', true);
    return;
  }

  const wanted = c.inputValue * ratio;
  let best = null;
  let bestDistance = Infinity;
  ITEMS_DB.forEach((item) => {
    const distance = Math.abs(Math.log(item.price / wanted));
    if (distance < bestDistance) {
      bestDistance = distance;
      best = item;
    }
  });

  ui.target = best;
  renderTargets();
  refreshSlots();
  updateCalc();

  ui.quick = key;
  document.querySelectorAll('.qbtn').forEach((b) => b.classList.toggle('on', b.dataset.key === key));
  const real = Math.min(MAX_CHANCE, (c.inputValue / best.price) * 100);
  setQuickMessage(`${best.name} · шанс ${fmtChance(real)}`, false);
  playSound('pick');
}

function secureRandom() {
  try {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0] / 4294967296;
  } catch (e) {
    return Math.random();
  }
}

export function setStatus(text, cls) {
  const el = $('wheel-status');
  el.innerText = text;
  el.className = 'text-[11px] mt-1.5 ' + cls;
}

export function performUpgrade() {
  if (ui.spinning) return;
  const c = calcUpgrade();
  if (c.chance <= 0 || !ui.target) return;

  const target = ui.target;
  const lostItems = c.items.slice();
  const chance = c.chance;
  const coinsSpent = c.added;
  const free = (game.freeSpins || 0) > 0;
  if (free) game.freeSpins--;

  game.coins -= c.added;
  const consumed = new Set(c.items.map((i) => i.instanceId));
  game.inventory = game.inventory.filter((i) => !consumed.has(i.instanceId));
  ui.inputIds = [];
  $('add-coins-range').value = 0;
  clearQuick();

  ui.spinning = true;
  setUpgradeReady(false);
  renderBalance();
  renderInventory();
  setStatus('Вращение…', 'text-amber-400');

  const roll = game.rigged ? secureRandom() * chance : secureRandom() * 100;
  const isWin = roll < chance;

  spinArrow(roll * 3.6, () => {
    ui.spinning = false;
    finishUpgrade({ isWin, chance, roll, target, lostItems, free, coinsSpent });
  });
}

function finishUpgrade({ isWin, chance, roll, target, lostItems, free, coinsSpent }) {
  const refunded = free && !isWin;
  if (refunded) {
    game.inventory.push(...lostItems);
    game.coins += coinsSpent;
  }

  game.upgradeCount++;
  game.upgradeHistory.unshift({
    id: game.upgradeCount,
    itemName: target.name,
    isWin,
    chance: fmtChance(chance),
    roll: roll.toFixed(4),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  if (game.upgradeHistory.length > 30) game.upgradeHistory.pop();

  if (isWin) {
    playSound('win');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    game.inventory.push({ ...target, instanceId: uid() });
    setStatus('Успех!', 'text-emerald-400');
  } else {
    playSound('lose');
    setStatus('Промах', 'text-red-400');
  }

  showResult(isWin, target, { chance, roll, lostItems, refunded });
  renderHistory();
  hooks.refresh();
  saveGame();
}

function showResult(isWin, item, info) {
  const card = $('result-card');
  const title = $('result-title');
  const iconBox = $('result-icon-box');
  const lost = info.lostItems.length ? info.lostItems.map((i) => i.name).join(', ') : 'монеты';

  if (isWin) {
    card.className = 'bg-[#0d0e12] border-2 border-emerald-400 rounded-2xl max-w-sm w-full p-6 flex flex-col items-center text-center gap-4 shadow-2xl';
    title.innerText = 'Успех!';
    title.className = 'text-2xl font-black text-emerald-400';
    $('result-desc').innerText = 'Вы получили предмет';
    iconBox.className = 'w-20 h-20 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400';
    iconBox.innerHTML = '<i data-lucide="check-circle" class="w-10 h-10"></i>';
  } else {
    card.className = 'bg-[#0d0e12] border-2 border-red-500 rounded-2xl max-w-sm w-full p-6 flex flex-col items-center text-center gap-4 shadow-2xl';
    title.innerText = 'Неудача';
    title.className = 'text-2xl font-black text-red-500';
    $('result-desc').innerText = info.refunded
      ? 'Бесплатная крутка: предметы и монеты возвращены'
      : `Апгрейд сорвался. Потеряно: ${lost}`;
    iconBox.className = 'w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500';
    iconBox.innerHTML = '<i data-lucide="x-circle" class="w-10 h-10"></i>';
  }

  $('result-item-preview').innerHTML = `
    <i data-lucide="${item.icon}" class="w-8 h-8 text-amber-400"></i>
    <div>
      <div class="text-xs font-bold text-white">${item.name}</div>
      <div class="mono text-[10px] text-amber-400 font-semibold">${fmt(item.price)} 🪙</div>
    </div>`;
  const shownChance = info.chance < 1 ? info.chance.toFixed(4) : info.chance.toFixed(2);
  $('result-roll').innerText = `Бросок ${info.roll.toFixed(4)}% ${isWin ? '<' : '≥'} ${shownChance}%`;
  $('result-modal').classList.remove('hidden');
  icons();
}

export function closeResult() {
  $('result-modal').classList.add('hidden');
  setStatus('Готов', 'text-slate-500');
}
