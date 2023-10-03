import {
  BannerData,
  NormalBannerData,
  CatfruitBannerData,
  CatseyeBannerData,
} from "./bannerData";

type Roll = {
  rarity: number;
  unitName: string;
  rerolledUnitName?: string;
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
    const rarity = getRarity({ seed, banner });

    seed = advanceSeed(seed);
    let [unitId, unitName] = getUnit({ seed, rarity, banner });
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
        unitName,
        rerolledUnitName,
      });
    } else {
      rolls.push({
        rarity,
        unitName,
      });
    }
    lastRoll = unitName; // Not rerolledUnitName because a reroll would take us off this track
  }

  return rolls;
};

export const generateAllRolls = (seed: number, numRolls: number) => {
  const banners = [NormalBannerData, CatfruitBannerData, CatseyeBannerData];
  return banners.map((banner) => ({
    trackA: generateRolls(seed, numRolls, banner),
    trackB: generateRolls(advanceSeed(seed), numRolls, banner),
  }));
};
