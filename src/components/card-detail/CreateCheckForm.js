import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import chroma from "chroma-js";

import Button from "../common/Button";

const Container = styled.div`
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

const CreateCheckForm = ({ refInput, onClickApply, onClickCancel }) => {
  const [newCheck, setNewCheck] = useState("");

  return (
    <Container>
      <Textarea
        ref={refInput}
        height={48}
        placeholder="Add an item"
        value={newCheck}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => setNewCheck(event.target.value)}
        onKeyDown={(event) => {
          switch (event.keyCode) {
            case 13: // Enter is pressed
              onClickApply(newCheck);
              break;

            case 27: // Escape is pressed
              onClickCancel();
              break;

            default:
              break;
          }

          setNewCheck("");
        }}
      />
      <Row>
        <ApplyButton
          label="Apply"
          onClick={(event) => {
            event.stopPropagation();
            onClickApply(newCheck);
            setNewCheck("");
          }}
        />
        <Button
          label="Cancel"
          color="#e74c3c"
          onClick={(event) => {
            event.stopPropagation();
            onClickCancel();
            setNewCheck("");
          }}
        />
      </Row>
    </Container>
  );
};

CreateCheckForm.propTypes = {
  refInput: PropTypes.any,
  onClickApply: PropTypes.func,
  onClickCancel: PropTypes.func,
};

export default CreateCheckForm;
