import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import chroma from "chroma-js";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { faList, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";

import Button from "../components/common/Button";
import Header from "../components/card-detail/Header";
import Check from "../components/card-detail/Check";
import Progress from "../components/card-detail/Progress";
import {
  updateCard,
  createCheck,
  updateCheck,
  deleteCheck,
  deleteCard,
  moveCheck,
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
  line-height: 1.5em;
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

const Textarea = styled.textarea`
  width: 100%;
  height: ${({ height }) => height || 96}px;
  font-family: "Roboto";
  font-size: 14px;
  outline: none;
  padding: 8px;
  line-height: 1.5em;
  margin-right: 24px;
  margin-bottom: 8px;
  box-sizing: border-box;
  resize: none;
  border-radius: 4px;
  border: 2px solid ${chroma("#3498db").darken(0.6).hex()};
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

const modalStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.7)",
  },
  content: {
    background: "none",
    border: 0,
    width: 640,
    padding: 0,
    margin: "auto",
  },
};

const machine = Machine({
  id: "cardDetail",
  initial: "idle",
  states: {
    idle: {
      on: {
        UPDATE_CARD_NAME: "updateCardName",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: "updateCheck",
      },
    },
    updateCardName: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: "updateCheck",
      },
    },
    updateCardDescription: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_NAME: "updateCardName",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: "updateCheck",
      },
    },
    createCheck: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_NAME: "updateCardName",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        UPDATE_CHECK: "updateCheck",
      },
    },
    updateCheck: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_NAME: "updateCardName",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: "updateCheck",
      },
    },
  },
});

const CardDetail = () => {
  const cards = useSelector((state) => state.cards);
  const lists = useSelector((state) => state.lists);
  const checks = useSelector((state) => state.checks);
  const dispatch = useDispatch();
  const { cardSlug } = useParams();
  const history = useHistory();
  const [current, send] = useMachine(machine);
  const [checkId, setCheckId] = useState(null);
  const refInputName = useRef(null);
  const refInputDescription = useRef(null);
  const refInputCheck = useRef(null);

  const card = cards.find((card) => card.slug === cardSlug);
  const list = lists.find((list) => list.id === card.listId);
  const currentChecks = checks.filter((check) => check.cardId === card.id);
  const totalChecked = currentChecks.filter((check) => !!check.isChecked)
    .length;
  const divide = totalChecked / currentChecks.length;
  const progress = Number.isNaN(divide) ? 0 : (divide * 100).toFixed(0);
  const isUpdateCardName = current.matches("updateCardName");
  const isUpdateCardDescription = current.matches("updateCardDescription");
  const isCreateCheck = current.matches("createCheck");

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCheck, setNewCheck] = useState("");

  useEffect(() => {
    setNewName(card ? card.name : "");
    setNewDescription(card ? card.description : "");
  }, [card]);

  useEffect(() => {
    if (isUpdateCardName) {
      refInputName.current.select();
    }
  }, [isUpdateCardName]);

  useEffect(() => {
    if (isUpdateCardDescription) {
      refInputDescription.current.select();
    }
  }, [isUpdateCardDescription]);

  useEffect(() => {
    if (isCreateCheck) {
      refInputCheck.current.focus();
    }
  }, [isCreateCheck]);

  const reorder = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const isSameCard = destination.droppableId === source.droppableId;
    const isSameIndex = destination.index === source.index;

    if (isSameCard && isSameIndex) return;

    dispatch(
      moveCheck(draggableId, {
        index: destination.index,
      })
    );
  };

  if (!card || !list) return null;

  return (
    <Modal
      style={modalStyles}
      onRequestClose={() => {
        send("IDLE");

        if (current.matches("idle")) {
          history.goBack();
        }
      }}
      contentLabel="Card Detail"
      isOpen
    >
      <Container onClick={() => send("IDLE")}>
        <Header
          refInput={refInputName}
          title={card.name}
          groupName={group.name}
          isEdit={current.matches("updateCardName")}
          onApplyTitle={(newName) => {
            dispatch(updateCard(card.id, { name: newName }));
            send("IDLE");
          }}
          onClickClose={() => {
            send("IDLE");
            history.goBack();
          }}
          onClickTitle={(event) => {
            event.stopPropagation();
            send("UPDATE_CARD_NAME");
          }}
          onClickDelete={(event) => {
            event.stopPropagation();
            history.goBack();

            setTimeout(() => {
              checks.forEach((check) => {
                dispatch(deleteCheck(check.id));
              });

              dispatch(deleteCard(card.id));
            }, 50);
          }}
        />
        <Section>
          <SectionHeader>
            <Icon icon={faList} />
            <Subtitle>Description</Subtitle>
          </SectionHeader>
          <EditWrapper>
            {current.matches("updateCardDescription") ? (
              <>
                <Textarea
                  ref={refInputDescription}
                  placeholder="Enter a description..."
                  value={newDescription}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => setNewDescription(event.target.value)}
                  onKeyDown={(event) => {
                    const isEscapePressed = event.keyCode === 27;

                    if (isEscapePressed) {
                      setNewDescription(card.description);
                      send("IDLE");
                    }
                  }}
                />
                <Row>
                  <ApplyButton
                    label="Apply"
                    onClick={(event) => {
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
                    onClick={(event) => {
                      event.stopPropagation();
                      setNewDescription(card.description);
                      send("IDLE");
                    }}
                  />
                </Row>
              </>
            ) : (
              <Description
                onClick={(event) => {
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
          <DragDropContext onDragEnd={reorder}>
            <Droppable droppableId={card.id} direction="vertical" type="CHECK">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {currentChecks.map((check) => (
                    <Check
                      key={check.id}
                      id={check.id}
                      index={check.index}
                      label={check.label}
                      isChecked={check.isChecked}
                      onClickCheck={() => {
                        dispatch(
                          updateCheck(check.id, { isChecked: !check.isChecked })
                        );
                      }}
                      onClickLabel={() => {
                        send("UPDATE_CHECK");
                        setCheckId(check.id);
                      }}
                      onClickApplyUpdate={(newLabel) => {
                        dispatch(updateCheck(check.id, { label: newLabel }));
                        send("IDLE");
                      }}
                      onClickCancelUpdate={() => {
                        setNewCheck("");
                        send("IDLE");
                      }}
                      onClickDelete={() => dispatch(deleteCheck(check.id))}
                      isWillUpdateLabel={
                        current.matches("updateCheck") && checkId === check.id
                      }
                    />
                  ))}
                  {provided.placeholder}
                  {current.matches("createCheck") ? (
                    <EditWrapper>
                      <Textarea
                        ref={refInputCheck}
                        height={48}
                        placeholder="Add an item"
                        value={newCheck}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => setNewCheck(event.target.value)}
                        onKeyDown={(event) => {
                          switch (event.keyCode) {
                            case 13: // Enter is pressed
                              dispatch(
                                createCheck({
                                  cardId: card.id,
                                  label: newCheck,
                                })
                              );
                              setTimeout(() => setNewCheck(""), 20);
                              break;

                            case 27: // Escape is pressed
                              setNewCheck("");
                              send("IDLE");
                              break;

                            default:
                              break;
                          }
                        }}
                      />
                      <Row>
                        <ApplyButton
                          label="Apply"
                          onClick={(event) => {
                            event.stopPropagation();
                            dispatch(
                              createCheck({ cardId: card.id, label: newCheck })
                            );
                            setTimeout(() => setNewCheck(""), 20);
                          }}
                        />
                        <Button
                          label="Cancel"
                          color="#e74c3c"
                          onClick={(event) => {
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
                      onClick={(event) => {
                        event.stopPropagation();
                        send("CREATE_CHECK");
                      }}
                    />
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Section>
      </Container>
    </Modal>
  );
};

export default CardDetail;
