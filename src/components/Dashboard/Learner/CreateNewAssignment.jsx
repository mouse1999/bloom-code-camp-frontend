import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DashboardContainer, DashboardHeader, Title } from "./LearnersDashboard";
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    faArrowLeft,
    faPaperPlane
    
  } from '@fortawesome/free-solid-svg-icons';
  

const CreateNewAssignment = ({ assignmentEnumList = [
    { id: 1, name: "Spring Boot Assignment" },
    { id: 2, name: "JavaScript Project"},
    { id: 3, name: "Python Scripting" }
  ]}) => {

  
  const [formData, setFormData] = useState({
    githubUrl: '',
    branch: '',
    notes: ''
  });

  const [assignmentToBeSubmitted, setAssignmentToBeSubmitted] = useState(null);
  const [isAlreadyDone, setIsAlreadyDone] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // the below function will 
  const handleSelect = async (item) => {
    

    // 'item' here will be the string like "spring boot", "javascript", or "Python"
    const isDone = true; //await doneAssignment(item);
  
    if (!isDone) {
      // You might want to update your `assignmentToBeSubmitted` state to be an object
      // with more details if you intend to display `assignmentToBeSubmitted.name`
      // and `assignmentToBeSubmitted.id` later.
      // For now, it will just store the string.
      setAssignmentToBeSubmitted(item);
      setIsAlreadyDone(false); // Reset this when a new selection is made
    } else  {
      setIsAlreadyDone(true);
      setAssignmentToBeSubmitted(item); // Optionally clear if already done
    }

    if(item === "") {
        setIsAlreadyDone(false);
    }
  };

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


    return(
<DashboardContainer>
    <DashboardHeader>
        <Title>
            Create New Assignment
            
        </Title>
        
    </DashboardHeader>
    


  <GlassPanel>
      <FormHeader>
        {
        assignmentToBeSubmitted === null || assignmentToBeSubmitted === ""? (
            <GlassPanel>
                  <ErrorMessage>No assignment selected. Please choose one.</ErrorMessage>
            </GlassPanel>
        ) :
        (
        <>
            <FormTitle>{assignmentToBeSubmitted}</FormTitle>
            <FormSubtitle>{assignmentToBeSubmitted} </FormSubtitle>
        </>
        )
        }

        {
            isAlreadyDone &&  (
                <GlassPanel>
                  <ErrorMessage> This assignment is already selected. Please choose another one.</ErrorMessage>
                </GlassPanel>
            )
        }
      </FormHeader>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <AssignmentLabel htmlFor="assignment-number">Assignment Number</AssignmentLabel>
          <AssignmentSelect id="assignment-number"
            onChange={(e) => handleSelect(e.target.value)} // Attach onChange here
            
           

          >
            <option value="">Choose Assignment</option>
            {assignmentEnumList.map((item) => (
              <option 
              key={item.id} 
              value={item.name}
        
              >
                {item.name}
              </option>
            ))}
          </AssignmentSelect>
        </FormGroup>

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
          
          <ActionButton disabled={isSubmitting}  >
                <FontAwesomeIcon icon={faPaperPlane} />
                {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </ActionButton>
        </ButtonGroup>
      </form>
    </GlassPanel>
</DashboardContainer>
        
    );



}


const GlassPanel = styled.div`
  background: rgba(255, 255, 255, 0.9); 
  /* backdrop-filter: blur(10px); */
  border-radius: 12px;
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); */
  /* height: 50%vh; */
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  color: #212529;
  font-weight: 600;
`;

const FormSubtitle = styled.p`
  margin: 0.5rem 0 0;
  color: #6c757d;
  font-size: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const AssignmentLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #343a40;
  font-size: 0.95rem;
`;

const AssignmentSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #4a6fa5;
    box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.2);
  }
     option:checked {
    background-color: #bcbcbc;
    color: white;
  }



`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #343a40;
  font-size: 0.95rem;
`;

const InputField = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.$hasError ? '#dc3545' : '#ced4da'};
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#dc3545' : '#4a6fa5'};
    box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(220, 53, 69, 0.2)' : 'rgba(74, 111, 165, 0.2)'};
  }
`;

const TextAreaField = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #4a6fa5;
    box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.2);
  }
`;

const ErrorText = styled.span`
  display: block;
  margin-top: 0.5rem;
  color: #dc3545;
  font-size: 0.85rem;
`;

const OptionalText = styled.span`
  color: #6c757d;
  font-weight: normal;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
`;

const BaseButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`;

const PrimaryAction = styled(BaseButton)`
  background-color: #4a6fa5;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: #3a5a80;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const SecondaryAction = styled(BaseButton)`
  background-color: transparent;
  border: 1px solid #4a6fa5;
  color: #4a6fa5;
  
  &:hover {
    background-color: rgba(74, 111, 165, 0.1);

  }
`;
const ErrorMessage = styled.div`
padding: 0.5rem;
text-align: center;
color: #ef4444;
background: rgba(239, 68, 68, 0.1);
border-radius: 8px;
`;



const BackLink = styled.a`
  display: inline-block;
  margin-bottom: 2rem;
  color: #4a6fa5;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
  
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.770rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4361ee;
  color: white;
  border: none; 
    
&:hover:not(:disabled) {
    background-color: #3a56d9;
  }
  
  &:disabled {
    background-color:#3a56d9;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default CreateNewAssignment