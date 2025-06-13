import styled from "styled-components";
import BackLinkToDashboard from "../../ui/BackLinkToDashboard";
import { DashboardContainer } from "./LearnersDashboard";
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
   faVideo,
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
  max-width: 900px;
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



// Fetch assignment from backend using axios
const fetchAssignmentFromDB = async (id) => {
  const token = localStorage.getItem('jwt token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Replace with your actual API endpoint
  const endpoint = `YOUR_API_ENDPOINT_HERE/${id}`;

  const response = await axios.get(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.data;
};


const AssignmentView = () => {

  const { assignmentId = "assign-456" } = useParams();

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
      "Reviewer": { value: assignmentData.reviewerId, icon: faUsers },
      "GitHub Repository URL": { value: assignmentData.githubUrl, icon: faClock },
      "Due Date": { value: assignmentData.dueDate, icon: faCalendarAlt }, // Added DueDate
      "Notes": { value: assignmentData.notes, icon: faInfoCircle }, // Added Notes
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
    const fetchAndProcessAssignment = async () => {
      try {
        setLoading(true);
        setError(null); 

    
        if (!assignmentId) {
          setError("Assignment ID is missing from the URL.");
          setLoading(false);
          return;
        }

        const rawData = fetchAssignmentFromDB(assignmentId);

        if (rawData) {
          setAssignment(rawData); 
          const processedData = processAssignmentForDisplay(rawData);
          setAssignmentDetail(processedData);
        } else {
          setAssignment({}); 
          setAssignmentDetail([]);
          setError(`Assignment with ID "${assignmentId}" not found.`);
        }
      } catch (err) {
        console.error("Error fetching or processing assignment:", err);
        setError("Failed to load assignment details. Please try again.");
        setAssignment({}); 
        setAssignmentDetail([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessAssignment();
  }, [assignmentId]); // Re-run effect if assignmentId changes in the URL

  
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
      <LoadingSpinner isLoading={loading}></LoadingSpinner>

        <BackLinkToDashboard />
        <AssignmentViewContainer>
          <Header>
            
            <h2>{assignment.title || 'Assignment Details'}</h2>
        
            <StatusBadge status={assignment.status}>
              {assignment.status === 'Pending Submission' && <FontAwesomeIcon icon={faClock} />}
              {assignment.status === 'Submitted' && <FontAwesomeIcon icon={faExclamationCircle} />}
              {assignment.status === 'In Review' && <FontAwesomeIcon icon={faClock} />}
              {assignment.status === 'Completed' && <FontAwesomeIcon icon={faCheckCircle} />}
              {assignment.status === 'Needs Update' && <FontAwesomeIcon icon={faExclamationCircle} />} 
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

          </VideoContainer>

          <SectionTitle>
            <FontAwesomeIcon icon={faSignalMessenger} color="#4361ee"/>
            <h3>Feedback</h3>

          </SectionTitle>
          <FeedbackContainer>
            <h4>Feedback Comment:</h4>
            <p>This is first paragraph</p>
            <p>This is second paragraph</p>

          </FeedbackContainer>



        </AssignmentViewContainer>
      </>
    </DashboardContainer>
  );
};

export default AssignmentView