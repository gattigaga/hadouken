import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import Button from "./Button";

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  padding-bottom: 12px;
  border-radius: 4px;
  display: flex;

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
  label,
  isChecked,
  isWillUpdateLabel,
  onClickCheck,
  onClickLabel,
  onClickDelete,
  onClickApplyUpdate,
  onClickCancelUpdate
}) => {
  const [newLabel, setNewLabel] = useState(label);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setNewLabel(label);
  }, [isWillUpdateLabel, label]);

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        type="checkbox"
        onChange={event => {
          event.stopPropagation();
          onClickCheck();
        }}
        checked={isChecked}
      />
      <LabelWrapper>
        {isWillUpdateLabel ? (
          <>
            <Textarea
              placeholder="Enter a label..."
              value={newLabel}
              onClick={event => event.stopPropagation()}
              onChange={event => setNewLabel(event.target.value)}
            />
            <Row>
              <ApplyButton
                label="Apply"
                onClick={event => {
                  event.stopPropagation();
                  onClickApplyUpdate(newLabel);
                }}
              />
              <Button
                label="Cancel"
                color="#e74c3c"
                onClick={event => {
                  event.stopPropagation();
                  setNewLabel(label);
                  onClickCancelUpdate();
                }}
              />
            </Row>
          </>
        ) : (
          <Label
            onClick={event => {
              event.stopPropagation();
              onClickLabel();
            }}
          >
            {label}
          </Label>
        )}
      </LabelWrapper>
      {isHovered && (
        <Icon
          icon={faTimes}
          onClick={event => {
            event.stopPropagation();
            onClickDelete();
          }}
        />
      )}
    </Container>
  );
};

Check.propTypes = {
  label: PropTypes.string,
  isChecked: PropTypes.bool,
  isWillUpdateLabel: PropTypes.bool,
  onClickCheck: PropTypes.func,
  onClickLabel: PropTypes.func,
  onClickDelete: PropTypes.func,
  onClickApplyUpdate: PropTypes.func,
  onClickCancelUpdate: PropTypes.func
};

export default Check;
