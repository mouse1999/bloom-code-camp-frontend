
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router-dom";
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
submittedDate,
title,
reviewedDate,
branch,
reviewer,
learner,
gitHubURL,
videoUrl,
status,
assignmentNumber, 
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
  const isReviewerClaimed = reviewer && reviewer.trim() !== '';
  const navigate = useNavigate();

  return (
    <AssignmentFormContainer>
      <CardHeader>
        <CardTitle> {title}</CardTitle>

      

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
      <DetailGrid>
        {/* {branch && (
          <DetailRow>
            <DetailLabel>Branch</DetailLabel>
            <DetailValue>{branch}</DetailValue>
          </DetailRow>
        )} */}

        {learner && involved === "reviewer" && (
          <DetailRow>
            <DetailLabel>Learner</DetailLabel>
            <DetailValue>{learner}</DetailValue>
          </DetailRow>
        )}

        {/* {gitHubURL && (
          <DetailRow>
            <DetailLabel>GitHub URL</DetailLabel>
            <DetailValue>{gitHubURL}</DetailValue>
          </DetailRow>
        )} */}

        {/* {videoUrl && (
          <DetailRow>
            <DetailLabel>Video URL</DetailLabel>
            <DetailValue>{videoUrl}</DetailValue>
          </DetailRow>
        )} */}

        {submittedDate && (
          <DetailRow>
            <DetailLabel>Submitted Date</DetailLabel>
            <DetailValue>{submittedDate}</DetailValue>
          </DetailRow>
        )}

        {reviewedDate && (
          <DetailRow>
            <DetailLabel>Reviewed Date</DetailLabel>
            <DetailValue>{reviewedDate}</DetailValue>
          </DetailRow>
        )}

        {reviewer && (
          <DetailRow>
            <DetailLabel>Reviewer</DetailLabel>
            <DetailValue>{reviewer}</DetailValue>
          </DetailRow>
        )}
      </DetailGrid>
</CardBody>
      <CardFooter>
        {
          branch && (
        <BranchInfo>
          <span>Branch:</span>
          <code>{branch}</code>
        </BranchInfo>
          )
        }

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
                  <ActionButton outline onClick={() => {navigate(`/learner/assignments/${id}/reject`)}}>
                    <FontAwesomeIcon icon={faEye} /> View
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
                <FontAwesomeIcon icon={faEdit} /> Check
              </ActionButton>

              )}

              {status === 'Completed' && (
                <ActionButton outline onClick={() => onViewClick(id)}>
                  <FontAwesomeIcon icon={faEye} /> View
                </ActionButton>
              )}

              {status === 'Resubmitted' && (
                <ActionButton secondary onClick={() => onReclaimClick(id)}>
                  <FontAwesomeIcon icon={faExchangeAlt} /> Reclaim
                </ActionButton>
              )}
            </>
          )}
        </CardAction>
      </CardFooter>
    </AssignmentFormContainer>
  );
};



const AssignmentFormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  max-width: 420px;
  width: 90%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
    max-width: 100%;
    min-width: 0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;

  @media (max-width: 480px) {
    // flex-direction: column;
    // align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.55rem;
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #212529;

  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  width: 6rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  background-color: ${({ status }) => {
    switch (status) {
      case 'Pending Submission': return 'rgba(243, 156, 18, 0.1)';
      case 'Submitted': return 'rgba(52, 152, 219, 0.1)';
      case 'Completed': return 'rgba(46, 204, 113, 0.1)';
      case 'Needs Update': return 'rgba(231, 76, 60, 0.1)';
      case 'In Review': return '#e5e7eb';
      case 'Resubmitted': return 'rgba(168, 85, 247, 0.13)';
      default: return '#f1f3f5';
    }
  }};

  color: ${({ status }) => {
    switch (status) {
      case 'Pending Submission': return '#f39c12';
      case 'Submitted': return '#3498db';
      case 'Completed': return '#2ecc71';
      case 'Needs Update': return '#e74c3c';
      case 'In Review': return '#111827';
      case 'Resubmitted': return '#a855f7';
      default: return '#495057';
    }
  }};

    @media (max-width: 480px) {
    font-size: 0.55rem;
  }
`;
const CardBody = styled.div`
  margin-bottom: 1.5rem;
  font-size: 0.85rem;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
    font-size: 0.65rem;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(100px, auto) 1fr;
  border-left: 1px solid #eaeaea;

  @media (max-width: 600px) {
    // grid-template-columns: 1fr;
    // border-left: none;
  }
`;

const DetailRow = styled.div`
  display: contents;

  &:not(:last-child) > * {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  color: #555;
  display: flex;
  align-items: center;
  border-right: 1px solid #eaeaea;
  background-color: #fafafa;

  @media (max-width: 600px) {
    border-right: none;
    background-color: #f6f6f6;
    font-size: 0.7rem
    padding-bottom: 0.5rem;
  }
`;

const DetailValue = styled.span`
  padding: 0.5rem 0.75rem;
  color: rgb(85, 64, 24);
  font-weight: 400;
  font-size: 0.8rem;
  line-height: 1.3;
  display: flex;
  align-items: center;
  word-break: break-word;

  @media (max-width: 600px) {
    border-right: none;
    background-color: #f6f6f6;
    font-size: 0.7rem;
    margin-left: 1px;
    padding-bottom: 0.5rem;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;

  @media (max-width: 480px) {
    // flex-direction: column;
    // align-items: stretch;
    gap: 0.7rem;
    padding-top: 0.7rem;
  }
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

   @media (max-width: 480px) {
   font-size: 0.65rem;
    gap: 0.7rem;
    padding-top: 0.7rem;
  }
`;

const CardAction = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  // flex-wrap: wrap;

  @media (max-width: 480px) {
    // flex-direction: column;
    // flex-wrap: none;
    gap: 0.5rem;
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
  min-width: 90px;

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
    } else if (secondary) {
      return `
        background-color: #c71818;
        border: 1px solid #4361ee;
        color: white;

        &:hover {
          background-color: rgba(249, 12, 12, 0.5);
        }
      `;
    }
  }}

  @media (max-width: 480px) {
    width: 90%;
    min-width: 0;
    font-size: 0.55rem;
    justify-content: center;
  }
`;

export default AssignmentCard;