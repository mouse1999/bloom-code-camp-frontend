import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const LoginFormWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 640px) {
    padding: 1.5rem;
    margin: 1rem;
  }

  @media (max-width: 480px) {
    max-width: 22rem;
    padding: 1rem;
  }

  @media (max-width: 360px) {
    max-width: 18rem;
    padding: 0.5rem;
    margin: 0.5rem;
  }
`;

const LoginHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: inherit;
  text-align: center;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 550;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ForgotPasswordLink = styled.a`
  display: block;
  text-align: right;
  font-size: 0.875rem;
  color: #3b82f6;
  margin-top: 0.5rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
    
      const response = await axios.post(
          'http://localhost:8081/api/users/login',
          { username, password },
          {
              withCredentials: true, // Equivalent to credentials: 'include' for cookies
              headers: {
                  'Accept': 'application/json' 
              }
          }
      );

    
      const data = response.data;
      localStorage.setItem('jwt token', data.token); 

      navigate('/learner');

  } catch (err) {
      console.error('Login error:', err);

      if (err.response) {
          console.error('Error data:', err.response.data);
          console.error('Error status:', err.response.status);
          console.error('Error headers:', err.response.headers);
          setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else if (err.request) {
          console.error('Error request:', err.request);
          setError('No response from server. Please try again later.');
      } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', err.message);
          setError('An unexpected error occurred. ' + err.message);
      }
  } finally {
      setIsLoading(false); 
  }
  };

  return (
    <LoginContainer>
      <LoginFormWrapper>

        <LoginHeader>Login to Dashboard</LoginHeader>
        
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <InputLabel htmlFor="username">Username</InputLabel>
            <InputField
              id="username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Username"
              required
            />
          </InputGroup>

          <InputGroup>
            <InputLabel htmlFor="password">Password</InputLabel>
            <InputField
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
            />
            <ForgotPasswordLink href="/forgot-password">
              Forgot password?
            </ForgotPasswordLink>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </SubmitButton>
        </form>


      </LoginFormWrapper>
    </LoginContainer>
  );
}

export default LoginPage;