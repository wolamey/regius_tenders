import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App/App";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { Theme } from "@radix-ui/themes";
import { ReactNotifications } from "react-notifications-component";

createRoot(document.getElementById("root")).render(
  <>
    <ReactNotifications />

    <BrowserRouter >
      <CookiesProvider>
        <StrictMode>
          <Theme>
            <App />
          </Theme>
        </StrictMode>
      </CookiesProvider>
    </BrowserRouter>
  </>
);
