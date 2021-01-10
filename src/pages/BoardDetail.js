import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Machine, assign } from "xstate";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useMachine } from "@xstate/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import chroma from "chroma-js";

import Group from "../components/Group";
import Card from "../components/Card";
import Button from "../components/Button";
import CreateGroupButton from "../components/CreateGroupButton";
import CreateGroupForm from "../components/CreateGroupForm";
import {
  createList,
  deleteList,
  createCard,
  updateList,
  updateBoard,
  deleteBoard,
  moveCard,
  moveList,
  deleteCard,
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

const Header = styled.header`
  display: flex;
  margin-bottom: 24px;
  align-items: center;
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
        CREATE_LIST: "createList",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            listId: (_, event) => event.listId,
          }),
        },
        UPDATE_LIST_NAME: {
          target: "updateListName",
          actions: assign({
            listId: (_, event) => event.listId,
          }),
        },
      },
    },
    createList: {
      on: {
        IDLE: "idle",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            listId: (_, event) => event.listId,
          }),
        },
        UPDATE_LIST_NAME: {
          target: "updateListName",
          actions: assign({
            listId: (_, event) => event.listId,
          }),
        },
      },
    },
    createCard: {
      on: {
        IDLE: "idle",
        CREATE_LIST: "createList",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            listId: (_, event) => event.listId,
          }),
        },
        UPDATE_LIST_NAME: {
          target: "updateListName",
          actions: assign({
            listId: (_, event) => event.listId,
          }),
        },
      },
    },
    updateListName: {
      on: {
        IDLE: "idle",
        CREATE_LIST: "createList",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            listId: (_, event) => event.listId,
          }),
        },
        UPDATE_LIST_NAME: {
          target: "updateListName",
          actions: assign({
            listId: (_, event) => event.listId,
          }),
        },
      },
    },
    updateBoardName: {
      on: {
        IDLE: "idle",
        CREATE_LIST: "createList",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            listId: (_, event) => event.listId,
          }),
        },
        UPDATE_LIST_NAME: {
          target: "updateListName",
          actions: assign({
            listId: (_, event) => event.listId,
          }),
        },
      },
    },
  },
});

const BoardDetail = () => {
  const boards = useSelector((state) => state.boards);
  const lists = useSelector((state) => state.lists);
  const cards = useSelector((state) => state.cards);
  const checks = useSelector((state) => state.checks);
  const dispatch = useDispatch();
  const history = useHistory();
  const { boardSlug } = useParams();
  const [current, send] = useMachine(machine);
  const refInputName = useRef(null);

  const isUpdateBoardName = current.matches("updateBoardName");
  const board = boards.find((board) => board.slug === boardSlug);

  const currentLists = lists
    .filter((list) => list.boardId === board.id)
    .sort((a, b) => a.index - b.index);

  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    setNewBoardName(board ? board.name : "");
  }, [board]);

  useEffect(() => {
    if (isUpdateBoardName) {
      refInputName.current.select();
    }
  }, [isUpdateBoardName]);

  const reorder = (result) => {
    const { type, source, destination, draggableId } = result;

    if (!destination) return;

    const isSameList = destination.droppableId === source.droppableId;
    const isSameIndex = destination.index === source.index;

    if (isSameList && isSameIndex) return;

    if (type === "LIST") {
      dispatch(
        moveList(draggableId, {
          index: destination.index,
        })
      );
    } else {
      dispatch(
        moveCard(draggableId, {
          listId: isSameList ? undefined : destination.droppableId,
          index: destination.index,
        })
      );
    }
  };

  if (!board) return null;

  return (
    <Container onClick={() => send("IDLE")}>
      <Helmet>
        <title>Hadouken | {board.name}</title>
      </Helmet>
      <Wrapper>
        {current.matches("updateBoardName") ? (
          <Input
            ref={refInputName}
            type="text"
            value={newBoardName}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setNewBoardName(event.target.value)}
            onBlur={() => dispatch(updateBoard(board.id, newBoardName))}
            onKeyDown={(event) => {
              switch (event.keyCode) {
                case 13: // Enter is pressed
                case 27: // Escape is pressed
                  dispatch(updateBoard(board.id, newBoardName));
                  send("IDLE");
                  break;

                default:
                  break;
              }
            }}
          />
        ) : (
          <Header>
            <Icon
              icon={faChevronLeft}
              onClick={(event) => {
                event.stopPropagation();
                history.goBack();
              }}
            />
            <Title
              onClick={(event) => {
                event.stopPropagation();
                send("UPDATE_BOARD_NAME");
              }}
            >
              {board.name}
            </Title>
            <Button
              label="Delete"
              color="#5cb5fa"
              onClick={(event) => {
                event.stopPropagation();
                history.goBack();
                setTimeout(() => {
                  currentLists.forEach((list) => {
                    const currentCards = cards
                      .filter((card) => card.listId === list.id)
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

                    dispatch(deleteList(list.id));
                  });

                  dispatch(deleteBoard(board.id));
                }, 50);
              }}
            />
          </Header>
        )}
        <DragDropContext onDragEnd={reorder}>
          <Droppable
            droppableId="droppable-root"
            direction="horizontal"
            type="LIST"
          >
            {(provided) => (
              <GroupWrapper
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {currentLists.map((list) => {
                  const currentCards = cards
                    .filter((card) => card.listId === list.id)
                    .sort((a, b) => a.index - b.index);

                  return (
                    <Group
                      key={list.id}
                      id={list.id}
                      index={list.index}
                      name={list.name}
                      onNameUpdated={(newListName) => {
                        if (!newListName) return;

                        dispatch(updateList(list.id, { name: newListName }));
                        send("IDLE");
                      }}
                      onClickName={() =>
                        send("UPDATE_LIST_NAME", { listId: list.id })
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

                        dispatch(deleteList(list.id));
                      }}
                      onClickAdd={() =>
                        send("CREATE_CARD", { listId: list.id })
                      }
                      onClickApplyAdd={(cardName) => {
                        if (!cardName) return;

                        const action = createCard({
                          listId: list.id,
                          name: cardName,
                        });

                        dispatch(action);
                      }}
                      onClickCancelAdd={() => send("IDLE")}
                      isWillAdd={
                        current.matches("createCard") &&
                        current.context.listId === list.id
                      }
                      isWillUpdateName={
                        current.matches("updateListName") &&
                        current.context.listId === list.id
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
                {current.matches("createList") ? (
                  <CreateGroupForm
                    onClickApplyAdd={(listName) => {
                      if (!listName) return;

                      const action = createList({
                        boardId: board.id,
                        name: listName,
                      });

                      dispatch(action);
                      send("IDLE");
                    }}
                    onClickCancelAdd={() => send("IDLE")}
                  />
                ) : (
                  <CreateGroupButton onClick={() => send("CREATE_LIST")} />
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
