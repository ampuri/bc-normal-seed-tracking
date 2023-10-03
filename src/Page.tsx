import React from "react";
import { generateAllRolls } from "./utils/seed";

const Page = () => {
  console.log(generateAllRolls(1, 10));
  return <div>Page</div>;
};

export default Page;
