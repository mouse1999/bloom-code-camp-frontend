import React from 'react';
import styled from 'styled-components';


const SpinnerContainer = styled.div`
  display: ${props => (props.isLoading ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingSpinner = ({ isLoading }) => {
  return (
    <SpinnerContainer isLoading={isLoading}>
      <Spinner />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;