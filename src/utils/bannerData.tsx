export type BannerData = {
  rateCumSum: number[];
  pools: {
    rate: number;
    units: string[];
    reroll: boolean;
  }[];
};

export const NormalBannerData: BannerData = {
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

export const CatfruitBannerData: BannerData = {
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
