import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import chroma from "chroma-js";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import autosize from "autosize";

import Button from "../common/Button";

const Container = styled.div`
  width: 280px;
  margin-right: 12px;
  background: #eee;
  border-radius: 4px;
  flex-shrink: 0;
`;

const Header = styled.div`
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  padding: 0px 12px;
  box-sizing: border-box;
`;

const Footer = styled(Header)`
  padding: 0px 8px;
  height: 48px;
`;

const Name = styled.h2`
  font-size: 14px;
  font-family: "Roboto";
  color: #777;
  margin-right: auto;
  width: 100%;
`;

const Content = styled.div`
  padding: 0px 8px;
  min-height: 16px;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #ddd;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: #999;
  font-size: 14px;
`;

const FooterButton = styled.button`
  border: 0px;
  border-radius: 4px;
  padding: 0px 12px;
  background: none;
  width: 100%;
  height: 28px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: #ddd;
  }
`;

const Text = styled.p`
  font-size: 14px;
  font-family: "Roboto";
  color: #999;
  margin: 0px;
  margin-left: 8px;
`;

const ApplyButton = styled(Button)`
  margin-right: 8px;
`;

const NewCard = styled.textarea`
  width: 100%;
  min-height: 72px;
  border: 0px;
  border-radius: 4px;
  border-bottom: 1px solid #ccc;
  padding: 12px 8px;
  background: white;
  box-sizing: border-box;
  margin-bottom: 8px;
  font-family: "Roboto";
  font-size: 14px;
  outline: none;
  color: #777;
  resize: none;
  line-height: 1.2em;
`;

const CloseButton = styled.button`
  cursor: pointer;
  border: 0px;
  background: none;
`;

const Input = styled.input`
  width: 100%;
  height: 28px;
  font-family: "Roboto";
  font-size: 14px;
  outline: none;
  padding: 0px 8px;
  margin-right: 24px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 2px solid ${chroma("#3498db").darken(0.6).hex()};
`;

const List = ({
  id,
  index,
  name,
  children,
  isWillAdd,
  isWillUpdateName,
  onNameUpdated,
  onClickName,
  onClickClose,
  onClickAdd,
  onClickApplyAdd,
  onClickCancelAdd,
}) => {
  const [newCard, setNewCard] = useState("");
  const [newName, setNewName] = useState(name);
  const refInputName = useRef(null);
  const refInputNewCard = useRef(null);

  useEffect(() => {
    setNewCard("");

    if (isWillAdd) {
      refInputNewCard.current.focus();
      autosize(refInputNewCard.current);
    }
  }, [isWillAdd]);

  useEffect(() => {
    if (isWillUpdateName) {
      refInputName.current.select();
    }
  }, [isWillUpdateName]);

  useEffect(() => {
    const isApplied = !isWillUpdateName && name !== newName;

    if (!isApplied) return;

    onNameUpdated(newName);

    if (newName) return;

    setNewName(name);
  }, [isWillUpdateName, name, onNameUpdated, newName]);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Header>
            {isWillUpdateName ? (
              <Input
                ref={refInputName}
                type="text"
                value={newName}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => setNewName(event.target.value)}
                onKeyDown={(event) => {
                  switch (event.keyCode) {
                    case 13: // Enter is pressed
                    case 27: // Escape is pressed
                      onNameUpdated(newName);
                      break;

                    default:
                      break;
                  }
                }}
              />
            ) : (
              <Name
                onClick={(event) => {
                  event.stopPropagation();
                  onClickName();
                }}
              >
                {name}
              </Name>
            )}
            <CloseButton
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClickClose();
              }}
            >
              <Icon icon={faTimes} />
            </CloseButton>
          </Header>
          <Droppable droppableId={id} type="CARD">
            {(provided) => (
              <Content ref={provided.innerRef} {...provided.droppableProps}>
                {children}
                {provided.placeholder}
                {isWillAdd && (
                  <NewCard
                    ref={refInputNewCard}
                    placeholder="Enter a name for this card..."
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => setNewCard(event.target.value)}
                    onKeyDown={(event) => {
                      switch (event.keyCode) {
                        case 13: // Enter is pressed
                          onClickApplyAdd(newCard);
                          setTimeout(() => setNewCard(""), 50);
                          break;

                        case 27: // Escape is pressed
                          onClickCancelAdd();
                          break;

                        default:
                          break;
                      }
                    }}
                    value={newCard}
                  />
                )}
              </Content>
            )}
          </Droppable>
          <Footer>
            {isWillAdd ? (
              <>
                <ApplyButton
                  label="Apply"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClickApplyAdd(newCard);
                    setTimeout(() => setNewCard(""), 50);
                  }}
                />
                <Button
                  label="Cancel"
                  color="#e74c3c"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClickCancelAdd();
                  }}
                />
              </>
            ) : (
              <FooterButton
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onClickAdd();
                }}
              >
                <Icon icon={faPlus} />
                <Text>Add new card</Text>
              </FooterButton>
            )}
          </Footer>
        </Container>
      )}
    </Draggable>
  );
};

List.propTypes = {
  id: PropTypes.string,
  index: PropTypes.string,
  name: PropTypes.string,
  children: PropTypes.array,
  isWillAdd: PropTypes.bool,
  isWillUpdateName: PropTypes.bool,
  onNameUpdated: PropTypes.func,
  onClickName: PropTypes.func,
  onClickClose: PropTypes.func,
  onClickAdd: PropTypes.func,
  onClickApplyAdd: PropTypes.func,
  onClickCancelAdd: PropTypes.func,
};

export default List;
