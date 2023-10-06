import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import React, { useState } from "react";
import GodfatExampleImage from "./images/godfat.png";
import { BannerData } from "./utils/bannerData";
import { generateWorkerInitializationMessage } from "./utils/seedFinder";
import { WorkerMessage } from "./FinderPage";
import FinderResultsRare from "./FinderResultsRare";

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

const parseBannerData = (bannerData: string): BannerData => {
  const splitBannerData = bannerData.split("\n").map((line) => line.trim());
  const relevantBannerData = splitBannerData.filter(
    (line) =>
      line.startsWith("Rare:") ||
      line.startsWith("Super:") ||
      line.startsWith("Uber:") ||
      line.startsWith("Legendary:")
  );

  const lineRegex =
    /^(?<rarity>[a-zA-Z]*): (?<rate>.*)% \(\d* cats\)(?<cats>.*)?$/;
  const relevantBannerDataParsed = relevantBannerData.map((line) => {
    const result = lineRegex.exec(line);
    return result?.groups as { rarity: string; rate: string; cats: string };
  });
  const bannerDataPoolsElements = relevantBannerDataParsed
    .filter(({ cats }) => Boolean(cats))
    .map(({ rarity, rate, cats }) => {
      // Turn rate into the number of slots in 10000
      const raritySlots = Math.round(parseFloat(rate) * 100);
      // Parse units
      const parsedUnits = cats
        .trim()
        .split(/, \d+/)
        .map((unit) => unit.trim());
      return {
        rate: raritySlots,
        units: parsedUnits,
        reroll: rarity === "Rare",
      };
    });

  // Create cumsum
  const rateCumSum = bannerDataPoolsElements
    .map((pool) => pool.rate)
    .map((rate, index, rates) =>
      rates.slice(0, index + 1).reduce((a, b) => a + b, 0)
    );

  return {
    name: "Custom",
    rateCumSum,
    pools: bannerDataPoolsElements,
  };
};

const RarePage = () => {
  const [dataToParse, setDataToParse] = useState<string>("");
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const hasBannerData = bannerData !== null;

  const [userRolls, setUserRolls] = useState<(string | null)[]>(
    Array(10).fill(null)
  );
  const setUserRoll = (index: number, unit: string | null) => {
    if (unit === "null") {
      unit = null;
    }
    setUserRolls((prevRolls) => [
      ...prevRolls.slice(0, index),
      unit,
      ...prevRolls.slice(index + 1),
    ]);
  };

  const bannerPool = bannerData?.pools.flatMap((pool) => pool.units);

  const [progresses, setProgresses] = useState<number[]>([]);
  const setWorkerProgress = (worker: number, progress: number) => {
    setProgresses((prevProgresses) => [
      ...prevProgresses.slice(0, worker),
      progress,
      ...prevProgresses.slice(worker + 1),
    ]);
  };
  const [seedsFound, setSeedsFound] = useState<number[]>([]);
  const isSearching = progresses.length > 0 && progresses.some((p) => p < 100);
  const startedAndFinishedSearching = progresses.length > 0 && !isSearching;

  const onClick = () => {
    const partialInitialMessage = generateWorkerInitializationMessage({
      banner: bannerData!,
      rolls: userRolls.filter(Boolean) as string[],
    });

    if (window.Worker) {
      const chunkSize = 100_000_000;
      const startingSeed = 1;
      const endingSeedPlusOne = 2 ** 32;
      const chunks = [];
      for (let start = 0; start <= endingSeedPlusOne; start += chunkSize) {
        chunks.push([
          Math.max(startingSeed, start),
          Math.min(endingSeedPlusOne, start + chunkSize),
        ]);
      }

      const workers = [];
      setProgresses(chunks.map(() => 0));
      setSeedsFound([]);
      for (const [workerNumber, [startSeed, endSeed]] of chunks.entries()) {
        const initialMessage = {
          ...partialInitialMessage,
          workerNumber,
          startSeed,
          endSeed,
        };
        const worker = new Worker(
          new URL("./seedFinderWorker.js", import.meta.url)
        );
        worker.onmessage = (event: { data: WorkerMessage }) => {
          const messageType = event.data.type;
          if (messageType === "progress") {
            setWorkerProgress(workerNumber, event.data.percentageSearched!);
          } else if (messageType === "seedFound") {
            setSeedsFound((prevSeedsFound) => [
              ...prevSeedsFound,
              event.data.seed!,
            ]);
          }
        };
        worker.postMessage(initialMessage);
        workers.push(worker);
      }
    } else {
      alert("Sorry, web workers are not supported in this browser.");
    }
  };

  return (
    <Styles>
      <Typography variant="h4">
        BC [Rare] Seed Finder <a href="#credits">[Credits]</a>
      </Typography>
      <Typography variant="h6">READ THIS FIRST</Typography>
      <Typography variant="h5">
        YOU DO NOT NEED A SEED TO USE THIS TOOL.
        <br />
        THIS TOOL IS FOR FINDING YOUR SEED.
      </Typography>
      <Typography variant="h6">Background</Typography>
      <ul>
        <li>
          This is an alternative to Godfat's{" "}
          <a href="https://bc-seek.godfat.org/seek">seed finder</a> which runs{" "}
          <span style={{ fontWeight: "bold" }}>inside your own browser</span>.
          <ul>
            <li>
              Since it runs using your own device's resources, you won't have to
              wait in a queue.
            </li>
            <li>
              However, it will heavily slow down your device while running.
            </li>
          </ul>
        </li>
        <li>
          Most of the difficulty in seed finding is getting and maintaining the
          banner data and unit pools in each banner.
          <ul>
            <li>
              For ease of implementation, we're going to reuse a bunch of
              Godfat's hard work in figuring out the banner rates and pools.
            </li>
            <li>
              For this reason, I don't take credit for any of this work -
              writing this site is super simple in comparison.
            </li>
          </ul>
        </li>
      </ul>
      <Typography variant="h6">Usage</Typography>
      <Typography variant="body1" style={{ marginBottom: "12px" }}>
        <ul>
          <li>Pull 8-10 times on a banner.</li>
          <li>
            Navigate to Godfat's{" "}
            <a href="https://bc.godfat.org/?seed=1&details=true">
              seed tracking website
            </a>{" "}
            and select the banner you pulled on.
          </li>
          <li>
            <strong style={{ fontWeight: "bold" }}>
              You do not need a seed to do this step.
            </strong>
          </li>
          <li>
            <strong style={{ fontWeight: "bold" }}>
              There's a seed in the image below, but that's just a random
              placeholder. Just go to{" "}
              <a href="https://bc.godfat.org/?seed=1&details=true">this link</a>{" "}
              and follow the instructions below.
            </strong>
          </li>
          <li>
            <img
              src={GodfatExampleImage}
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          </li>
          <li>
            Check the <span style={{ border: "3px solid red" }}>Details</span>{" "}
            box, if not already checked, to bring up the in-depth{" "}
            <span style={{ border: "3px solid #00A2E8" }}>
              rate information
            </span>
            , and copy all of it into the textbox below.
          </li>
          <li>
            If it parses correctly, you should be able to input units and seed
            track as usual.
          </li>
        </ul>
      </Typography>
      <Typography variant="h6">Parser</Typography>

      <textarea
        style={{ width: "100%", height: "10rem", resize: "none" }}
        placeholder={`Paste the copied information here, then click the "Parse" button below.`}
        onChange={(event) => setDataToParse(event.target.value)}
      />
      <div
        style={{ display: "flex", flexDirection: "row", marginBottom: "12px" }}
      >
        <button
          type="button"
          onClick={() => {
            try {
              const parsedData = parseBannerData(dataToParse);
              setBannerData(parsedData);
            } catch (e) {
              console.log(e);
              alert("Couldn't properly parse banner data :(");
            }
          }}
        >
          Parse
        </button>
        {hasBannerData && (
          <Typography variant="body1" style={{ marginLeft: "8px" }}>
            Parsed! The parser's validation is pretty light, so there might
            still be errors. Scroll down...
          </Typography>
        )}
      </div>

      {hasBannerData && (
        <>
          <Typography variant="h6">Finder</Typography>
          <Typography variant="subtitle2">Rolls</Typography>
          <div
            style={{
              marginBottom: "4px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {userRolls.map((roll, i) => {
              return (
                <select
                  onChange={(e) => setUserRoll(i, e.target.value)}
                  style={{
                    maxWidth: "300px",
                    marginBottom: "4px",
                  }}
                >
                  <option value="null" selected={roll === null}>
                    -- Select roll {i + 1} --
                  </option>
                  {bannerPool!.map((unit) => {
                    return (
                      <option key={unit} value={unit} selected={roll === unit}>
                        {unit}
                      </option>
                    );
                  })}
                </select>
              );
            })}
          </div>
          <Typography variant="subtitle2">Start</Typography>
          <button
            type="button"
            onClick={onClick}
            disabled={userRolls.every((roll) => roll === null) || isSearching}
          >
            Start searching
          </button>
          {(isSearching || startedAndFinishedSearching) && (
            <>
              <Typography variant="h6">Results</Typography>
              <FinderResultsRare
                workerProgresses={progresses}
                seedsFound={seedsFound}
                isSearching={isSearching}
                bannerData={bannerData!}
                numPulls={userRolls.filter(Boolean).length}
              />
            </>
          )}
        </>
      )}
    </Styles>
  );
};

export default RarePage;
