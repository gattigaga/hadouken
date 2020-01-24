import React, { useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";

import List from "../components/List";
import Card from "../components/Card";
import CreateList from "../components/CreateList";
import { createList, deleteList, createCard, updateList } from "../store/actionCreators";

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

const BoardDetail = () => {
  const boards = useSelector(state => state.boards);
  const lists = useSelector(state => state.lists);
  const cards = useSelector(state => state.cards);
  const dispatch = useDispatch();
  const { boardSlug } = useParams();
  const [willAdd, setWillAdd] = useState(null);
  const [activeListId, setActiveListId] = useState(null);

  const board = boards.find(board => board.slug === boardSlug);

  if (!board) return null;

  return (
    <Container>
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
                onClickClose={() => {
                  dispatch(deleteList(list.id));
                }}
                onClickAdd={() => {
                  setWillAdd("card");
                  setActiveListId(list.id);
                }}
                onClickApplyAdd={cardName => {
                  dispatch(createCard({ listId: list.id, name: cardName }));
                  setWillAdd(null);
                  setActiveListId(null);
                }}
                onClickCancelAdd={() => {
                  setWillAdd(null);
                  setActiveListId(null);
                }}
                isWillAdd={willAdd === "card" && activeListId === list.id}
              >
                {cards
                  .filter(card => card.listId === list.id)
                  .map(card => (
                    <Card key={card.id} name={card.name} />
                  ))}
              </List>
            ))}
          <CreateList
            onClickAdd={() => setWillAdd("list")}
            onClickApplyAdd={listName => {
              dispatch(createList({ boardId: board.id, name: listName }));
              setWillAdd(null);
            }}
            onClickCancelAdd={() => setWillAdd(null)}
            isWillAdd={willAdd === "list"}
          />
        </ListWrapper>
      </Wrapper>
    </Container>
  );
};

export default BoardDetail;
