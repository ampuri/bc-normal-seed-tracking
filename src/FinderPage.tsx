import React, { useState } from "react";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { generateWorkerInitializationMessage } from "./utils/seedFinder";
import { CatseyeBannerData, NormalBannerData } from "./utils/bannerData";
import FinderResults from "./FinderResults";

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

type WorkerMessage = {
  type: "progress" | "seedFound";
  percentageSearched?: number;
  seed?: number;
};

const FinderPage = () => {
  const [progresses, setProgresses] = useState<number[]>([]);
  const setWorkerProgress = (worker: number, progress: number) => {
    setProgresses((prevProgresses) => [
      ...prevProgresses.slice(0, worker),
      progress,
      ...prevProgresses.slice(worker + 1),
    ]);
  };
  const [seedsFound, setSeedsFound] = useState([]);

  const onClick = () => {
    const partialInitialMessage = generateWorkerInitializationMessage({
      banner: NormalBannerData,
      rolls: [
        "Gross Cat",
        "Cat Energy",
        "Titan Cat",
        "Cat",
        "Titan Cat",
        "Research",
        "Axe Cat",
        "Cat Cannon Attack",
        "Cat",
        "Tank Cat",
      ],
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
            console.log(
              `Worker ${workerNumber} progress ${event.data.percentageSearched}%`
            );
            setWorkerProgress(workerNumber, event.data.percentageSearched!);
          } else if (messageType === "seedFound") {
            console.log(`Worker ${workerNumber} found seed ${event.data.seed}`);
          }
        };
        worker.postMessage(initialMessage);
        workers.push(worker);
      }
    } else {
      alert("Web Workers not supported");
    }
  };
  return (
    <Styles>
      <Typography variant="h4">BC Normal Seed Tracker</Typography>
      <Typography variant="h6">About this tool</Typography>
      <Typography variant="body1">
        <ul>
          <li>
            Looking for the tracks? Try <a href="#">here</a>.
          </li>
        </ul>
      </Typography>
      <button type="button" onClick={onClick}>
        Start webworker
      </button>
      <FinderResults workerProgresses={progresses} />
    </Styles>
  );
};

export default FinderPage;
