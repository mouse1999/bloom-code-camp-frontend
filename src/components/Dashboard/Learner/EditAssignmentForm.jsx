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
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BackLinkToDashboard from "../../ui/BackLinkToDashboard"; // Ensure this path is correct

// Reusing common styled components from LearnersDashboard or a shared UI library
import { DashboardContainer, DashboardHeader, Title } from "./LearnersDashboard"; 

/**
 * EditAssignmentForm Component
 * A form dedicated for learners to edit details of an existing assignment submission.
 * It dynamically fetches assignment details based on an 'assignmentId' from URL params.
 */
const EditAssignmentForm = () => { // Renamed component
    const navigate = useNavigate();
    const { assignmentId } = useParams(); // Get assignmentId from URL parameters

    const [formData, setFormData] = useState({
        githubUrl: '',
        branch: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState(null); // For success/error messages
    const [errors, setErrors] = useState({});
    const [fetchedAssignment, setFetchedAssignment] = useState(null);
    const [isLoadingSubmission, setIsLoadingSubmission] = useState(true); // Initial state set to true

    useEffect(() => {
        const fetchAnAssignment = async (id) => {
            // This component is strictly for editing, so an ID is always expected.
            if (!id) {
                setSubmissionMessage({ type: 'error', message: 'No assignment ID provided for editing.' });
                setIsLoadingSubmission(false);
                return;
            }

            setIsLoadingSubmission(true);
            try {
                const token = localStorage.getItem('jwt token');
                if (!token) {
                    setSubmissionMessage({ type: 'error', message: 'Authentication required. Please log in.' });
                    setIsLoadingSubmission(false);
                    return;
                }

                // API endpoint to fetch details of a specific submitted assignment by its ID
                const response = await axios.get(`http://localhost:8081/api/user/assignments/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });

                const fetchedData = response.data;
                setFetchedAssignment(fetchedData); // Store full fetched assignment details
                setFormData({ // Populate form fields with fetched data
                    githubUrl: fetchedData.githubUrl || '',
                    branch: fetchedData.branch || '',
                    notes: fetchedData.notes || ''
                });
                setSubmissionMessage(null); // Clear any previous messages
            } catch (error) {
                console.error('Error fetching assignment submission details:', error);
                let errorMessage = 'Failed to load existing assignment details. Please check the ID or your connection.';
                if (error.response) {
                    errorMessage = error.response.data.message || errorMessage;
                } else if (error.request) {
                    errorMessage = 'No response from server. Check your internet connection.';
                } else {
                    errorMessage = error.message;
                }
                setSubmissionMessage({ type: 'error', message: errorMessage });
                setFetchedAssignment(null); // Clear details if fetch fails
            } finally {
                setIsLoadingSubmission(false);
            }
        };

        fetchAnAssignment(assignmentId); // Call the fetch function when component mounts or assignmentId changes
    }, []); // Dependency array: re-run effect if assignmentId changes

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Validate form fields before submission
    const validate = () => {
        const newErrors = {};
        if (!formData.githubUrl.trim()) {
            newErrors.githubUrl = 'GitHub URL is required';
        } else if (!/^https:\/\/github\.com\/.+\/.+/.test(formData.githubUrl)) {
            newErrors.githubUrl = 'Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)';
        }
        if (!formData.branch.trim()) newErrors.branch = 'Branch name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission (now only for update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionMessage(null);

        if (!validate()) {
            setSubmissionMessage({ type: 'error', message: 'Please fix the errors in the form before submitting.' });
            return;
        }

        // Ensure an assignmentId is present and details are fetched for updating
        if (!assignmentId || !fetchedAssignment) {
            setSubmissionMessage({ type: 'error', message: 'Cannot update: Assignment details are missing or not loaded.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('jwt token');
            if (!token) {
                setSubmissionMessage({ type: 'error', message: 'Authentication required to update.' });
                setIsSubmitting(false);
                return;
            }

            
            await axios.post(`http://localhost:8081/api/user/assignments/${assignmentId}/submit`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSubmissionMessage({ type: 'success', message: 'Assignment updated successfully!' });
            
            // navigate('/learner'); 

        } catch (error) {
            console.error(`Error updating assignment:`, error);
            let errorMessage = `Failed to update the assignment. Please try again.`;
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = 'No response from server. Check your internet connection.';
            } else {
                errorMessage = error.message;
            }
            setSubmissionMessage({ type: 'error', message: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardContainer>
            <DashboardHeader>
                <Title>Edit Assignment</Title> {/* Static Title for Editing */}
            </DashboardHeader>

            <FormWrapper>
                

                <GlassPanel>
                    <BackLinkToDashboard/>
                    <FormHeader>
                        {isLoadingSubmission ? (
                            <InfoMessage $type="info">
                                <FontAwesomeIcon icon={faInfoCircle} /> Loading assignment details...
                            </InfoMessage>
                        ) : fetchedAssignment ? (
                            <>
                                {/* Display assignment details from fetchedAssignment */}
                                <FormTitle>{fetchedAssignment.assignmentName || fetchedAssignment.assignmentType || 'Unknown Assignment'}</FormTitle>
                                <FormSubtitle>Assignment Number: {fetchedAssignment.assignmentNumber || 'N/A'}</FormSubtitle>
                            </>
                        ) : (
                            <InfoMessage $type="error">
                                <FontAwesomeIcon icon={faExclamationTriangle} /> Assignment details could not be loaded. Please ensure a valid ID.
                            </InfoMessage>
                        )}
                    </FormHeader>

                    {submissionMessage && (
                        <MessageContainer $type={submissionMessage.type}>
                            <FontAwesomeIcon icon={
                                submissionMessage.type === 'success' ? faCheckCircle :
                                submissionMessage.type === 'error' ? faExclamationTriangle :
                                submissionMessage.type === 'warning' ? faExclamationTriangle :
                                faInfoCircle
                            } />
                            <span>{submissionMessage.message}</span>
                        </MessageContainer>
                    )}

                    <form onSubmit={handleSubmit}>
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
                                disabled={isSubmitting || isLoadingSubmission || !fetchedAssignment}
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
                                disabled={isSubmitting || isLoadingSubmission || !fetchedAssignment}
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
                                disabled={isSubmitting || isLoadingSubmission || !fetchedAssignment}
                            />
                        </FormGroup>

                        <ButtonGroup>
                            <SecondaryAction type="button" onClick={() => navigate(-1)}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Cancel
                            </SecondaryAction>

                            <PrimaryActionButton disabled={isSubmitting || isLoadingSubmission || !fetchedAssignment}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                                {isSubmitting ? 'Updating...' : 'Update Assignment'} {/* Always "Update" */}
                            </PrimaryActionButton>
                        </ButtonGroup>
                    </form>
                </GlassPanel>
            </FormWrapper>
        </DashboardContainer>
    );
};


export default EditAssignmentForm; // Export the renamed component

// --- Styled Components (Remaining unchanged for consistency) ---

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
    display: flex;
    align-items: center;
    gap: 0.5rem;


    &:hover:not(:disabled) {
        background-color: #ecf0f1;
        border-color: #7f8c8d;
        transform: translateY(-2px);
    }
`;

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
