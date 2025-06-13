import AssignmentForm from "../../layout/AssignmentForm";


import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faCheckCircle,
  faExclamationCircle,
  faEdit,
  faPaperPlane,
  faEye,
  faRedo,
  faHandHolding,
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';

const AssignmentCard = ({
  id, // <--- NEW: Add id prop here
  title,
  status,
  course,
  branch,
  description,
  progress,
  submittedDate,
  feedback,
  learnersName,
  reviewersName,
  reviewDate,
  involved, // 'learner' or 'reviewer'
  // <--- NEW: Add action handler props here
  onEditClick,
  onSubmitClick,
  onViewClick,
  onResubmitClick,
  onClaimClick,
  onReclaimClick,
  // Add any other specific action handlers you might need
}) => {

  // Helper to check if a reviewer has claimed this assignment
  const isReviewerClaimed = reviewersName && reviewersName.trim() !== '';

  return (
    <AssignmentFormContainer>
      <CardHeader>
        <CardTitle> {title}</CardTitle>

        {/* PENDING_SUBMISSION("Pending Submission", 1),
    SUBMITTED("Submitted", 2),
    IN_REVIEW("In Review", 3),
    NEEDS_UPDATE("Needs Update", 4),
    COMPLETED("Completed", 5),
    RESUBMITTED */}

        <StatusBadge status={status}>
          {status === 'Pending Submission' && <FontAwesomeIcon icon={faClock} />}
          {status === 'Submitted' && <FontAwesomeIcon icon={faExclamationCircle} />}
          {status === 'In Review' && <FontAwesomeIcon icon={faClock} />}
          {status === 'Completed' && <FontAwesomeIcon icon={faCheckCircle} />}
          {status === 'Needs Update' && <FontAwesomeIcon icon={faExclamationCircle} />}
          {status === 'Resubmitted' && <FontAwesomeIcon icon={faExclamationCircle} />}
          {status}
        </StatusBadge>
      </CardHeader>

      <CardBody>
        <DetailRow>
          <DetailLabel>Course:</DetailLabel>
          <DetailValue>{course}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Branch:</DetailLabel>
          <DetailValue>{branch}</DetailValue>
        </DetailRow>

        {description && (
          <DetailRow>
            <DetailLabel>Description:</DetailLabel>
            <DetailValue>{description}</DetailValue>
          </DetailRow>
        )}

        {involved === 'learner' && progress && (
          <ProgressContainer>
            <ProgressLabel>
              <span>Progress</span>
              <span>{progress}%</span>
            </ProgressLabel>
            <ProgressBar>
              <ProgressFill progress={progress} />
            </ProgressBar>
          </ProgressContainer>
        )}

        {submittedDate && (
          <DetailRow>
            <DetailLabel>Submitted:</DetailLabel>
            <DetailValue>{submittedDate}</DetailValue>
          </DetailRow>
        )}

        {feedback && (
          <DetailRow>
            <DetailLabel>Feedback:</DetailLabel>
            <DetailValue
              style={{
                color: status === 'Submitted' ? '#ff9800' : undefined,
                fontWeight: 600
              }}
            >
              {feedback}
            </DetailValue>
          </DetailRow>
        )}

        {reviewDate && (
          <DetailRow>
            <DetailLabel>Reviewed Date:</DetailLabel>
            <DetailValue>{reviewDate}</DetailValue>
          </DetailRow>
        )}

        {reviewersName && (
          <DetailRow>
            <DetailLabel>Reviewer:</DetailLabel>
            <DetailValue>{reviewersName}</DetailValue>
          </DetailRow>
        )}
      </CardBody>

      <CardFooter>
        <BranchInfo>
          <span>Branch:</span>
          <code>{branch}</code>
        </BranchInfo>

        <CardAction>
          {involved === 'learner' && (
            <>
              {status === 'Pending Submission' && (
                <>
                  <ActionButton outline onClick={() => onEditClick(id)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </ActionButton>
                  <ActionButton primary onClick={() => onSubmitClick(id)}>
                    <FontAwesomeIcon icon={faPaperPlane} /> Submit
                  </ActionButton>
                </>
              )}
              {(status === 'Submitted' || status === 'Completed' || status === 'Resubmitted') && (
                <ActionButton outline onClick={() => onViewClick(id)}>
                  <FontAwesomeIcon icon={faEye} /> View
                </ActionButton>
              )}
              

              {(status === 'In Review') && (
                <ActionButton outline onClick={() => onViewClick(id)}>
                  <FontAwesomeIcon icon={faEye} /> View
                </ActionButton>
              )}



              {status === 'Needs Update' && (
                <>
                  <ActionButton outline onClick={() => onEditClick(id)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </ActionButton>
                  <ActionButton secondary onClick={() => onResubmitClick(id)}>
                    <FontAwesomeIcon icon={faRedo} /> Resubmit
                  </ActionButton>
                </>
              )}
            </>
          )}

          {involved === 'reviewer' && (
            <>
              {status === 'Submitted' && !isReviewerClaimed && (
                <ActionButton primary onClick={() => onClaimClick(id)}>
                  <FontAwesomeIcon icon={faHandHolding} /> Claim
                </ActionButton>
              )}

              

              {status === 'Needs Update' &&  (
                // Reclaim when rejected and already claimed by reviewer
                <ActionButton secondary onClick={() => onReclaimClick(id)}>
                  <FontAwesomeIcon icon={faExchangeAlt} /> Reclaim
                </ActionButton>
              )}

              {status === 'Submitted' && isReviewerClaimed && (
                // Submitted and claimed by this reviewer (show review/view)
                <ActionButton outline onClick={() => onViewClick(id)}> {/* Or onReviewClick(id) */}
                  <FontAwesomeIcon icon={faEye} /> View {/* Or faClipboardCheck for Review */}
                </ActionButton>
              )}

              {status === 'In Review' &&  (
                <ActionButton outline onClick={() => onEditClick(id)}>
                <FontAwesomeIcon icon={faEdit} /> Edit
              </ActionButton>

              )


              }

              

              {status === 'Completed' && (
                <ActionButton outline onClick={() => onViewClick(id)}>
                  <FontAwesomeIcon icon={faEye} /> View
                </ActionButton>
              )}
            </>
          )}
        </CardAction>
      </CardFooter>
    </AssignmentFormContainer>
  );
};


// Styled Components
const AssignmentFormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #212529;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  background-color: ${({ status }) => {
    switch(status) {
      case 'Pending Submission': return 'rgba(243, 156, 18, 0.1)';
      case 'Submitted': return 'rgba(52, 152, 219, 0.1)';
      case 'Completed': return 'rgba(46, 204, 113, 0.1)';
      case 'Needs Update': return 'rgba(231, 76, 60, 0.1)';
      case 'In Review': return 'rgba(231, 76, 60, 0.1)';
      case 'Resubmitted': return 'rgba(52, 152, 219, 0.1)';    
      

      default: return '#f1f3f5';
    }
  }};
  
  color: ${({ status }) => {
    switch(status) {
      case 'Pending Submission': return '#f39c12';
      case 'Submitted': return '#3498db';
      case 'Completed': return '#2ecc71';
      case 'Needs Update': return '#e74c3c';
      case 'In Review': return '';
      case 'Resubmitted': return ''; 
      default: return '#495057';
    }
  }};
`;

const CardBody = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

const DetailLabel = styled.span`
  font-weight: 800;
  margin-right: 0.5rem;
  font-size: 0.85rem;
  color: #666;
  min-width: 80px;
`;

const DetailValue = styled.span`
  font-size: 0.85rem; /* Standard readable text size */
  color: #333; /* Darker grey for good contrast */
  font-weight: 40; /* Regular weight, easy on the eyes */
  line-height: 1.5; /* Good spacing for readability */
  /* If it's part of a key-value pair, you might want some margin */
  margin-left: 0.5rem; /* Space from a preceding label */

  font-family: 'Inter', sans-serif; /* Primary font

`;

const ProgressContainer = styled.div`
  margin: 1.5rem 0;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #666;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, #4361ee, #4cc9f0);
  width: ${({ progress }) => progress}%;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const BranchInfo = styled.div`
  font-size: 0.75rem;
  color: #666;
  
  code {
    background-color: #f8f9fa;
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
    margin-left: 0.5rem;
    font-family: monospace;
    color: #495057;
  }
`;

const CardAction = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
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
  
  ${({ primary, outline, secondary }) => {
    if (primary) {
      return `
        background-color: #4361ee;
        color: white;
        border: none;
        
        &:hover {
          background-color: #3a56d9;
        }
      `;
    } else if (outline) {
      return `
        background-color: transparent;
        border: 1px solid #4361ee;
        color: #4361ee;
        
        &:hover {
          background-color: rgba(67, 97, 238, 0.1);
        }
      `;
    } else if(secondary) {
      return `
        background-color: #c71818;
        border: 1px solid #4361ee;
        color: white;
        
        &:hover {
          background-color: rgba(249, 12, 12, 0.5);
        }
      
      
      `
    }
  }}
`;

export default AssignmentCard;