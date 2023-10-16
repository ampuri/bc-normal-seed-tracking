export type BannerData = {
  name: string;
  shortName: string;
  rateCumSum: number[];
  pools: {
    rate: number;
    units: string[];
    reroll: boolean;
  }[];
};

export const NormalBannerData: BannerData = {
  name: "Normal",
  shortName: "n",
  rateCumSum: [10000],
  pools: [
    {
      rate: 10000,
      units: [
        "Cat",
        "Tank Cat",
        "Axe Cat",
        "Gross Cat",
        "Cow Cat",
        "Bird Cat",
        "Fish Cat",
        "Lizard Cat",
        "Titan Cat",
        "Cat Cannon Attack",
        "Cat Cannon Charge",
        "Worker Cat Rate",
        "Worker Cat Wallet",
        "Base Defense",
        "Research",
        "Accounting",
        "Study",
        "Cat Energy",
      ],
      reroll: true,
    },
  ],
};

export const NormalBannerPlusData: BannerData = {
  name: "Normal+",
  shortName: "np",
  rateCumSum: [10000],
  pools: [
    {
      rate: 10000,
      units: [
        "Cat",
        "Tank Cat",
        "Axe Cat",
        "Gross Cat",
        "Cow Cat",
        "Bird Cat",
        "Fish Cat",
        "Lizard Cat",
        "Titan Cat",
        "Superfeline",
        "Cat Cannon Attack",
        "Cat Cannon Charge",
        "Worker Cat Rate",
        "Worker Cat Wallet",
        "Base Defense",
        "Research",
        "Accounting",
        "Study",
        "Cat Energy",
      ],
      reroll: true,
    },
  ],
};

export const CatfruitBannerData: BannerData = {
  name: "Catfruit",
  shortName: "cf",
  rateCumSum: [400, 2400, 9400, 10000],
  pools: [
    {
      rate: 400,
      units: ["5K XP"],
      reroll: false,
    },
    {
      rate: 2000,
      units: [
        "Speed Up",
        "Cat CPU",
        "10K XP",
        "30K XP",
        "50K XP",
        "Purple Catfruit Seed",
        "Red Catfruit Seed",
        "Blue Catfruit Seed",
        "Green Catfruit Seed",
        "Yellow Catfruit Seed",
      ],
      reroll: true,
    },
    {
      rate: 7000,
      units: [
        "Rich Cat",
        "Cat Jobs",
        "Sniper the Cat",
        "100K XP",
        "200K XP",
        "Purple Catfruit",
        "Red Catfruit",
        "Blue Catfruit",
        "Green Catfruit",
        "Yellow Catfruit",
      ],
      reroll: false,
    },
    {
      rate: 600,
      units: ["Treasure Radar", "500K XP", "Epic Catfruit"],
      reroll: false,
    },
  ],
};

export const CatseyeBannerData: BannerData = {
  name: "Catseye",
  shortName: "ce",
  rateCumSum: [500, 7400, 9400, 9900, 10000],
  pools: [
    {
      rate: 500,
      units: ["5K XP"],
      reroll: false,
    },
    {
      rate: 6900,
      units: ["10K XP", "30K XP", "Special Catseye", "Rare Catseye"],
      reroll: true,
    },
    {
      rate: 2000,
      units: ["100K XP", "Super Rare Catseye"],
      reroll: false,
    },
    {
      rate: 500,
      units: ["Uber Rare Catseye"],
      reroll: false,
    },
    {
      rate: 100,
      units: ["Dark Catseye"],
      reroll: false,
    },
  ],
};

export const LuckyTicketBannerData: BannerData = {
  name: "Lucky Ticket",
  shortName: "lt",
  rateCumSum: [7400, 9500, 10000],
  pools: [
    {
      rate: 7400,
      units: [
        "Li'l Titan Cat",
        "Li'l Lizard Cat",
        "Li'l Fish Cat",
        "Li'l Bird Cat",
        "Li'l Cow Cat",
        "Li'l Gross Cat",
        "Li'l Axe Cat",
        "Li'l Tank Cat",
        "Li'l Cat",
        "Speed Up",
        "Speed Up",
        "Speed Up",
        "Cat CPU",
        "Cat CPU",
        "10K XP",
        "10K XP",
        "10K XP",
        "30K XP",
        "30K XP",
        "30K XP",
      ],
      reroll: true,
    },
    {
      rate: 2100,
      units: ["Rich Cat", "Cat Jobs", "Sniper the Cat"],
      reroll: false,
    },
    {
      rate: 500,
      units: ["Treasure Radar"],
      reroll: false,
    },
  ],
};

export const LuckyTicketGBannerData: BannerData = {
  name: "Lucky Ticket G",
  shortName: "ltg",
  rateCumSum: [5100, 8600, 10000],
  pools: [
    {
      rate: 5100,
      units: [
        "Catamin A",
        "Catamin A",
        "Catamin A",
        "100K XP",
        "100K XP",
        "100K XP",
      ],
      reroll: true,
    },
    {
      rate: 3500,
      units: ["Catamin B", "Catamin B", "Catamin B", "500K XP"],
      reroll: false,
    },
    {
      rate: 1400,
      units: ["Catamin C", "Catamin C", "Catamin C", "1M XP"],
      reroll: false,
    },
  ],
};

export const AllBanners = [
  NormalBannerData,
  NormalBannerPlusData,
  CatfruitBannerData,
  CatseyeBannerData,
  LuckyTicketBannerData,
  LuckyTicketGBannerData,
];
