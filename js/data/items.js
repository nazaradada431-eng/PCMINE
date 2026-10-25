export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const ITEMS_DB = [
  { id: 'gpu_gt710', name: 'NVIDIA GT 710', category: 'gpu', price: 100, income: 1, rarity: 'common', icon: 'monitor' },
  { id: 'cpu_celeron', name: 'Intel Celeron G5900', category: 'cpu', price: 120, income: 1.2, rarity: 'common', icon: 'cpu' },
  { id: 'ram_4gb', name: 'DDR4 4GB 2133MHz', category: 'ram', price: 80, income: 0.8, rarity: 'common', icon: 'circuit-board' },
  { id: 'cooler_stock', name: 'Box Cooler 80mm', category: 'cooler', price: 50, income: 0.5, rarity: 'common', icon: 'fan' },
  { id: 'psu_300w', name: 'NoName 300W', category: 'psu', price: 70, income: 0.7, rarity: 'common', icon: 'zap' },
  { id: 'mobo_h110', name: 'H110M OEM', category: 'mobo', price: 90, income: 0.9, rarity: 'common', icon: 'grid' },
  { id: 'gpu_gtx1050', name: 'GTX 1050 Ti', category: 'gpu', price: 500, income: 6, rarity: 'uncommon', icon: 'monitor' },
  { id: 'cpu_i3_10100', name: 'Core i3-10100F', category: 'cpu', price: 600, income: 7.5, rarity: 'uncommon', icon: 'cpu' },
  { id: 'ram_8gb', name: 'DDR4 8GB Kingston', category: 'ram', price: 400, income: 5, rarity: 'uncommon', icon: 'circuit-board' },
  { id: 'cooler_gammaxx', name: 'Deepcool Gammaxx 300', category: 'cooler', price: 250, income: 3, rarity: 'uncommon', icon: 'fan' },
  { id: 'psu_500w', name: 'Chieftec 500W', category: 'psu', price: 350, income: 4, rarity: 'uncommon', icon: 'zap' },
  { id: 'mobo_b450', name: 'Gigabyte B450M', category: 'mobo', price: 450, income: 5.5, rarity: 'uncommon', icon: 'grid' },
  { id: 'gpu_rtx2060', name: 'RTX 2060 Super', category: 'gpu', price: 2500, income: 32, rarity: 'rare', icon: 'monitor' },
  { id: 'cpu_ryzen5', name: 'Ryzen 5 5600X', category: 'cpu', price: 2800, income: 36, rarity: 'rare', icon: 'cpu' },
  { id: 'ram_16gb', name: 'DDR4 16GB Fury RGB', category: 'ram', price: 1800, income: 22, rarity: 'rare', icon: 'circuit-board' },
  { id: 'cooler_water120', name: 'AIO Liquid 120mm', category: 'cooler', price: 1200, income: 15, rarity: 'rare', icon: 'fan' },
  { id: 'psu_750w', name: 'Corsair RM750x', category: 'psu', price: 1500, income: 18, rarity: 'rare', icon: 'zap' },
  { id: 'mobo_z590', name: 'MSI Z590 Gaming', category: 'mobo', price: 2200, income: 28, rarity: 'rare', icon: 'grid' },
  { id: 'gpu_rtx3080', name: 'RTX 3080 Ti 12GB', category: 'gpu', price: 12000, income: 160, rarity: 'epic', icon: 'monitor' },
  { id: 'cpu_i9_12900k', name: 'Core i9-12900K', category: 'cpu', price: 14000, income: 190, rarity: 'epic', icon: 'cpu' },
  { id: 'ram_32gb_ddr5', name: 'DDR5 32GB Dominator', category: 'ram', price: 9000, income: 120, rarity: 'epic', icon: 'circuit-board' },
  { id: 'cooler_kraken', name: 'NZXT Kraken Z73 360', category: 'cooler', price: 6000, income: 80, rarity: 'epic', icon: 'fan' },
  { id: 'psu_1000w', name: 'ASUS ROG 1000W Gold', category: 'psu', price: 8000, income: 105, rarity: 'epic', icon: 'zap' },
  { id: 'mobo_x570', name: 'ASUS ROG X570 Crosshair', category: 'mobo', price: 10000, income: 135, rarity: 'epic', icon: 'grid' },
  { id: 'gpu_rtx4090', name: 'NVIDIA RTX 4090 24GB', category: 'gpu', price: 60000, income: 850, rarity: 'legendary', icon: 'monitor' },
  { id: 'cpu_i9_14900ks', name: 'Core i9-14900KS Spec', category: 'cpu', price: 65000, income: 920, rarity: 'legendary', icon: 'cpu' },
  { id: 'ram_128gb_ddr5', name: 'DDR5 128GB G.Skill 7200', category: 'ram', price: 40000, income: 550, rarity: 'legendary', icon: 'circuit-board' },
  { id: 'gpu_quantum', name: 'Quantum Rig Accelerator X', category: 'gpu', price: 300000, income: 4500, rarity: 'mythic', icon: 'cpu' },
  { id: 'cpu_ai_core', name: 'Neural AI Super-Core v9', category: 'cpu', price: 500000, income: 8000, rarity: 'mythic', icon: 'zap' }
        ];

export const SLOTS = [
  { cat: 'gpu', label: 'Видеокарта', icon: 'monitor' },
  { cat: 'cpu', label: 'Процессор', icon: 'cpu' },
  { cat: 'ram', label: 'ОЗУ', icon: 'circuit-board' },
  { cat: 'cooler', label: 'Охлаждение', icon: 'fan' },
  { cat: 'psu', label: 'Блок питания', icon: 'zap' },
  { cat: 'mobo', label: 'Материнка', icon: 'grid' }
];

const BASE_TDP = { gpu: 120, cpu: 65, ram: 8, cooler: 10, mobo: 45 };
const PSU_CAP = [300, 500, 750, 1000, 1500, 2000];

export function specs(item) {
  const r = Math.max(0, RARITIES.indexOf(item.rarity));
  const isPsu = item.category === 'psu';
  return {
    watt: isPsu ? PSU_CAP[r] : Math.round(BASE_TDP[item.category] * (1 + r * 0.5)),
    hash: item.income * 1.7,
    isPsu
  };
}

export const findItem = (id) => ITEMS_DB.find((i) => i.id === id);
