const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx'];

export function fmt(value) {
  const n = Math.floor(value);
  if (n < 1e15) return n.toLocaleString('ru-RU');
  let exp = 0;
  let v = n;
  while (v >= 1000 && exp < SUFFIXES.length - 1) {
    v /= 1000;
    exp++;
  }
  return v.toFixed(2) + SUFFIXES[exp];
}

export function fmtChance(c) {
  if (c <= 0) return '0.00%';
  if (c < 0.0001) return '<0.0001%';
  if (c < 0.01) return c.toFixed(4) + '%';
  if (c < 1) return c.toFixed(3) + '%';
  if (c > 99.99) return '99.99%';
  return c.toFixed(2) + '%';
}

export function fmtMultiplier(target, input) {
  if (!(target > 0) || !(input > 0)) return 'x0.00';
  return 'x' + (target / input).toLocaleString('ru-RU', { maximumFractionDigits: 2 });
}
