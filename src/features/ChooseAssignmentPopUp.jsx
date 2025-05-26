import React from 'react'


import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ChooseAssignmentPopUp = ({ assignments, onClose, onSubmit, onChoose }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const navigate = useNavigate();

  // Check if assignment is already submitted
  const checkSubmissionStatus = (assignmentId) => {
    // Replace with actual API call or logic
    const isSubmitted = assignments.find(a => a.id === assignmentId)?.isSubmitted;
    setSubmissionStatus(isSubmitted ? 'already-submitted' : null);
  };



  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment);
    checkSubmissionStatus(assignment.id);
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) return;

    setIsSubmitting(true);
    try {
        //changes

        onChoose();
        navigate('/dashbord', { state: { from: "login" } });
        
      await onSubmit(selectedAssignment.id); // this waits on the logic of onSubmit in the parent component
    
    } catch (error) {
      setSubmissionStatus('error');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PopUpContainer>
      <PopUpContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Select Assignment to work on</Title>
        
        <AssignmentList>
          {assignments.map(assignment => (
            <AssignmentItem 
              key={assignment.id}
              onClick={() => handleAssignmentSelect(assignment)}
              selected={selectedAssignment?.id === assignment.id}
            >
              <AssignmentName>{assignment.name}</AssignmentName>
              <AssignmentDetails>
                <span>Due: {assignment.dueDate}</span>
                {assignment.isSubmitted && (
                  <SubmittedBadge>Submitted</SubmittedBadge>
                )}
              </AssignmentDetails>
            </AssignmentItem>
          ))}
        </AssignmentList>

        {selectedAssignment && (
          <ConfirmationSection>
            {submissionStatus === 'already-submitted' ? (
              <Message type="warning">
                This assignment has already been submitted.
              </Message>
            ) 
            : submissionStatus === 'error' ? (
              <Message type="error">
                Submission failed. Please try again.
              </Message>
            ) : (
              <>
                <ConfirmationText>
                  Do you want to work on <strong>{selectedAssignment.name}</strong>?
                </ConfirmationText>
                <ActionButtons>
                  <CancelButton onClick={onClose}>Cancel</CancelButton>
                  <SubmitButton 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Loading...' : 'Yes, I do'}
                  </SubmitButton>
                </ActionButtons>
              </>
            )}
          </ConfirmationSection>
        )}
      </PopUpContent>
    </PopUpContainer>
  );
};

// Styled Components
const PopUpContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopUpContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  padding: 4px;
  line-height: 1;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5rem;
`;

const AssignmentList = styled.div`
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 6px;
`;

const AssignmentItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  background-color: ${props => props.selected ? '#f0f7ff' : 'white'};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.selected ? '#e0f0ff' : '#f9f9f9'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const AssignmentName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const AssignmentDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #666;
`;

const SubmittedBadge = styled.span`
  background-color: #e6f7e6;
  color: #2e7d32;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
`;

const ConfirmationSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const ConfirmationText = styled.p`
  margin-bottom: 20px;
  font-size: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

const CancelButton = styled(Button)`
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;

  &:hover {
    background-color: #eaeaea;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #3f51b5;
  border: 1px solid #3f51b5;
  color: white;

  &:hover {
    background-color: #303f9f;
  }

  &:disabled {
    background-color: #9fa8da;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  background-color: ${props => 
    props.type === 'success' ? '#e6f7e6' :
    props.type === 'error' ? '#ffebee' :
    '#fff8e1'};
  color: ${props => 
    props.type === 'success' ? '#2e7d32' :
    props.type === 'error' ? '#c62828' :
    '#f57f17'};
  border-left: 4px solid ${props => 
    props.type === 'success' ? '#4caf50' :
    props.type === 'error' ? '#d32f2f' :
    '#ffc107'};
`;



export default ChooseAssignmentPopUp;