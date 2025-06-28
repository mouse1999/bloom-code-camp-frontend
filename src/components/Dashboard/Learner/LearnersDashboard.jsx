import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AssignmentCard from '../../common/AssignmentCard';
import LoadingSpinner from '../../common/LoadingSpinner';
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
  padding: 0 0.5rem;

  @media (max-width: 600px) {
    padding: 0 0.1rem;
    max-width: 100vw;
  }
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.7rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 0.4rem;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  color: #156c7c;

  @media (max-width: 600px) {
    font-size: 0.95rem;
  }
`;

const FilterControls = styled.div`
  display: flex;
  margin: 0.5rem 0.1rem;
  gap: 0.12rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: row;
    gap: 0.08rem;
    margin: 0.3rem 0.05rem;
  }
`;

const FilterButton = styled.button`
  padding: 0.28rem 0.55rem;
  border-radius: 16px;
  border: none;
  font-weight: 550;
  background-color: ${({ active }) => active ? '#4361ee' : '#f1f3f5'};
  color: ${({ active }) => active ? 'white' : '#495057'};
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ active }) => active ? '#3a56d9' : '#e9ecef'};
  }

  @media (max-width: 600px) {
    font-size: 0.6rem;
    padding: 0.22rem 0.38rem;
    border-radius: 12px;
  }
`;

export const AssignmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  max-height: 60vh;
  overflow-y: auto;
  padding-bottom: 1rem;

  @media (max-width: 768px) {
    // grid-template-columns: 1fr;
    gap: 0.7rem;
    max-height: 55vh;
  }

  @media (max-width: 600px) {
    max-height: 50vh;
    padding-bottom: 0.5rem;
  }
`;

const WelcomeParagraph = styled.p`
  margin-left: 15px;
  padding: 0;
  margin-top: 3px;
  white-space: normal;
  font-style: italic;
  font-size: 0.85rem;
  color: #555;
  line-height: 1.3;

  @media (max-width: 600px) {
    margin-left: 7px;
    font-size: 0.78rem;
  }
`;

const TextMessage = styled.div`
  margin: 1.2rem 0 1.2rem 0;
  padding: 1.2rem 1.2rem;
  max-width: 320px;
  background: linear-gradient(90deg, #f0f4ff 0%, #e0e7ff 100%);
  color: #3b82f6;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: left;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.07);
  letter-spacing: 0.01em;
  border: 1px solid #dbeafe;
  align-self: flex-start;
  display: block;

  @media (max-width: 600px) {
    padding: 0.7rem 0.5rem;
    font-size: 0.85rem;
    border-radius: 7px;
    margin: 0.7rem 0;
    max-width: 98vw;
  }
`;

const LearnerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.1rem;
  flex-wrap: wrap;
  gap: 1rem;
  background: linear-gradient(90deg, #f0f4ff 0%, #e0e7ff 100%);
  border-radius: 14px;
  padding: 1.1rem 1.2rem 1rem 1.1rem;
  box-shadow: 0 2px 10px rgba(67, 97, 238, 0.07);

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.7rem;
    padding: 0.7rem 0.3rem 0.7rem 0.3rem;
    border-radius: 7px;
    margin-bottom: 0.7rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 600px) {
    gap: 0.5rem;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 40px;
  height: 40px;

  @media (max-width: 600px) {
    width: 32px;
    height: 32px;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4361ee;

  @media (max-width: 600px) {
    width: 32px;
    height: 32px;
    border-width: 1.5px;
  }
`;

const OnlineIndicator = styled.span`
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 9px;
  height: 9px;
  background: #22c55e;
  border: 1.5px solid #fff;
  border-radius: 50%;

  @media (max-width: 600px) {
    width: 7px;
    height: 7px;
    bottom: 2px;
    right: 2px;
  }
`;

const WelcomeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
`;
const WelcomeText = styled.div`
  font-size: 0.92rem;
  color: #3b82f6;
  font-weight: 500;
  display: flex;
  align-items: center;

  @media (max-width: 600px) {
    font-size: 0.82rem;
  }
`;

const UserName = styled.h1`
  font-size: 1.05rem;
  font-weight: 700;
  color: #101828;
  margin: 0.08rem 0 0.13rem 0;

  @media (max-width: 600px) {
    font-size: 0.85rem;
    margin: 0.05rem 0 0.1rem 0;
  }
`;

const DashboardType = styled.div`
  margin-top: 1px;
`;

const Badge = styled.span`
  display: inline-block;
  background-color: #F0F5FF;
  color: #3B82F6;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;

  @media (max-width: 600px) {
    font-size: 0.7rem;
    padding: 1.5px 6px;
    border-radius: 9px;
  }
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #F9FAFB;
  border-radius: 8px;
  padding: 6px 10px;

  @media (max-width: 600px) {
    gap: 5px;
    padding: 4px 5px;
    border-radius: 5px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 5px;
`;

const StatNumber = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #4361ee;

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;

  @media (max-width: 600px) {
    font-size: 0.65rem;
  }
`;

const StatDivider = styled.div`
  width: 2px;
  height: 18px;
  background: #e0e7ff;
`;

const FilterIcon = styled.span`
  color: #64748b;
  font-size: 0.95rem;
  margin-right: 0.3rem;
  display: flex;
  align-items: center;
`;


export default LearnersDashboard;