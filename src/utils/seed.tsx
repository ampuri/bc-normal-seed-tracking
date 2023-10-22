import { BannerData, AllBanners } from "./bannerData";
import { getQueryParam } from "./queryParams";

// Used to power a single cell in the roll table
// Each roll has two possiblities depending on if the previous roll is a dupe or not
export type Roll = {
  rarity: number;
  raritySeed: number;
  unitIfDistinct: {
    unitName: string;
    unitSeed: number;
  };
  // unitIfDupe will only exist if the roll's rarity can reroll
  unitIfDupe?: {
    unitName: string;
    unitSeed: number;
    rerolledTimes: number;
  };
  // These get filled in later
  dupeInfo?: {
    showDupe: boolean;
    targetCellId: string;
    targetWillRerollAgain: boolean;
  };
};

export const advanceSeed = (seed: number) => {
  seed ^= seed << 13;
  seed = seed >>> 0; // Convert to 32bit unsigned integer
  seed ^= seed >>> 17;
  seed ^= seed << 15;
  seed = seed >>> 0; // Convert to 32bit unsigned integer
  return seed;
};

const getRarity = ({
  seed,
  rateCumSum,
}: {
  seed: number;
  rateCumSum: number[];
}) => {
  const seedMod = seed % 10000;
  return rateCumSum.findIndex((sum) => seedMod < sum);
};

// Returns the unit index and name that a seed will roll
// Supports dupe rerolls via removedIndices - indices in this array will not be considered from the units array
const getUnit = ({
  seed,
  units,
  removedIndices = [],
}: {
  seed: number;
  units: string[];
  removedIndices?: number[];
}): [number, string] => {
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

// A lightweight version of generateRolls that returns only the final seed
// Should only be used on banners without multiple dupe rares in the pool, like Normal and Normal+
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
    const rarity = getRarity({ seed, rateCumSum: banner.rateCumSum });

    seed = advanceSeed(seed);
    let [unitId, unitName] = getUnit({
      seed,
      units: banner.pools[rarity].units,
    });
    if (unitName === lastRoll && banner.pools[rarity].reroll) {
      if (i === numRolls) {
        finalRollIsReroll = true;
      }
      seed = advanceSeed(seed);
      const [_, rerolledUnitName] = getUnit({
        seed,
        units: banner.pools[rarity].units,
        removedIndices: [unitId],
      });
      lastRoll = rerolledUnitName;
    } else {
      lastRoll = unitName;
    }
  }

  return [finalRollSeed, finalRollIsReroll];
};

const generateRolls = (seed: number, numRolls: number, banner: BannerData) => {
  const rolls: Roll[] = [];

  let lastRoll = "";
  for (let i = 0; i < numRolls; i++) {
    const roll = {} as Roll;

    // Calculate rarity
    seed = advanceSeed(seed);
    const raritySeed = seed;
    const rarity = getRarity({
      seed: raritySeed,
      rateCumSum: banner.rateCumSum,
    });
    roll.raritySeed = raritySeed;
    roll.rarity = rarity;

    // Calculate unit if the previous unit was distinct
    seed = advanceSeed(seed);
    const unitSeed = seed;
    let [unitId, unitName] = getUnit({
      seed: unitSeed,
      units: banner.pools[rarity].units,
    });
    roll.unitIfDistinct = {
      unitName,
      unitSeed,
    };

    // Calculate unit if the previous unit was a dupe
    if (banner.pools[rarity].reroll) {
      // Here we clone the seed since we don't actually want to reroll
      let rerollSeed = unitSeed;
      let rerollUnitName = unitName;
      const rerollRemovedIndices = [unitId];
      let rerollTimes = 0;
      // Reroll until we get something different from the canonical roll
      while (rerollUnitName === unitName) {
        rerollTimes++;
        rerollSeed = advanceSeed(rerollSeed);
        const [nextUnitId, nextUnitName] = getUnit({
          seed: rerollSeed,
          units: banner.pools[rarity].units,
          removedIndices: rerollRemovedIndices,
        });
        rerollUnitName = nextUnitName;
        rerollRemovedIndices.push(nextUnitId);
      }
      roll.unitIfDupe = {
        unitName: rerollUnitName,
        unitSeed: rerollSeed,
        rerolledTimes: rerollTimes,
      };
    }
    lastRoll = roll.unitIfDistinct.unitName;
    rolls.push(roll);
  }

  return rolls;
};

export const generateAllRolls = (seed: number, numRolls: number) => {
  const selectedBanners = getQueryParam("banners").split(",");
  const banners = AllBanners.filter((banner) =>
    selectedBanners.includes(banner.shortName)
  );
  return banners.map((banner) => ({
    bannerName: banner.name,
    trackA: generateRolls(seed, numRolls, banner),
    trackB: generateRolls(advanceSeed(seed), numRolls, banner),
  }));
};
