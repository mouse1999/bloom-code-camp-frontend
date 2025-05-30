import React, { useState } from 'react';
import styled from 'styled-components';
import AssignmentCard from './AssignmentCard';

const AssignmentsDashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample assignment data
  const assignments = [
    {
      id: 1,
      title: 'Responsive Portfolio',
      course: 'Web Development 101',
      dueDate: '2023-06-15',
      status: 'in-progress',
      progress: 65,
      branch: 'portfolio-assignment'
    },
    {
      id: 2,
      title: 'JavaScript Calculator',
      course: 'JavaScript Fundamentals',
      dueDate: '2023-06-10',
      status: 'submitted',
      feedback: 'Pending review',
      branch: 'js-calculator'
    },
    {
      id: 3,
      title: 'React Todo App',
      course: 'React Basics',
      dueDate: '2023-05-28',
      status: 'rejected',
      feedback: 'State management needs improvement',
      branch: 'react-todo'
    },
    {
      id: 4,
      title: 'Node.js API',
      course: 'Backend Development',
      dueDate: '2023-05-20',
      status: 'completed',
      score: '95/100',
      branch: 'node-api'
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    if (activeFilter === 'all') return true;
    return assignment.status === activeFilter;
  });

  return (
    <DashboardContainer>
      <DashboardHeader>
        <WelcomeContainer>
          <Title>Welcome, Kufre Edward</Title>
          <WelcomeParagraph>This space is for specific information</WelcomeParagraph>
        </WelcomeContainer>

        

        <FilterControls>
          <FilterButton 
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'in-progress'}
            onClick={() => setActiveFilter('in-progress')}
          >
            In Progress
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'submitted'}
            onClick={() => setActiveFilter('submitted')}
          >
            Submitted
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'completed'}
            onClick={() => setActiveFilter('completed')}
          >
            Completed
          </FilterButton>
        </FilterControls>
      </DashboardHeader>

      <AssignmentGrid>
        {filteredAssignments.map(assignment => (
          <AssignmentCard 
          key={assignment.id} 
          status={assignment.status}
          title={assignment.title}
          course ={assignment.course}
          branch={assignment.branch}
          description={assignment.description}
          progress={assignment.progress}
          feedback={assignment.feedback}
          dueDate ={assignment.dueDate}
          
          >
            
          </AssignmentCard>
        ))}
      </AssignmentGrid>


    </DashboardContainer>
  );
};

// Styled Components

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

export default AssignmentsDashboard;