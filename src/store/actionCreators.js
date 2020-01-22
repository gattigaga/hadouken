import uuid from "uuid/v4";

import { CREATE_BOARD, UPDATE_BOARD, DELETE_BOARD } from "./actions";

export const createBoard = name => ({
  type: CREATE_BOARD,
  payload: {
    id: uuid(),
    timestamp: Date.now(),
    name
  }
});

export const updateBoard = (id, name) => ({
  type: UPDATE_BOARD,
  payload: { id, name }
});

export const deleteBoard = id => ({
  type: DELETE_BOARD,
  payload: id
});
