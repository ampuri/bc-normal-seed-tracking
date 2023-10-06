import styled from "@emotion/styled";
import { Typography, css } from "@mui/material";
import React from "react";
import { BannerData, NormalBannerPlusData } from "./utils/bannerData";
import {
  generateRollsLightweight,
  getTrackUrlWithSeedQueryParam,
} from "./utils/seed";

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 1em;
  border: 1px solid black;
  max-width: 40em;
`;

const ProgressBar = styled.div<{ percentage: number }>`
  width: ${(props) => props.percentage}%;
  height: 100%;
  background-color: green;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

// Don't ask
const UlWithStrong = styled.ul`
  strong {
    font-weight: bold;
  }
`;

const FinderResultsRare = ({
  workerProgresses,
  seedsFound,
  isSearching,
  bannerData,
  numPulls,
}: {
  workerProgresses: number[];
  seedsFound: number[];
  isSearching: boolean;
  bannerData: BannerData;
  numPulls: number;
}) => {
  if (seedsFound.length > 200) {
    seedsFound = seedsFound.slice(0, 200);
  }
  return isSearching ? (
    <div>
      <Typography variant="body1">Searching...</Typography>
      {workerProgresses.map((progress, i) => {
        return (
          <RowContainer>
            <Typography variant="body1" style={{ minWidth: "30px" }}>
              #{i + 1}
            </Typography>
            <ProgressBarContainer>
              <ProgressBar percentage={progress} />
            </ProgressBarContainer>
          </RowContainer>
        );
      })}
    </div>
  ) : (
    <div style={{ marginBottom: "24px" }}>
      {seedsFound.length > 0 ? (
        <>
          <Typography variant="body1">
            Notes:
            <ul>
              <li>
                If there are multiple seeds found, only one will be correct, you
                can pull some more and check the tracks to confirm which one it
                is.
              </li>
              <li>
                It's also possible that none of the seeds are correct due to a
                dupe.
                <ul>
                  <li>
                    In that case you can just remove the first cat and try
                    again.
                  </li>
                </ul>
              </li>
            </ul>
            <br />
            Found a total of {seedsFound.length} seed
            {seedsFound.length > 1 && "s"} matching your rolls.{" "}
          </Typography>
          <UlWithStrong>
            {seedsFound.map((seed, i) => {
              const [seedAfterRolls, nextRollIsReroll] =
                generateRollsLightweight(seed, numPulls, bannerData);
              return (
                <li>
                  <strong>Seed {i + 1}</strong>
                  <ul>
                    <li>
                      <strong>Before</strong> doing the {numPulls} pulls: {seed}
                    </li>
                    <li>
                      <strong>After</strong> doing the {numPulls} pulls:{" "}
                      {seedAfterRolls}
                    </li>
                    {nextRollIsReroll && (
                      <li>
                        <strong>Important:</strong> For this seed, the next roll
                        is detected to be a <i>dupe track switch</i>.
                        <ul>
                          <li>
                            The tracker <i>might not account for this</i> if you
                            use the <strong>After</strong> seed, so it will
                            incorrectly show you proceeding along track A.
                          </li>
                          <li>
                            Instead, you should use the <strong>Before</strong>{" "}
                            seed and update your seed manually.
                          </li>
                        </ul>
                      </li>
                    )}
                  </ul>
                </li>
              );
            })}
          </UlWithStrong>
        </>
      ) : (
        <Typography variant="body1">
          Couldn't find your seed. This could be because of a dupe - please
          remove the first cat and try again.
        </Typography>
      )}
    </div>
  );
};

export default FinderResultsRare;
