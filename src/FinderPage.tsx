import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { generateWorkerInitializationMessage } from "./utils/seedFinder";
import { CatseyeBannerData, NormalBannerData } from "./utils/bannerData";

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
      const workers = [];
      for (let i = 0; i < 1; i++) {
        const initialMessage = {
          ...partialInitialMessage,
          workerNumber: i,
          startSeed: 3356970559,
          endSeed: 3356970559 + 3,
        };
        const worker = new Worker(
          new URL("./seedFinderWorker.js", import.meta.url)
        );
        worker.onmessage = (event) => {
          console.log(`Got message from worker ${i}: ${event.data}`);
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
    </Styles>
  );
};

export default FinderPage;
