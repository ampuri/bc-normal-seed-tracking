import React, { useState } from "react";
import RollTable from "./RollTable";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { getQueryParam, setQueryParam } from "./utils/queryParams";
import { AllBanners } from "./utils/bannerData";

const Page = () => {
  // We'll just put all our controls here because we're lazy
  const [seedInput, setSeedInput] = useState(getQueryParam("seed"));
  const selectedBanners = getQueryParam("banners").split(",") || [];

  return (
    <>
      <Typography variant="h4">
        BC Normal Seed Tracker <a href="#credits">[Credits]</a>
      </Typography>
      <Typography variant="h6">About this tool</Typography>
      <ul>
        <li>
          The{" "}
          <strong>
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
        <li>
          Clicking an <strong>unit name</strong> will update your seed. Clicking{" "}
          <strong>anywhere else in a cell</strong> will highlight your next 10
          rolls.
        </li>
        <li>
          What is <strong>100K XP (β)</strong>?
          <ul>
            <li>
              The Lucky Ticket G banner uses a special 100K XP item with an
              different ID from the 100K XP used in other banners.
            </li>
            <li>
              This makes no difference ingame, but means that it{" "}
              <strong>
                cannot be used to force track switches across banners
              </strong>
              .
            </li>
            <li>
              In order to distinguish between the two in the tracker, the Lucky
              Ticket G-exclusive one is marked with (β).
            </li>
          </ul>
        </li>
      </ul>
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
            setQueryParam("seed", seedInput);
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
    </>
  );
};

export default Page;
