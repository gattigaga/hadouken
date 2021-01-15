import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 140px;
  background: #3498db;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 16px;

  @media screen and (min-width: 800px) {
    height: 128px;
  }
`;

const Name = styled.p`
  font-family: "Roboto";
  font-weight: bold;
  font-size: 22px;
  word-break: break-word;
  color: white;
  margin: 0px;
  line-height: 1.5em;

  @media screen and (min-width: 800px) {
    font-size: 18px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Board = ({ name, to }) => {
  const isExcerptNeeded = name.length > 50;
  const excerpt = isExcerptNeeded ? name.slice(0, 50) + "..." : name;

  return (
    <StyledLink to={to}>
      <Container>
        <Name>{excerpt}</Name>
      </Container>
    </StyledLink>
  );
};

Board.propTypes = {
  name: PropTypes.string,
  to: PropTypes.string,
};

export default Board;
