import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.fullPage ? '100vh' : 'auto'};
  width: ${props => props.fullPage ? '100vw' : 'auto'};
  position: ${props => props.fullPage ? 'fixed' : 'relative'};
  top: 0;
  left: 0;
  background-color: ${props => props.fullPage ? 'rgba(255, 255, 255, 0.8)' : 'transparent'};
  z-index: ${props => props.fullPage ? 9999 : 'auto'};
`;

const Spinner = styled.div`
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  border: ${props => props.thickness || '5px'} solid ${props => props.color || '#f3f3f3'};
  border-top: ${props => props.thickness || '5px'} solid ${props => props.primaryColor || '#4361ee'};
  border-radius: 50%;
  animation: ${spin} ${props => props.speed || '1s'} linear infinite;
  margin: ${props => props.margin || '20px auto'};
`;

const LoadingText = styled.div`
  margin-top: 10px;
  color: ${props => props.textColor || '#333'};
  font-size: ${props => props.textSize || '14px'};
`;

const LoadingSpinner = ({
  fullPage,
  size,
  thickness,
  color,
  primaryColor,
  speed,
  margin,
  text,
  textColor,
  textSize,
  className
}) => {
  return (
    <SpinnerContainer fullPage={fullPage} className={className}>
      <div style={{ textAlign: 'center' }}>
        <Spinner 
          size={size}
          thickness={thickness}
          color={color}
          primaryColor={primaryColor}
          speed={speed}
          margin={margin}
        />
        {text && <LoadingText textColor={textColor} textSize={textSize}>{text}</LoadingText>}
      </div>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;