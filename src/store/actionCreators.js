import uuid from "uuid/v4";

import {
  CREATE_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  CREATE_LIST,
  UPDATE_LIST,
  DELETE_LIST,
  CREATE_CARD,
  UPDATE_CARD,
  DELETE_CARD,
  DELETE_CHECK,
  CREATE_CHECK,
  UPDATE_CHECK,
  MOVE_CARD,
  MOVE_LIST
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
  const dataKeys = ["name"];

  dataKeys.forEach(key => {
    if (data[key] === undefined) return;

    validData[key] = data[key];
  });

  return {
    type: UPDATE_LIST,
    payload: { id, data: validData }
  };
};

export const moveList = (id, data) => {
  const validData = {};
  const dataKeys = ["index"];

  dataKeys.forEach(key => {
    if (data[key] === undefined) return;

    validData[key] = data[key];
  });

  return {
    type: MOVE_LIST,
    payload: { id, data: validData }
  };
};

export const deleteList = id => ({
  type: DELETE_LIST,
  payload: id
});

export const createCard = ({ listId, name }) => {
  const id = uuid();
  const slug = name.toLowerCase().replace(" ", "-") + `-${id}`;
  const timestamp = Date.now();
  const description = "";

  return {
    type: CREATE_CARD,
    payload: {
      id,
      listId,
      slug,
      name,
      description,
      timestamp
    }
  };
};

export const updateCard = (id, data) => {
  const validData = {};
  const dataKeys = ["name", "description"];

  dataKeys.forEach(key => {
    if (data[key] === undefined) return;

    validData[key] = data[key];
  });

  return {
    type: UPDATE_CARD,
    payload: { id, data: validData }
  };
};

export const moveCard = (id, data) => {
  const validData = {};
  const dataKeys = ["listId", "index"];

  dataKeys.forEach(key => {
    if (data[key] === undefined) return;

    validData[key] = data[key];
  });

  return {
    type: MOVE_CARD,
    payload: { id, data: validData }
  };
};

export const deleteCard = id => ({
  type: DELETE_CARD,
  payload: id
});

export const createCheck = ({ cardId, label }) => {
  const id = uuid();
  const timestamp = Date.now();
  const isChecked = false;

  return {
    type: CREATE_CHECK,
    payload: {
      id,
      cardId,
      label,
      isChecked,
      timestamp
    }
  };
};

export const updateCheck = (id, data) => {
  const validData = {};
  const dataKeys = ["label", "isChecked", "index"];

  dataKeys.forEach(key => {
    if (data[key] === undefined) return;

    validData[key] = data[key];
  });

  return {
    type: UPDATE_CHECK,
    payload: { id, data: validData }
  };
};

export const deleteCheck = id => ({
  type: DELETE_CHECK,
  payload: id
});
