import React from "react";
import RollTable from "./RollTable";
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

const Page = () => {
  return (
    <Styles>
      <Typography variant="h4">BC Normal Seed Tracker</Typography>
      <Typography variant="h6">About this tool:</Typography>
      <Typography variant="body1">
        <ul>
          <li>
            The{" "}
            <strong style={{ fontWeight: "bold" }}>
              normal gacha does NOT share a seed with the rare gacha.
            </strong>{" "}
            You'll need to find your seed separately.
          </li>
          <li>
            To input a seed, change the URL to have a parameter like ?seed=123
          </li>
          <li>
            Track switches work the exact same as rare banners. You can
            strategically roll to hit or avoid a track switches.
          </li>
          <li>
            Clicking an entry will update your seed, but clicking track switches
            doesn't work. You'll need to find the destination manually and
            update.
          </li>
        </ul>
      </Typography>
      <Typography variant="body1">&nbsp;</Typography>
      <RollTable />
    </Styles>
  );
};

export default Page;
