import { $ } from './ui/dom.js';
import { icons } from './ui/icons.js';
import { setupCanvas } from './ui/wheel.js';
import {
  renderTabs,
  showView,
  renderBalance,
  renderInventory,
  renderTargets,
  renderShop,
  renderRig,
  renderRigStats,
  renderHistory,
  renderAudioIcon,
  setPanel
} from './ui/render.js';
import { findItem } from './data/items.js';
import { game, ui, hooks, loadGame, saveGame } from './core/state.js';
import { playSound } from './core/audio.js';
import {
  refreshSlots,
  updateCalc,
  initQuick,
  quickPick,
  performUpgrade,
  clearInputs,
  removeInput,
  boxClick,
  onCoinsInput,
  closeResult
} from './features/upgrade.js';
import { initDrag } from './features/drag.js';
import { buyItem, sellItem, sellCommon, tap } from './features/inventory.js';
import { openEquip, closeEquip, equip, unequip, addRig, startIncomeTimer } from './features/rig.js';
import { openPromo, closePromo, submitPromo } from './features/promo.js';

function renderAll() {
  renderBalance();
  renderInventory();
  renderTargets();
  renderShop();
  renderRig();
  refreshSlots();
  updateCalc();
  renderRigStats();
}

hooks.refresh = renderAll;

const actions = {
  tab: (d) => {
    showView(d.tab);
    playSound('click');
  },
  audio: () => {
    game.audioEnabled = !game.audioEnabled;
    renderAudioIcon();
    saveGame();
  },
  'promo-open': openPromo,
  'promo-close': closePromo,
  'promo-submit': submitPromo,
  'clear-inputs': clearInputs,
  'remove-input': (d) => removeInput(d.id),
  upgrade: performUpgrade,
  quick: (d) => quickPick(d.key, Number(d.ratio)),
  box: (d, e) => boxClick(d.box, e),
  panel: (d) => setPanel(d.panel),
  'sell-common': sellCommon,
  sell: (d) => sellItem(d.id),
  buy: (d) => buyItem(d.id),
  tap: (d, e) => tap(e),
  'equip-open': (d) => openEquip(d.rig, d.cat),
  'equip-close': closeEquip,
  equip: (d) => equip(d.rig, d.cat, d.id),
  unequip: (d) => unequip(d.rig, d.cat),
  'rig-add': addRig,
  'result-close': closeResult
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  if (el.dataset.self && e.target !== el) return;
  const handler = actions[el.dataset.action];
  if (handler) handler(el.dataset, e);
});

function init() {
  loadGame();
  ui.target = findItem('gpu_gtx1050');
  setupCanvas();
  initDrag();
  initQuick();
  $('add-coins-range').addEventListener('input', onCoinsInput);
  $('filter-category').addEventListener('change', renderTargets);
  $('promo-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitPromo();
  });
  renderTabs('upgrade');
  renderAudioIcon();
  renderHistory();
  renderAll();
  icons();
  startIncomeTimer();
}

init();
