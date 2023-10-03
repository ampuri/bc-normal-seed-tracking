import React from "react";
import RollTable from "./RollTable";
import styled from "@emotion/styled";

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
  return (
    <Styles>
      <RollTable />
    </Styles>
  );
};

export default Page;
