import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Container = styled.div`
  margin-top: 36px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Icon = styled(FontAwesomeIcon)`
  color: #777;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 18px;
  font-family: "Roboto";
  color: #777;
  margin: 0px;
  margin-left: 16px;
`;

const Section = ({ icon, title, children }) => (
  <Container>
    <Header>
      <Icon icon={icon} />
      <Title>{title}</Title>
    </Header>
    {children}
  </Container>
);

Section.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Section;
