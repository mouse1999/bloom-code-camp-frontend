import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faPaperPlane,
    faInfoCircle,
    faExclamationTriangle,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackLinkToDashboard from "../../ui/BackLinkToDashboard"; 


import { DashboardContainer, DashboardHeader, Title } from "./LearnersDashboard"; 

// --- Confirmation Modal 
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalMessage>{message}</ModalMessage>
        <ModalActions>
          <ModalButton onClick={onCancel} type="cancel">Cancel</ModalButton>
          <ModalButton onClick={onConfirm} type="confirm">Confirm</ModalButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};


const CreateNewAssignment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        assignmentNumber: '',
        githubUrl: '',
        branch: '',
        notes: ''
    });

    const [selectedAssignmentDetails, setSelectedAssignmentDetails] = useState(null);
    const [isAlreadyDone, setIsAlreadyDone] = useState(false);
    const [assignmentId, setAssignmentId] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState(null); 
    const [assignmentEnumList, setAssignmentEnumList] = useState([]);

    
    const [showSelectionConfirmationModal, setShowSelectionConfirmationModal] = useState(false);
    const [selectedAssignmentForConfirmation, setSelectedAssignmentForConfirmation] = useState(null);


    useEffect(() => {
        const fetchAssignmentEnumList = async () => {
            try {
                const token = localStorage.getItem('jwt token'); 
                if (!token) {
                    console.error('No authentication token found');
                    
                    setSubmissionMessage({ type: 'error', message: 'Authentication required. Please log in.' });
                    return;
                }
                
                const response = await axios.get('http://localhost:8081/api/assignments/enums', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                setAssignmentEnumList(response.data || []);
            } catch (error) {
                console.error('Error fetching assignment enum list:', error);
                let errorMessage = 'Error fetching assignments. Please try again.';
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    console.error('Error response status:', error.response.status);
                    errorMessage = error.response.data.message || errorMessage;
                } else if (error.request) {
                    console.error('No response received from server:', error.request);
                    errorMessage = 'No response from server. Check your internet connection.';
                } else {
                    console.error('Error setting up the request:', error.message);
                    errorMessage = error.message;
                }
                setSubmissionMessage({ type: 'error', message: errorMessage });
            }
        };
        fetchAssignmentEnumList();
    }, []);
    
    // Handler for when an option is selected from the dropdown
    const handleSelectChange = (e) => {
        const selectedNumber = e.target.value;
        const selectedItem = assignmentEnumList.find(item => String(item.assignmentNumber) === selectedNumber);
        
        if (selectedItem) {
            setSelectedAssignmentForConfirmation(selectedItem);
            setShowSelectionConfirmationModal(true);
        } else {
            // Reset when "Select Assignment" is chosen
            setSelectedAssignmentDetails(null);
            setFormData(prev => ({ ...prev, assignmentNumber: '' }));
            setIsAlreadyDone(false);
            setSubmissionMessage(null); // Clear any previous messages
        }
    };

    // Confirm the assignment selection and proceed with checks/creation
    const confirmAssignmentSelection = async () => {
        setShowSelectionConfirmationModal(false); // Close modal
        setSubmissionMessage(null); // Clear previous messages
    
        if (!selectedAssignmentForConfirmation) {
            console.error("No assignment selected for confirmation.");
            return;
        }

        const selectedItem = selectedAssignmentForConfirmation;
    
        try {
            const token = localStorage.getItem('jwt token');
            if (!token) {
                console.error('No authentication found');
                setSubmissionMessage({ type: 'error', message: 'Authentication required to proceed.' });
                return;
            }
    
            // Check if assignment is already done
            const isDone = await axios.get(`http://localhost:8081/api/user/assignments/${selectedItem.assignmentNumber}/status`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            }).then(response => response.data);
            
            if (!isDone) {
                setSelectedAssignmentDetails(selectedItem);
                setFormData(prev => ({ ...prev, assignmentNumber: selectedItem.assignmentNumber }));
                setIsAlreadyDone(false); // Reset this when a new selection is made
                
                // Attempt to create the assignment
                try {
                    const response = await axios.post(
                        'http://localhost:8081/api/assignments/create', 
                        { assignmentNumber: selectedItem.assignmentNumber },
                        {
                            headers: { 'Authorization': `Bearer ${token}` },
                            withCredentials: true,
                        }
                    );
                    setAssignmentId(response.data.id);
                    console.log(response.data);
                    setSubmissionMessage({ type: 'success', message: `Assignment ${selectedItem.assignmentName} selected and prepared for submission!` });
                } catch (error) {
                    console.error('Error creating assignment:', error);
                    let errorMessage = 'Failed to prepare assignment. Please try again.';
                    if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    }
                    setSubmissionMessage({ type: 'error', message: errorMessage });
                }
            } else {
                // If assignment is already done
                setIsAlreadyDone(true);
                setSelectedAssignmentDetails(selectedItem);
                setFormData(prev => ({ ...prev, assignmentNumber: selectedItem.assignmentNumber }));
                setSubmissionMessage({ type: 'warning', message: `This assignment ${selectedItem.assignmentName} has already been created by you.` });
            }
        } catch (error) { 
            console.error('Error during assignment selection process:', error);
            let errorMessage = 'An error occurred during selection. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = 'No response from server. Check your connection.';
            } else {
                errorMessage = error.message;
            }
            setSubmissionMessage({ type: 'error', message: errorMessage });
        } finally {
            setSelectedAssignmentForConfirmation(null); // Clear confirmation state
        }
    };

    
    const cancelAssignmentSelection = () => {
        setShowSelectionConfirmationModal(false);
        setSelectedAssignmentForConfirmation(null);
        
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
        if (!formData.assignmentNumber) {
            newErrors.assignmentNumber = 'Please select an assignment.';
        }
        if (!formData.githubUrl.trim()) {
            newErrors.githubUrl = 'GitHub URL is required';
        } else if (!/^https:\/\/github\.com\/.+\/.+/.test(formData.githubUrl)) {
            newErrors.githubUrl = 'Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)';
        }
        if (!formData.branch.trim()) newErrors.branch = 'Branch name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionMessage(null); // Clear previous messages
        if (!validate()) {
            setSubmissionMessage({ type: 'error', message: 'Please fix the errors in the form.' });
            return;
        }

        if (isAlreadyDone) {
            setSubmissionMessage({ type: 'error', message: `This assignment (${selectedAssignmentDetails?.assignmentName}) has already been submitted by you. You cannot submit it again.` });
            return;
        }

        if (!assignmentId) {
            setSubmissionMessage({ type: 'error', message: 'Please select and confirm an assignment before submitting.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(`http://localhost:8081/api/user/assignments/${assignmentId}/submit`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt token')}`
                }
            });

            setSubmissionMessage({ type: 'success', message: 'Assignment submitted successfully!' });
            setFormData({ githubUrl: '', branch: '', notes: '', assignmentNumber: formData.assignmentNumber }); 
            
        } catch (error) {
            console.error('Error submitting assignment:', error);
            let errorMessage = 'Failed to submit the assignment. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            setSubmissionMessage({ type: 'error', message: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardContainer>
            <DashboardHeader>
                <Title>Create New Assignment</Title>
            </DashboardHeader>

            <FormWrapper>
            

                <GlassPanel>
                    <BackLinkToDashboard/>
                    <FormHeader>
                        {selectedAssignmentDetails ? (
                            <>
                                <FormTitle>{selectedAssignmentDetails.assignmentName}</FormTitle>
                                <FormSubtitle>Assignment Number: {selectedAssignmentDetails.assignmentNumber}</FormSubtitle>
                            </>
                        ) : (
                            <InfoMessage $type="info">
                                <FontAwesomeIcon icon={faInfoCircle} /> Please select an assignment from the dropdown.
                            </InfoMessage>
                        )}
                    </FormHeader>

                    {submissionMessage && (
                        <MessageContainer $type={submissionMessage.type}>
                            <FontAwesomeIcon icon={
                                submissionMessage.type === 'success' ? faCheckCircle :
                                submissionMessage.type === 'error' ? faExclamationTriangle :
                                submissionMessage.type === 'warning' ? faExclamationTriangle : // Use warning icon for warning messages
                                faInfoCircle
                            } />
                            <span>{submissionMessage.message}</span>
                        </MessageContainer>
                    )}

                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <InputLabel htmlFor="assignment-select">Choose Assignment</InputLabel>
                            <AssignmentSelect
                                id="assignment-select"
                                name="assignmentNumber"
                                value={formData.assignmentNumber}
                                onChange={handleSelectChange} // Changed to handleSelectChange
                                $hasError={!!errors.assignmentNumber} // Corrected to assignmentNumber
                            >
                                <option value="">Select Assignment</option>
                                {assignmentEnumList.map((item) => (
                                    <option
                                        key={item.assignmentNumber}
                                        value={item.assignmentNumber}
                                    >
                                        {item.assignmentName}
                                    </option>
                                ))}
                            </AssignmentSelect>
                            {errors.assignmentNumber && <ErrorText>{errors.assignmentNumber}</ErrorText>} {/* Corrected error key */}
                        </FormGroup>

                        <FormGroup>
                            <InputLabel htmlFor="githubUrl">GitHub Repository URL</InputLabel>
                            <InputField
                                type="url"
                                id="githubUrl"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleChange}
                                placeholder="https://github.com/username/repo"
                                required
                                $hasError={!!errors.githubUrl}
                                disabled={!selectedAssignmentDetails} // Disable if no assignment selected
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
                                placeholder="main or develop"
                                required
                                $hasError={!!errors.branch}
                                disabled={!selectedAssignmentDetails} // Disable if no assignment selected
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
                                disabled={!selectedAssignmentDetails} // Disable if no assignment selected
                            />
                        </FormGroup>

                        <ButtonGroup>
                            <SecondaryAction type="button" onClick={() => navigate(-1)}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Cancel
                            </SecondaryAction>

                            <PrimaryActionButton disabled={isSubmitting || !selectedAssignmentDetails || isAlreadyDone}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                                {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                            </PrimaryActionButton>
                        </ButtonGroup>
                    </form>
                </GlassPanel>
            </FormWrapper>

            {/* Confirmation Modal for Assignment Selection */}
            {showSelectionConfirmationModal && (
                <ConfirmationModal
                    message={`Are you sure you want to select "${selectedAssignmentForConfirmation?.assignmentName}"? This will prepare it for submission.`}
                    onConfirm={confirmAssignmentSelection}
                    onCancel={cancelAssignmentSelection}
                />
            )}
        </DashboardContainer>
    );
};

export default CreateNewAssignment;

// --- Styled Components (Minimal changes) ---

const GlobalFont = `
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const GlassPanel = styled.div`
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(15px);
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    max-width: 700px;
    margin: auto; 
    border: 1px solid rgba(255, 255, 255, 0.3);
    ${GlobalFont}
`;

const FormWrapper = styled.div`
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
`;

const FormHeader = styled.div`
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    text-align: center;
`;

const FormTitle = styled.h2`
    margin: 0;
    font-size: 2.2rem;
    color: #2c3e50;
    font-weight: 700;
    letter-spacing: -0.03em;
    ${GlobalFont}
`;

const FormSubtitle = styled.p`
    margin: 0.75rem 0 0;
    color: #7f8c8d;
    font-size: 1.1rem;
    line-height: 1.5;
    ${GlobalFont}
`;

const FormGroup = styled.div`
    margin-bottom: 1.75rem;
`;

const InputLabel = styled.label`
    display: block;
    margin-bottom: 0.6rem;
    font-weight: 600;
    color: #34495e;
    font-size: 1rem;
    ${GlobalFont}
`;

const AssignmentSelect = styled.select`
    width: 100%;
    padding: 0.85rem 1.2rem;
    border: 1px solid ${props => props.$hasError ? '#e74c3c' : '#bdc3c7'};
    border-radius: 8px;
    font-size: 1rem;
    background-color: white;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237f8c8d'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1.2em;
    position: relative; 
    transition: all 0.2s ease-in-out;
    ${GlobalFont}

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
    }

    option {
        background-color: white;
        color: #34495e;
    }
`;

const InputField = styled.input`
    width: 100%;
    box-sizing: border-box;
    padding: 0.85rem 1.2rem;
    border: 1px solid ${props => props.$hasError ? '#e74c3c' : '#bdc3c7'};
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease-in-out;
    ${GlobalFont}

    &:focus {
        outline: none;
        border-color: ${props => props.$hasError ? '#e74c3c' : '#3498db'};
        box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(231, 76, 60, 0.3)' : 'rgba(52, 152, 219, 0.3)'};
    }

    &:disabled {
        background-color: #ecf0f1;
        cursor: not-allowed;
    }
`;

const TextAreaField = styled.textarea`
    width: 100%;
    padding: 0.85rem 1.2rem;
    box-sizing: border-box;
    border: 1px solid #bdc3c7;
    border-radius: 8px;
    font-size: 1rem;
    min-height: 100px;
    resize: vertical;
    transition: all 0.2s ease-in-out;
    ${GlobalFont}

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
    }

    &:disabled {
        background-color: #ecf0f1;
        cursor: not-allowed;
    }
`;

const ErrorText = styled.span`
    display: block;
    margin-top: 0.6rem;
    color: #e74c3c;
    font-size: 0.88rem;
    font-weight: 500;
    ${GlobalFont}
`;

const OptionalText = styled.span`
    color: #95a5a6;
    font-weight: normal;
    font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2.5rem;
`;

const BaseButton = styled.button`
    padding: 0.85rem 1.8rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    ${GlobalFont}

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const PrimaryActionButton = styled(BaseButton)`
    background-color: #3498db;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.6rem;

    &:hover:not(:disabled) {
        background-color: #2980b9;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
    }
`;

const SecondaryAction = styled(BaseButton)`
    background-color: transparent;
    border: 1px solid #95a5a6;
    color: #7f8c8d;
    display: flex; /* Added display flex to align icon */
    align-items: center; /* Added align-items center to align icon */
    gap: 0.5rem; /* Added gap for spacing between icon and text */


    &:hover:not(:disabled) {
        background-color: #ecf0f1;
        border-color: #7f8c8d;
        transform: translateY(-2px);
    }
`;

// New Styled Component for back button (assuming it's used elsewhere or for general styling)
const BackButton = styled.button`
    background: none;
    border: none;
    color: #3498db;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s ease-in-out;
    ${GlobalFont}
    font-weight: 500;

    &:hover {
        background-color: rgba(52, 152, 219, 0.1);
        color: #2980b9;
    }
`;

// New Styled Component for messages (Info, Warning, Error, Success)
const MessageContainer = styled.div`
    padding: 1rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-weight: 500;
    ${GlobalFont}

    ${props => props.$type === 'info' && `
        background-color: #e0f2f7;
        color: #2c7da0;
        border: 1px solid #a0d8e6;
    `}
    ${props => props.$type === 'warning' && `
        background-color: #fff9e6;
        color: #c99400;
        border: 1px solid #f8e178;
    `}
    ${props => props.$type === 'error' && `
        background-color: #fcebeb;
        color: #e74c3c;
        border: 1px solid #f2d7d5;
    `}
    ${props => props.$type === 'success' && `
        background-color: #e8f9e6;
        color: #27ae60;
        border: 1px solid #bceccb;
    `}

    svg {
        font-size: 1.2em;
    }
`;

const InfoMessage = styled(MessageContainer)`
   // Base styling handled by MessageContainer
`;

// --- Styled Components for Confirmation Modal (copied from previous response for consistency) ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const ModalMessage = styled.p`
  font-size: 1.15rem;
  margin-bottom: 1.8rem;
  color: #333;
  line-height: 1.5;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;

  ${props => props.type === 'confirm' && `
    background-color: #4361ee;
    color: white;
    &:hover {
      background-color: #3a56d9;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  `}

  ${props => props.type === 'cancel' && `
    background-color: #e0e0e0;
    color: #333;
    &:hover {
      background-color: #c9c9c9;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  `}
`;
