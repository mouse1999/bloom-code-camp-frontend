import styled from "styled-components";
import BackLinkToDashboard from "../components/common/BackLinkToDashboard";
import { DashboardContainer, DashboardHeader, Title } from "../components/Dashboard/Learner/LearnersDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AssignmentDetailItem from "../components/common/AssignmentDetailItem";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import {
  faCheckCircle,
  faClock,
  faExclamationCircle,
  faInfoCircle,
  faCodeBranch,
  faCommentDots, 
  faVideo,
  faHashtag,
  faCalendarAlt, 
  faUsers,
  faArrowLeft,
  faRedo
} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../components/common/LoadingSpinner";
import axios from "axios";

// Styled Components
const GlobalFont = `
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;
const RejectedAssignmentContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;

  @media (max-width: 900px) {
    max-width: 98vw;
    padding: 1.2rem;
  }
  @media (max-width: 600px) {
    padding: 0.7rem 0.2rem;
    border-radius: 0;
    box-shadow: none;
  }
`;
const SubmissionMessage = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  background: ${({ type }) =>
    type === 'success'
      ? 'linear-gradient(90deg, #e0ffe8 0%, #d1fae5 100%)'
      : 'linear-gradient(90deg, #fff0f0 0%, #ffe4e6 100%)'};
  color: ${({ type }) => (type === 'success' ? '#15803d' : '#b91c1c')};
  border: 1px solid
    ${({ type }) => (type === 'success' ? '#bbf7d0' : '#fecaca')};
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 600px) {
    font-size: 0.85rem;
    padding: 0.7rem 0.5rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding-bottom: 0.3rem;
  }
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1.25rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 600px) {
    font-size: 0.7rem;
    padding: 0.35rem 0.7rem;
    border-radius: 18px;
    gap: 0.3rem;
  }
`;

const SectionTitle = styled.div`
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: #212529;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 600px) {
    font-size: 1rem;
    margin-bottom: 0.7rem;
    gap: 0.4rem;
  }
`;

const AssignmentDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0.7rem;
    margin-bottom: 1.2rem;
  }
`;

const FeedbackContainer = styled.div`
  background-color: #fff5f5;
  border-left: 4px solid #e74c3c;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  & h4 {
    color: #e74c3c;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  & p {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  @media (max-width: 600px) {
    padding: 0.7rem 0.5rem;
    border-radius: 6px;
    margin-bottom: 1rem;

    & h4 {
      font-size: 0.95rem;
      margin-bottom: 0.5rem;
      gap: 0.3rem;
    }
    & p {
      font-size: 0.85rem;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 600px) {
    // sflex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 0.85rem;
    padding: 0.5rem 0.7rem;
    border-radius: 5px;
    gap: 0.3rem;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #4361ee;
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background-color: #3a56d4;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #4361ee;
  color: #4361ee;

  &:hover:not(:disabled) {
    background-color: #f0f2ff;
  }
`;

const ResubmissionForm = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;

  @media (max-width: 600px) {
    margin-top: 1rem;
    padding-top: 1rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    margin-bottom: 0.8rem;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #212529;

  @media (max-width: 600px) {
    font-size: 0.85rem;
    margin-bottom: 0.3rem;
  }
`;

const ErrorText = styled.span`
  display: block;
  margin-top: 0.6rem;
  color: #e74c3c;
  font-size: 0.88rem;
  font-weight: 500;
  ${GlobalFont}

  @media (max-width: 600px) {
    font-size: 0.75rem;
    margin-top: 0.3rem;
  }
`;

const FormInput = styled.input`
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

  @media (max-width: 600px) {
    font-size: 0.85rem;
    padding: 0.5rem 0.7rem;
    border-radius: 5px;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
  }

  @media (max-width: 600px) {
    font-size: 0.85rem;
    min-height: 70px;
    padding: 0.5rem;
    border-radius: 5px;
  }
`;

const RejectedAssignmentView = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignmentDetail, setAssignmentDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [assignment, setAssignment] = useState({});
  const [isResubmitting, setIsResubmitting] = useState(false);
  const { user } = useAuth(); 
  const [resubmitData, setResubmitData] = useState({
    githubUrl: '',
    branch: '',
    changesSummary: ''
  });
  const [submissionMessage, setSubmissionMessage] = useState(null); // Add this line

  const processAssignmentForDisplay = (assignmentData) => {
    const details = [];
    const assignmentMapping = {
      "Submitted Date": { value: assignmentData.submittedAt, icon: faCalendarAlt },
      "Reviewed Date": { value: assignmentData.reviewedAt, icon: faCalendarAlt },
      "Branch": { value: assignmentData.branch, icon: faCodeBranch },
      "Reviewer": { value: assignmentData.codeReviewerName, icon: faUsers },
      "Learner": { value: assignmentData.learnerName, icon: faUsers },
      "GitHub Repository URL": { value: assignmentData.githubUrl, icon: faClock },
      "Video Url": { value: assignmentData.reviewVideoUrl, icon: faVideo },
      "Assignment Number": { value: assignmentData.assignmentNumber, icon: faHashtag },
    };

    for (const label in assignmentMapping) {
      const { value: rawValue, icon: defaultIcon } = assignmentMapping[label];

      if (rawValue !== null && typeof rawValue !== 'undefined' && (typeof rawValue !== 'string' || rawValue.trim() !== '')) {
        let formattedValue = rawValue;
        let displayIcon = defaultIcon;

        if (label.includes("Date")) {
          try {
            const date = new Date(rawValue);
            if (!isNaN(date.getTime())) { 
              formattedValue = date.toLocaleDateString();
            }
          } catch (e) {
            formattedValue = rawValue;
          }
        } else if (label === "GitHub Repository URL" || label === "Video Url") {
          formattedValue = (
            <a href={rawValue} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>
              {rawValue}
            </a>
          );
        }

        details.push({
          label: label,
          value: formattedValue,
          icon: displayIcon
        });
      }
    }
    return details;
  };

  useEffect(() => {
    const fetchAndProcessAssignment = async (id) => {
      try {
        setLoading(true);

        if (!id) {
          setSubmissionMessage({ type: 'error', message: "Assignment ID is missing from the URL." });
          setLoading(false);
          return;
        }

        const token = user?.token || localStorage.getItem('jwt token');
        if (!token) {
          setSubmissionMessage({ type: 'error', message: 'Authentication required. Please log in.' });
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8081/api/user/assignments/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });

        const rawData = response.data;
        
        console.log("Fetched raw data:", rawData);

        if (rawData) {
          setAssignment(rawData);
          setAssignmentDetail(processAssignmentForDisplay(rawData));
          setResubmitData({
            githubUrl: rawData.githubUrl || '',
            branch: rawData.branch ? `${rawData.branch}` : '',
            changesSummary: ''
          });
        } else {
          setAssignment({});
          setAssignmentDetail([]);
          setSubmissionMessage({ type: 'error', message: `Assignment with ID "${id}" not found.` });
        }
      } catch (err) {
        console.error("Error fetching or processing assignment:", err);
        let errorMessage = "Failed to load assignment details. Please try again.";
        if (err.response) {
          errorMessage = err.response.data.message || errorMessage;
        } else if (err.request) {
          errorMessage = "No response from server. Check your internet connection.";
        } else {
          errorMessage = err.message;
        }
        setSubmissionMessage({ type: 'error', message: errorMessage });
        setAssignment({});
        setAssignmentDetail([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessAssignment(assignmentId);
  }, [assignmentId]);

  const handleResubmit = async () => {
    try {
      setIsResubmitting(true);
      const token = user?.token || localStorage.getItem('jwt token');

      const response = await axios.post(
        `http://localhost:8081/api/user/assignments/${assignmentId}/submit`,
        {
          githubUrl: resubmitData.githubUrl,
          branch: resubmitData.branch,
          notes: resubmitData.changesSummarys
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        }
      );
       setSubmissionMessage({ type: 'success', message: 'Assignment resubmitted successfully' });

      // navigate('/dashboard', { state: { message: 'Assignment resubmitted successfully!' } });
    } catch (err) {
      console.error("Error resubmitting assignment:", err);
      let errorMessage = "Failed to resubmit assignment. Please try again.";
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      setSubmissionMessage({ type: 'error', message: errorMessage });
    } finally {
      setIsResubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResubmitData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  if (loading) {
    return (
      <LoadingSpinner
        speed="3s"
        text="Loading details..."
        textColor="blue"
      />
    );
  }

  if (!assignment || Object.keys(assignment).length === 0) {
    return (
      <DashboardContainer>
        <RejectedAssignmentContainer>
          <div>No assignment data available.</div>
        </RejectedAssignmentContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Rejected Assignment</Title>
      </DashboardHeader>
      
      <RejectedAssignmentContainer>
        <BackLinkToDashboard />
        
        <Header>
          <h2>{assignment.assignmentType || 'Assignment Details'}</h2>
          <StatusBadge>
            <FontAwesomeIcon icon={faExclamationCircle} />
            {assignment.status}
          </StatusBadge>
        </Header>
        {submissionMessage && (
                <SubmissionMessage type={submissionMessage.type}>
                  {submissionMessage.message}
                </SubmissionMessage>
              )}
        
        <SectionTitle>
          <FontAwesomeIcon icon={faInfoCircle} color="#4361ee" />
          <h3>Assignment Details</h3>
        </SectionTitle>

        <AssignmentDetails>
          {assignmentDetail.map((item) => (
            <AssignmentDetailItem
              itemLabel={item.label}
              itemValue={item.value}
              key={item.label} 
              fontIcon={<FontAwesomeIcon icon={item.icon} color="#4361ee" />}
            />
          ))}
        </AssignmentDetails>

        {assignment.reviewVideoUrl && (
          <>
            <SectionTitle>
              <FontAwesomeIcon icon={faVideo} color="#4361ee"/>
              <h3>Review Video</h3>
            </SectionTitle>
            <iframe
              width="100%"
              height="315"
              src={assignment.reviewVideoUrl.replace("watch?v=", "embed/")}
              title="Assignment Review Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </>
        )}

        <SectionTitle>
          <FontAwesomeIcon icon={faCommentDots} color="#4361ee"/>
          <h3>Feedback</h3>
        </SectionTitle>
        
        <FeedbackContainer>
          {assignment.notes ? (
            <>
              <h4><FontAwesomeIcon icon={faExclamationCircle} /> Review Feedback</h4>
              {assignment.notes.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </>
          ) : (
            <p>No feedback comments available for this assignment.</p>
          )}
        </FeedbackContainer>

        <ResubmissionForm>
          <SectionTitle>
            <FontAwesomeIcon icon={faRedo} color="#4361ee"/>
            <h3>Resubmit Assignment</h3>
          </SectionTitle>
          
          <FormGroup>
            <FormLabel>GitHub Repository URL</FormLabel>
            <FormInput
              type="url"
                id="githubUrl"
                name="githubUrl"
                value={resubmitData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                required
                $hasError={!!errors.githubUrl}
                disabled={isResubmitting || loading}
            />
            {errors.githubUrl && <ErrorText>{errors.githubUrl}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Branch Name</FormLabel>
            <FormInput
               type="text"
                id="branch"
                name="branch"
                value={resubmitData.branch}
                onChange={handleChange}
                placeholder="main or develop"
                required
                $hasError={!!errors.branch}
                disabled={isResubmitting || loading}
            />
            {errors.branch && <ErrorText>{errors.branch}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Summary of Changes</FormLabel>
            <FormTextarea
            id="changesSummary"
              name="changesSummary"
              value={resubmitData.changesSummary}
              onChange={handleChange}
              placeholder="Describe the changes you made to address the feedback..."
            />
          </FormGroup>
          
          <ActionButtons>
            <SecondaryButton onClick={handleCancel} disabled={isResubmitting}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleResubmit} disabled={isResubmitting}>
              <FontAwesomeIcon icon={faRedo} />
              {isResubmitting ? 'Resubmitting...' : 'Resubmit Assignment'}
            </PrimaryButton>
          </ActionButtons>
        </ResubmissionForm>
      </RejectedAssignmentContainer>
    </DashboardContainer>
  );
};

export default RejectedAssignmentView;