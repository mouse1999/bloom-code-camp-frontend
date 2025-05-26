import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock,
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';

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
        <Title>My Assignments</Title>
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
const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  color: #212529;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  background-color: ${({ active }) => active ? '#4361ee' : '#f1f3f5'};
  color: ${({ active }) => active ? 'white' : '#495057'};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ active }) => active ? '#3a56d9' : '#e9ecef'};
  }
`;

const AssignmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AssignmentCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  border-left: 4px solid ${({ status }) => {
    switch(status) {
      case 'in-progress': return '#f39c12';
      case 'submitted': return '#3498db';
      case 'rejected': return '#e74c3c';
      case 'completed': return '#2ecc71';
      default: return '#4361ee';
    }
  }};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f3f5;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #212529;
  flex-grow: 1;
`;

const StatusBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-left: 0.75rem;
  
  background-color: ${({ status }) => {
    switch(status) {
      case 'in-progress': return 'rgba(243, 156, 18, 0.1)';
      case 'submitted': return 'rgba(52, 152, 219, 0.1)';
      case 'rejected': return 'rgba(231, 76, 60, 0.1)';
      case 'completed': return 'rgba(46, 204, 113, 0.1)';
      default: return '#f1f3f5';
    }
  }};
  
  color: ${({ status }) => {
    switch(status) {
      case 'in-progress': return '#f39c12';
      case 'submitted': return '#3498db';
      case 'rejected': return '#e74c3c';
      case 'completed': return '#2ecc71';
      default: return '#495057';
    }
  }};
`;

const CardMenu = styled.button`
  background: none;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  margin-left: 0.75rem;
  padding: 0.25rem;
  
  &:hover {
    color: #495057;
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  margin-right: 0.5rem;
  color: #666;
  min-width: 100px;
`;

const DetailValue = styled.span`
  color: #212529;
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
  background-color: #f1f3f5;
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
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f3f5;
`;

const BranchInfo = styled.div`
  font-size: 0.85rem;
  color: #666;
  
  code {
    background-color: #f8f9fa;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    margin-left: 0.5rem;
    font-family: monospace;
    color: #495057;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ primary }) => primary ? `
    background-color: #4361ee;
    color: white;
    border: none;
    
    &:hover {
      background-color: #3a56d9;
    }
  ` : `
    background-color: transparent;
    border: 1px solid #4361ee;
    color: #4361ee;
    
    &:hover {
      background-color: rgba(67, 97, 238, 0.1);
    }
  `}
`;

export default AssignmentsDashboard;