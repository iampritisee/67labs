import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import config from "./auth_config";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain={config.domain}
    clientId={config.clientId}
    authorizationParams={{
      redirect_uri: config.redirectUri,
      audience: config.audience,
    }}
  >
    <App />
  </Auth0Provider>
);
