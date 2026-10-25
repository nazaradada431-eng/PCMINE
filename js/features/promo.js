import { confetti } from '../ui/effects.js';
import { $ } from '../ui/dom.js';
import { renderHistory } from '../ui/render.js';
import { ITEMS_DB, SLOTS, findItem } from '../data/items.js';
import { PROMOS, PROMO_SALT } from '../data/promos.js';
import { game, ui, uid, hooks, saveGame, itemsByGroup } from '../core/state.js';
import { playSound } from '../core/audio.js';

export function openPromo() {
  $('promo-msg').innerHTML = '';
  $('promo-modal').classList.remove('hidden');
  setTimeout(() => $('promo-input').focus(), 50);
}

export function closePromo() {
  $('promo-modal').classList.add('hidden');
}

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function normalize(code) {
  return code.trim().toLowerCase().replace(/\s+/g, '');
}

function equipBest() {
  if (!game.rigs.length) game.rigs.push({ id: uid(), slots: { gpu: null, cpu: null, ram: null, cooler: null, psu: null, mobo: null } });
  const rig = game.rigs[0];
  SLOTS.forEach((slot) => {
    const best = ITEMS_DB.filter((i) => i.category === slot.cat).sort((a, b) => b.price - a.price)[0];
    if (!best) return;
    if (rig.slots[slot.cat]) game.inventory.push(rig.slots[slot.cat]);
    rig.slots[slot.cat] = { ...best, instanceId: uid() };
  });
}

function resetProgress() {
  game.coins = 0;
  game.clickPower = 10;
  game.inventory = [];
  game.upgradeHistory = [];
  game.upgradeCount = 0;
  game.freeSpins = 0;
  game.rigged = false;
  game.rigs = [{ id: uid(), slots: { gpu: null, cpu: null, ram: null, cooler: null, psu: null, mobo: null } }];
  ui.inputIds = [];
}

function applyGrant(grant) {
  if (grant.reset) resetProgress();
  if (grant.coins) game.coins += grant.coins;
  if (grant.click) game.clickPower += grant.click;
  (grant.items || []).forEach(({ group, count }) => {
    itemsByGroup(group).forEach((item) => {
      for (let i = 0; i < count; i++) game.inventory.push({ ...item, instanceId: uid() });
    });
  });
  (grant.itemIds || []).forEach((id) => {
    const item = findItem(id);
    if (item) game.inventory.push({ ...item, instanceId: uid() });
  });
  if (grant.freeSpins) game.freeSpins = (game.freeSpins || 0) + grant.freeSpins;
  if ('rigged' in grant) game.rigged = grant.rigged;
  if (grant.rig === 'best') equipBest();
}

function showMessage(html) {
  $('promo-msg').innerHTML = html;
}

export async function submitPromo() {
  if (ui.spinning) return;
  const input = $('promo-input');
  const code = normalize(input.value);
  if (!code) return;

  let hash;
  try {
    hash = await sha256(PROMO_SALT + code);
  } catch (e) {
    showMessage('<span class="text-red-400">Браузер не поддерживает проверку кода</span>');
    return;
  }

  const promo = PROMOS.find((p) => p.hash === hash);
  if (!promo) {
    showMessage('<span class="text-red-400">Неверный промокод</span>');
    playSound('lose');
    return;
  }

  if (!Array.isArray(game.usedPromos)) game.usedPromos = [];
  if (promo.once && game.usedPromos.includes(promo.hash)) {
    showMessage('<span class="text-red-400">Этот код уже использован</span>');
    playSound('lose');
    return;
  }

  applyGrant(promo.grant);
  if (promo.once) game.usedPromos.push(promo.hash);

  input.value = '';
  showMessage(`<span class="text-emerald-400 font-semibold">Активировано: ${promo.title}</span>`);
  playSound('win');
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
  hooks.refresh();
  renderHistory();
  saveGame();
}
