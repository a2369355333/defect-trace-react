import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SystemProvider } from "./context/SystemContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <SystemProvider>
      <App />
    </SystemProvider>
  </React.StrictMode>
);


