import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AssignmentCard from './AssignmentCard';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faChalkboardTeacher

  

} from "@fortawesome/free-solid-svg-icons";


const LearnersDashboard = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading,  setIsLoading] = useState(false);
  const [allAssignment, setAllAssignment] = useState([]);
  const { userData } = useOutletContext();
  const navigate = useNavigate();

  // Fetch assignments from backend with filter
  const fetchAssignments = async (filter) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('jwt token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let endpoint = 'http://localhost:8081/api/user/assignments';
      if (filter && filter !== 'All') {
        endpoint += `?status=${encodeURIComponent(filter)}`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setAssignments(response.data);
      if(filter === 'All'){
        setAllAssignment(response.data);
      } 
      setError(null);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError(err.message);
      }
      setAssignments([]); // Ensure assignments are cleared on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (assignmentId) => {
    console.log(`Editing assignment: ${assignmentId}`);
    navigate(`/learner/assignments/${assignmentId}/edit`); // Assuming navigate is available from react-router-dom
  };

  const handleSubmit = async (assignmentId) => {
    console.log(`Submitting assignment: ${assignmentId}`);
    try {
      // Replace with your actual API base URL
      const API_BASE_URL = 'http://localhost:8081/api/user/assignments';
      await axios.put(`${API_BASE_URL}/${assignmentId}/submit`);
      alert(`Assignment ${assignmentId} submitted successfully!`);
      fetchAssignments(activeFilter);
    } catch (err) {
      console.error(`Error submitting assignment ${assignmentId}:`, err);
      alert(`Failed to submit assignment ${assignmentId}. Error: ${err.message}`);
    }
  };

  const handleView = (assignmentId) => {
    console.log(`Viewing assignment: ${assignmentId}`);
    navigate(`/learner/assignments/${assignmentId}/view`); // Assuming navigate is available from react-router-dom
  };

  const handleResubmit = async (assignmentId) => {
    console.log(`Resubmitting assignment: ${assignmentId}`);
    try {
      const API_BASE_URL = 'http://localhost:8081/api/user/assignments';
      await axios.put(`${API_BASE_URL}/${assignmentId}/resubmit`);
      alert(`Assignment ${assignmentId} resubmitted!`);
      fetchAssignments(activeFilter);
    } catch (err) {
      console.error(`Error resubmitting assignment ${assignmentId}:`, err);
      alert(`Failed to resubmit assignment ${assignmentId}. Error: ${err.message}`);
    }
  };

  const handleClaim = async (assignmentId) => {
    console.log(`Claiming assignment: ${assignmentId}`);
    try {
      const API_BASE_URL = 'http://localhost:8081/api/user/assignments';
      // You'll need to define currentReviewerId and currentReviewerName
      // For demonstration, I'm using placeholders.
      const currentReviewerId = 'reviewer123';
      const currentReviewerName = 'John Doe';
      await axios.post(`${API_BASE_URL}/${assignmentId}/claim`, {
        reviewerId: currentReviewerId,
        reviewerName: currentReviewerName
      });
      alert(`Assignment ${assignmentId} claimed by ${currentReviewerName}!`);
      fetchAssignments(activeFilter);
    } catch (err) {
      console.error(`Error claiming assignment ${assignmentId}:`, err);
      alert(`Failed to claim assignment ${assignmentId}. Error: ${err.message}`);
    }
  };

  const handleReclaim = async (assignmentId) => {
    console.log(`Reclaiming assignment: ${assignmentId}`);
    try {
      const API_BASE_URL = 'http://localhost:8081/api/user/assignments';
      // You'll need to define currentReviewerId and currentReviewerName
      const currentReviewerId = 'reviewer123';
      const currentReviewerName = 'John Doe';
      await axios.post(`${API_BASE_URL}/${assignmentId}/reclaim`, {
        reviewerId: currentReviewerId,
        reviewerName: currentReviewerName
      });
      alert(`Assignment ${assignmentId} reclaimed by ${currentReviewerName}!`);
      fetchAssignments(activeFilter);
    } catch (err) {
      console.error(`Error reclaiming assignment ${assignmentId}:`, err);
      alert(`Failed to reclaim assignment ${assignmentId}. Error: ${err.message}`);
    }
  };

  // Fetch assignments when activeFilter changes
  useEffect(() => {
    fetchAssignments(activeFilter);
    // eslint-disable-next-line
  }, [activeFilter]);

  useEffect(() => {
    console.log('Current loading state:', isLoading);
  }, [isLoading]);


  return (
    <DashboardContainer>
      <LearnerHeader>
        <HeaderLeft>
          <AvatarContainer>
            <UserAvatar src="/src/assets/avatar.jpg" alt="User Avatar" />
            <OnlineIndicator />
          </AvatarContainer>
          <WelcomeContent>
            <WelcomeText>
              <FontAwesomeIcon icon={faUserGraduate} style={{ marginRight: "0.5rem" }} />
              Welcome back, {userData.username}
            </WelcomeText>
            <UserName>{userData.username}</UserName>
            <DashboardType>
              <Badge>
                <FontAwesomeIcon icon={faChalkboardTeacher} style={{ marginRight: "0.4rem" }} />
                Learner Dashboard
              </Badge>
            </DashboardType>
            <WelcomeParagraph>
              ...
            </WelcomeParagraph>
          </WelcomeContent>
        </HeaderLeft>
        <HeaderRight>
          <StatsContainer>
            <StatItem>
              <StatNumber>{allAssignment.length}</StatNumber>
              <StatLabel>Assignments</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatNumber>
                {allAssignment.filter(a => a.status === "Completed").length}
              </StatNumber>
              <StatLabel>Completed</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatNumber>
                {allAssignment.filter(a => a.status === "Submitted" || a.status === "Resubmitted").length}
              </StatNumber>
              <StatLabel>Pending Review</StatLabel>
            </StatItem>
          </StatsContainer>
        </HeaderRight>
      </LearnerHeader>

      <FilterControls>
        <FilterButton
          active={activeFilter === 'All'}
          onClick={() => setActiveFilter('All')}
        >
          All
        </FilterButton>
        <FilterButton
          active={activeFilter === 'Pending Submission'}
          onClick={() => setActiveFilter('Pending Submission')}
        >
          In Progress
        </FilterButton>
        <FilterButton
          active={activeFilter === 'Submitted'}
          onClick={() => setActiveFilter('Submitted')}
        >
          Submitted
        </FilterButton>
        <FilterButton
          active={activeFilter === 'Completed'}
          onClick={() => setActiveFilter('Completed')}
        >
          Completed
        </FilterButton>
        <FilterButton
          active={activeFilter === 'Resubmitted'}
          onClick={() => setActiveFilter('Resubmitted')}
        >
          Resubmitted
        </FilterButton>
      </FilterControls>

      {!isLoading && assignments.length === 0 && (
        <TextMessage>No assignment found under this filter.</TextMessage>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <AssignmentGrid>
          {assignments.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              id={assignment.id}
              submittedDate={assignment.createdAt}
              reviewedDate={assignment.reviewedAt}
              branch={assignment.branch}
              title={assignment.assignmentType}
              reviewer={assignment.codeReviewerName}
              learner={assignment.learnerName}
              gitHubURL={assignment.githubUrl}
              videoUrl={assignment.reviewVideoUrl}
              status={assignment.status}
              assignmentNumber={assignment.assignmentNumber}
              involved={"learner"}
              onEditClick={handleEdit}
              onSubmitClick={handleSubmit}
              onViewClick={handleView}
              onResubmitClick={handleResubmit}
              onClaimClick={handleClaim}
              onReclaimClick={handleReclaim}
            />
          ))}
        </AssignmentGrid>
      )}
    </DashboardContainer>
  );
};


export const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.7rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  color: #156c7c;
`;

const FilterControls = styled.div`
  display: flex;
  margin: 1rem;
  gap: 0.25rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  font-weight: 550;
  
  background-color: ${({ active }) => active ? '#4361ee' : '#f1f3f5'};
  color: ${({ active }) => active ? 'white' : '#495057'};
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ active }) => active ? '#3a56d9' : '#e9ecef'};
  }
`;

export const AssignmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const WelcomeContainer = styled.div`
`;

const WelcomeParagraph = styled.p`
  margin-left: 25px;
  padding: 0;
  margin-top: 5px;

  /* New styles for wrapping, italics, and font size */
  white-space: normal; /* Ensures text wraps to a new line */
  font-style: italic; /* Makes the text italic */
  font-size: 0.95rem; /* Example font size, adjust as needed */
  color: #555; /* A slightly softer color for the italicized text */
  line-height: 1.4; /* Improves readability for wrapped text */
`;


const TextMessage = styled.div`
  margin: 2rem 0 2rem 0;
  padding: 2rem 2.5rem;
  max-width: 400px;
  background: linear-gradient(90deg, #f0f4ff 0%, #e0e7ff 100%);
  color: #3b82f6;
  border-radius: 16px;
  font-size: 1.15rem;
  font-weight: 500;
  text-align: left;
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.07);
  letter-spacing: 0.01em;
  border: 1px solid #dbeafe;
  align-self: flex-start;
  display: block;
`;

  const LearnerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
  background: linear-gradient(90deg, #f0f4ff 0%, #e0e7ff 100%);
  border-radius: 18px;
  padding: 2rem 2.5rem 1.5rem 2rem;
  box-shadow: 0 2px 16px rgba(67, 97, 238, 0.07);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
`;

const UserAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4361ee;
`;

const OnlineIndicator = styled.span`
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 14px;
  height: 14px;
  background: #22c55e;
  border: 2px solid #fff;
  border-radius: 50%;
`;

const WelcomeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;
const WelcomeText = styled.div`
  font-size: 1.1rem;
  color: #3b82f6;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const UserName = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  color: #101828;
  margin: 0.1rem 0 0.2rem 0;
`;

const DashboardType = styled.div`
  margin-top: 2px;
`;

const Badge = styled.span`
  display: inline-block;
  background-color: #F0F5FF;
  color: #3B82F6;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #F9FAFB;
  border-radius: 12px;
  padding: 10px 18px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
`;

const StatNumber = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #4361ee;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 32px;
  background: #e0e7ff;
`;

const FilterIcon = styled.span`
  color: #64748b;
  font-size: 1.1rem;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;


export default LearnersDashboard;