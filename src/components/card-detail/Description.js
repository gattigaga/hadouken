import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import chroma from "chroma-js";
import { faList } from "@fortawesome/free-solid-svg-icons";

import Button from "../common/Button";
import Section from "./Section";

const Wrapper = styled.div`
  padding-left: 32px;
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

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const ApplyButton = styled(Button)`
  margin-right: 8px;
`;

const Text = styled.p`
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

const Description = ({
  refInput,
  value,
  isEdit,
  onClick,
  onClickCancel,
  onClickApply,
}) => {
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    setNewValue(value);
  }, [value]);

  return (
    <Section icon={faList} title="Description">
      <Wrapper>
        {isEdit ? (
          <>
            <Textarea
              ref={refInput}
              placeholder="Enter a description..."
              value={newValue}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => setNewValue(event.target.value)}
              onKeyDown={(event) => {
                const isEscapePressed = event.keyCode === 27;

                if (isEscapePressed) {
                  setNewValue(value);
                  onClickCancel();
                }
              }}
            />
            <Row>
              <ApplyButton
                label="Apply"
                onClick={(event) => {
                  event.stopPropagation();
                  onClickApply(newValue);
                }}
              />
              <Button
                label="Cancel"
                color="#e74c3c"
                onClick={(event) => {
                  event.stopPropagation();
                  setNewValue(value);
                  onClickCancel();
                }}
              />
            </Row>
          </>
        ) : (
          <Text
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
            isEmpty={!newValue}
          >
            {newValue || "Enter a description..."}
          </Text>
        )}
      </Wrapper>
    </Section>
  );
};

Description.propTypes = {
  refInput: PropTypes.any,
  value: PropTypes.string,
  isEdit: PropTypes.bool,
  onClick: PropTypes.func,
  onClickCancel: PropTypes.func,
  onClickApply: PropTypes.func,
};

export default Description;
