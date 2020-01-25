import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Modal from "react-modal";
import chroma from "chroma-js";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";

import Button from "../components/Button";
import { updateCard } from "../store/actionCreators";

const Container = styled.div`
  width: 640px;
  min-height: 480px;
  padding: 24px;
  background: #eee;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Icon = styled(FontAwesomeIcon)`
  color: white;
  margin-right: 4px;
  cursor: pointer;
`;

const CloseIcon = styled(FontAwesomeIcon)`
  color: #999;
  font-size: 24px;
  margin-left: auto;
  cursor: pointer;
`;

const Header = styled.div`
  font-family: "Roboto";
  color: #777;
  display: flex;
`;

const Name = styled.h2`
  font-size: 24px;
  font-family: "Roboto";
  color: #777;
  margin: 0px;
`;

const Input = styled.input`
  width: 100%;
  height: 42px;
  font-family: "Roboto";
  font-size: 24px;
  outline: none;
  padding: 0px 8px;
  margin-right: 24px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 2px solid
    ${chroma("#3498db")
      .darken(0.6)
      .hex()};
`;

const modalStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.7)"
  },
  content: {
    background: "none",
    border: 0,
    width: 640,
    padding: 0,
    margin: "auto"
  }
};

const machine = Machine({
  id: "machine",
  initial: "idle",
  states: {
    idle: {
      on: {
        UPDATE_CARD_NAME: "updateCardName",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription"
      }
    },
    updateCardName: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription"
      }
    },
    updateCardDescription: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_NAME: "updateCardName"
      }
    }
  }
});

const CardDetail = () => {
  const cards = useSelector(state => state.cards);
  const dispatch = useDispatch();
  const { cardSlug } = useParams();
  const history = useHistory();
  const [current, send] = useMachine(machine);

  const card = cards.find(card => card.slug === cardSlug);

  const [newName, setNewName] = useState("");

  useEffect(() => {
    setNewName(card ? card.name : "");
  }, [card]);

  if (!card) return null;

  return (
    <Modal
      style={modalStyles}
      onRequestClose={history.goBack}
      contentLabel="Card Detail"
      isOpen
    >
      <Container onClick={() => send("IDLE")}>
        <Header>
          {current.matches("updateCardName") ? (
            <Input
              type="text"
              value={newName}
              onClick={event => event.stopPropagation()}
              onChange={event => setNewName(event.target.value)}
              onBlur={() => dispatch(updateCard(card.id, { name: newName }))}
            />
          ) : (
            <Name
              onClick={event => {
                event.stopPropagation();
                send("UPDATE_CARD_NAME");
              }}
            >
              {card.name}
            </Name>
          )}
          <CloseIcon icon={faTimes} onClick={history.goBack} />
        </Header>
      </Container>
    </Modal>
  );
};

export default CardDetail;
