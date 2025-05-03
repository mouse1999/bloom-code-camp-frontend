import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #4CAF50;
  text-decoration: none;

  span {
    margin-left: 0.5rem;
    transition: transform 0.3s;
  }

  &:hover span {
    transform: scale(1.1);
  }
`;

const Logo = () => {
  return (
    <LogoContainer to="/">
      <span>🌱</span>
      <span>Bloom</span>
    </LogoContainer>
  );
};

export default Logo;