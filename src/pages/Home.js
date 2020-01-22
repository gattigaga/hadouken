import React, { useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";

import Board from "../components/Board";
import CreateBoard from "../components/CreateBoard";
import ModalCreateBoard from "../components/ModalCreateBoard";
import { createBoard } from "../store/actionCreators";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  width: 800px;
  margin: auto;
  padding-top: 48px;
`;

const Title = styled.h1`
  font-family: "Roboto";
  font-size: 64px;
  letter-spacing: -4px;
  margin-top: 0px;
  color: #333;
`;

const BoardList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 180px);
  grid-gap: 26px;
`;

const Home = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const boards = useSelector(state => state.boards);
  const dispatch = useDispatch();

  return (
    <Container>
      <Helmet>
        <title>Hadouken</title>
      </Helmet>
      <Wrapper>
        <Title>Hadouken</Title>
        <BoardList>
          {boards.map(board => (
            <Board key={board.id} name={board.name} to={board.slug} />
          ))}
          <CreateBoard onClick={() => setIsCreateOpen(true)} />
        </BoardList>
      </Wrapper>
      <ModalCreateBoard
        onClickClose={() => setIsCreateOpen(false)}
        onClickCreate={boardName => {
          dispatch(createBoard(boardName));
          setIsCreateOpen(false);
        }}
        isOpen={isCreateOpen}
      />
    </Container>
  );
};

export default Home;
