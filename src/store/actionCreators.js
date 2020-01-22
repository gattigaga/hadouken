import uuid from "uuid/v4";

import { CREATE_BOARD, UPDATE_BOARD, DELETE_BOARD } from "./actions";

export const createBoard = name => {
  const id = uuid();
  const slug = name.toLowerCase().replace(" ", "-") + `-${id}`;
  const timestamp = Date.now();

  return {
    type: CREATE_BOARD,
    payload: {
      id,
      slug,
      name,
      timestamp
    }
  };
};

export const updateBoard = (id, name) => ({
  type: UPDATE_BOARD,
  payload: { id, name }
});

export const deleteBoard = id => ({
  type: DELETE_BOARD,
  payload: id
});
