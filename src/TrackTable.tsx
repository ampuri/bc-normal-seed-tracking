import React from "react";
import { BannerTrackRolls } from "./RollTable";
import styled from "@emotion/styled";
import { Roll } from "./utils/seed";

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

const Td = styled.td<{ rarity: number; unitName?: string }>`
  white-space: nowrap;
  border: 1px solid black;
  text-align: center;
  background-color: ${(props) => {
    if (
      [
        "Cat Cannon Attack",
        "Cat Cannon Charge",
        "Worker Cat Rate",
        "Worker Cat Wallet",
        "Base Defense",
        "Research",
        "Accounting",
        "Study",
        "Cat Energy",
      ].includes(props.unitName || "")
    ) {
      return "#c9e4ff";
    }
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
                {row.map((unit: Roll, j) => {
                  const urlParams = new URLSearchParams(window.location.search);
                  urlParams.set(
                    "seed",
                    unit.unitIfDistinct.unitSeed.toString()
                  );
                  urlParams.set("lastCat", unit.unitIfDistinct.unitName);
                  const canonicalDestination = `?${urlParams.toString()}`;
                  return (
                    <TopTd
                      key={j}
                      rarity={unit.rarity}
                      unitName={unit.unitIfDistinct.unitName}
                    >
                      {unit.dupeInfo?.showDupe ? (
                        <a href={canonicalDestination}>
                          {unit.unitIfDistinct.unitName}
                        </a>
                      ) : (
                        "\u00A0"
                      )}
                    </TopTd>
                  );
                })}
              </tr>
              <tr>
                {row.map((unit: Roll, j) => {
                  const urlParams = new URLSearchParams(window.location.search);
                  urlParams.set(
                    "seed",
                    unit.unitIfDistinct.unitSeed.toString()
                  );
                  urlParams.set("lastCat", unit.unitIfDistinct.unitName);
                  const canonicalDestination = `?${urlParams.toString()}`;

                  const rerollUrlParams = new URLSearchParams(
                    window.location.search
                  );
                  rerollUrlParams.set(
                    "seed",
                    unit.unitIfDupe?.unitSeed?.toString() || ""
                  );
                  rerollUrlParams.set(
                    "lastCat",
                    unit.unitIfDupe?.unitName || ""
                  );
                  const rerollDestination = `?${rerollUrlParams.toString()}`;

                  const rerollDestinationText =
                    track === "A"
                      ? `${unit.unitIfDupe?.unitName} -> ${
                          unit.dupeInfo?.targetCellId
                        }${unit.dupeInfo?.targetWillRerollAgain ? "R" : ""}`
                      : `<- ${unit.dupeInfo?.targetCellId}${
                          unit.dupeInfo?.targetWillRerollAgain ? "R" : ""
                        } ${unit.unitIfDupe?.unitName}`;
                  return (
                    <BottomTd
                      key={j}
                      rarity={unit.rarity}
                      unitName={
                        unit.dupeInfo?.showDupe
                          ? unit.unitIfDupe!.unitName
                          : unit.unitIfDistinct.unitName
                      }
                    >
                      {unit.dupeInfo?.showDupe ? (
                        <a href={rerollDestination}>{rerollDestinationText}</a>
                      ) : (
                        <a href={canonicalDestination}>
                          {unit.unitIfDistinct.unitName}
                        </a>
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
