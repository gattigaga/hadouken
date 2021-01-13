import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import chroma from "chroma-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faTrash } from "@fortawesome/free-solid-svg-icons";

import Button from "../common/Button";

const Container = styled.header`
  display: flex;
  margin-bottom: 24px;
  align-items: center;
`;

const Title = styled.h1`
  font-family: "Roboto";
  font-size: 24px;
  letter-spacing: -1px;
  margin-top: 0px;
  margin-bottom: 0px;
  color: white;
`;

const ButtonBack = styled.button`
  margin-right: 24px;
  border: 0px;
  background: none;
  cursor: pointer;
`;

const IconBack = styled(FontAwesomeIcon)`
  font-size: 32px;
  color: ${chroma("#3498db").brighten(0.5).hex()};
`;

const IconDelete = styled(FontAwesomeIcon)`
  font-size: 16px;
  color: white;
`;

const Input = styled.input`
  width: 320px;
  height: 32px;
  font-family: "Roboto";
  font-size: 24px;
  font-weight: bold;
  letter-spacing: -1px;
  outline: none;
  padding: 0px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 0px;
  background: none;
  color: white;
`;

const StyledButton = styled(Button)`
  margin-left: 32px;
`;

const Header = ({
  refInput,
  title,
  isEdit,
  onApplyTitle,
  onClickBack,
  onClickTitle,
  onClickDelete,
}) => {
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  return (
    <Container>
      <ButtonBack>
        <IconBack
          icon={faChevronLeft}
          onClick={(event) => {
            event.stopPropagation();
            onClickBack();
          }}
        />
      </ButtonBack>
      {isEdit ? (
        <Input
          ref={refInput}
          type="text"
          value={newTitle}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => setNewTitle(event.target.value)}
          onBlur={() => onApplyTitle(newTitle)}
          onKeyDown={(event) => {
            switch (event.keyCode) {
              case 13: // Enter is pressed
              case 27: // Escape is pressed
                onApplyTitle(newTitle);
                break;

              default:
                break;
            }
          }}
        />
      ) : (
        <Title
          onClick={(event) => {
            event.stopPropagation();
            onClickTitle();
          }}
        >
          {title}
        </Title>
      )}
      <StyledButton
        label={<IconDelete icon={faTrash} />}
        color="#5cb5fa"
        onClick={(event) => {
          event.stopPropagation();
          onClickDelete();
        }}
      />
    </Container>
  );
};

Header.propTypes = {
  refInput: PropTypes.any,
  title: PropTypes.string,
  isEdit: PropTypes.bool,
  onApplyTitle: PropTypes.func,
  onClickBack: PropTypes.func,
  onClickTitle: PropTypes.func,
  onClickDelete: PropTypes.func,
};

export default Header;
