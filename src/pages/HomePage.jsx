import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomePage = () => {
  return (
    <HomeWrapper>
      <Hero>
        <Title>Welcome to <span>BloomCode Camp</span></Title>
        <Subtitle>Your journey to becoming a software developer starts here!</Subtitle>
        <Description>
          Explore our courses, connect with mentors, and build your future.
        </Description>
        <ButtonGroup>
          <StyledLink to="/register" $primary>Get Started</StyledLink>
          <StyledLink to="/login">Login</StyledLink>
        </ButtonGroup>
      </Hero>
      <Wave />
    </HomeWrapper>
  );
};

export default HomePage;

// Styled Components

const HomeWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Hero = styled.div`
  background: rgba(255,255,255,0.95);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(67, 97, 238, 0.08);
  padding: 3rem 3.5rem 2.5rem 3.5rem;
  text-align: center;
  margin-top: 4rem;
  z-index: 2;

  @media (max-width: 600px) {
    padding: 2rem 1rem 1.5rem 1rem;
    margin-top: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.7rem;
  font-weight: 800;
  color: #22223b;
  margin-bottom: 1.2rem;
  letter-spacing: -0.03em;

  span {
    color: #4361ee;
    background: linear-gradient(90deg, #4361ee 60%, #3a86ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 600px) {
    font-size: 1.7rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #3a0ca3;
  font-weight: 600;
  margin-bottom: 0.7rem;

  @media (max-width: 600px) {
    font-size: 1.05rem;
  }
`;

const Description = styled.p`
  color: #495057;
  font-size: 1.05rem;
  margin-bottom: 2.2rem;

  @media (max-width: 600px) {
    font-size: 0.97rem;
    margin-bottom: 1.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  margin-top: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.7rem;
    width: 100%;
  }
`;

const StyledLink = styled(Link)`
  padding: 0.85rem 2.2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  outline: none;
  background: ${({ $primary }) =>
    $primary
      ? 'linear-gradient(90deg, #4361ee 60%, #3a86ff 100%)'
      : '#f1f3f8'};
  color: ${({ $primary }) => ($primary ? '#fff' : '#4361ee')};
  box-shadow: ${({ $primary }) =>
    $primary ? '0 4px 16px rgba(67,97,238,0.13)' : 'none'};
  letter-spacing: 0.01em;
  cursor: pointer;

  &:hover, &:focus {
    background: ${({ $primary }) =>
      $primary
        ? 'linear-gradient(90deg, #3a86ff 60%, #4361ee 100%)'
        : '#e0e7ff'};
    color: ${({ $primary }) => ($primary ? '#fff' : '#22223b')};
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 6px 20px rgba(67,97,238,0.15);
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 1rem;
    padding: 0.8rem 1.2rem;
  }
`;

const Wave = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 120px;
  background: url('data:image/svg+xml;utf8,<svg width="100%" height="120" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 60L60 65C120 70 240 80 360 80C480 80 600 70 720 60C840 50 960 40 1080 50C1200 60 1320 90 1380 105L1440 120V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V60Z" fill="%234361ee" fill-opacity="0.13"/></svg>');
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 1;
  width: 100%;
  pointer-events: none;
  @media (max-width: 600px) {
    height: 60px;
  }
`;