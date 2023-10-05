import React from "react";
import ReactDOM from "react-dom";
import { createHashRouter, RouterProvider } from "react-router-dom";

import Page from "./Page";
import FinderPage from "./FinderPage";
import CreditsPage from "./CreditsPage";
import RarePage from "./RarePage";

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

ReactDOM.render(
  <RouterProvider router={router} />,
  document.getElementById("root")
);
