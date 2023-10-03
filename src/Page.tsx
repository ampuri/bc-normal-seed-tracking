import React, { useState } from "react";
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
  // We'll just put all our controls here because we're lazy
  const queryParams = new URLSearchParams(window.location.search);
  const [seedInput, setSeedInput] = useState(queryParams.get("seed") || "1");
  const superfeline = queryParams.get("sf") === "true";
  const superfelineToggledQueryParams = new URLSearchParams(
    window.location.search
  );
  superfelineToggledQueryParams.set("sf", (!superfeline).toString());
  const superfelineToggledUrl = `?${superfelineToggledQueryParams.toString()}`;

  return (
    <Styles>
      <Typography variant="h4">BC Normal Seed Tracker</Typography>
      <Typography variant="h6">About this tool</Typography>
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
            Track switches work the exact same as rare banners. You can
            strategically roll to hit or avoid a track switches.
          </li>
          <li>Clicking an entry will update your seed.</li>
        </ul>
      </Typography>
      <Typography variant="h6">Controls</Typography>
      <Typography variant="subtitle2">Current seed</Typography>
      <div style={{ marginBottom: "4px" }}>
        <input
          type="text"
          style={{ marginRight: "4px" }}
          value={seedInput}
          onChange={(event) => setSeedInput(event.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set("seed", seedInput);
            window.location.href = newUrl.toString();
          }}
        >
          Update
        </button>
      </div>
      <Typography variant="subtitle2">
        Currently showing Normal Capsules
        {superfeline ? "+ (with Superfeline)" : ""}
      </Typography>
      <a href={superfelineToggledUrl}>
        Switch to Normal Capsules
        {!superfeline ? "+ (with Superfeline)" : ""}
      </a>
      <Typography variant="body1">&nbsp;</Typography>
      <RollTable />
    </Styles>
  );
};

export default Page;
