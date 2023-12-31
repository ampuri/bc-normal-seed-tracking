import React, { useState } from "react";
import { Typography } from "@mui/material";
import { generateWorkerInitializationMessage } from "./utils/seedFinder";
import { NormalBannerData, NormalBannerPlusData } from "./utils/bannerData";
import FinderResults from "./FinderResults";

export type WorkerMessage = {
  type: "progress" | "seedFound";
  percentageSearched?: number;
  seed?: number;
};

const FinderPage = () => {
  // We'll just put all our controls here because we're lazy
  const [banner, setBanner] = useState<"normal" | "normalPlus">("normal");
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

  const bannerObj = {
    normal: NormalBannerData,
    normalPlus: NormalBannerPlusData,
  }[banner];
  const bannerPool = bannerObj.pools.flatMap((pool) => pool.units);

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
      banner: bannerObj,
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
    <>
      <Typography variant="h4">
        BC Normal Seed Finder <a href="#credits">[Credits]</a>
      </Typography>
      <Typography variant="h6">About this tool</Typography>
      <Typography variant="body1">
        <ul style={{ marginTop: 0 }}>
          <li>
            This tool will find your normal seed by looking for a seed that
            matches the rolls you input.
          </li>
          <li>
            The searching is done <strong>within the browser</strong>, meaning
            that it will consume your device's resources.
            <ul>
              <li>
                You should expect some heavy device slowdown while the search is
                running.
              </li>
            </ul>
          </li>
          <li>
            Similar to rare ticket tracking, 8-10 rolls is required for a
            reliable result.
          </li>
          <li>
            Looking for the actual tracker? Try <a href="#">here</a>.
          </li>
        </ul>
      </Typography>
      <Typography variant="h6">Controls</Typography>
      <Typography variant="subtitle2">Banner</Typography>
      <div style={{ marginBottom: "4px" }}>
        <select
          id="banner"
          onChange={(e) => {
            setBanner(e.target.value as "normal" | "normalPlus");
            setUserRolls(Array(10).fill(null));
          }}
        >
          <option value="normal">Normal Capsules</option>
          <option value="normalPlus">
            Normal Capsules+ (with Superfeline)
          </option>
        </select>
      </div>
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
              {bannerPool.map((unit) => {
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
          <FinderResults
            workerProgresses={progresses}
            seedsFound={seedsFound}
            isSearching={isSearching}
            bannerData={bannerObj}
            numPulls={userRolls.filter(Boolean).length}
          />
        </>
      )}
    </>
  );
};

export default FinderPage;
