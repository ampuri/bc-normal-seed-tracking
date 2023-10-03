import React from "react";
import { Roll, generateAllRolls } from "./utils/seed";
import TrackTable from "./TrackTable";
import styled from "@emotion/styled";

export type BannerTrackRolls = {
  bannerName: string;
  track: Roll[];
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const RollTable = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialSeed = parseInt(urlParams.get("seed")!, 10) || 1;
  const numRolls = parseInt(urlParams.get("rolls")!, 10) || 100;
  const superfeline = urlParams.get("sf") === "true";

  const allRolls = generateAllRolls(initialSeed, numRolls, superfeline);
  console.log(allRolls);

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
