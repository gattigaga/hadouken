import React, { useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";

import Board from "../components/home/Board";
import CreateBoardButton from "../components/home/CreateBoardButton";
import ModalCreateBoard from "../components/home/ModalCreateBoard";
import { createBoard } from "../store/actionCreators";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  width: calc(100% - 48px);
  margin: auto;
  padding-top: 48px;
  padding-bottom: 96px;

  @media screen and (min-width: 1024px) {
    width: 1024px;
  }
`;

const Title = styled.h1`
  font-family: "Roboto";
  font-size: 64px;
  letter-spacing: -3px;
  margin-top: 0px;
  margin-bottom: 0px;
  color: #333;
  text-align: center;
`;

const BoardList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 24px;

  @media screen and (min-width: 540px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 800px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CreatorName = styled.p`
  font-family: "Roboto";
  font-size: 14px;
  color: #aaa;
  margin-top: 0px;
  margin-bottom: 48px;
  text-align: center;
`;

const Home = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const boards = useSelector((state) => state.boards);
  const dispatch = useDispatch();

  const addNewBoard = (name) => {
    dispatch(createBoard({ name }));
    setIsCreateOpen(false);
  };

  return (
    <Container>
      <Helmet>
        <title>Hadouken</title>
      </Helmet>
      <Wrapper>
        <Title>Hadouken</Title>
        <CreatorName>Created by Gattigaga Hayyuta Dewa</CreatorName>
        <BoardList>
          {boards.map((board) => (
            <Board key={board.id} name={board.name} to={board.slug} />
          ))}
          <CreateBoardButton onClick={() => setIsCreateOpen(true)} />
        </BoardList>
      </Wrapper>
      <ModalCreateBoard
        onClickClose={() => setIsCreateOpen(false)}
        onClickCreate={addNewBoard}
        isOpen={isCreateOpen}
      />
    </Container>
  );
};

export default Home;
