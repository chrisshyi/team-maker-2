import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import TeamMaker from "./TeamMaker";
import init from "wasm-lib";

init().then(() => {
  console.log("WASM initialized");
});

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
      <TeamMaker />
  </StrictMode>
);