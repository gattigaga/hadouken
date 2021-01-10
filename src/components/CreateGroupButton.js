import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import chroma from "chroma-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Container = styled.button`
  width: 280px;
  height: 40px;
  flex-shrink: 0;
  color: white;
  display: flex;
  align-items: center;
  border: 0px;
  border-radius: 4px;
  padding: 0px 16px;
  cursor: pointer;
  background: ${chroma("#3498db")
    .brighten(0.5)
    .hex()};

  &:hover {
    background: ${chroma("#3498db")
      .brighten(0.6)
      .hex()};
  }
`;

const Label = styled.p`
  font-size: 14px;
  font-family: "Roboto";
  margin: 0px;
  margin-left: 8px;
`;

const CreateGroupButton = ({ onClick }) => (
  <Container
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
  >
    <FontAwesomeIcon icon={faPlus} size={14} />
    <Label>Add new list</Label>
  </Container>
);

CreateGroupButton.propTypes = {
  onClick: PropTypes.func,
};

export default CreateGroupButton;
