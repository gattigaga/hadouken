import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import Button from "../common/Button";

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  padding-bottom: 12px;
  border-radius: 4px;
  display: flex;
  background: #eee;

  &:hover {
    background: #e7e7e7;
  }
`;

const Label = styled.p`
  font-family: "Roboto";
  font-size: 14px;
  color: #777;
  margin: 0px;
  line-height: 1.2em;
  cursor: pointer;
  width: 100%;
  text-decoration: ${({ isChecked }) => (isChecked ? "line-through" : "none")};
`;

const Checkbox = styled.input`
  margin-right: 16px;
  outline: none;
  cursor: pointer;
`;

const Icon = styled(FontAwesomeIcon)`
  margin-left: auto;
  font-size: 14px;
  color: #777;
  cursor: pointer;
`;

const LabelWrapper = styled.div`
  flex: 1;
  margin-right: 24px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const ApplyButton = styled(Button)`
  margin-right: 8px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 54px;
  font-family: "Roboto";
  font-size: 14px;
  outline: none;
  padding: 8px;
  margin-right: 24px;
  margin-bottom: 8px;
  box-sizing: border-box;
  resize: none;
  background: #e3e3e3;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Check = ({
  id,
  index,
  label,
  isChecked,
  isWillUpdateLabel,
  onClickCheck,
  onClickLabel,
  onClickDelete,
  onClickApplyUpdate,
  onClickCancelUpdate,
}) => {
  const [newLabel, setNewLabel] = useState(label);
  const [isHovered, setIsHovered] = useState(false);
  const refInput = useRef(null);

  useEffect(() => {
    setNewLabel(label);
  }, [isWillUpdateLabel, label]);

  useEffect(() => {
    if (isWillUpdateLabel) {
      refInput.current.select();
    }
  }, [isWillUpdateLabel]);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Container
          ref={provided.innerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Checkbox
            type="checkbox"
            onChange={(event) => {
              event.stopPropagation();
              onClickCheck();
            }}
            checked={isChecked}
          />
          <LabelWrapper>
            {isWillUpdateLabel ? (
              <>
                <Textarea
                  ref={refInput}
                  placeholder="Enter a label..."
                  value={newLabel}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => setNewLabel(event.target.value)}
                  onKeyDown={(event) => {
                    switch (event.keyCode) {
                      case 13: // Enter is pressed
                        onClickApplyUpdate(newLabel);
                        break;

                      case 27: // Escape is pressed
                        setNewLabel(label);
                        onClickCancelUpdate();
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
                      onClickApplyUpdate(newLabel);
                    }}
                  />
                  <Button
                    label="Cancel"
                    color="#e74c3c"
                    onClick={(event) => {
                      event.stopPropagation();
                      setNewLabel(label);
                      onClickCancelUpdate();
                    }}
                  />
                </Row>
              </>
            ) : (
              <Label
                onClick={(event) => {
                  event.stopPropagation();
                  onClickLabel();
                }}
                isChecked={isChecked}
              >
                {label}
              </Label>
            )}
          </LabelWrapper>
          {isHovered && (
            <Icon
              icon={faTimes}
              onClick={(event) => {
                event.stopPropagation();
                onClickDelete();
              }}
            />
          )}
        </Container>
      )}
    </Draggable>
  );
};

Check.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
  label: PropTypes.string,
  isChecked: PropTypes.bool,
  isWillUpdateLabel: PropTypes.bool,
  onClickCheck: PropTypes.func,
  onClickLabel: PropTypes.func,
  onClickDelete: PropTypes.func,
  onClickApplyUpdate: PropTypes.func,
  onClickCancelUpdate: PropTypes.func,
};

export default Check;
