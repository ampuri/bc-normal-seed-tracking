import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import React from "react";

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

const FinderResults = ({
  workerProgresses,
  seedsFound,
  isSearching,
}: {
  workerProgresses: number[];
  seedsFound: number[];
  isSearching: boolean;
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
    <div>
      {seedsFound.length > 0 ? (
        <>
          <Typography variant="body1">
            Found a total of {seedsFound.length} seed
            {seedsFound.length > 1 && "s"} matching your rolls.
            {seedsFound.length > 1 && (
              <>
                <br />
                Only one of these will be accurate, you can pull some more and
                check the tracks to confirm which one it is.
              </>
            )}
            {seedsFound.length > 200 && (
              <>
                <br />
                Actually, over 200 seeds were found, so only the first 200 are
                shown. Please add more cats to decrese the number of potential
                seeds.
              </>
            )}
          </Typography>
          <ul>
            {seedsFound.map((seed) => {
              const searchParams = new URLSearchParams(window.location.search);
              searchParams.set("seed", seed.toString());
              const trackLink = `?${searchParams.toString()}#`;
              return (
                <li>
                  {seed}: <a href={trackLink}>Track link for {seed}</a>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <Typography variant="body1">
          Couldn't find your seed. This could be because of a dupe - please
          remove the first entry and try again.
        </Typography>
      )}
    </div>
  );
};

export default FinderResults;
