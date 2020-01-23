import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Modal from "react-modal";
import chroma from "chroma-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import Button from "./Button";

const Board = styled.div`
  width: 320px;
  height: 96px;
  background: #3498db;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px;
  margin: 16px 0px;
  display: flex;
  align-items: flex-start;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  border: 0px;
  padding: 8px;
  margin-right: 24px;
  font-family: "Roboto";
  font-weight: bold;
  font-size: 16px;
  color: white;
  background: ${chroma("#3498db")
    .brighten(0.5)
    .hex()};
`;

const Icon = styled(FontAwesomeIcon)`
  color: white;
  margin-right: 4px;
  cursor: pointer;
`;

const modalStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.7)"
  },
  content: {
    background: "none",
    border: 0,
    width: 320,
    padding: 0,
    margin: "auto"
  }
};

const ModalCreateBoard = ({ isOpen, onClickCreate, onClickClose }) => {
  const [boardName, setBoardName] = useState("");

  return (
    <Modal
      style={modalStyles}
      isOpen={isOpen}
      onRequestClose={() => {
        onClickClose();
        setBoardName("");
      }}
      contentLabel="Modal Create Board"
    >
      <Board>
        <Input
          type="text"
          name="board"
          value={boardName}
          onChange={event => setBoardName(event.target.value)}
          autoComplete="off"
        />
        <Icon
          icon={faTimes}
          onClick={() => {
            onClickClose();
            setBoardName("");
          }}
        />
      </Board>
      <Button
        label="Create Board"
        onClick={() => {
          onClickCreate(boardName);
          setBoardName("");
        }}
        isDisabled={!boardName}
      />
    </Modal>
  );
};

ModalCreateBoard.propTypes = {
  isOpen: PropTypes.bool,
  onClickCreate: PropTypes.bool,
  onClickClose: PropTypes.bool
};

export default ModalCreateBoard;