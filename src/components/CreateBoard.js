import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  width: 180px;
  height: 96px;
  background: #eee;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px;
  display: flex;
  cursor: pointer;
`;

const Label = styled.p`
  font-family: "Roboto";
  font-size: 14px;
  color: #aaa;
  margin: auto;
`;

const CreateBoard = ({ onClick }) => (
  <Container onClick={onClick}>
    <Label>Create New Board</Label>
  </Container>
);

CreateBoard.propTypes = {
  onClick: PropTypes.func
};

export default CreateBoard;
