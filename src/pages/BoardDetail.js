import React, { useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";

import List from "../components/List";
import Card from "../components/Card";
import CreateList from "../components/CreateList";
import {
  createList,
  deleteList,
  createCard,
  updateList
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
  color: white;
`;

const ListWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const machine = Machine({
  id: "machine",
  initial: "idle",
  states: {
    idle: {
      on: {
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
    },
    createList: {
      on: {
        IDLE: "idle",
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
  const dispatch = useDispatch();
  const { boardSlug } = useParams();
  const [current, send] = useMachine(machine);

  const board = boards.find(board => board.slug === boardSlug);

  if (!board) return null;

  return (
    <Container onClick={() => send("IDLE")}>
      <Helmet>
        <title>Hadouken | {board.name}</title>
      </Helmet>
      <Wrapper>
        <Title>{board.name}</Title>
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
                  .map(card => (
                    <Card
                      key={card.id}
                      name={card.name}
                      to={`${board.slug}/${card.slug}`}
                      hasDescription={card.description}
                    />
                  ))}
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
