import { CREATE_BOARD, UPDATE_BOARD, DELETE_BOARD } from "./actions";

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
