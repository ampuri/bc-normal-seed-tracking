import React from "react";
import { BannerTrackRolls } from "./RollTable";
import styled from "@emotion/styled";

const zip = (arr: any[]) =>
  Array(Math.min(...arr.map((a) => a.length)))
    .fill(0)
    .map((_, i) => arr.map((a) => a[i]));

const Table = styled.table`
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid black;
  text-align: center;
  font-weight: bold;
`;

const Td = styled.td<{ rarity: number }>`
  white-space: nowrap;
  border: 1px solid black;
  text-align: center;
  background-color: ${(props) => {
    switch (props.rarity) {
      case 0:
        return "#FFFFFF";
      case 1:
        return "#EEEEEE";
      case 2:
        return "gold";
      case 3:
        return "red";
      case 4:
        return "aqua";
      default:
        return "#EEEEEE";
    }
  }};
`;

const TopTd = styled(Td)`
  border-bottom: none;
  padding: 0 8px;
`;

const BottomTd = styled(Td)`
  border-top: none;
  padding: 0 8px;
`;

const calculateRerollDestination = ({
  currentNumber,
  track,
  rerolledUnitName,
  rerolledTimes,
}: {
  currentNumber: number;
  track: "A" | "B";
  rerolledUnitName: string;
  rerolledTimes: number;
}) => {
  const nextNumber = currentNumber + 1;
  const oppositeTrack = track === "A" ? "B" : "A";
  const switchingOntoOppositeTrack = rerolledTimes % 2 === 1;
  const bToAFactor = track === "B" && switchingOntoOppositeTrack ? 1 : 0;
  const additionalMovement = Math.floor(rerolledTimes / 2);
  const destinationNumber = nextNumber + bToAFactor + additionalMovement;
  const destinationTrack = switchingOntoOppositeTrack ? oppositeTrack : track;
  return track === "A"
    ? `${rerolledUnitName} -> ${destinationNumber}${destinationTrack}`
    : `<- ${destinationNumber}${destinationTrack} ${rerolledUnitName}`;
};

const TrackTable = ({
  rolls,
  track,
}: {
  rolls: BannerTrackRolls[];
  track: "A" | "B";
}) => {
  const zippedRolls = zip(rolls.map((roll) => roll.track));
  return (
    <Table cellSpacing={0}>
      <thead>
        <tr>
          <Th>#</Th>
          {rolls.map((roll) => (
            <Th key={roll.bannerName}>{roll.bannerName}</Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {track === "B" && (
          <tr>
            <Td rarity={0} colSpan={rolls.length + 1}>
              &nbsp;
            </Td>
          </tr>
        )}
        {zippedRolls.map((row, i) => {
          return (
            <>
              <tr>
                <Td rowSpan={2} rarity={-1}>
                  {i + 1}
                  {track}
                </Td>
                {row.map((unit, j) => {
                  const urlParams = new URLSearchParams(window.location.search);
                  urlParams.set("seed", unit.unitSeed.toString());
                  urlParams.set("lastCat", unit.unitName);
                  const canonicalDestination = `?${urlParams.toString()}`;
                  return (
                    <TopTd key={j} rarity={unit.rarity}>
                      {unit.rerolledUnitName ? (
                        <a href={canonicalDestination}>{unit.unitName}</a>
                      ) : (
                        "\u00A0"
                      )}
                    </TopTd>
                  );
                })}
              </tr>
              <tr>
                {row.map((unit, j) => {
                  const urlParams = new URLSearchParams(window.location.search);
                  urlParams.set("seed", unit.unitSeed.toString());
                  urlParams.set("lastCat", unit.unitName);
                  const canonicalDestination = `?${urlParams.toString()}`;

                  const rerollUrlParams = new URLSearchParams(
                    window.location.search
                  );
                  rerollUrlParams.set(
                    "seed",
                    unit.rerolledUnitSeed?.toString()
                  );
                  rerollUrlParams.set("lastCat", unit.rerolledUnitName);
                  const rerollDestination = `?${rerollUrlParams.toString()}`;

                  const rerollDestinationText = calculateRerollDestination({
                    currentNumber: i + 1,
                    track,
                    rerolledUnitName: unit.rerolledUnitName,
                    rerolledTimes: unit.rerolledTimes,
                  });
                  return (
                    <BottomTd key={j} rarity={unit.rarity}>
                      {unit.rerolledUnitName ? (
                        <a href={rerollDestination}>{rerollDestinationText}</a>
                      ) : (
                        <a href={canonicalDestination}>{unit.unitName}</a>
                      )}
                    </BottomTd>
                  );
                })}
              </tr>
            </>
          );
        })}
        {track === "A" && (
          <tr>
            <Td rarity={0} colSpan={rolls.length + 1}>
              &nbsp;
            </Td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TrackTable;
