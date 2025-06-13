import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    confirmPassword: '',
    role: 'LEARNER'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Username must be at least 3 characters';
    }
    
    // if (!formData.email.trim()) {
    //   newErrors.email = 'Email is required';
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   newErrors.email = 'Please enter a valid email';
    // }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
        setPasswordMatch(false);
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      
      const { confirmPassword, ...registrationData } = formData;
      console.log(registrationData);

      const response = await axios.post('http://localhost:8081/api/users/register', registrationData);

      setIsRegistrationSuccessful(true);

      setTimeout(() => {
        console.log("Delay finished, navigating to login...");
        // Optionally, hide the success message after the delay if you want
        // setIsRegistrationSuccessful(false); 
        navigate('/login');
    },1000);



      console.log('Registration successful:', response.data);
  

    } catch (error) {
      console.error('Registration error:', error);
      // Axios errors have a `response` object if the server responded with an error status
      if (error.response) {

        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        setSubmitError(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setSubmitError('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setSubmitError(error.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
      


    }
  };

  return (
    <RegistrationContainer>
      <FormContainer>
        <Title>Registration Page</Title>
        
        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Username</Label>
            <Input
              name="userName"
              type="text"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter username"
              hasError={!!errors.userName}
            />
            {errors.username && <ErrorText>{errors.userName}</ErrorText>}
          </FormGroup>


          <FormGroup>
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              hasError={!!errors.password}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Confirm Password</Label>
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              hasError={!!errors.confirmPassword}
            />
            {!passwordMatch && <ErrorText>{errors.confirmPassword}</ErrorText>}
            
          </FormGroup>

          <FormGroup>
            <Label>Register As</Label>

            <RoleContainer>
              <RoleOption>
                <RadioInput
                  type="radio"
                  id="user-role"
                  name="role"
                  value="LEARNER"
                  checked={formData.role === 'LEARNER'}
                  onChange={handleChange}
                />
                <RoleLabel htmlFor="user-role" active={formData.role === 'LEARNER'}>
                  Learner
                </RoleLabel>
              </RoleOption>
              <RoleOption>
                <RadioInput
                  type="radio"
                  id="reviewer-role"
                  name="role"
                  value="REVIEWER"
                  checked={formData.role === 'REVIEWER'}
                  onChange={handleChange}
                />
                <RoleLabel htmlFor="reviewer-role" active={formData.role === 'REVIEWER'}>
                  Reviewer
                </RoleLabel>
              </RoleOption>
            </RoleContainer>
            {errors.role && <ErrorText>{errors.role}</ErrorText>}
          </FormGroup>

          {submitError && <SubmitError>{submitError}</SubmitError>}
          {isRegistrationSuccessful && <SuccessText>Registraton Successful</SuccessText>}

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </SubmitButton>

          <LoginLink>
            Already have an account? <Link to="/login">Login</Link>
          </LoginLink>
        </StyledForm>
      </FormContainer>
    </RegistrationContainer>
  );
};

// Styled Components (same as before)
const RegistrationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 95vh;
  background-color: #f8fafc;
  padding: 2rem;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  margin-bottom: 2rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: clamp(0.75rem, 3vw, 0.8rem);
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.025em;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 0.375rem;
   font-size: clamp(0.85rem, 3vw, 0.9rem);
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition: border-color 0.2s;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const RoleContainer = styled.div`
  display: flex;
  gap:0;
  margin-top: 0.5rem;
`;

const RoleOption = styled.div`
  display: flex;
  align-items: center;
`;

const RadioInput = styled.input`
  display: none;
`;

const RoleLabel = styled.label`
  padding: 0.5rem 1rem;
  /* border-radius: 0.375rem; */
  cursor: pointer;
  background-color: ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  color: ${props => props.active ? 'white' : '#64748b'};
  transition: all 0.2s;
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

const SubmitError = styled.div`
  color: #ef4444;
  text-align: center;
  font-size: 0.875rem;
`;

const LoginLink = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
`;

const SuccessText = styled.div`
color: #228B22 ;
  text-align: center;
  font-size: 0.875rem;

`;

export default RegistrationPage;