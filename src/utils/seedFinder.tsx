import { BannerData } from "./bannerData";

type WorkerInitializationMessage = {
  rolls: number[];
  bannerRateCumSum: number[];
  bannerUnits: number[][];
  bannerRerollablePools: number[];
};

export const generateWorkerInitializationMessage = ({
  banner,
  rolls,
}: {
  banner: BannerData;
  rolls: string[];
}): WorkerInitializationMessage => {
  // To speed up computation, convert each unit to a numberic value
  const allUnits = banner.pools.flatMap((pool) => pool.units);
  const poolsNumeric = banner.pools.map((pool) =>
    pool.units.map((unit) => allUnits.indexOf(unit))
  );
  const rerollablePools = banner.pools.flatMap((pool, i) =>
    pool.reroll ? [i] : []
  );
  const rollsNumeric = rolls.map((roll) => allUnits.indexOf(roll));

  // Sanitize
  if (poolsNumeric.length !== banner.rateCumSum.length) {
    throw new Error(
      "Number of pools and number of cumulative rates do not match"
    );
  }
  if (rollsNumeric.includes(-1)) {
    throw new Error("Rolls contains units not in the banner");
  }

  return {
    bannerRateCumSum: banner.rateCumSum,
    bannerUnits: poolsNumeric,
    bannerRerollablePools: rerollablePools,
    rolls: rollsNumeric,
  };
};
