import React from "react";
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

const CreditsPage = () => {
  return (
    <Styles>
      <Typography variant="h4">BC Normal Seed Tracker</Typography>
      <Typography variant="h6">Thanks to:</Typography>
      <Typography variant="body1">
        <ul>
          <li>
            <a href="https://www.godfat.org/">Godfat</a> for the tracker format,
            most of this site is inspired by theirs.
          </li>
          <li>
            <a href="https://www.reddit.com/user/JulietCat/">/u/JulietCat</a>,
            for:
            <ul>
              <li>
                <a href="https://old.reddit.com/r/battlecats/comments/64geym/tutorial_cheating_almost_everything_you_could/">
                  This Reddit post
                </a>{" "}
                explaining the seed tracking system in-depth.
              </li>
              <li>
                <a href="https://old.reddit.com/r/battlecats/comments/6c8gsy/cheating_forecasting_silver_draws/">
                  This Reddit post
                </a>{" "}
                confirming rare tickets can be tracked + the rarity breakdown
                for each normal gacha.
              </li>
            </ul>
          </li>
        </ul>
      </Typography>
    </Styles>
  );
};

export default CreditsPage;
