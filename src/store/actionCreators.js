import uuid from "uuid/v4";

import {
  CREATE_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  CREATE_LIST,
  UPDATE_LIST,
  DELETE_LIST,
} from "./actions";

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

export const createList = ({ boardId, name }) => {
  const id = uuid();
  const timestamp = Date.now();

  return {
    type: CREATE_LIST,
    payload: {
      id,
      boardId,
      name,
      timestamp
    }
  };
};

export const updateList = (id, data) => {
  const validData = {};
  const dataKeys = ["name", "index"];

  dataKeys.forEach(key => {
    if (!data[key]) return;

    validData[key] = data[key];
  });

  return {
    type: UPDATE_LIST,
    payload: { id, data: validData }
  };
};

export const deleteList = id => ({
  type: DELETE_LIST,
  payload: id
});

