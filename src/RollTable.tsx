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
  const allRolls = generateAllRolls(1, 100);
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
