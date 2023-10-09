import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import TeamMaker from "./TeamMaker";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
      <TeamMaker />
  </StrictMode>
);