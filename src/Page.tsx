import React, { useState } from "react";
import RollTable from "./RollTable";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { getQueryParam, setQueryParam } from "./utils/queryParams";
import { AllBanners } from "./utils/bannerData";

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
  const [seedInput, setSeedInput] = useState(getQueryParam("seed"));
  const selectedBanners = getQueryParam("banners").split(",") || [];

  return (
    <Styles>
      <Typography variant="h4">
        BC Normal Seed Tracker <a href="#credits">[Credits]</a>
      </Typography>
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
          <ul>
            <li>
              Looking for your seed? Try <a href="#/finder">here</a>.
            </li>
          </ul>
          <li>
            Track switches work the exact same as rare banners. You can
            strategically roll to hit or avoid a track switch.
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
      <Typography variant="subtitle2">Rolls</Typography>
      <div style={{ marginBottom: "4px" }}>
        <select
          style={{ marginRight: "4px" }}
          onChange={(event) => setQueryParam("rolls", event.target.value)}
        >
          {[100, 200, 500, 999].map((numRolls) => (
            <option
              value={numRolls}
              selected={getQueryParam("rolls") === numRolls.toString()}
            >
              {numRolls}
            </option>
          ))}
        </select>
      </div>
      <Typography variant="subtitle2">Banners</Typography>
      <div style={{ display: "flex", gap: "24px" }}>
        {AllBanners.map((banner) => {
          return (
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={selectedBanners.includes(banner.shortName)}
                onClick={(event) => {
                  let newSelectedBanners;
                  if ((event.target as HTMLInputElement).checked) {
                    newSelectedBanners = [
                      ...selectedBanners,
                      banner.shortName,
                    ].sort();
                  } else {
                    newSelectedBanners = selectedBanners.filter(
                      (bannerName) => bannerName !== banner.shortName
                    );
                  }
                  setQueryParam("banners", newSelectedBanners.join(","));
                }}
                style={{ marginRight: "8px", width: "20px", height: "20px" }}
              ></input>
              <Typography variant="body1">{banner.name}</Typography>
            </label>
          );
        })}
      </div>
      <Typography variant="body1">&nbsp;</Typography>
      <RollTable />
    </Styles>
  );
};

export default Page;
