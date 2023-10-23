import React from "react";
import { BannerTrackRolls } from "./RollTable";
import styled from "@emotion/styled";
import { Roll } from "./utils/seed";
import { getQueryParam, setQueryParam } from "./utils/queryParams";

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

const Td = styled.td<{
  rarity: number;
  unitName?: string;
  highlight?: boolean;
  isLastHighlighted?: boolean;
}>`
  white-space: nowrap;
  border: 1px solid black;
  text-align: center;

  background-image: ${(props) => {
    if (props.highlight) {
      if (props.isLastHighlighted) {
        return "repeating-linear-gradient(90deg, #00000075 5px, #00000075 15px, #00000050 15px, #00000050 25px);";
      }
      return "linear-gradient(#00000050, #00000050)";
    }
  }};

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
  cursor: pointer;
  border-bottom: none;
  padding: 0 8px;
`;

const BottomTd = styled(Td)`
  cursor: pointer;
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
                      onClick={(e) => {
                        // Don't highlight if clicking on the link itself
                        if ((e.target as Node).nodeName === "A") {
                          return;
                        }
                        // r = reroll, c = canonical
                        const selected = `c,${unit.raritySeed},${rolls[j].bannerShortName}`;
                        if (getQueryParam("selected") === selected) {
                          setQueryParam("selected", "");
                        } else {
                          setQueryParam("selected", selected);
                        }
                      }}
                      highlight={unit.highlight?.top}
                      isLastHighlighted={unit.highlight?.isLast}
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
                      onClick={(e) => {
                        // Don't highlight if clicking on the link itself
                        if ((e.target as Node).nodeName === "A") {
                          return;
                        }
                        // r = reroll, c = canonical
                        const selected = `${
                          unit.dupeInfo?.showDupe ? "r" : "c"
                        },${unit.raritySeed},${rolls[j].bannerShortName}`;
                        if (getQueryParam("selected") === selected) {
                          setQueryParam("selected", "");
                        } else {
                          setQueryParam("selected", selected);
                        }
                      }}
                      highlight={unit.highlight?.bottom}
                      isLastHighlighted={unit.highlight?.isLast}
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
