import styled from "styled-components";
import BackLinkToDashboard from "../../ui/BackLinkToDashboard";
import { DashboardContainer, DashboardHeader, Title  } from "./LearnersDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AssignmentDetailItem from "../../ui/AssignmentDetailItem";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';


import {
  faCheckCircle,
  faClock,
  faExclamationCircle,
  faInfoCircle,
  faUserCircle,
  faCodeBranch,
  faCommentDots, 
   faVideo,
   faHashtag,
  faCalendarAlt, 
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { faSignalMessenger } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

// Styled Components
const AssignmentViewContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
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
      case 'Pending Submission':
        return 'rgba(243, 156, 18, 0.1)';
      case 'Submitted':
        return 'rgba(52, 152, 219, 0.1)';
      case 'In Review':
        return 'rgba(243, 156, 18, 0.1)';
      case 'Completed':
        return 'rgba(46, 204, 113, 0.1)';
      case 'Needs Update':
        return 'rgba(231, 76, 60, 0.1)';
      default:
        return '#f1f3f5';
    }
  }};

  color: ${({ status }) => {
    switch (status) {
      case 'Pending Submission':
        return '#f39c12';
      case 'Submitted':
        return '#3498db';
      case 'In Review':
        return '#f39c12';
      case 'Completed':
        return '#2ecc71';
      case 'Needs Update':
        return '#e74c3c';
      default:
        return '#495057';
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
`;

const AssignmentDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;


const VideoContainer = styled.div`
`;
const FeedbackContainer = styled.div`
font-weight: 500;
  margin-bottom: 1.25rem;
  color: #212529;
  font-size: 0.9rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  & p {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 550;
  
  
  }

`;




const AssignmentView = () => {

  const { assignmentId} = useParams();

  const [assignmentDetail, setAssignmentDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignment, setAssignment] = useState({}); 

  
  const processAssignmentForDisplay = (assignmentData) => {
    const details = [];

    // Define the order and icons
    const assignmentMapping = {
      "Submitted Date": { value: assignmentData.submittedAt, icon: faCalendarAlt },
      "Reviewed Date": { value: assignmentData.reviewedAt, icon: faCalendarAlt },
      "Branch": { value: assignmentData.branch, icon: faCodeBranch },
      "Reviewer": { value: assignmentData.codeReviewerName, icon: faUsers },
      "Learner" : { value: assignmentData.learnerName, icon: faUsers },
      "GitHub Repository URL": { value: assignmentData.githubUrl, icon: faClock },
      "Video Url": { value: assignmentData.reviewVideoUrl, icon: faVideo },
      // "Status": { value: assignmentData.status, icon:   }
      "Assignment Number": { value: assignmentData.assignmentNumber, icon: faHashtag   },
      // "Due Date": { value: assignmentData.dueDate, icon: faCalendarAlt }, // Added DueDate
      // "Notes": { value: assignmentData.notes, icon: faInfoCircle }, // Added Notes
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
            // If parsing fails, use the raw value
            formattedValue = rawValue;
          }
        } else if (label === "GitHub Repository URL") {
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
                setLoading(true); // Start loading
                setError(null);   // Clear previous errors

                if (!id) {
                    setError("Assignment ID is missing from the URL.");
                    setLoading(false);
                    return;
                }

                const token = localStorage.getItem('jwt token');
                if (!token) {
                    setError('Authentication required. Please log in.');
                    setLoading(false);
                    return;
                }

                // Await the axios call to get the actual data
                const response = await axios.get(`http://localhost:8081/api/user/assignments/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                
                const rawData = response.data; // This now holds the actual data
                console.log("Fetched raw data:", rawData); // For debugging
                
                if (rawData) {
                    setAssignment(rawData); // Store the raw fetched object
                    const processedData = processAssignmentForDisplay(rawData);
                    setAssignmentDetail(processedData); // Store processed details for rendering
                } else {
                    setAssignment({}); 
                    setAssignmentDetail([]);
                    setError(`Assignment with ID "${id}" not found.`); // Use 'id' here
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
                setError(errorMessage);
                setAssignment({}); 
                setAssignmentDetail([]); 
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchAndProcessAssignment(assignmentId);
    }, [assignmentId]); 

  
//   if (loading) {
//     return (
//       <DashboardContainer>
//         <AssignmentViewContainer>
//           <div>Loading assignment details...</div>
//         </AssignmentViewContainer>
//       </DashboardContainer>
//     );
//   }

  if (error) {
    return (
      <DashboardContainer>
        <AssignmentViewContainer>
          <div>Error: {error}</div>
        </AssignmentViewContainer>
      </DashboardContainer>
    );
  }

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
        <AssignmentViewContainer>
          <div>No assignment data available.</div>
        </AssignmentViewContainer>
      </DashboardContainer>
    );
  }
  

  return (
    <DashboardContainer>
      <>
      <DashboardHeader>
                <Title>Assignment View Page</Title> {/* Static Title for Editing */}
      </DashboardHeader>
      

        {/* <BackLinkToDashboard /> */}
        <AssignmentViewContainer>
          <BackLinkToDashboard />
          <Header>
            
            <h2>{assignment.assignmentType || 'Assignment Details'}</h2>
        
            <StatusBadge status={assignment.status}>
              {assignment.status === 'Pending Submission' && <FontAwesomeIcon icon={faClock} />}
              {assignment.status === 'Submitted' && <FontAwesomeIcon icon={faExclamationCircle} />}
              {assignment.status === 'In Review' && <FontAwesomeIcon icon={faClock} />}
              {assignment.status === 'Completed' && <FontAwesomeIcon icon={faCheckCircle} />}
              {assignment.status === 'Needs Update' && <FontAwesomeIcon icon={faExclamationCircle} />} 
              {assignment.status === 'Resubmitted' && <FontAwesomeIcon icon={faExclamationCircle} />} 
              {assignment.status }
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
                fontIcon={<FontAwesomeIcon icon={item.icon} color="#4361ee" />}
              />
            ))}
          </AssignmentDetails>

          <SectionTitle>
            <FontAwesomeIcon icon={faVideo} color="#4361ee"/>
            <h3>Review Video</h3>
          </SectionTitle>
          <VideoContainer>
            {assignment.reviewVideoUrl ? (
                              <iframe
                                  width="100%"
                                  height="315"
                                  src={assignment.reviewVideoUrl.replace("watch?v=", "embed/")} // Converts YouTube watch URL to embed URL
                                  title="Assignment Review Video"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                              ></iframe>
                          ) : (
                              <InfoMessage $type="info">
                                  <FontAwesomeIcon icon={faInfoCircle} /> No review video available for this assignment yet.
                              </InfoMessage>
                          )
            }

          </VideoContainer>

          <SectionTitle>
            <FontAwesomeIcon icon={faCommentDots} color="#4361ee"/>
            <h3>Feedback</h3>

          </SectionTitle>
          <FeedbackContainer>
            {
              (assignment.notes && !assignment.reviewVideoUrl) ? ( // If notes are there but not a video URL (might be feedback)
                            <>
                                <h4>Notes:</h4>
                                {assignment.notes.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </>
                        ) : (
                            <InfoMessage $type="info">
                                <FontAwesomeIcon icon={faInfoCircle} /> No feedback comments available for this assignment yet.
                            </InfoMessage>
                        )

            }
          </FeedbackContainer>



        </AssignmentViewContainer>
      </>
    </DashboardContainer>
  );
};

export default AssignmentView

const GlobalFont = `
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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