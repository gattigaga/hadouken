import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import chroma from "chroma-js";

import Button from "./Button";

const Container = styled.div`
  width: 280px;
  flex-shrink: 0;
  background: #eee;
  border-radius: 4px;
`;

const ApplyButton = styled(Button)`
  margin-right: 8px;
`;

const Header = styled.div`
  padding: 8px;
  padding-bottom: 0px;
`;

const Footer = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0px 8px;
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  height: 36px;
  font-family: "Roboto";
  font-size: 14px;
  outline: none;
  padding: 0px 12px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 2px solid
    ${chroma("#3498db")
      .darken(0.6)
      .hex()};
`;

const CreateGroupForm = ({ onClickApplyAdd, onClickCancelAdd }) => {
  const [name, setName] = useState("");
  const refInput = useRef(null);

  useEffect(() => {
    setName("");
    refInput.current.focus();
  }, []);

  return (
    <Container>
      <Header>
        <Input
          ref={refInput}
          type="text"
          placeholder="Enter group name..."
          value={name}
          onClick={event => event.stopPropagation()}
          onChange={event => setName(event.target.value)}
          onKeyDown={event => {
            switch (event.keyCode) {
              case 13: // Enter is pressed
                onClickApplyAdd(name);
                break;

              case 27: // Escape is pressed
                onClickCancelAdd();
                break;

              default:
                break;
            }
          }}
        />
      </Header>
      <Footer>
        <ApplyButton
          label="Apply"
          onClick={event => {
            event.stopPropagation();
            onClickApplyAdd(name);
          }}
        />
        <Button
          label="Cancel"
          color="#e74c3c"
          onClick={event => {
            event.stopPropagation();
            onClickCancelAdd();
          }}
        />
      </Footer>
    </Container>
  );
};

CreateGroupForm.propTypes = {
  onClickApplyAdd: PropTypes.func,
  onClickCancelAdd: PropTypes.func
};

export default CreateGroupForm;
