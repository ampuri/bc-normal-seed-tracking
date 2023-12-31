const advanceSeed = (seed) => {
  seed ^= seed << 13;
  seed = seed >>> 0; // Convert to 32bit unsigned integer
  seed ^= seed >>> 17;
  seed ^= seed << 15;
  seed = seed >>> 0; // Convert to 32bit unsigned integer
  return seed;
};

const getRarity = ({ seed, rateCumSum }) => {
  const seedMod = seed % 10000;
  return rateCumSum.findIndex((sum) => seedMod < sum);
};

const getUnit = ({ seed, rarity, bannerUnits, removedIndex = -1 }) => {
  const units = bannerUnits[rarity];
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

const check = ({
  seed,
  rolls,
  bannerRateCumSum,
  bannerUnits,
  bannerRerollablePools,
}) => {
  let lastRoll = -1;
  for (const userRoll of rolls) {
    seed = advanceSeed(seed);
    const rarity = getRarity({ seed, rateCumSum: bannerRateCumSum });

    seed = advanceSeed(seed);
    const [unitIndex, unitId] = getUnit({ seed, rarity, bannerUnits });
    if (unitId === lastRoll && bannerRerollablePools.includes(rarity)) {
      seed = advanceSeed(seed);
      const [_, rerolledUnitId] = getUnit({
        seed,
        rarity,
        bannerUnits,
        removedIndex: unitIndex,
      });
      if (userRoll !== rerolledUnitId) {
        return false;
      }
      lastRoll = rerolledUnitId;
    } else {
      if (userRoll !== unitId) {
        return false;
      }
      lastRoll = unitId;
    }
  }

  return true;
};

const searchRange = (data) => {
  const {
    workerNumber,
    startSeed,
    endSeed,
    rolls,
    bannerRateCumSum,
    bannerUnits,
    bannerRerollablePools,
  } = data;

  const oneTenthBlock = (endSeed - startSeed) / 10;
  let percentageSearched = 0;
  let outputBreakpoint = startSeed + oneTenthBlock;

  for (let seed = startSeed; seed < endSeed; seed++) {
    if (seed >= outputBreakpoint) {
      percentageSearched += 10;
      postMessage({
        type: "progress",
        percentageSearched: percentageSearched,
      });
      outputBreakpoint += oneTenthBlock;
    }
    const seedIsValid = check({
      seed,
      rolls,
      bannerRateCumSum,
      bannerUnits,
      bannerRerollablePools,
    });
    if (seedIsValid) {
      postMessage({
        type: "seedFound",
        seed: seed,
      });
    }
  }
};

onmessage = (e) => {
  searchRange(e.data);
  postMessage({
    type: "progress",
    percentageSearched: 100,
  });
};
