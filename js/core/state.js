import { ITEMS_DB, findItem } from '../data/items.js';

const STORAGE_KEY = 'pcmine_save';
const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000;

export const hooks = { refresh: () => {} };

const emptyRigSlots = () => ({ gpu: null, cpu: null, ram: null, cooler: null, psu: null, mobo: null });
const createRig = () => ({ id: uid(), slots: emptyRigSlots() });

export const game = {
  coins: 1000,
  clickPower: 10,
  inventory: [],
  upgradeHistory: [],
  upgradeCount: 0,
  rigs: [],
  audioEnabled: true,
  usedPromos: [],
  freeSpins: 0,
  rigged: false,
  lastSeen: Date.now()
};

export const ui = {
  inputIds: [],
  target: null,
  spinning: false,
  wheelAngle: 0,
  lastChance: -1,
  quick: null
};

let uidCounter = 0;
export function uid() {
  return Date.now().toString(36) + (++uidCounter).toString(36) + Math.random().toString(36).slice(2, 6);
}

export function makeItem(base) {
  const def = typeof base === 'string' ? findItem(base) : base;
  return { ...def, instanceId: uid() };
}

export function rigIncome() {
  return game.rigs.reduce((sum, rig) => {
    const parts = Object.values(rig.slots);
    const income = parts.reduce((total, it) => total + (it ? it.income : 0), 0);
    return sum + income * (parts.every(Boolean) ? 1.1 : 1);
  }, 0);
}

export function saveGame() {
  game.lastSeen = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  } catch (e) {
    return;
  }
}

export function loadGame() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    raw = null;
  }

  if (!raw) {
    game.rigs = [createRig()];
    game.inventory.push(makeItem('gpu_gt710'), makeItem('cpu_celeron'));
    return;
  }

  try {
    Object.assign(game, JSON.parse(raw));
  } catch (e) {
    return;
  }

  if (!Array.isArray(game.upgradeHistory)) game.upgradeHistory = [];
  if (!game.upgradeCount) game.upgradeCount = game.upgradeHistory.length;

  const seen = new Set();
  const normalize = (it) => {
    if (!it) return it;
    let id = String(it.instanceId);
    if (seen.has(id)) id = uid();
    seen.add(id);
    it.instanceId = id;
    return it;
  };
  game.inventory.forEach(normalize);
  if (!Array.isArray(game.rigs)) {
    const legacySlots = game.rigSlots || emptyRigSlots();
    game.rigs = [Object.values(legacySlots).some(Boolean) ? { id: uid(), slots: legacySlots } : createRig()];
    delete game.rigSlots;
  }
  if (!game.rigs.length) game.rigs.push(createRig());
  game.rigs.forEach((rig) => {
    if (!rig.slots) rig.slots = emptyRigSlots();
    Object.values(rig.slots).forEach(normalize);
  });

  const away = Math.min(Math.max(0, Date.now() - (game.lastSeen || Date.now())), OFFLINE_CAP_MS);
  game.coins += (away / 1000) * rigIncome();
}


export function itemsByGroup(group) {
  if (group === 'top') return ITEMS_DB.filter((i) => i.rarity === 'legendary' || i.rarity === 'mythic');
  return ITEMS_DB;
}
