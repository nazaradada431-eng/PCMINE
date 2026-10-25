import { game, ui, hooks, saveGame, rigIncome } from '../core/state.js';
import { playSound } from '../core/audio.js';
import { $ } from '../ui/dom.js';
import { renderEquipList, renderBalance } from '../ui/render.js';
import { updateCalc } from './upgrade.js';

export function openEquip(category) {
  renderEquipList(category);
  $('equip-modal').classList.remove('hidden');
}

export function closeEquip() {
  $('equip-modal').classList.add('hidden');
}

export function equip(category, instanceId) {
  const idx = game.inventory.findIndex((i) => i.instanceId === instanceId);
  if (idx === -1) return;
  const item = game.inventory[idx];
  game.inventory.splice(idx, 1);
  if (game.rigSlots[category]) game.inventory.push(game.rigSlots[category]);
  game.rigSlots[category] = item;
  ui.inputIds = ui.inputIds.filter((id) => id !== instanceId);
  closeEquip();
  hooks.refresh();
  saveGame();
  playSound('click');
}

export function unequip(category) {
  if (!game.rigSlots[category]) return;
  game.inventory.push(game.rigSlots[category]);
  game.rigSlots[category] = null;
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
