import React from "react";
import { Roll, advanceSeed, generateAllRolls } from "./utils/seed";
import TrackTable from "./TrackTable";
import styled from "@emotion/styled";
import { getQueryParam } from "./utils/queryParams";

export type BannerTrackRolls = {
  bannerName: string;
  bannerShortName: string;
  track: Roll[];
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const RollTable = () => {
  const initialSeed = parseInt(getQueryParam("seed"), 10);
  const numRolls = parseInt(getQueryParam("rolls"), 10);
  // Buffer so that track switches near the end of numRolls can be processed
  const NUM_ROLLS_BUFFER = 10;
  const lastCatFromQueryParams = getQueryParam("lastCat");
  const [selectedType, selectedSeedStr, selectedBanner] =
    getQueryParam("selected").split(",");
  const selectedSeed = parseInt(selectedSeedStr, 10);

  const allRolls = generateAllRolls(initialSeed, numRolls + NUM_ROLLS_BUFFER);
  // Augment roll data with dupe track switch data
  // For this processing we'll identify each cell by its raritySeed
  allRolls.forEach(({ trackA, trackB }) => {
    // Find all cells that should dupe track switch
    const cellsWithDupeTrackSwitches: number[] = [];
    const findCellsWithDupeTrackSwitches = (lastCat: string, track: Roll[]) => {
      track.forEach((roll) => {
        if (roll.unitIfDupe && roll.unitIfDistinct.unitName === lastCat) {
          cellsWithDupeTrackSwitches.push(roll.raritySeed);
        }
        lastCat = roll.unitIfDistinct.unitName;
      });
    };
    findCellsWithDupeTrackSwitches(lastCatFromQueryParams, trackA);
    findCellsWithDupeTrackSwitches("", trackB);

    // Process all cells that should dupe track switch
    cellsWithDupeTrackSwitches.forEach((raritySeed) => {
      const findCell = (raritySeed: number) =>
        trackA.find((roll) => roll.raritySeed === raritySeed) ||
        trackB.find((roll) => roll.raritySeed === raritySeed);
      const findCellId = (raritySeed: number) => {
        const trackAIndex = trackA.findIndex(
          (roll) => roll.raritySeed === raritySeed
        );
        if (trackAIndex >= 0) {
          return `${trackAIndex + 1}A`;
        }
        const trackBIndex = trackB.findIndex(
          (roll) => roll.raritySeed === raritySeed
        );
        return `${trackBIndex + 1}B`;
      };

      let sourceCell = findCell(raritySeed)!;
      let prevUnit = sourceCell.unitIfDistinct.unitName;
      while (sourceCell.unitIfDistinct.unitName === prevUnit) {
        prevUnit = sourceCell.unitIfDupe!.unitName;
        const destinationRaritySeed = advanceSeed(
          sourceCell.unitIfDupe!.unitSeed
        );
        const destinationCell = findCell(destinationRaritySeed);
        if (!destinationCell) {
          break;
        }
        sourceCell.dupeInfo = {
          showDupe: true,
          targetCellId: findCellId(destinationRaritySeed),
          targetWillRerollAgain:
            sourceCell.unitIfDupe!.unitName ===
            destinationCell.unitIfDistinct.unitName,
        };
        sourceCell = destinationCell;
      }
    });
  });

  // Highlight the next 10 pulls from selected
  if (selectedType) {
    const selectedRolls = allRolls.find(
      ({ bannerShortName }) => bannerShortName === selectedBanner
    );
    const findCell = (raritySeed: number) =>
      selectedRolls?.trackA.find((roll) => roll.raritySeed === raritySeed) ||
      selectedRolls?.trackB.find((roll) => roll.raritySeed === raritySeed);
    if (selectedRolls) {
      const startingRoll = findCell(selectedSeed);

      // Weird edge case where the reroll is somehow removed
      const selectedRerollButStartingRollHasNone =
        selectedType === "r" && !startingRoll?.dupeInfo?.showDupe;

      if (startingRoll && !selectedRerollButStartingRollHasNone) {
        // If selectedType = "r", force the unitIfDupe path
        let prevUnit =
          selectedType === "c" ? "" : startingRoll.unitIfDistinct.unitName;
        let currentRoll = startingRoll;
        for (let i = 0; i < 11; i++) {
          let destinationRaritySeed = 0;
          if (currentRoll.unitIfDistinct.unitName !== prevUnit) {
            // Go down the canonical path
            currentRoll.highlight = {
              top: true,
              bottom: !currentRoll.dupeInfo?.showDupe,
            };
            prevUnit = currentRoll.unitIfDistinct.unitName;
            destinationRaritySeed = advanceSeed(
              currentRoll.unitIfDistinct.unitSeed
            );
          } else {
            // Go down the reroll path
            currentRoll.highlight = {
              top: false,
              bottom: true,
            };
            prevUnit = currentRoll.unitIfDupe!.unitName;
            destinationRaritySeed = advanceSeed(
              currentRoll.unitIfDupe!.unitSeed
            );
          }
          if (i === 10) {
            currentRoll.highlight.isLast = true;
          }
          const destination = findCell(destinationRaritySeed);
          if (!destination) {
            break;
          }
          currentRoll = destination;
        }
      }
    }
  }

  const trackARolls = allRolls.map((roll) => ({
    bannerName: roll.bannerName,
    bannerShortName: roll.bannerShortName,
    track: roll.trackA.slice(0, numRolls),
  }));
  const trackBRolls = allRolls.map((roll) => ({
    bannerName: roll.bannerName,
    bannerShortName: roll.bannerShortName,
    track: roll.trackB.slice(0, numRolls),
  }));
  return (
    <Container>
      <TrackTable rolls={trackARolls} track={"A"} />
      <TrackTable rolls={trackBRolls} track={"B"} />
    </Container>
  );
};

export default RollTable;
