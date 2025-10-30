import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import * as Tooltip from "@radix-ui/react-tooltip";
import "@/styles/Main/base/global.css";

createRoot(document.getElementById("root")!).render(
  <Tooltip.Provider>
    <App />
  </Tooltip.Provider>
);
