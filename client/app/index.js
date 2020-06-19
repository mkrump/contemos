import React from "react";
import ReactDom from "react-dom";

import Game from "./components/Game";

const App = () => {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="container">
      <Game />
    </div>
  );
};
ReactDom.render(<App />, document.getElementById("app"));
