import { $ } from '../ui/dom.js';
import { ui } from '../core/state.js';
import { playSound } from '../core/audio.js';
import { addInput, setTarget, toggleInput } from './upgrade.js';

const HOLD_MS = 200;
const MOUSE_THRESHOLD = 5;
const TOUCH_THRESHOLD = 10;
const SCROLL_EDGE = 90;

let drag = null;

function acceptedZone(kind) {
  return kind === 'inv' ? 'input' : 'target';
}

function zoneAt(x, y) {
  if (drag && drag.ghost) drag.ghost.style.display = 'none';
  const el = document.elementFromPoint(x, y);
  if (drag && drag.ghost) drag.ghost.style.display = '';
  return el ? el.closest('[data-dropzone]') : null;
}

function moveGhost() {
  drag.ghost.style.left = drag.x + 'px';
  drag.ghost.style.top = drag.y + 'px';
  const accept = acceptedZone(drag.kind);
  const over = zoneAt(drag.x, drag.y);
  document
    .querySelectorAll('.dropzone')
    .forEach((z) => z.classList.toggle('drop-hover', z === over && z.dataset.dropzone === accept));
}

function autoScroll() {
  if (!drag || !drag.started) return;
  if (drag.y < SCROLL_EDGE) window.scrollBy(0, -(SCROLL_EDGE - drag.y) / 4);
  else if (drag.y > innerHeight - SCROLL_EDGE) window.scrollBy(0, (drag.y - (innerHeight - SCROLL_EDGE)) / 4);
  requestAnimationFrame(autoScroll);
}

function startDrag() {
  if (!drag || drag.started) return;
  drag.started = true;

  const ghost = drag.card.cloneNode(true);
  ghost.classList.remove('drag-source', 'ring-2', 'hover:-translate-y-0.5');
  ghost.classList.add('drag-ghost');
  ghost.style.width = drag.card.offsetWidth + 'px';
  document.body.appendChild(ghost);
  drag.ghost = ghost;

  drag.card.classList.add('drag-source');
  document.body.classList.add('dragging');
  document.querySelector(`[data-dropzone="${acceptedZone(drag.kind)}"]`).classList.add('drop-active');

  moveGhost();
  playSound('pick');
  autoScroll();
}

function endDrag() {
  if (!drag) return;
  clearTimeout(drag.timer);
  if (drag.ghost) drag.ghost.remove();
  if (drag.card) drag.card.classList.remove('drag-source');
  document.body.classList.remove('dragging');
  document.querySelectorAll('.dropzone').forEach((z) => z.classList.remove('drop-active', 'drop-hover'));
  drag = null;
}

function onCardDown(e) {
  if (ui.spinning || drag) return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  const card = e.target.closest('[data-drag]');
  if (!card || e.target.closest('button')) return;

  drag = {
    kind: card.dataset.drag,
    id: card.dataset.id,
    card,
    x0: e.clientX,
    y0: e.clientY,
    x: e.clientX,
    y: e.clientY,
    type: e.pointerType,
    started: false,
    ghost: null
  };
  drag.timer = setTimeout(startDrag, HOLD_MS);
}

function onMove(e) {
  if (!drag) return;
  drag.x = e.clientX;
  drag.y = e.clientY;

  if (!drag.started) {
    const dist = Math.hypot(drag.x - drag.x0, drag.y - drag.y0);
    if (drag.type === 'mouse') {
      if (dist > MOUSE_THRESHOLD) {
        clearTimeout(drag.timer);
        startDrag();
      }
    } else if (dist > TOUCH_THRESHOLD) {
      clearTimeout(drag.timer);
      drag = null;
    }
    return;
  }

  e.preventDefault();
  moveGhost();
}

function onUp(e) {
  if (!drag) return;
  clearTimeout(drag.timer);
  drag.x = e.clientX;
  drag.y = e.clientY;
  const { kind, id, started } = drag;

  if (!started) {
    drag = null;
    if (kind === 'inv') toggleInput(id);
    else setTarget(id);
    return;
  }

  const zone = zoneAt(drag.x, drag.y);
  endDrag();
  if (!zone || zone.dataset.dropzone !== acceptedZone(kind)) return;
  if (kind === 'inv') addInput(id);
  else setTarget(id);
}

export function initDrag() {
  ['inventory-grid', 'target-shop-grid'].forEach((id) => {
    const grid = $(id);
    grid.addEventListener('pointerdown', onCardDown);
    grid.addEventListener('contextmenu', (e) => {
      if (e.target.closest('[data-drag]')) e.preventDefault();
    });
    grid.addEventListener('dragstart', (e) => e.preventDefault());
  });
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
  document.addEventListener('pointercancel', endDrag);
  document.addEventListener(
    'touchmove',
    (e) => {
      if (drag && drag.started) e.preventDefault();
    },
    { passive: false }
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') endDrag();
  });
}
