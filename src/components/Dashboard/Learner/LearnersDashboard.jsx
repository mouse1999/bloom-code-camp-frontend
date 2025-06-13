import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AssignmentCard from './AssignmentCard';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

const LearnersDashboard = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);
  const { isLoading, setIsLoading } = useOutletContext();

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
    // navigate(`/assignments/${assignmentId}/edit`); // Assuming navigate is available from react-router-dom
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
    // navigate(`/assignments/${assignmentId}/view`); // Assuming navigate is available from react-router-dom
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
      <DashboardHeader>
        <WelcomeContainer>
          <Title>Welcome, Kufre Edward</Title>
          <WelcomeParagraph>This space is for specific information</WelcomeParagraph>
        </WelcomeContainer>
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
        {/* Conditional rendering for "No assignment found" */}
        {!isLoading && assignments.length === 0 && (
          <TextMessage>No assignment found under this filter.</TextMessage>
        )}
      </DashboardHeader>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <AssignmentGrid>
          {assignments.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              submittedDate={assignment.createdAt}
              ReviewedDate={assignment.reviewedAt}
              branch={assignment.branch}
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
  padding: 16px;
  margin: 16px 0;
  border-radius: 8px;
  font-size: 1.2rem;
  text-align: center;
  font-weight: 500;
  border: 1px solid transparent;
  `;

export default LearnersDashboard;