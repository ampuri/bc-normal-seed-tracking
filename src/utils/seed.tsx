import {
  BannerData,
  NormalBannerData,
  CatfruitBannerData,
  CatseyeBannerData,
  NormalBannerPlusData,
  AllBanners,
} from "./bannerData";
import { getQueryParam } from "./queryParams";

export type Roll = {
  rarity: number;
  raritySeed: number;
  unitName: string;
  unitSeed: number;
  rerolledUnitName?: string;
  rerolledUnitSeed?: number;
  rerolledTimes?: number;
  rerolledUnitWillRerollAgain?: boolean;
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
  removedIndices = [],
}: {
  seed: number;
  rarity: number;
  banner: BannerData;
  removedIndices?: number[];
}): [number, string] => {
  const units = banner.pools[rarity].units;
  if (removedIndices.length === 0) {
    const seedMod = seed % units.length;
    return [seedMod, units[seedMod]];
  } else {
    const numUnitsInPool = units.length - removedIndices.length;
    const seedMod = seed % numUnitsInPool;
    const numRemovedIndicesBeforeSeedMod = removedIndices.filter(
      (index) => index <= seedMod
    ).length;
    const rerolledSeedMod = seedMod + numRemovedIndicesBeforeSeedMod;
    // Return the original seedMod as the index to eliminate, but the cat from rerolledSeedMod
    return [seedMod, units[rerolledSeedMod]];
  }
};

export const getTrackUrlWithSeedQueryParam = (seed: number) => {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set("seed", seed.toString());
  return `?${queryParams.toString()}#`;
};

// TODO: Doesn't support lucky ticket and lucky tichet G which have multiple dupe rares in the pool.
// Should be fine for now since you can't seed find with those banners, and this fn is only called in Finder
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
        removedIndices: [unitId],
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
    if (unitName !== lastRoll || !banner.pools[rarity].reroll) {
      rolls.push({
        rarity,
        raritySeed,
        unitName,
        unitSeed,
      });
    } else {
      // If there's a dupe that should be rerolled, simulate the reroll but don't actually do it
      let tmpSeed = unitSeed;
      let tmpUnitName = unitName;
      const tmpRemovedIndices = [unitId];
      let rerollTimes = 0;
      while (tmpUnitName === lastRoll && banner.pools[rarity].reroll) {
        rerollTimes++;
        tmpSeed = advanceSeed(tmpSeed);
        const [nextUnitId, rerolledUnitName] = getUnit({
          seed: tmpSeed,
          rarity,
          removedIndices: tmpRemovedIndices,
          banner,
        });
        tmpUnitName = rerolledUnitName;
        tmpRemovedIndices.push(nextUnitId);
      }
      // Check if the rerolled location will reroll again
      let rerolledUnitWillRerollAgain = false;
      if (rerollTimes > 0 && banner.pools[rarity].reroll) {
        const targetLocationRaritySeed = advanceSeed(tmpSeed);
        const targetLocationRarity = getRarity({
          seed: targetLocationRaritySeed,
          banner,
        });
        const targetLocationUnitSeed = advanceSeed(targetLocationRaritySeed);
        const [_, targetLocationUnitName] = getUnit({
          seed: targetLocationUnitSeed,
          rarity: targetLocationRarity,
          banner,
        });
        if (targetLocationUnitName === tmpUnitName) {
          rerolledUnitWillRerollAgain = true;
        }
      }
      rolls.push({
        rarity,
        raritySeed,
        unitName,
        unitSeed,
        rerolledUnitName: tmpUnitName,
        rerolledUnitSeed: tmpSeed,
        rerolledTimes: rerollTimes,
        rerolledUnitWillRerollAgain,
      });
    }
    lastRoll = unitName; // Not rerolledUnitName because a reroll would take us off this track
  }

  return rolls;
};

export const generateAllRolls = (
  seed: number,
  numRolls: number,
  lastCat: string
): BannerRolls[] => {
  const selectedBanners = getQueryParam("banners").split(",");
  const banners = AllBanners.filter((banner) =>
    selectedBanners.includes(banner.shortName)
  );
  return banners.map((banner) => ({
    bannerName: banner.name,
    trackA: generateRolls(seed, numRolls, banner, lastCat ?? ""),
    trackB: generateRolls(advanceSeed(seed), numRolls, banner, ""),
  }));
};
