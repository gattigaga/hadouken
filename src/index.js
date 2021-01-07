import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import "typeface-roboto";
import "normalize.css";

import App from "./App";

Modal.setAppElement("#root");

ReactDOM.render(<App />, document.getElementById("root"));
