import {
  BannerData,
  NormalBannerData,
  CatfruitBannerData,
  CatseyeBannerData,
} from "./bannerData";

export type Roll = {
  rarity: number;
  raritySeed: number;
  unitName: string;
  unitSeed: number;
  rerolledUnitName?: string;
  rerolledUnitSeed?: number;
};

type BannerRolls = {
  bannerName: string;
  trackA: Roll[];
  trackB: Roll[];
};

const advanceSeed = (seed: number) => {
  seed ^= seed << 13;
  seed = seed >>> 0; // Convert to 32bit unsigned integer
  seed ^= seed >>> 17;
  seed ^= seed << 15;
  seed = seed >>> 0; // Convert to 32bit unsigned integer
  return seed;
};

const getRarity = ({ seed, banner }: { seed: number; banner: BannerData }) => {
  const seedMod = seed % 10000;
  return banner.rateCumSum.findIndex((sum) => seedMod < sum);
};

const getUnit = ({
  seed,
  rarity,
  banner,
  removedIndex = -1,
}: {
  seed: number;
  rarity: number;
  banner: BannerData;
  removedIndex?: number;
}): [number, string] => {
  const units = banner.pools[rarity].units;
  let seedMod;
  if (removedIndex === -1) {
    seedMod = seed % units.length;
  } else {
    seedMod = seed % (units.length - 1);
    if (seedMod >= removedIndex) {
      seedMod++;
    }
  }
  return [seedMod, units[seedMod]];
};

const generateRolls = (seed: number, numRolls: number, banner: BannerData) => {
  const rolls: Roll[] = [];

  let lastRoll = "";
  for (let i = 0; i < numRolls; i++) {
    seed = advanceSeed(seed);
    const raritySeed = seed;
    const rarity = getRarity({ seed: raritySeed, banner });

    seed = advanceSeed(seed);
    const unitSeed = seed;
    let [unitId, unitName] = getUnit({ seed: unitSeed, rarity, banner });
    // If there's a dupe that should be rerolled, simulate the reroll but don't actually do it
    if (unitName === lastRoll && banner.pools[rarity].reroll) {
      const nextSeed = advanceSeed(seed);
      const [_, rerolledUnitName] = getUnit({
        seed: nextSeed,
        rarity,
        removedIndex: unitId,
        banner,
      });
      rolls.push({
        rarity,
        raritySeed,
        unitName,
        unitSeed,
        rerolledUnitName,
        rerolledUnitSeed: nextSeed,
      });
    } else {
      rolls.push({
        rarity,
        raritySeed,
        unitName,
        unitSeed,
      });
    }
    lastRoll = unitName; // Not rerolledUnitName because a reroll would take us off this track
  }

  return rolls;
};

export const generateAllRolls = (
  seed: number,
  numRolls: number
): BannerRolls[] => {
  const banners = [NormalBannerData, CatfruitBannerData, CatseyeBannerData];
  return banners.map((banner) => ({
    bannerName: banner.name,
    trackA: generateRolls(seed, numRolls, banner),
    trackB: generateRolls(advanceSeed(seed), numRolls, banner),
  }));
};
