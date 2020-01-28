import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";

import List from "../components/List";
import Card from "../components/Card";
import Button from "../components/Button";
import CreateList from "../components/CreateList";
import {
  createList,
  deleteList,
  createCard,
  updateList,
  updateBoard,
  deleteBoard
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

const ListWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const Header = styled.header`
  display: flex;
  margin-bottom: 24px;
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
            listId: (_, event) => event.listId
          })
        },
        UPDATE_LIST_NAME: {
          target: "updateListName",
          actions: assign({
            listId: (_, event) => event.listId
          })
        }
      }
    },
    createList: {
      on: {
        IDLE: "idle",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            listId: (_, event) => event.listId
          })
        },
        UPDATE_LIST_NAME: {
          target: "updateListName",
          actions: assign({
            listId: (_, event) => event.listId
          })
        }
      }
    },
    createCard: {
      on: {
        IDLE: "idle",
        CREATE_LIST: "createList",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            listId: (_, event) => event.listId
          })
        },
        UPDATE_LIST_NAME: {
          target: "updateListName",
          actions: assign({
            listId: (_, event) => event.listId
          })
        }
      }
    },
    updateListName: {
      on: {
        IDLE: "idle",
        CREATE_LIST: "createList",
        UPDATE_BOARD_NAME: "updateBoardName",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            listId: (_, event) => event.listId
          })
        },
        UPDATE_LIST_NAME: {
          target: "updateListName",
          actions: assign({
            listId: (_, event) => event.listId
          })
        }
      }
    },
    updateBoardName: {
      on: {
        IDLE: "idle",
        CREATE_LIST: "createList",
        CREATE_CARD: {
          target: "createCard",
          actions: assign({
            listId: (_, event) => event.listId
          })
        },
        UPDATE_LIST_NAME: {
          target: "updateListName",
          actions: assign({
            listId: (_, event) => event.listId
          })
        }
      }
    }
  }
});

const BoardDetail = () => {
  const boards = useSelector(state => state.boards);
  const lists = useSelector(state => state.lists);
  const cards = useSelector(state => state.cards);
  const checks = useSelector(state => state.checks);
  const dispatch = useDispatch();
  const history = useHistory();
  const { boardSlug } = useParams();
  const [current, send] = useMachine(machine);

  const board = boards.find(board => board.slug === boardSlug);

  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    setNewBoardName(board ? board.name : "");
  }, [board]);

  if (!board) return null;

  return (
    <Container onClick={() => send("IDLE")}>
      <Helmet>
        <title>Hadouken | {board.name}</title>
      </Helmet>
      <Wrapper>
        {current.matches("updateBoardName") ? (
          <Input
            type="text"
            value={newBoardName}
            onClick={event => event.stopPropagation()}
            onChange={event => setNewBoardName(event.target.value)}
            onBlur={() => dispatch(updateBoard(board.id, newBoardName))}
          />
        ) : (
          <Header>
            <Title
              onClick={event => {
                event.stopPropagation();
                send("UPDATE_BOARD_NAME");
              }}
            >
              {board.name}
            </Title>
            <Button
              label="Delete"
              color="#34495e"
              onClick={event => {
                event.stopPropagation();
                history.goBack();
                setTimeout(() => dispatch(deleteBoard(board.id)), 50);
              }}
            />
          </Header>
        )}
        <ListWrapper>
          {lists
            .filter(list => list.boardId === board.id)
            .map(list => (
              <List
                key={list.id}
                name={list.name}
                onNameUpdated={newListName => {
                  if (!newListName) return;

                  dispatch(updateList(list.id, { name: newListName }));
                }}
                onClickName={() =>
                  send("UPDATE_LIST_NAME", { listId: list.id })
                }
                onClickClose={() => {
                  dispatch(deleteList(list.id));
                }}
                onClickAdd={() => send("CREATE_CARD", { listId: list.id })}
                onClickApplyAdd={cardName => {
                  if (!cardName) return;

                  const action = createCard({
                    listId: list.id,
                    name: cardName
                  });

                  dispatch(action);
                  send("IDLE");
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
                {cards
                  .filter(card => card.listId === list.id)
                  .map(card => {
                    const currentChecks = checks.filter(
                      check => check.cardId === card.id
                    );

                    const totalChecked = currentChecks.filter(
                      check => !!check.isChecked
                    ).length;

                    return (
                      <Card
                        key={card.id}
                        name={card.name}
                        to={`${board.slug}/${card.slug}`}
                        totalChecked={totalChecked}
                        maxChecklist={currentChecks.length}
                        hasDescription={card.description}
                        hasChecklist={!!currentChecks.length}
                      />
                    );
                  })}
              </List>
            ))}
          <CreateList
            onClickAdd={() => send("CREATE_LIST")}
            onClickApplyAdd={listName => {
              if (!listName) return;

              const action = createList({
                boardId: board.id,
                name: listName
              });

              dispatch(action);
              send("IDLE");
            }}
            onClickCancelAdd={() => send("IDLE")}
            isWillAdd={current.matches("createList")}
          />
        </ListWrapper>
      </Wrapper>
    </Container>
  );
};

export default BoardDetail;
