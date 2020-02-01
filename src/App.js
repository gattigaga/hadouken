import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import Home from "./pages/Home";
import BoardDetail from "./pages/BoardDetail";
import CardDetail from "./pages/CardDetail";
import { store } from "./store/store";

const App = () => (
  <Provider store={store}>
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path="/:boardSlug">
          <BoardDetail />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      <Route path="/:boardSlug/:cardSlug">
        <CardDetail />
      </Route>
    </Router>
  </Provider>
);

export default App;
