import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Machine } from "xstate";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useMachine } from "@xstate/react";
import chroma from "chroma-js";

import Header from "../components/board-detail/Header";
import Group from "../components/board-detail/Group";
import Card from "../components/board-detail/Card";
import CreateGroupButton from "../components/board-detail/CreateGroupButton";
import CreateGroupForm from "../components/board-detail/CreateGroupForm";
import {
  updateBoard,
  deleteBoard,
  createGroup,
  updateGroup,
  deleteGroup,
  moveGroup,
  createCard,
  moveCard,
  deleteCards,
  deleteChecks,
  deleteGroups,
} from "../store/actionCreators";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background: #3498db;
`;

const Wrapper = styled.div`
  width: calc(100vw - 64px);
  margin: auto;
  padding-top: 48px;
`;

const GroupWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-x: auto;
  height: 80vh;

  &::-webkit-scrollbar {
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 8px;
    background: ${chroma("#3498db").darken(0.3).hex()};
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: ${chroma("#3498db").brighten(0.5).hex()};
  }
`;

const machine = Machine({
  id: "boardDetail",
  initial: "idle",
  states: {
    idle: {
      on: {
        CREATE_GROUP: "createGroup",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: "createCard",
        UPDATE_GROUP_NAME: "updateGroupName",
      },
    },
    createGroup: {
      on: {
        IDLE: "idle",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: "createCard",
        UPDATE_GROUP_NAME: "updateGroupName",
      },
    },
    createCard: {
      on: {
        IDLE: "idle",
        CREATE_GROUP: "createGroup",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: "createCard",
        UPDATE_GROUP_NAME: "updateGroupName",
      },
    },
    updateGroupName: {
      on: {
        IDLE: "idle",
        CREATE_GROUP: "createGroup",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: "createCard",
        UPDATE_GROUP_NAME: "updateGroupName",
      },
    },
    updateBoardName: {
      on: {
        IDLE: "idle",
        CREATE_GROUP: "createGroup",
        CREATE_CARD: "createCard",
        UPDATE_GROUP_NAME: "updateGroupName",
      },
    },
  },
});

const BoardDetail = () => {
  const [current, send] = useMachine(machine);
  const [groupId, setGroupId] = useState(null);
  const { boardSlug } = useParams();

  // Get current board
  const board = useSelector((state) =>
    state.boards.find((board) => board.slug === boardSlug)
  );

  // Get current board's groups
  const groups = useSelector((state) =>
    state.groups
      .filter((group) => group.boardId === board.id)
      .sort((a, b) => a.index - b.index)
  );

  const cards = useSelector((state) => state.cards);
  const checks = useSelector((state) => state.checks);
  const dispatch = useDispatch();
  const history = useHistory();
  const refInputName = useRef(null);

  const isUpdateBoardName = current.matches("updateBoardName");

  const removeBoard = (event) => {
    event.stopPropagation();
    history.goBack();

    setTimeout(() => {
      const groupIds = groups.map((group) => group.id);

      const cardIds = cards
        .filter((card) => groupIds.includes(card.groupId))
        .map((card) => card.id);

      const checkIds = checks
        .filter((check) => cardIds.includes(check.cardId))
        .map((check) => check.id);

      dispatch(deleteBoard(board.id));
      dispatch(deleteGroups(groupIds));
      dispatch(deleteCards(cardIds));
      dispatch(deleteChecks(checkIds));
    }, 50);
  };

  const removeGroup = (group) => {
    const cardIds = cards
      .filter((card) => card.groupId === group.id)
      .map((card) => card.id);

    const checkIds = checks
      .filter((check) => cardIds.includes(check.cardId))
      .map((check) => check.id);

    dispatch(deleteGroup(group.id));
    dispatch(deleteCards(cardIds));
    dispatch(deleteChecks(checkIds));
  };

  const reorderGroup = (result) => {
    const { type, source, destination, draggableId } = result;

    if (!destination) return;

    const isSameGroup = destination.droppableId === source.droppableId;
    const isSameIndex = destination.index === source.index;

    if (isSameGroup && isSameIndex) return;

    if (type === "GROUP") {
      dispatch(
        moveGroup(draggableId, {
          index: destination.index,
        })
      );
    } else {
      dispatch(
        moveCard(draggableId, {
          groupId: isSameGroup ? undefined : destination.droppableId,
          index: destination.index,
        })
      );
    }
  };

  const updateBoardName = (name) => {
    dispatch(updateBoard(board.id, { name }));
    send("IDLE");
  };

  const updateGroupName = (group, name) => {
    if (!name) return;

    dispatch(updateGroup(group.id, { name }));
    send("IDLE");
  };

  const addNewCard = (group, name) => {
    if (!name) return;

    dispatch(
      createCard({
        groupId: group.id,
        name,
      })
    );
  };

  const addNewGroup = (name) => {
    if (!name) return;

    dispatch(
      createGroup({
        boardId: board.id,
        name,
      })
    );

    send("IDLE");
  };

  useEffect(() => {
    if (isUpdateBoardName) {
      refInputName.current.select();
    }
  }, [isUpdateBoardName]);

  if (!board) return null;

  return (
    <Container onClick={() => send("IDLE")}>
      <Helmet>
        <title>Hadouken | {board.name}</title>
      </Helmet>
      <Wrapper>
        <Header
          refInput={refInputName}
          title={board.name}
          isEdit={current.matches("updateBoardName")}
          onApplyTitle={updateBoardName}
          onClickBack={(event) => {
            event.stopPropagation();
            history.goBack();
          }}
          onClickTitle={(event) => {
            event.stopPropagation();
            send("UPDATE_BOARD_NAME");
          }}
          onClickDelete={removeBoard}
        />
        <DragDropContext onDragEnd={reorderGroup}>
          <Droppable
            droppableId="droppable-root"
            direction="horizontal"
            type="GROUP"
          >
            {(provided) => (
              <GroupWrapper
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {groups.map((group) => {
                  const currentCards = cards
                    .filter((card) => card.groupId === group.id)
                    .sort((a, b) => a.index - b.index);

                  return (
                    <Group
                      key={group.id}
                      id={group.id}
                      index={group.index}
                      name={group.name}
                      onNameUpdated={(newName) => {
                        updateGroupName(group, newName);
                      }}
                      onClickName={() => {
                        send("UPDATE_GROUP_NAME");
                        setGroupId(group.id);
                      }}
                      onClickClose={() => removeGroup(group)}
                      onClickAdd={() => {
                        send("CREATE_CARD");
                        setGroupId(group.id);
                      }}
                      onClickApplyAdd={(cardName) => {
                        addNewCard(group, cardName);
                      }}
                      onClickCancelAdd={() => send("IDLE")}
                      isWillAdd={
                        current.matches("createCard") && groupId === group.id
                      }
                      isWillUpdateName={
                        current.matches("updateGroupName") &&
                        groupId === group.id
                      }
                    >
                      {currentCards.map((card) => {
                        const currentChecks = checks.filter(
                          (check) => check.cardId === card.id
                        );

                        const totalChecked = currentChecks.filter(
                          (check) => !!check.isChecked
                        ).length;

                        return (
                          <Card
                            key={card.id}
                            id={card.id}
                            index={card.index}
                            name={card.name}
                            to={`${board.slug}/${card.slug}`}
                            totalChecked={totalChecked}
                            maxChecklist={currentChecks.length}
                            hasDescription={card.description}
                            hasChecklist={!!currentChecks.length}
                          />
                        );
                      })}
                    </Group>
                  );
                })}
                {provided.placeholder}
                {current.matches("createGroup") ? (
                  <CreateGroupForm
                    onClickApplyAdd={addNewGroup}
                    onClickCancelAdd={() => send("IDLE")}
                  />
                ) : (
                  <CreateGroupButton onClick={() => send("CREATE_GROUP")} />
                )}
              </GroupWrapper>
            )}
          </Droppable>
        </DragDropContext>
      </Wrapper>
    </Container>
  );
};

export default BoardDetail;
