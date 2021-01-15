import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Button = styled.button`
  width: 100%;
  height: 140px;
  background: #ddd;
  border: 0px;
  border-radius: 4px;
  box-sizing: border-box;
  font-family: "Roboto";
  font-size: 22px;
  color: #999;

  @media screen and (min-width: 800px) {
    height: 128px;
    font-size: 18px;
  }
`;

const CreateBoardButton = ({ onClick }) => (
  <Button type="button" onClick={onClick}>
    Create New Board
  </Button>
);

CreateBoardButton.propTypes = {
  onClick: PropTypes.func,
};

export default CreateBoardButton;
