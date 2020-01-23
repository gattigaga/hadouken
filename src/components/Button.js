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

  &:disabled {
    background: #eee;
    color: #aaa;
  }
`;

const Button = ({ className, label, color, onClick, isDisabled }) => (
  <Content
    className={className}
    color={color}
    onClick={onClick}
    disabled={isDisabled}
  >
    {label}
  </Content>
);

Button.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool
};

Button.defaultProps = {
  color: "#2ecc71"
};

export default Button;
