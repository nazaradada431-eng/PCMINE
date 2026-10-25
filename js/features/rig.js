import { game, ui, hooks, saveGame, rigIncome, uid } from '../core/state.js';
import { playSound } from '../core/audio.js';
import { $ } from '../ui/dom.js';
import { renderEquipList, renderRigDetails, renderBalance } from '../ui/render.js';
import { updateCalc } from './upgrade.js';

export function addRig() {
  game.rigs.push({ id: uid(), slots: { gpu: null, cpu: null, ram: null, cooler: null, psu: null, mobo: null } });
  hooks.refresh();
  saveGame();
  playSound('click');
}

export function openRigDetails(rigId) {
  ui.activeRigId = rigId;
  renderRigDetails(rigId);
  $('rig-detail-modal').classList.remove('hidden');
}

export function closeRigDetails() {
  ui.activeRigId = null;
  $('rig-detail-modal').classList.add('hidden');
}

export function openEquip(rigId, category) {
  renderEquipList(category, rigId);
  $('equip-modal').classList.remove('hidden');
}

export function closeEquip() {
  $('equip-modal').classList.add('hidden');
}

export function equip(rigId, category, instanceId) {
  const rig = game.rigs.find((entry) => entry.id === rigId);
  if (!rig) return;
  const idx = game.inventory.findIndex((i) => i.instanceId === instanceId);
  if (idx === -1) return;
  const item = game.inventory[idx];
  game.inventory.splice(idx, 1);
  if (rig.slots[category]) game.inventory.push(rig.slots[category]);
  rig.slots[category] = item;
  ui.inputIds = ui.inputIds.filter((id) => id !== instanceId);
  closeEquip();
  hooks.refresh();
  saveGame();
  playSound('click');
}

export function unequip(rigId, category) {
  const rig = game.rigs.find((entry) => entry.id === rigId);
  if (!rig || !rig.slots[category]) return;
  game.inventory.push(rig.slots[category]);
  rig.slots[category] = null;
  hooks.refresh();
  saveGame();
  playSound('click');
}

export function startIncomeTimer() {
  setInterval(() => {
    const income = rigIncome();
    if (income <= 0) return;
    game.coins += income;
    renderBalance();
    if (!ui.spinning) updateCalc();
  }, 1000);
  setInterval(saveGame, 5000);
  window.addEventListener('beforeunload', saveGame);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveGame();
  });
}
