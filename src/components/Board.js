import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 180px;
  height: 96px;
  background: #3498db;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px;
`;

const Name = styled.p`
  font-family: "Roboto";
  font-weight: bold;
  font-size: 16px;
  color: white;
  margin: 0px;
  line-height: 1.2em;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Board = ({ name, to }) => (
  <StyledLink to={to}>
    <Container>
      <Name>{name}</Name>
    </Container>
  </StyledLink>
);

Board.propTypes = {
  name: PropTypes.string,
  to: PropTypes.string,
};

export default Board;
