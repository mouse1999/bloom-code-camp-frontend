import styled from "styled-components";
import BackLinkToDashboard from "../../common/BackLinkToDashboard";
import { DashboardContainer } from "../Learner/LearnersDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AssignmentDetailItem from "../../common/AssignmentDetailItem";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../common/LoadingSpinner"; // Make sure this import is present

import {
  faCheckCircle,
  faClock,
  faExclamationCircle,
  faInfoCircle,
  faUserCircle,
  faCodeBranch,
  faVideo,
  faCalendarAlt,
  faUserGraduate,
  faFloppyDisk,
  faCheck,
  faXmark,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const AssignmentViewContainer = styled.div`
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

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const SubmissionMessage = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1.5rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  font-size: 0.92rem;
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
    font-size: 0.82rem;
    padding: 0.5rem 0.5rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }
`;

const StatusSpan = styled.span`
  padding: 0.5rem 1.25rem;
  border-radius: 30px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.85rem;
  background-color: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
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
    switch (status) {
      case 'Pending Submission': return 'rgba(243, 156, 18, 0.1)';
      case 'Submitted': return 'rgba(52, 152, 219, 0.1)';
      case 'Completed': return 'rgba(46, 204, 113, 0.1)';
      case 'Needs Update': return 'rgba(231, 76, 60, 0.1)';
      case 'In Review': return '#e5e7eb'; // Light gray background
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
      case 'In Review': return '#111827'; // Black for "In Review"
      case 'Resubmitted': return '#a855f7';
      default: return '#495057';
    }
  }};
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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0.7rem;
    margin-bottom: 1.2rem;
  }
`;

const TextContainer = styled.div`
  width: 60%;
  margin-bottom: 2rem;

  @media (max-width: 900px) {
    width: 90%;
  }
  @media (max-width: 600px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 120px;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  transition: all 0.3s;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4cc9f0;
    box-shadow: 0 0 0 3px rgba(76, 201, 240, 0.2);
  }

  @media (max-width: 600px) {
    min-height: 80px;
    font-size: 0.78rem;
    padding: 0.5rem;
    border-radius: 6px;
  }
`;

const UrlContainer = styled.div`
  margin-bottom: 2rem;
  width: 80%;

  @media (max-width: 900px) {
    width: 95%;
  }
  @media (max-width: 600px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.7rem 0.9rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.85rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #4cc9f0;
    box-shadow: 0 0 0 3px rgba(76, 201, 240, 0.2);
  }

  @media (max-width: 600px) {
    font-size: 0.78rem;
    padding: 0.5rem 0.5rem;
    border-radius: 6px;
  }
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;

  @media (max-width: 600px) {
    font-size: 0.78rem;
    margin-bottom: 0.3rem;
  }
`;

const ReviewAction = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;

  @media (max-width: 600px) {
    // flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
  }
`;

const RejectedButton = styled.button`
  padding: 0.5rem 1.1rem;
  border: none;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background-color: #4361ee;
  color: white;

  &:hover {
    background-color: #3a0ca3;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 0.78rem;
    padding: 0.4rem 0.5rem;
    border-radius: 14px;
  }
`;

const DraftButton = styled.button`
  padding: 0.5rem 1.1rem;
  border: none;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 0.78rem;
    padding: 0.4rem 0.5rem;
    border-radius: 14px;
  }
`;

const CompletedButton = styled.button`
  padding: 0.5rem 1.1rem;
  border: none;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background-color: #2ecc71;
  color: white;

  &:hover {
    background-color: #27ae60;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 0.78rem;
    padding: 0.4rem 0.5rem;
    border-radius: 14px;
  }
`;

export default function AssignmentReviewPage() {
  const { assignmentId } = useParams();
  const { user } = useAuth();

  const [assignmentDetail, setAssignmentDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionMessge, setSubmissionMessage] = useState(null);
  const [error, setError] = useState(null);
  const [assignment, setAssignment] = useState({});
  const [errors, setErrors] = useState({});
  const [isCancelling, setIsCancelling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reviewVideoUrl: '',
    review: '',
  });
  const navigate = useNavigate();

  const processAssignmentForDisplay = (assignmentData) => {
    const details = [];
    const assignmentMapping = {
      "Submitted Date": { value: assignmentData.submittedAt, icon: faCalendarAlt },
      "Learner": { value: assignmentData.learnerName, icon: faUserGraduate },
      "Reviewed Date": { value: assignmentData.reviewedAt, icon: faCalendarAlt },
      "Branch": { value: assignmentData.branch, icon: faCodeBranch },
      "Reviewer": { value: assignmentData.codeReviewerName, icon: faUsers },
      "GitHub Repository URL": { value: assignmentData.githubUrl, icon: faGithub },
      "Notes": { value: assignmentData.notes, icon: faInfoCircle },
    };

    for (const label in assignmentMapping) {
      const { value: rawValue, icon: defaultIcon } = assignmentMapping[label];
      if (
        rawValue !== null &&
        typeof rawValue !== 'undefined' &&
        (typeof rawValue !== 'string' || rawValue.trim() !== '')
      ) {
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
        } else if (label === "GitHub Repository URL") {
          formattedValue = (
            <a
              href={rawValue}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3498db', textDecoration: 'none' }}
            >
              {rawValue}
            </a>
          );
        }else if(label === "Video Url") {
          formattedValue = (
            <a href={rawValue} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>
              {rawValue}
            </a>
          );

        }

        details.push({
          label: label,
          value: formattedValue,
          icon: displayIcon,
        });
      }
    }
    return details;
  };

  useEffect(() => {
    const fetchAndProcessAssignment = async (id) => {
      try {
        setLoading(true);
        setError(null);

        if (!assignmentId) {
          setError("Assignment ID is missing from the URL.");
          setLoading(false);
          return;
        }

        const token = user?.token || localStorage.getItem('jwt token');
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8081/api/reviewer/assignments/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const rawData = response.data;
        if (rawData) {
          setAssignment(rawData);
          const processedData = processAssignmentForDisplay(rawData);
          setAssignmentDetail(processedData);
        } else {
          setAssignmentDetail([]);
          setError(`Assignment with ID "${id}" not found.`);
        }
      } catch (err) {
        let errorMessage = "Failed to load assignment details. Please try again.";
        if (err.response) {
          errorMessage = err.response.data.message || errorMessage;
        } else if (err.request) {
          errorMessage = "No response from server. Check your internet connection.";
        } else {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setAssignmentDetail([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessAssignment(assignmentId);
  }, [assignmentId]);


  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.reviewVideoUrl.trim()) {
      newErrors.reviewVideoUrl = 'Video URL is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage(null);

    if (!validate()) {
      setSubmissionMessage({
        type: 'error',
        message: 'Please fix the errors in the form before submitting.',
      });
      return;
    }

    if (!assignmentId) {
      setSubmissionMessage({ type: 'error', message: 'Assignment Not Found' });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = user?.token || localStorage.getItem('jwt token');
      if (!token) {
        setSubmissionMessage({
          type: 'error',
          message: 'Authentication required to update.',
        });
        setIsSubmitting(false);
        return;
      }

      const response = await axios.put(
        `http://localhost:8081/api/reviewer/assignments/${assignmentId}/complete`,
        formData,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setSubmissionMessage({
        type: 'success',
        message: 'Assignment Reviewed successfully!',
      });
    } catch (error) {
      let errorMessage = `Failed to review the assignment. Please try again.`;
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


  const handleReject = async (e) => {
    e.preventDefault();
    setSubmissionMessage(null);

    if (!validate()) {
      setSubmissionMessage({
        type: 'error',
        message: 'Please fix the errors in the form before submitting.',
      });
      return;
    }

    if (!assignmentId) {
      setSubmissionMessage({ type: 'error', message: 'Assignment Not Found' });
      return;
    }

    setIsCancelling(true);
    try {
      const token = user?.token || localStorage.getItem('jwt token');
      if (!token) {
        setSubmissionMessage({
          type: 'error',
          message: 'Authentication required to reject.',
        });
        setIsCancelling(false);
        return;
      }

      const response = await axios.put(
        `http://localhost:8081/api/reviewer/assignments/${assignmentId}/resubmit`,
        formData,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setSubmissionMessage({
        type: 'success',
        message: 'Assignment Rejected successfully!',
      });
    } catch (error) {
      let errorMessage = `Failed to reject the assignment. Please try again.`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = 'No response from server. Check your internet connection.';
      } else {
        errorMessage = error.message;
      }
      setSubmissionMessage({ type: 'error', message: errorMessage });
    } finally {
      setIsCancelling(false);
    }
  };


  return (
    <DashboardContainer style={{ position: "relative", minHeight: "400px" }}>
      {loading ? (
      <Overlay>
      <LoadingSpinner speed="0.4s"
       primaryColor="#4361ee"
       size="25px"
       thickness="4px"
       color="#f3f3f3"
       />
    </Overlay>
      ) : (
        <>
          <AssignmentViewContainer>
            <BackLinkToDashboard />
            {submissionMessge && (
                <SubmissionMessage type={submissionMessge.type}>
                  {submissionMessge.message}
                </SubmissionMessage>
              )}
            <Header>
              
              <h2>{assignment.assignmentType}</h2>
              <StatusBadge status={assignment.status}>
                {assignment.status === 'Pending Submission' && (
                  <FontAwesomeIcon icon={faClock} />
                )}
                {assignment.status === 'Submitted' && (
                  <FontAwesomeIcon icon={faExclamationCircle} />
                )}
                {assignment.status === 'In Review' && (
                  <FontAwesomeIcon icon={faClock} />
                )}
                {assignment.status === 'Completed' && (
                  <FontAwesomeIcon icon={faCheckCircle} />
                )}
                {assignment.status === 'Needs Update' && (
                  <FontAwesomeIcon icon={faExclamationCircle} />
                )}
                {assignment.status}
              </StatusBadge>
            </Header>
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
                  fontIcon={
                    <FontAwesomeIcon icon={item.icon} color="#4361ee" />
                  }
                />
              ))}
            </AssignmentDetails>
            <SectionTitle>
              <FontAwesomeIcon icon={faInfoCircle} color="#4361ee" />
              <h3>Code Review</h3>
            </SectionTitle>
            <form onSubmit={handleSubmit}>
              <TextContainer>
                <TextArea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                />
              </TextContainer>
              <SectionTitle>
                <FontAwesomeIcon icon={faVideo} color="#4361ee" />
                <h3>Review Video URL</h3>
              </SectionTitle>
              <UrlContainer>
                <InputLabel htmlFor="video">
                  Enter review video URL (e.g., Loom, YouTube)
                </InputLabel>
                <Input
                  id="reviewVideoUrl"
                  name="reviewVideoUrl"
                  value={formData.reviewVideoUrl}
                  onChange={handleChange}
                  placeholder="loom, youtube, e.t.c"
                />
                {errors.reviewVideoUrl && (
                  <SubmissionMessage type="error">
                    {errors.reviewVideoUrl}
                  </SubmissionMessage>
                )}
              </UrlContainer>
              <ReviewAction>
                <RejectedButton type="button" onClick={handleReject}>
                  <FontAwesomeIcon icon={faXmark} />
                  {isCancelling ? '...': 'Reject'}
                </RejectedButton>
                <DraftButton type="button" onClick={() => navigate(-1)}>
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  {'Back'}
                </DraftButton>
                <CompletedButton type="submit">
                  <FontAwesomeIcon icon={faCheck} />
                  {isSubmitting ? '...' : 'Complete'}
                </CompletedButton>
              </ReviewAction>
            </form>
          </AssignmentViewContainer>
        </>
      )}
    </DashboardContainer>
  );
}