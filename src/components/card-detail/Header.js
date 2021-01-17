import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faIdCard } from "@fortawesome/free-solid-svg-icons";
import chroma from "chroma-js";

const Container = styled.div`
  display: flex;
  margin-bottom: 24px;
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
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: 0px;
  margin-top: -4px;
  margin-right: -4px;
  background: none;
`;

const NameWrapper = styled.div`
  margin-left: 16px;
  margin-right: 32px;
  width: 100%;
`;

const Name = styled.h1`
  font-size: 24px;
  font-family: "Roboto";
  color: #777;
  margin: 0px;
`;

const GroupName = styled.p`
  font-size: 14px;
  font-family: "Roboto";
  color: #777;
  margin: 0px;
  margin-top: 8px;
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
  border: 2px solid ${chroma("#3498db").darken(0.6).hex()};
`;

const DeleteButton = styled.button`
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: 0px;
`;

const Header = ({
  refInput,
  title,
  groupName,
  isEdit,
  onApplyTitle,
  onClickTitle,
  onClickClose,
  onClickDelete,
}) => {
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  return (
    <Container>
      <CardIcon icon={faIdCard} />
      <NameWrapper>
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
          <Name
            onClick={(event) => {
              event.stopPropagation();
              onClickTitle();
            }}
          >
            {title}
          </Name>
        )}
        <GroupName>
          in group <strong>{groupName}</strong>{" "}
          <DeleteButton
            onClick={(event) => {
              event.stopPropagation();
              onClickDelete();
            }}
          >
            (Delete)
          </DeleteButton>
        </GroupName>
      </NameWrapper>
      <CloseButton onClick={onClickClose}>
        <CloseIcon icon={faTimes} />
      </CloseButton>
    </Container>
  );
};

Header.propTypes = {
  refInput: PropTypes.any,
  title: PropTypes.string,
  groupName: PropTypes.string,
  isEdit: PropTypes.bool,
  onApplyTitle: PropTypes.func,
  onClickTitle: PropTypes.func,
  onClickClose: PropTypes.func,
  onClickDelete: PropTypes.func,
};

export default Header;
