import { findItem } from '../data/items.js';
import { game, ui, uid, hooks, saveGame } from '../core/state.js';
import { playSound } from '../core/audio.js';
import { renderBalance } from '../ui/render.js';
import { updateCalc } from './upgrade.js';

export function buyItem(itemId) {
  const item = findItem(itemId);
  if (!item || game.coins < item.price) return;
  game.coins -= item.price;
  game.inventory.push({ ...item, instanceId: uid() });
  hooks.refresh();
  saveGame();
  playSound('win');
}

export function sellItem(instanceId) {
  if (ui.spinning) return;
  const idx = game.inventory.findIndex((i) => i.instanceId === instanceId);
  if (idx === -1) return;
  game.coins += game.inventory[idx].price;
  game.inventory.splice(idx, 1);
  ui.inputIds = ui.inputIds.filter((id) => id !== instanceId);
  hooks.refresh();
  saveGame();
  playSound('click');
}

export function sellCommon() {
  if (ui.spinning) return;
  const commons = game.inventory.filter((i) => i.rarity === 'common');
  if (!commons.length) return;
  game.coins += commons.reduce((sum, c) => sum + c.price, 0);
  const ids = new Set(commons.map((c) => c.instanceId));
  game.inventory = game.inventory.filter((i) => !ids.has(i.instanceId));
  ui.inputIds = ui.inputIds.filter((id) => !ids.has(id));
  hooks.refresh();
  saveGame();
  playSound('click');
}

export function tap(event) {
  game.coins += game.clickPower;
  renderBalance();
  if (!ui.spinning) updateCalc();
  playSound('click');

  const particle = document.createElement('div');
  particle.className = 'tap-particle';
  particle.innerText = `+${game.clickPower.toLocaleString('ru-RU')} 🪙`;
  particle.style.left = `${event.clientX - 20}px`;
  particle.style.top = `${event.clientY - 30}px`;
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 800);
  saveGame();
}
