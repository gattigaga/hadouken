import {
  CREATE_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  CREATE_LIST,
  UPDATE_LIST,
  DELETE_LIST
} from "./actions";

export const boards = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_BOARD:
      return [...state, payload];

    case UPDATE_BOARD:
      return state.map(item => {
        if (item.id === payload.id) {
          return { ...item, name: payload.name };
        }

        return item;
      });

    case DELETE_BOARD:
      return state.filter(item => item.id !== payload);

    default:
      return state;
  }
};

export const lists = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_LIST:
      payload.index = state.filter(
        item => item.boardId === payload.boardId
      ).length;

      return [...state, payload];

    case UPDATE_LIST:
      return state.map(item => {
        if (item.id === payload.id) {
          return { ...item, ...payload.data };
        }

        return item;
      });

    case DELETE_LIST:
      return state.filter(item => item.id !== payload);

    default:
      return state;
  }
};
