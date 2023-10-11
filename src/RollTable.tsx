import React from "react";
import { Roll, generateAllRolls } from "./utils/seed";
import TrackTable from "./TrackTable";
import styled from "@emotion/styled";
import { getQueryParam } from "./utils/queryParams";

export type BannerTrackRolls = {
  bannerName: string;
  track: Roll[];
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const RollTable = () => {
  const initialSeed = parseInt(getQueryParam("seed"), 10);
  const numRolls = parseInt(getQueryParam("rolls"), 10);
  const lastCat = getQueryParam("lastCat");
  const lastBanner = getQueryParam("lastBanner");

  const allRolls = generateAllRolls(initialSeed, numRolls, lastCat, lastBanner);

  const trackARolls = allRolls.map((roll) => ({
    bannerName: roll.bannerName,
    track: roll.trackA,
  }));
  const trackBRolls = allRolls.map((roll) => ({
    bannerName: roll.bannerName,
    track: roll.trackB,
  }));
  return (
    <Container>
      <TrackTable rolls={trackARolls} track={"A"} />
      <TrackTable rolls={trackBRolls} track={"B"} />
    </Container>
  );
};

export default RollTable;
