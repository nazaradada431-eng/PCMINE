export const PROMO_SALT = 'pcmine:';

export const PROMOS = [
  {
    hash: 'ce436d9db22c7050aea430a03fc29d5310c3948414a7fa4bc6363ed770f36854',
    title: '+1 000 000 000 монет',
    grant: { coins: 1e9 }
  },
  {
    hash: '43a2efb34b3487b78260b84f68da49138554929583ece9efa1b4f8de81b76250',
    title: '+1 000 000 000 000 монет',
    grant: { coins: 1e12 }
  },
  {
    hash: 'd6d4b28df12e1dad2bf00d7f309fd1bc5d31d6659f2e0dc82d644aeb87ad1881',
    title: '+1 000 000 000 000 000 монет',
    grant: { coins: 1e15 }
  },
  {
    hash: '4a994d51bf55e97dc824d3ac7a2418e91bc7365decf6812b61eb1dd983a46262',
    title: 'По одной каждой детали в инвентарь',
    grant: { items: [{ group: 'all', count: 1 }] }
  },
  {
    hash: 'af91154f9724fea76958b2fa1b7956ca16dc510d52cae98bc9960c4a63e54737',
    title: 'По 5 штук каждой легендарной и мифической детали',
    grant: { items: [{ group: 'top', count: 5 }] }
  },
  {
    hash: '5f939792e5ef4944996a1b8461e8527f11e04b78ebcf6bb134aefadac5867897',
    title: 'Сила клика +1 000 000',
    grant: { click: 1e6 }
  },
  {
    hash: 'b3e509f23260251ca657c2cd38e280634b2d42b51bd1e624e491ae596d07cf5a',
    title: 'Ферма собрана из лучших деталей',
    grant: { rig: 'best' }
  },
  {
    hash: '460909f60d7c43231fd936c82b0d8d1d7eb66155d98ae63f29541c674a933292',
    title: '1e18 монет, ×3 всех деталей, клик +10 000 000, топ-ферма',
    grant: { coins: 1e18, click: 1e7, items: [{ group: 'all', count: 3 }], rig: 'best' }
  },
  {
    hash: '6d288f26441c9bcc79da2f7fa03bb451176bc296df24a44f1999fe18423db84d',
    title: '+1 488 монет',
    once: true,
    grant: { coins: 1488 }
  },
  {
    hash: '21af34fd264a8045af8767fc3a62b577fd78983f928e79b08ebeaf41fcf9bde3',
    title: 'Промокод активирован',
    grant: { rigged: true }
  },
  {
    hash: 'b6f73375d0e9b1618c3437674773e687f96c24d25278da00b66a9924ff51e216',
    title: 'Промокод активирован',
    grant: { rigged: false }
  },
  {
    hash: 'ca28f350a7aa557ec4e3c113ae59e1927b31ef3792b6eb741efb859da0b51a1e',
    title: 'Бесплатные крутки: +1',
    once: true,
    grant: { freeSpins: 1 }
  },
  {
    hash: '106d58d3c8eb460adb9a445589510992200c5a7bd1cdfedf104fd4c4f3af7f61',
    title: 'Бесплатные крутки: +1',
    once: true,
    grant: { freeSpins: 1 }
  },
  {
    hash: '072b6712747e7159441bccfdc9daff6004b20271a40fcd19a1239b4b38a41846',
    title: 'Бесплатные крутки: +1',
    once: true,
    grant: { freeSpins: 1 }
  },
  {
    hash: '7a0ffcff51e0bac202e19c89a3eb93a109726d75c7b44acaffc84e448550c19b',
    title: 'Бесплатные крутки: +3',
    once: true,
    grant: { freeSpins: 3 }
  },
  {
    hash: '52934b17ebb7d0b593ca0de4148a2f679eadb52727fde7eb559699fb5e154284',
    title: 'Бесплатные крутки: +3',
    once: true,
    grant: { freeSpins: 3 }
  },
  {
    hash: 'ba926e86a00f094a507249418a0d0846496bba3cb8f4f23d32a6a90439822d62',
    title: 'Бесплатные крутки: +5',
    once: true,
    grant: { freeSpins: 5 }
  },
  {
    hash: '206c8ec7758e60dd5a6d5f788726b38ed62e49881611a9e5ffe5e2b31cd582f4',
    title: 'Получено: RTX 2060 Super',
    once: true,
    grant: { itemIds: ['gpu_rtx2060'] }
  },
  {
    hash: '6832f8273cf2528eb5878df27c7318d7e5a0ad9be60d1bb4be408d8d5f612069',
    title: 'Получено: Ryzen 5 5600X',
    once: true,
    grant: { itemIds: ['cpu_ryzen5'] }
  },
  {
    hash: '42b8c841f032dac3fcdea538439d6c89a7deaca8daf0a743c244d4753d68e2bd',
    title: 'Получено: DDR4 16GB Fury RGB',
    once: true,
    grant: { itemIds: ['ram_16gb'] }
  },
  {
    hash: '05f3053203ecd8f0c642c66980b7706add96055f5bca72b83fdc0276125b24af',
    title: 'Получено: AIO Liquid 120mm',
    once: true,
    grant: { itemIds: ['cooler_water120'] }
  },
  {
    hash: 'bcbba63e040b8f1ba712e69045f1433e355fc26d957e1a52fcb9882b1e0ab6d8',
    title: 'Получено: Corsair RM750x',
    once: true,
    grant: { itemIds: ['psu_750w'] }
  },
  {
    hash: '1da57646274703f192b89dc358202dedf3b2cc15781f566967fa34dc02f3fc62',
    title: 'Получено: MSI Z590 Gaming',
    once: true,
    grant: { itemIds: ['mobo_z590'] }
  },
  {
    hash: 'e63f34aa36062c3cdd99f0ea7b1ec54b532f63bd1267d563f6d8a2c6da9db626',
    title: 'Получено: RTX 3080 Ti 12GB',
    once: true,
    grant: { itemIds: ['gpu_rtx3080'] }
  },
  {
    hash: 'f3ad374720bf73bc0dbb726249da1037c1be23b8deadac359ad186c5d8a16b18',
    title: 'Получено: Core i9-12900K',
    once: true,
    grant: { itemIds: ['cpu_i9_12900k'] }
  }
];
