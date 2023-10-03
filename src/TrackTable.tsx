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

const TrackTable = ({
  rolls,
  track,
}: {
  rolls: BannerTrackRolls[];
  track: "A" | "B";
}) => {
  console.log(rolls);
  const zippedRolls = zip(rolls.map((roll) => roll.track));
  console.log(zippedRolls);
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
                {row.map((unit, j) => (
                  <TopTd key={j} rarity={unit.rarity}>
                    {unit.rerolledUnitName ? unit.unitName : "\u00A0"}
                  </TopTd>
                ))}
              </tr>
              <tr>
                {row.map((unit, j) => {
                  const rerolledEntry =
                    track === "A"
                      ? `${unit.rerolledUnitName} -> ${i + 2}B`
                      : `<- ${i + 3}A ${unit.rerolledUnitName}`;
                  return (
                    <BottomTd key={j} rarity={unit.rarity}>
                      {unit.rerolledUnitName ? rerolledEntry : unit.unitName}
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
