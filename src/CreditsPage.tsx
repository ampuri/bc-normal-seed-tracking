import React from "react";
import { Typography } from "@mui/material";

const CreditsPage = () => {
  return (
    <>
      <Typography variant="h4">BC Normal Seed Tracker</Typography>
      <Typography variant="h6">Thanks to:</Typography>
      <Typography variant="body1">
        <ul style={{ marginTop: 0 }}>
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
    </>
  );
};

export default CreditsPage;
