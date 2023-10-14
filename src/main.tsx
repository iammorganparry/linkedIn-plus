import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = document.createElement("div");
root.id = "crx-root";
root.style.zIndex = "999";
root.style.position = "fixed";
root.style.top = "0";
root.style.right = "0";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
