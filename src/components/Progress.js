import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const Value = styled.p`
  font-family: "Roboto";
  font-size: 12px;
  color: #777;
  margin: 0px;
  margin-right: 16px;
`;

const Meter = styled.progress`
  appearance: none;
  width: 100%;
  height: 8px;

  &::-webkit-progress-bar {
    background: #ddd;
    border-radius: 8px;
  }

  &::-webkit-progress-value {
    background: ${({ color }) => color};
    border-radius: 8px;
  }
`;

const Progress = ({ value }) => (
  <Container>
    <Value>{value}%</Value>
    <Meter
      value={value}
      max={100}
      color={value === 100 ? "#2ecc71" : "#3498db"}
    />
  </Container>
);

Progress.propTypes = {
  value: PropTypes.number
};

export default Progress;
