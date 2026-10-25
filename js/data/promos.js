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
  }
];
