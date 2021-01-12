import uuid from "uuid/v4";

import {
  CREATE_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  DELETE_GROUPS,
  CREATE_CARD,
  UPDATE_CARD,
  DELETE_CARD,
  DELETE_CARDS,
  DELETE_CHECK,
  CREATE_CHECK,
  UPDATE_CHECK,
  MOVE_CARD,
  MOVE_GROUP,
  MOVE_CHECK,
} from "./actions";

/**
 * Create action for create board.
 *
 * @param {Object} data Data
 * @param {String} data.name Board name
 * @return {Object} Action
 */
export const createBoard = ({ name }) => {
  const id = uuid();
  const slug = name.toLowerCase().replace(" ", "-") + `-${id}`;
  const timestamp = Date.now();

  return {
    type: CREATE_BOARD,
    payload: {
      id,
      slug,
      name,
      timestamp,
    },
  };
};

/**
 * Create action for update board.
 *
 * @param {String} id Board ID
 * @param {Object} data Data
 * @param {String} data.name New board name
 * @return {Object} Action
 */
export const updateBoard = (id, { name }) => ({
  type: UPDATE_BOARD,
  payload: {
    id,
    data: {
      name,
    },
  },
});

/**
 * Create action for delete board.
 *
 * @param {String} id Board ID
 * @return {Object} Action
 */
export const deleteBoard = (id) => ({
  type: DELETE_BOARD,
  payload: id,
});

/**
 * Create action for create group.
 *
 * @param {Object} data Data
 * @param {String} data.boardId Board ID
 * @param {String} data.name Group name
 * @return {Object} Action
 */
export const createGroup = ({ boardId, name }) => {
  const id = uuid();
  const timestamp = Date.now();

  return {
    type: CREATE_GROUP,
    payload: {
      id,
      boardId,
      name,
      timestamp,
    },
  };
};

/**
 * Create action for update group.
 *
 * @param {String} id Group ID
 * @param {Object} data Data
 * @param {String} data.name New group name
 * @return {Object} Action
 */
export const updateGroup = (id, { name }) => ({
  type: UPDATE_GROUP,
  payload: {
    id,
    data: {
      name,
    },
  },
});

/**
 * Create action for move group.
 *
 * @param {String} id Group ID
 * @param {Object} data Data
 * @param {String} data.index New group index
 * @return {Object} Action
 */
export const moveGroup = (id, { index }) => ({
  type: MOVE_GROUP,
  payload: {
    id,
    data: {
      index,
    },
  },
});

/**
 * Create action for delete group.
 *
 * @param {String} id Group ID
 * @return {Object} Action
 */
export const deleteGroup = (id) => ({
  type: DELETE_GROUP,
  payload: id,
});

/**
 * Create action for delete groups.
 *
 * @param {String[]} ids Group IDs
 * @return {Object} Action
 */
export const deleteGroups = (ids) => ({
  type: DELETE_GROUPS,
  payload: ids,
});

/**
 * Create action for create card.
 *
 * @param {Object} data Data
 * @param {String} data.groupId Group ID
 * @param {String} data.name Card name
 * @return {Object} Action
 */
export const createCard = ({ groupId, name }) => {
  const id = uuid();
  const slug = name.toLowerCase().replace(" ", "-") + `-${id}`;
  const timestamp = Date.now();
  const description = "";

  return {
    type: CREATE_CARD,
    payload: {
      id,
      groupId,
      slug,
      name,
      description,
      timestamp,
    },
  };
};

/**
 * Create action for update card.
 *
 * @param {String} id Card ID
 * @param {Object} data Data
 * @param {String} data.name New card name
 * @param {String} data.description New card description
 * @return {Object} Action
 */
export const updateCard = (id, { name, description }) => ({
  type: UPDATE_CARD,
  payload: {
    id,
    data: {
      name,
      description,
    },
  },
});

/**
 * Create action for move card.
 *
 * @param {String} id Card ID
 * @param {Object} data Data
 * @param {String} data.groupId New group ID
 * @param {String} data.index New card index
 * @return {Object} Action
 */
export const moveCard = (id, { groupId, index }) => ({
  type: MOVE_CARD,
  payload: {
    id,
    data: {
      groupId,
      index,
    },
  },
});

/**
 * Create action for delete card.
 *
 * @param {String} id Card ID
 * @return {Object} Action
 */
export const deleteCard = (id) => ({
  type: DELETE_CARD,
  payload: id,
});

/**
 * Create action for delete cards.
 *
 * @param {String[]} ids Card IDs
 * @return {Object} Action
 */
export const deleteCards = (ids) => ({
  type: DELETE_CARDS,
  payload: ids,
});

/**
 * Create action for create check.
 *
 * @param {Object} data Data
 * @param {String} data.cardId Card ID
 * @param {String} data.label Check label
 * @return {Object} Action
 */
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
      timestamp,
    },
  };
};

/**
 * Create action for update check.
 *
 * @param {String} id Check ID
 * @param {Object} data Data
 * @param {String} data.label New check label
 * @param {String} data.isChecked Is this checked or not ?
 * @return {Object} Action
 */
export const updateCheck = (id, { label, isChecked }) => ({
  type: UPDATE_CHECK,
  payload: {
    id,
    data: {
      label,
      isChecked,
    },
  },
});

/**
 * Create action for move check.
 *
 * @param {String} id Check ID
 * @param {Object} data Data
 * @param {String} data.index New check index
 * @return {Object} Action
 */
export const moveCheck = (id, { index }) => ({
  type: MOVE_CHECK,
  payload: {
    id,
    data: {
      index,
    },
  },
});

/**
 * Create action for delete check.
 *
 * @param {String} id Check ID
 * @return {Object} Action
 */
export const deleteCheck = (id) => ({
  type: DELETE_CHECK,
  payload: id,
});
