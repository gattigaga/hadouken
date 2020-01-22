import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import chroma from "chroma-js";

const Content = styled.button`
  padding: 8px 12px;
  border-radius: 4px;
  background: ${({ color }) => color};
  color: white;
  border: 0px;
  font-family: "Roboto";
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: ${({ color }) =>
      chroma(color)
        .brighten(0.3)
        .hex()};
  }
`;

const Button = ({ label, color, onClick }) => (
  <Content color={color} onClick={onClick}>
    {label}
  </Content>
);

Button.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func
};

Button.defaultProps = {
  color: "#2ecc71"
};

export default Button;
