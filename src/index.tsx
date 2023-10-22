import React from "react";
import ReactDOM from "react-dom";
import { createHashRouter, RouterProvider } from "react-router-dom";

import Page from "./Page";
import FinderPage from "./FinderPage";
import CreditsPage from "./CreditsPage";
import RarePage from "./RarePage";
import styled from "@emotion/styled";

const router = createHashRouter([
  {
    path: "/",
    element: <Page />,
  },
  {
    path: "/finder",
    element: <FinderPage />,
  },
  {
    path: "/credits",
    element: <CreditsPage />,
  },
  {
    path: "/rare",
    element: <RarePage />,
  },
]);

const Styles = styled.div`
  * {
    margin: 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 0.875rem;
    line-height: 1.43;
    letter-spacing: 0.01071em;
  }
`;

ReactDOM.render(
  <Styles>
    <RouterProvider router={router} />
  </Styles>,
  document.getElementById("root")
);
