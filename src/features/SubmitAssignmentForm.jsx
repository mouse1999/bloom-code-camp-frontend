import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SubmitAssignmentForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const assignment =  { id: 1, name: 'Math Homework', dueDate: '2023-06-15', isSubmitted: false }//state?.assignment;
  
  const [formData, setFormData] = useState({
    githubUrl: '',
    branch: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.githubUrl.trim()) {
      newErrors.githubUrl = 'GitHub URL is required';
    } else if (!/^https:\/\/github\.com\/.+\/.+/.test(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid GitHub repository URL';
    }
    if (!formData.branch.trim()) newErrors.branch = 'Branch name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      // Submission logic here
      navigate('/assignments', { state: { submissionSuccess: true } });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assignment) {
    return (
      <GlassPanel>
        <ErrorMessage>No assignment selected. Please go back and choose one.</ErrorMessage>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel>
      <FormHeader>
        <FormTitle>{assignment.name}</FormTitle>
        <FormSubtitle>Assignment #{assignment.id} • Due: {assignment.dueDate}</FormSubtitle>
      </FormHeader>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <InputLabel htmlFor="githubUrl">GitHub Repository</InputLabel>
          <InputField
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
            required
            $hasError={!!errors.githubUrl}
          />
          {errors.githubUrl && <ErrorText>{errors.githubUrl}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <InputLabel htmlFor="branch">Branch Name</InputLabel>
          <InputField
            type="text"
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="main"
            required
            $hasError={!!errors.branch}
          />
          {errors.branch && <ErrorText>{errors.branch}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <InputLabel htmlFor="notes">
            Notes <OptionalText>(Optional)</OptionalText>
          </InputLabel>
          <TextAreaField
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional context for the reviewer..."
            rows="4"
          />
        </FormGroup>

        <ButtonGroup>
          <SecondaryAction type="button" onClick={() => navigate(-1)}>
            Cancel
          </SecondaryAction>
          <PrimaryAction type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </PrimaryAction>
        </ButtonGroup>
      </form>
    </GlassPanel>
  );
};

// Styled Components
const GlassPanel = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const FormTitle = styled.h1`
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const FormSubtitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const OptionalText = styled.span`
  color: #9ca3af;
  font-weight: normal;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background-color: rgba(255, 255, 255, 0.7);

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextAreaField = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  transition: all 0.2s;
  background-color: rgba(255, 255, 255, 0.7);
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const BaseButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

const SecondaryAction = styled(BaseButton)`
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;

  &:hover {
    background: #f3f4f6;
  }
`;

const PrimaryAction = styled(BaseButton)`
  background: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #93c5fd;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #ef4444;
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
`;

export default SubmitAssignmentForm;