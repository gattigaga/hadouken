import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Machine, assign } from "xstate";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useMachine } from "@xstate/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  deleteCard,
  moveCard,
  deleteCheck,
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

const Title = styled.h1`
  font-family: "Roboto";
  font-size: 32px;
  letter-spacing: -1px;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-right: 24px;
  color: white;
`;

const Input = styled.input`
  width: 320px;
  height: 42px;
  font-family: "Roboto";
  font-size: 24px;
  outline: none;
  padding: 0px 8px;
  margin-right: 24px;
  margin-bottom: 24px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 0px;
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

const Icon = styled(FontAwesomeIcon)`
  font-size: 32px;
  margin-right: 32px;
  cursor: pointer;
  color: ${chroma("#3498db").brighten(0.5).hex()};
`;

const machine = Machine({
  id: "machine",
  initial: "idle",
  states: {
    idle: {
      on: {
        CREATE_GROUP: "createGroup",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            groupId: (_, event) => event.groupId,
          }),
        },
        UPDATE_GROUP_NAME: {
          target: "updateGroupName",
          actions: assign({
            groupId: (_, event) => event.groupId,
          }),
        },
      },
    },
    createGroup: {
      on: {
        IDLE: "idle",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            groupId: (_, event) => event.groupId,
          }),
        },
        UPDATE_GROUP_NAME: {
          target: "updateGroupName",
          actions: assign({
            groupId: (_, event) => event.groupId,
          }),
        },
      },
    },
    createCard: {
      on: {
        IDLE: "idle",
        CREATE_GROUP: "createGroup",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            groupId: (_, event) => event.groupId,
          }),
        },
        UPDATE_GROUP_NAME: {
          target: "updateGroupName",
          actions: assign({
            groupId: (_, event) => event.groupId,
          }),
        },
      },
    },
    updateGroupName: {
      on: {
        IDLE: "idle",
        CREATE_GROUP: "createGroup",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            groupId: (_, event) => event.groupId,
          }),
        },
        UPDATE_GROUP_NAME: {
          target: "updateGroupName",
          actions: assign({
            groupId: (_, event) => event.groupId,
          }),
        },
      },
    },
    updateBoardName: {
      on: {
        IDLE: "idle",
        CREATE_GROUP: "createGroup",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            groupId: (_, event) => event.groupId,
          }),
        },
        UPDATE_GROUP_NAME: {
          target: "updateGroupName",
          actions: assign({
            groupId: (_, event) => event.groupId,
          }),
        },
      },
    },
  },
});

const BoardDetail = () => {
  const [current, send] = useMachine(machine);
  const [newBoardName, setNewBoardName] = useState("");
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
      groups.forEach((group) => {
        const currentCards = cards
          .filter((card) => card.groupId === group.id)
          .sort((a, b) => a.index - b.index);

        currentCards.forEach((card) => {
          const currentChecks = checks.filter(
            (check) => check.cardId === card.id
          );

          currentChecks.forEach((check) => {
            dispatch(deleteCheck(check.id));
          });

          dispatch(deleteCard(card.id));
        });

        dispatch(deleteGroup(group.id));
      });

      dispatch(deleteBoard(board.id));
    }, 50);
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

  useEffect(() => {
    setNewBoardName(board ? board.name : "");
  }, [board]);

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
          title={newBoardName}
          isEdit={current.matches("updateBoardName")}
          onChangeTitle={(event) => setNewBoardName(event.target.value)}
          onApplyTitle={() => {
            dispatch(
              updateBoard(board.id, {
                name: newBoardName,
              })
            );

            send("IDLE");
          }}
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
                      onNameUpdated={(newGroupName) => {
                        if (!newGroupName) return;

                        dispatch(updateGroup(group.id, { name: newGroupName }));
                        send("IDLE");
                      }}
                      onClickName={() =>
                        send("UPDATE_GROUP_NAME", { groupId: group.id })
                      }
                      onClickClose={() => {
                        currentCards.forEach((card) => {
                          const currentChecks = checks.filter(
                            (check) => check.cardId === card.id
                          );

                          currentChecks.forEach((check) => {
                            dispatch(deleteCheck(check.id));
                          });

                          dispatch(deleteCard(card.id));
                        });

                        dispatch(deleteGroup(group.id));
                      }}
                      onClickAdd={() =>
                        send("CREATE_CARD", { groupId: group.id })
                      }
                      onClickApplyAdd={(cardName) => {
                        if (!cardName) return;

                        const action = createCard({
                          groupId: group.id,
                          name: cardName,
                        });

                        dispatch(action);
                      }}
                      onClickCancelAdd={() => send("IDLE")}
                      isWillAdd={
                        current.matches("createCard") &&
                        current.context.groupId === group.id
                      }
                      isWillUpdateName={
                        current.matches("updateGroupName") &&
                        current.context.groupId === group.id
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
                    onClickApplyAdd={(groupName) => {
                      if (!groupName) return;

                      const action = createGroup({
                        boardId: board.id,
                        name: groupName,
                      });

                      dispatch(action);
                      send("IDLE");
                    }}
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
