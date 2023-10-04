import {
  BannerData,
  NormalBannerData,
  CatfruitBannerData,
  CatseyeBannerData,
  NormalBannerPlusData,
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

export const getTrackUrlWithSeedQueryParam = (
  seed: number,
  superfeline: boolean
) => {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set("seed", seed.toString());
  if (superfeline) {
    queryParams.set("sf", superfeline.toString());
  }
  return `?${queryParams.toString()}#`;
};

export const generateRollsLightweight = (
  seed: number,
  numRolls: number,
  banner: BannerData
): [number, boolean] => {
  let lastRoll = "";
  let finalRollSeed = 0;
  let finalRollIsReroll = false;
  // Roll to numRolls + 1 to check if the next one is a rare dupe, but return the seed at numRolls
  for (let i = 0; i < numRolls + 1; i++) {
    if (i === numRolls) {
      finalRollSeed = seed;
    }
    seed = advanceSeed(seed);
    const rarity = getRarity({ seed, banner });

    seed = advanceSeed(seed);
    let [unitId, unitName] = getUnit({ seed, rarity, banner });
    if (unitName === lastRoll && banner.pools[rarity].reroll) {
      if (i === numRolls) {
        finalRollIsReroll = true;
      }
      seed = advanceSeed(seed);
      const [_, rerolledUnitName] = getUnit({
        seed,
        rarity,
        removedIndex: unitId,
        banner,
      });
      lastRoll = rerolledUnitName;
    } else {
      lastRoll = unitName;
    }
  }

  return [finalRollSeed, finalRollIsReroll];
};

const generateRolls = (
  seed: number,
  numRolls: number,
  banner: BannerData,
  lastCat: string = ""
) => {
  const rolls: Roll[] = [];

  let lastRoll = lastCat;
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
  numRolls: number,
  useSuperfelineBanner: boolean,
  lastCat: string,
  lastBanner: string
): BannerRolls[] => {
  const banners = [
    useSuperfelineBanner ? NormalBannerPlusData : NormalBannerData,
    CatfruitBannerData,
    CatseyeBannerData,
  ];
  return banners.map((banner) => ({
    bannerName: banner.name,
    trackA: generateRolls(
      seed,
      numRolls,
      banner,
      lastBanner === banner.name ? lastCat : ""
    ),
    trackB: generateRolls(advanceSeed(seed), numRolls, banner, ""),
  }));
};
