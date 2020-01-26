import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Modal from "react-modal";
import chroma from "chroma-js";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faIdCard, faList } from "@fortawesome/free-solid-svg-icons";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";

import Button from "../components/Button";
import { updateCard } from "../store/actionCreators";

const Container = styled.div`
  width: 640px;
  min-height: 320px;
  padding: 24px;
  background: #eee;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Icon = styled(FontAwesomeIcon)`
  color: #777;
  cursor: pointer;
`;

const CardIcon = styled(Icon)`
  margin-top: 4px;
`;

const CloseIcon = styled(Icon)`
  font-size: 24px;
  margin-top: 4px;
  margin-left: auto;
`;

const Header = styled.div`
  font-family: "Roboto";
  color: #777;
  display: flex;
  margin-bottom: 24px;
`;

const NameWrapper = styled.div`
  margin-left: 16px;
  margin-right: 32px;
  width: 100%;
`;

const Name = styled.h2`
  font-size: 24px;
  font-family: "Roboto";
  color: #777;
  margin: 0px;
`;

const ListName = styled.p`
  font-size: 14px;
  font-family: "Roboto";
  color: #777;
  margin: 0px;
  margin-top: 8px;
`;

const Subtitle = styled.h3`
  font-size: 18px;
  font-family: "Roboto";
  color: #777;
  margin: 0px;
  margin-left: 16px;
`;

const Description = styled.p`
  font-size: 14px;
  font-family: "Roboto";
  color: #777;
  margin: 0px;
  cursor: pointer;

  ${({ isEmpty }) =>
    isEmpty &&
    `
    height: 54px;
    background: #ddd;
    border-radius: 4px;
    padding: 12px;
  `}
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

const Textarea = styled.textarea`
  width: 100%;
  height: 96px;
  font-family: "Roboto";
  font-size: 14px;
  outline: none;
  padding: 8px;
  margin-right: 24px;
  margin-bottom: 8px;
  box-sizing: border-box;
  resize: none;
  border-radius: 4px;
  border: 2px solid
    ${chroma("#3498db")
      .darken(0.6)
      .hex()};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const ApplyButton = styled(Button)`
  margin-right: 8px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const DescriptionWrapper = styled.div`
  padding-left: 32px;
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
  const lists = useSelector(state => state.lists);
  const dispatch = useDispatch();
  const { cardSlug } = useParams();
  const history = useHistory();
  const [current, send] = useMachine(machine);

  const card = cards.find(card => card.slug === cardSlug);
  const list = lists.find(list => list.id === card.listId);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    setNewName(card ? card.name : "");
    setNewDescription(card ? card.description : "");
  }, [card]);

  if (!card || !list) return null;

  return (
    <Modal
      style={modalStyles}
      onRequestClose={history.goBack}
      contentLabel="Card Detail"
      isOpen
    >
      <Container onClick={() => send("IDLE")}>
        <Header>
          <CardIcon icon={faIdCard} />
          <NameWrapper>
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
            <ListName>
              in list <strong>{list.name}</strong>
            </ListName>
          </NameWrapper>
          <CloseIcon icon={faTimes} onClick={history.goBack} />
        </Header>
        <Section>
          <SectionHeader>
            <Icon icon={faList} />
            <Subtitle>Description</Subtitle>
          </SectionHeader>
          <DescriptionWrapper>
            {current.matches("updateCardDescription") ? (
              <>
                <Textarea
                  placeholder="Enter a description..."
                  value={newDescription}
                  onClick={event => event.stopPropagation()}
                  onChange={event => setNewDescription(event.target.value)}
                />
                <Row>
                  <ApplyButton
                    label="Apply"
                    onClick={event => {
                      event.stopPropagation();
                      dispatch(
                        updateCard(card.id, { description: newDescription })
                      );
                      send("IDLE");
                    }}
                  />
                  <Button
                    label="Cancel"
                    color="#e74c3c"
                    onClick={event => {
                      event.stopPropagation();
                      setNewDescription(card.description);
                      send("IDLE");
                    }}
                  />
                </Row>
              </>
            ) : (
              <Description
                onClick={event => {
                  event.stopPropagation();
                  send("UPDATE_CARD_DESCRIPTION");
                }}
                isEmpty={!card.description}
              >
                {card.description || "Enter a description..."}
              </Description>
            )}
          </DescriptionWrapper>
        </Section>
      </Container>
    </Modal>
  );
};

export default CardDetail;
