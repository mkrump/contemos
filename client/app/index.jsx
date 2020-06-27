import ReactDOM from "react-dom";
import React from "react";
import { MuiThemeProvider } from "@material-ui/core";

import App from "./components/App";
import { Provider } from "./identityContext";
import globalTheme from "./components/theme";

ReactDOM.render(
  <Provider>
    <MuiThemeProvider theme={globalTheme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("app")
);
