import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Button = styled.button`
  width: 180px;
  height: 96px;
  background: #eee;
  border: 0px;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px;
  font-family: "Roboto";
  font-size: 14px;
  color: #aaa;
`;

const CreateBoardButton = ({ onClick }) => (
  <Button type="button" onClick={onClick}>
    Create New Board
  </Button>
);

CreateBoardButton.propTypes = {
  onClick: PropTypes.func
};

export default CreateBoardButton;
