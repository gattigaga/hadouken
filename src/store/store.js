import { combineReducers, createStore } from "redux";

import * as reducers from "./reducers";

const rootReducers = combineReducers(reducers);
export const store = createStore(rootReducers);
