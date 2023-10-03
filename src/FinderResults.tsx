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
}: {
  workerProgresses: number[];
}) => {
  console.log(workerProgresses);
  return (
    <div>
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
  );
};

export default FinderResults;
