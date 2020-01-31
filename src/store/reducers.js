import arrayMove from "array-move";

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
  CREATE_CHECK,
  UPDATE_CHECK,
  DELETE_CHECK,
  MOVE_CARD
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

export const cards = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_CARD:
      payload.index = state.filter(
        item => item.listId === payload.listId
      ).length;

      return [...state, payload];

    case UPDATE_CARD:
      return state.map(item => {
        if (item.id === payload.id) {
          return { ...item, ...payload.data };
        }

        return item;
      });

    case MOVE_CARD:
      return (() => {
        const withIndex = (card, index) => ({
          ...card,
          index
        });

        const { listId: newListId, index: newIndex } = payload.data;
        const isMoveToOtherList = newListId !== undefined;

        if (isMoveToOtherList) {
          const byListId = listId => item => item.listId === listId;

          const card = state.find(item => item.id === payload.id);
          const oldListId = card.listId;
          const sourceCards = state.filter(byListId(oldListId));
          const destinationCards = state.filter(byListId(newListId));

          const newSourceCards = sourceCards
            .filter(item => item.id !== card.id)
            .map(withIndex);

          const newDestinationCards = [
            ...destinationCards.slice(0, newIndex),
            { ...card, listId: newListId },
            ...destinationCards.slice(newIndex)
          ].map(withIndex);

          const result = state
            .filter(
              item => item.listId !== oldListId && item.listId !== newListId
            )
            .concat([...newSourceCards, ...newDestinationCards]);

          return result;
        } else {
          const card = state.find(item => item.id === payload.id);
          const cards = state.filter(item => item.listId === card.listId);
          const oldIndex = card.index;
          const movedCards = arrayMove(cards, oldIndex, newIndex);
          const sortedCards = movedCards.map(withIndex);

          const result = state
            .filter(item => item.listId !== card.listId)
            .concat(sortedCards);

          return result;
        }
      })();

    case DELETE_CARD:
      return (() => {
        const afterDeletedCards = state.filter(item => item.id !== payload);
        const card = state.find(item => item.id === payload);

        const sortedCards = afterDeletedCards
          .filter(item => item.listId === card.listId)
          .map((item, index) => ({ ...item, index }))
          .sort((a, b) => a.index - b.index);

        const result = afterDeletedCards
          .filter(item => item.listId !== card.listId)
          .concat(sortedCards);

        return result;
      })();

    default:
      return state;
  }
};

export const checks = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_CHECK:
      payload.index = state.filter(
        item => item.cardId === payload.cardId
      ).length;

      return [...state, payload];

    case UPDATE_CHECK:
      return state.map(item => {
        if (item.id === payload.id) {
          return { ...item, ...payload.data };
        }

        return item;
      });

    case DELETE_CHECK:
      return state.filter(item => item.id !== payload);

    default:
      return state;
  }
};
