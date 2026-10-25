let counter = 0;

function cssNumber(el, name, fallback) {
  const value = parseFloat(getComputedStyle(el).getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

function outline(kind, w, h, s) {
  const i = 1.5;
  const x1 = i;
  const x2 = w - i;
  const y1 = i;
  const y2 = h - i;
  switch (kind) {
    case 'left':
      return [[x1, y1], [x2, y1], [x2 - s, y2], [x1, y2]];
    case 'mid':
      return [[x1 + s, y1], [x2 - s, y1], [x2, y2], [x1, y2]];
    case 'right':
      return [[x1, y1], [x2, y1], [x2, y2], [x1 + s, y2]];
    default:
      return [[x1 + s, y1], [x2, y1], [x2 - s, y2], [x1, y2]];
  }
}

function roundedPath(points, radius) {
  const n = points.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const cur = points[i];
    const next = points[(i + 1) % n];
    const v1 = [prev[0] - cur[0], prev[1] - cur[1]];
    const v2 = [next[0] - cur[0], next[1] - cur[1]];
    const l1 = Math.hypot(v1[0], v1[1]);
    const l2 = Math.hypot(v2[0], v2[1]);
    const r = Math.min(radius, l1 / 2, l2 / 2);
    const a = [cur[0] + (v1[0] / l1) * r, cur[1] + (v1[1] / l1) * r];
    const b = [cur[0] + (v2[0] / l2) * r, cur[1] + (v2[1] / l2) * r];
    d += `${i === 0 ? 'M' : 'L'}${a[0].toFixed(2)} ${a[1].toFixed(2)}Q${cur[0].toFixed(2)} ${cur[1].toFixed(2)} ${b[0].toFixed(2)} ${b[1].toFixed(2)}`;
  }
  return d + 'Z';
}

function draw(piece) {
  const w = piece.offsetWidth;
  const h = piece.offsetHeight;
  if (!w || !h) return;

  const slant = cssNumber(piece, '--slant', 14);
  const radius = cssNumber(piece, '--radius', 11);
  const id = piece._glassId;
  const d = roundedPath(outline(piece.dataset.shape, w, h, slant), radius);
  const gloss = `M0 0H${w}V${(h * 0.4).toFixed(1)}Q${(w / 2).toFixed(1)} ${(h * 0.66).toFixed(1)} 0 ${(h * 0.4).toFixed(1)}Z`;

  let svg = piece.querySelector(':scope > svg.glass-shape');
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'glass-shape');
    piece.prepend(svg);
  }
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = `
    <defs>
      <linearGradient id="gf${id}" x1="0" y1="0" x2="0" y2="1">
        <stop class="s0" offset="0"/>
        <stop class="s1" offset="0.55"/>
        <stop class="s2" offset="1"/>
      </linearGradient>
      <linearGradient id="gg${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0.5"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0.02"/>
      </linearGradient>
      <clipPath id="gc${id}"><path d="${d}"/></clipPath>
    </defs>
    <path class="hit" d="${d}" fill="url(#gf${id})"/>
    <g clip-path="url(#gc${id})" class="shine">
      <path class="gloss" d="${gloss}" fill="url(#gg${id})"/>
      <rect class="edge" x="0" y="${h - 5}" width="${w}" height="5"/>
    </g>
    <path class="rim" d="${d}" fill="none"/>`;
}

export function mountGlass(root) {
  const pieces = root.classList.contains('gpiece') ? [root] : root.querySelectorAll('.gpiece');
  pieces.forEach((piece) => {
    if (piece._glassId) return;
    piece._glassId = ++counter;
    const observer = new ResizeObserver(() => draw(piece));
    observer.observe(piece);
    draw(piece);
  });
}
