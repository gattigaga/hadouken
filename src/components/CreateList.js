import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import chroma from "chroma-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import Button from "./Button";

const Container = styled.button`
  width: 280px;
  height: 40px;
  color: white;
  display: flex;
  border: 0px;
  border-radius: 4px;
  padding: 0px 16px;
  cursor: pointer;
  background: ${chroma("#3498db")
    .brighten(0.5)
    .hex()};

  &:hover {
    background: ${chroma("#3498db")
      .brighten(0.6)
      .hex()};
  }
`;

const Label = styled.p`
  font-size: 14px;
  font-family: "Roboto";
  margin: 0px;
  margin-left: 8px;
`;

const List = styled.div`
  width: 280px;
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

const CreateList = ({
  isWillAdd,
  onClickAdd,
  onClickApplyAdd,
  onClickCancelAdd
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName("");
  }, [isWillAdd]);

  return isWillAdd ? (
    <List>
      <Header>
        <Input
          type="text"
          placeholder="Enter list name..."
          value={name}
          onClick={event => event.stopPropagation()}
          onChange={event => setName(event.target.value)}
        />
      </Header>
      <Footer>
        <ApplyButton label="Apply" onClick={() => onClickApplyAdd(name)} />
        <Button label="Cancel" color="#e74c3c" onClick={onClickCancelAdd} />
      </Footer>
    </List>
  ) : (
    <Container
      onClick={event => {
        event.stopPropagation();
        onClickAdd();
      }}
    >
      <FontAwesomeIcon icon={faPlus} size={14} />
      <Label>Add new list</Label>
    </Container>
  );
};

CreateList.propTypes = {
  isWillAdd: PropTypes.bool,
  onClickAdd: PropTypes.func,
  onClickApplyAdd: PropTypes.func,
  onClickCancelAdd: PropTypes.func
};

export default CreateList;
