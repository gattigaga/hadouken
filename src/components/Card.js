import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  border-radius: 4px;
  border-bottom: 1px solid #ccc;
  padding: 12px 8px;
  background: white;
  box-sizing: border-box;
  margin-bottom: 8px;

  &:hover {
    background: #f5f5f5;
  }
`;

const Text = styled.p`
  font-family: "Roboto";
  font-size: 14px;
  color: #777;
  margin: 0px;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 14px;
`;

const IconDescription = styled(Icon)`
  margin-right: 14px;
`;

const IconWrapper = styled.div`
  display: flex;
  height: 28px;
  align-items: center;
  margin-top: 8px;
  padding: 0px 4px;
`;

const IconCheckWrapper = styled.div`
  background: ${({ isCompleted }) => (isCompleted ? "#2ecc71" : "none")};
  display: flex;
  align-items: center;
  padding: 6px;
  margin-left: -4px;
  border-radius: 4px;
`;

const CheckValue = styled(Text)`
  margin-left: 6px;
  margin-bottom: -2px;
  font-size: 12px;
  color: ${({ color }) => color || "#777"};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Card = ({
  id,
  index,
  name,
  to,
  totalChecked,
  maxChecklist,
  hasDescription,
  hasChecklist,
}) => {
  const isCompleted = totalChecked === maxChecklist;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <StyledLink to={to}>
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Text>{name}</Text>
            {(hasDescription || hasChecklist) && (
              <IconWrapper>
                {hasDescription && (
                  <IconDescription icon={faList} color="#777" />
                )}
                {hasChecklist && (
                  <IconCheckWrapper isCompleted={isCompleted}>
                    <Icon
                      icon={faCheckSquare}
                      color={isCompleted ? "white" : "#777"}
                    />
                    <CheckValue color={isCompleted ? "white" : "#777"}>
                      {totalChecked}/{maxChecklist}
                    </CheckValue>
                  </IconCheckWrapper>
                )}
              </IconWrapper>
            )}
          </Container>
        </StyledLink>
      )}
    </Draggable>
  );
};

Card.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
  name: PropTypes.string,
  to: PropTypes.string,
  totalChecked: PropTypes.number,
  maxChecklist: PropTypes.number,
  hasDescription: PropTypes.bool,
  hasChecklist: PropTypes.bool,
};

export default Card;
