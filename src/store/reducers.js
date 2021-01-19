import arrayMove from "array-move";

import {
  CREATE_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  CREATE_CARD,
  UPDATE_CARD,
  DELETE_CARD,
  CREATE_CHECK,
  UPDATE_CHECK,
  DELETE_CHECK,
  MOVE_CARD,
  MOVE_GROUP,
  MOVE_CHECK,
  DELETE_GROUPS,
  DELETE_CARDS,
  DELETE_CHECKS,
} from "./actions";

export const boards = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_BOARD:
      return [...state, payload];

    case UPDATE_BOARD:
      return state.map((item) => {
        if (item.id === payload.id) {
          return { ...item, ...payload.data };
        }

        return item;
      });

    case DELETE_BOARD:
      return state.filter((item) => item.id !== payload);

    default:
      return state;
  }
};

export const groups = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_GROUP:
      const index = state.filter((item) => item.boardId === payload.boardId)
        .length;

      return [
        ...state,
        {
          ...payload,
          index,
        },
      ];

    case UPDATE_GROUP:
      return state.map((item) => {
        if (item.id === payload.id) {
          return { ...item, ...payload.data };
        }

        return item;
      });

    case MOVE_GROUP:
      return (() => {
        const group = state.find((item) => item.id === payload.id);
        const newIndex = payload.data.index;
        const oldIndex = group.index;

        // Get current board's groups
        const groups = state.filter((item) => item.boardId === group.boardId);

        // Move the group from the group list and
        // assign new index for the groups
        const sortedGroups = arrayMove(groups, oldIndex, newIndex).map(
          (group, index) => ({
            ...group,
            index,
          })
        );

        const result = state
          .filter((item) => item.boardId !== group.boardId)
          .concat(sortedGroups);

        return result;
      })();

    case DELETE_GROUP:
      return (() => {
        const afterDeletedGroups = state.filter((item) => item.id !== payload);
        const group = state.find((item) => item.id === payload);

        // Get current board's groups
        // assign new index for the groups
        // and sort it
        const sortedGroups = afterDeletedGroups
          .filter((item) => item.boardId === group.boardId)
          .map((item, index) => ({ ...item, index }))
          .sort((a, b) => a.index - b.index);

        const result = afterDeletedGroups
          .filter((item) => item.boardId !== group.boardId)
          .concat(sortedGroups);

        return result;
      })();

    case DELETE_GROUPS:
      return (() => {
        const afterDeletedGroups = state.filter(
          (item) => !payload.includes(item.id)
        );

        const boardIds = state
          .filter((item) => payload.includes(item.id))
          .map((item) => item.boardId);

        // Get current board's groups
        // assign new index for the groups
        // and sort it
        const sortedGroups = afterDeletedGroups
          .filter((item) => boardIds.includes(item.boardId))
          .map((item, index) => ({ ...item, index }))
          .sort((a, b) => a.index - b.index);

        const result = afterDeletedGroups
          .filter((item) => !boardIds.includes(item.boardId))
          .concat(sortedGroups);

        return result;
      })();

    default:
      return state;
  }
};

export const cards = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_CARD:
      const index = state.filter((item) => item.groupId === payload.groupId)
        .length;

      return [
        ...state,
        {
          ...payload,
          index,
        },
      ];

    case UPDATE_CARD:
      return state.map((item) => {
        if (item.id === payload.id) {
          return { ...item, ...payload.data };
        }

        return item;
      });

    case MOVE_CARD:
      return (() => {
        const withIndex = (card, index) => ({
          ...card,
          index,
        });

        const { groupId: newGroupId, index: newIndex } = payload.data;
        const isMoveToOtherGroup = newGroupId !== undefined;
        const card = state.find((item) => item.id === payload.id);

        if (isMoveToOtherGroup) {
          const byGroupId = (groupId) => (item) => item.groupId === groupId;

          const oldGroupId = card.groupId;
          // Get cards from the source group
          const sourceCards = state.filter(byGroupId(oldGroupId));
          // Get cards from the destination group
          const destinationCards = state.filter(byGroupId(newGroupId));

          // Remove moved card from the source group and
          // assign new index for the cards
          const newSourceCards = sourceCards
            .filter((item) => item.id !== card.id)
            .map(withIndex);

          // Insert moved card to the destination group and
          // assign new index for the cards
          const newDestinationCards = [
            ...destinationCards.slice(0, newIndex),
            { ...card, groupId: newGroupId },
            ...destinationCards.slice(newIndex),
          ].map(withIndex);

          const result = state
            .filter((item) => {
              return item.groupId !== oldGroupId && item.groupId !== newGroupId;
            })
            .concat([...newSourceCards, ...newDestinationCards]);

          return result;
        } else {
          // Get current group's cards
          const cards = state.filter((item) => item.groupId === card.groupId);
          const oldIndex = card.index;

          // Move the card from the card list and
          // assign new index for the cards
          const sortedCards = arrayMove(cards, oldIndex, newIndex).map(
            withIndex
          );

          const result = state
            .filter((item) => item.groupId !== card.groupId)
            .concat(sortedCards);

          return result;
        }
      })();

    case DELETE_CARD:
      return (() => {
        const afterDeletedCards = state.filter((item) => item.id !== payload);
        const card = state.find((item) => item.id === payload);

        // Get current group's cards
        // assign new index for the cards
        // and sort it
        const sortedCards = afterDeletedCards
          .filter((item) => item.groupId === card.groupId)
          .map((item, index) => ({ ...item, index }))
          .sort((a, b) => a.index - b.index);

        const result = afterDeletedCards
          .filter((item) => item.groupId !== card.groupId)
          .concat(sortedCards);

        return result;
      })();

    case DELETE_CARDS:
      return (() => {
        const afterDeletedCards = state.filter(
          (item) => !payload.includes(item.id)
        );

        const cards = state.filter((item) => payload.includes(item.id));

        // Get current group's cards
        // assign new index for the cards
        // and sort it
        const sortedCards = afterDeletedCards
          .filter((item) => cards.includes(item.groupId))
          .map((item, index) => ({ ...item, index }))
          .sort((a, b) => a.index - b.index);

        const result = afterDeletedCards
          .filter((item) => !cards.includes(item.groupId))
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
      const index = state.filter((item) => item.cardId === payload.cardId)
        .length;

      return [
        ...state,
        {
          ...payload,
          index,
        },
      ];

    case UPDATE_CHECK:
      return state.map((item) => {
        if (item.id === payload.id) {
          return { ...item, ...payload.data };
        }

        return item;
      });

    case MOVE_CHECK:
      return (() => {
        const check = state.find((item) => item.id === payload.id);
        const newIndex = payload.data.index;
        const oldIndex = check.index;

        // Get current card's checks
        const checks = state.filter((item) => item.cardId === check.cardId);

        // Move the check from the check list and
        // assign new index for the checks
        const sortedChecks = arrayMove(checks, oldIndex, newIndex).map(
          (check, index) => ({
            ...check,
            index,
          })
        );

        const result = state
          .filter((item) => item.cardId !== check.cardId)
          .concat(sortedChecks);

        return result;
      })();

    case DELETE_CHECK:
      return (() => {
        const afterDeletedChecks = state.filter((item) => item.id !== payload);
        const check = state.find((item) => item.id === payload);

        // Get current card's checks
        // assign new index for the checks
        // and sort it
        const sortedChecks = afterDeletedChecks
          .filter((item) => item.cardId === check.cardId)
          .map((item, index) => ({ ...item, index }))
          .sort((a, b) => a.index - b.index);

        const result = afterDeletedChecks
          .filter((item) => item.cardId !== check.cardId)
          .concat(sortedChecks);

        return result;
      })();

    case DELETE_CHECKS:
      return (() => {
        const afterDeletedChecks = state.filter(
          (item) => !payload.includes(item.id)
        );

        const checks = state.filter((item) => payload.includes(item.id));

        // Get current card's checks
        // assign new index for the checks
        // and sort it
        const sortedChecks = afterDeletedChecks
          .filter((item) => checks.includes(item.cardId))
          .map((item, index) => ({ ...item, index }))
          .sort((a, b) => a.index - b.index);

        const result = afterDeletedChecks
          .filter((item) => !checks.includes(item.cardId))
          .concat(sortedChecks);

        return result;
      })();

    default:
      return state;
  }
};
