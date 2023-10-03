import React, { useState } from "react";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";

const Styles = styled.div`
  * {
    margin: 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.43;
    letter-spacing: 0.01071em;
  }
`;

const FinderPage = () => {
  return (
    <Styles>
      <Typography variant="h4">BC Normal Seed Tracker</Typography>
      <Typography variant="h6">About this tool</Typography>
      <Typography variant="body1">
        <ul>
          <li>
            Looking for the tracks? Try <a href="/">here</a>.
          </li>
        </ul>
      </Typography>
    </Styles>
  );
};

export default FinderPage;
