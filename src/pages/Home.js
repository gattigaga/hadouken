import React, { useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";

import Board from "../components/Board";
import CreateBoardButton from "../components/CreateBoardButton";
import ModalCreateBoard from "../components/ModalCreateBoard";
import { createBoard } from "../store/actionCreators";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  width: 800px;
  margin: auto;
  padding-top: 48px;
  padding-bottom: 96px;
`;

const Title = styled.h1`
  font-family: "Roboto";
  font-size: 64px;
  letter-spacing: -3px;
  margin-top: 0px;
  margin-bottom: 0px;
  color: #333;
`;

const BoardList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 180px);
  grid-gap: 26px;
`;

const CreatorName = styled.p`
  font-family: "Roboto";
  font-size: 14px;
  color: #aaa;
  margin-top: 0px;
  margin-bottom: 48px;
`;

const Home = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const boards = useSelector((state) => state.boards);
  const dispatch = useDispatch();

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
        onClickCreate={(boardName) => {
          dispatch(createBoard({ name: boardName }));
          setIsCreateOpen(false);
        }}
        isOpen={isCreateOpen}
      />
    </Container>
  );
};

export default Home;
