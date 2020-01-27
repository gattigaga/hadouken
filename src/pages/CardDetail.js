import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import chroma from "chroma-js";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faIdCard,
  faList,
  faCheckSquare
} from "@fortawesome/free-solid-svg-icons";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";

import Button from "../components/Button";
import Check from "../components/Check";
import Progress from "../components/Progress";
import {
  updateCard,
  createCheck,
  updateCheck,
  deleteCheck,
  deleteCard
} from "../store/actionCreators";

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
  height: ${({ height }) => height || 96}px;
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
  margin-top: 36px;
`;

const EditWrapper = styled.div`
  padding-left: 32px;
`;

const AddCheckButton = styled(Button)`
  margin-top: 8px;
  margin-left: 32px;
`;

const DeleteButton = styled.span`
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
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
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: {
          target: "updateCheck",
          actions: assign({
            checkId: (_, event) => event.checkId
          })
        }
      }
    },
    updateCardName: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: {
          target: "updateCheck",
          actions: assign({
            checkId: (_, event) => event.checkId
          })
        }
      }
    },
    updateCardDescription: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_NAME: "updateCardName",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: {
          target: "updateCheck",
          actions: assign({
            checkId: (_, event) => event.checkId
          })
        }
      }
    },
    createCheck: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_NAME: "updateCardName",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        UPDATE_CHECK: {
          target: "updateCheck",
          actions: assign({
            checkId: (_, event) => event.checkId
          })
        }
      }
    },
    updateCheck: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_NAME: "updateCardName",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: {
          target: "updateCheck",
          actions: assign({
            checkId: (_, event) => event.checkId
          })
        }
      }
    }
  }
});

const CardDetail = () => {
  const cards = useSelector(state => state.cards);
  const lists = useSelector(state => state.lists);
  const checks = useSelector(state => state.checks);
  const dispatch = useDispatch();
  const { cardSlug } = useParams();
  const history = useHistory();
  const [current, send] = useMachine(machine);

  const card = cards.find(card => card.slug === cardSlug);
  const list = lists.find(list => list.id === card.listId);
  const currentChecks = checks.filter(check => check.cardId === card.id);
  const totalChecked = currentChecks.filter(check => !!check.isChecked).length;
  const divide = totalChecked / currentChecks.length;
  const progress = Number.isNaN(divide) ? 0 : divide * 100;

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCheck, setNewCheck] = useState("");

  useEffect(() => {
    setNewName(card ? card.name : "");
    setNewDescription(card ? card.description : "");
  }, [card]);

  if (!card || !list) return null;

  return (
    <Modal
      style={modalStyles}
      onRequestClose={() => {
        send("IDLE");
        history.goBack();
      }}
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
              in list <strong>{list.name}</strong>{" "}
              <DeleteButton
                onClick={event => {
                  event.stopPropagation();
                  history.goBack();
                  setTimeout(() => dispatch(deleteCard(card.id)), 50);
                }}
              >
                (Delete)
              </DeleteButton>
            </ListName>
          </NameWrapper>
          <CloseIcon
            icon={faTimes}
            onClick={() => {
              send("IDLE");
              history.goBack();
            }}
          />
        </Header>
        <Section>
          <SectionHeader>
            <Icon icon={faList} />
            <Subtitle>Description</Subtitle>
          </SectionHeader>
          <EditWrapper>
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
          </EditWrapper>
        </Section>
        <Section>
          <SectionHeader>
            <Icon icon={faCheckSquare} />
            <Subtitle>Checklist</Subtitle>
          </SectionHeader>
          <Progress value={progress} />
          {currentChecks.map(check => (
            <Check
              key={check.id}
              label={check.label}
              isChecked={check.isChecked}
              onClickCheck={() => {
                dispatch(
                  updateCheck(check.id, { isChecked: !check.isChecked })
                );
              }}
              onClickLabel={() => send("UPDATE_CHECK", { checkId: check.id })}
              onClickApplyUpdate={newLabel => {
                dispatch(updateCheck(check.id, { label: newLabel }));
                send("IDLE");
              }}
              onClickCancelUpdate={() => {
                setNewCheck("");
                send("IDLE");
              }}
              onClickDelete={() => dispatch(deleteCheck(check.id))}
              isWillUpdateLabel={
                current.matches("updateCheck") &&
                current.context.checkId === check.id
              }
            />
          ))}
          {current.matches("createCheck") ? (
            <EditWrapper>
              <Textarea
                height={48}
                placeholder="Add an item"
                value={newCheck}
                onClick={event => event.stopPropagation()}
                onChange={event => setNewCheck(event.target.value)}
              />
              <Row>
                <ApplyButton
                  label="Apply"
                  onClick={event => {
                    event.stopPropagation();
                    dispatch(createCheck({ cardId: card.id, label: newCheck }));
                    setNewCheck("");
                    send("IDLE");
                  }}
                />
                <Button
                  label="Cancel"
                  color="#e74c3c"
                  onClick={event => {
                    event.stopPropagation();
                    setNewCheck("");
                    send("IDLE");
                  }}
                />
              </Row>
            </EditWrapper>
          ) : (
            <AddCheckButton
              label="Add an item"
              color="#34495e"
              onClick={event => {
                event.stopPropagation();
                send("CREATE_CHECK");
              }}
            />
          )}
        </Section>
      </Container>
    </Modal>
  );
};

export default CardDetail;
