import React, { useEffect, useState } from 'react'
import { AssignmentGrid, DashboardContainer } from '../Learner/LearnersDashboard'
import styled from 'styled-components'
import LoadingSpinner from '../../ui/LoadingSpinner';
import AssignmentCard from '../Learner/AssignmentCard';

function ReviewersDashboard({ userRole }) { // Assuming userRole is passed as a prop
    
    const [assignments, setAssignments] = useState([]);
    const [activeTab, setActiveTab] = useState("Available"); // Default active tab
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true); // Assuming 'Available' is the initial tab

    const fetchAssignments = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Replace with your actual API endpoint for fetching assignments
          // const response = await fetch('/api/assignments');
          // if (!response.ok) {
          //   throw new Error(`HTTP error! Status: ${response.status}`);
          // }
          // const data = await response.json();
  
          // --- Simulated Data for Demonstration ---
          const dummyData = [
            { id: 1, title: 'Responsive Portfolio', course: 'Web Development 101', dueDate: '2023-06-15', status: 'Pending Submission', progress: 65, branch: 'portfolio-assignment', reviewersName: null },
            { id: 2, title: 'JavaScript Calculator', course: 'JavaScript Fundamentals', dueDate: '2023-06-10', status: 'Submitted', feedback: 'Pending review', branch: 'js-calculator', reviewersName: null },
            { id: 3, title: 'React Todo App', course: 'React Basics', dueDate: '2023-05-28', status: 'Needs Update', feedback: 'State management needs improvement', branch: 'react-todo', reviewersName: "jen" },
            { id: 4, title: 'Node.js API', course: 'Backend Development', dueDate: '2023-05-20', status: 'Completed', score: '95/100', branch: 'node-api', reviewersName: "jen" },
            { id: 5, title: 'Login Page Redesign', course: 'UI/UX Basics', dueDate: '2023-06-20', status: 'Submitted', feedback: 'Needs review', branch: 'login-redesign', reviewersName: null }, // Another submitted
            { id: 6, title: 'Database Schema Design', course: 'Database Fundamentals', dueDate: '2023-07-01', status: 'Pending SubmissioN', progress: 20, branch: 'db-schema', reviewersName: null },
            { id: 1, title: 'Responsive Portfolio', course: 'Web Development 101', dueDate: '2023-06-15', status: 'In Review', progress: 65, branch: 'portfolio-assignment', reviewersName: "kely" }
          ];
          // --- End Simulated Data ---
  
          setAssignments(dummyData); // Update state with fetched dat
        } catch (err) {
          setError(err);
          console.error("Error fetching assignments:", err);
        } finally {
          setIsLoading(false);
        }
      };



    const handleEditAssignment = (assignmentId) => {
      console.log(`Editing assignment with ID: ${assignmentId}`);
      // Implement navigation to edit page, e.g., navigate(`/assignments/${assignmentId}/edit`);
    };
  
    const handleSubmitAssignment = (assignmentId) => {
      console.log(`Submitting assignment with ID: ${assignmentId}`);
      // Call API to submit. After success, re-fetch assignments.
      // fetchAssignments(); // <-- Call this after successful API call
    };
  
    const handleViewAssignment = (assignmentId) => {
      console.log(`Viewing assignment with ID: ${assignmentId}`);
      // Implement navigation to view page, e.g., navigate(`/assignments/${assignmentId}/view`);
    };
  
    const handleResubmitAssignment = (assignmentId) => {
      console.log(`Resubmitting assignment with ID: ${assignmentId}`);
      // Call API to resubmit. After success, re-fetch assignments.
      // fetchAssignments(); // <-- Call this after successful API call
    };
  
    const handleClaimAssignment = async (assignmentId) => {
      console.log(`Claiming assignment with ID: ${assignmentId}`);
      try {
    
        // const response = await fetch(`/api/assignments/${assignmentId}/claim`, { method: 'POST' });
        // if (!response.ok) throw new Error('Failed to claim');
        // console.log(`Assignment ${assignmentId} claimed successfully!`);
  
        // For demonstration, update local state directly
        setAssignments(prevAssignments =>
          prevAssignments.map(assign =>
            assign.id === assignmentId ? { ...assign, reviewersName: 'Current Reviewer' } : assign
          )
        );
      } catch (err) {
        console.error("Error claiming assignment:", err);
        // Show error message to user
      } finally {
        // Re-fetch assignments after action, or simply update local state optimistically
        // fetchAssignments(); // More robust if you need to sync with backend
      }
    };
  
  
    const handleReclaimAssignment = async (assignmentId) => {
      console.log(`Reclaiming assignment with ID: ${assignmentId}`);
      try {
        // Replace with your actual API call to reclaim an assignment
        // const response = await fetch(`/api/assignments/${assignmentId}/reclaim`, { method: 'POST' });
        // if (!response.ok) throw new Error('Failed to reclaim');
        // console.log(`Assignment ${assignmentId} reclaimed successfully!`);
  
        // For demonstration, update local state directly
        setAssignments(prevAssignments =>
          prevAssignments.map(assign =>
            assign.id === assignmentId ? { ...assign, reviewersName: "review" } : assign
          )
        );
      } catch (err) {
        console.error("Error reclaiming assignment:", err);
        // Show error message to user
      } finally {
        // Re-fetch assignments after action, or simply update local state optimistically
        // fetchAssignments(); // More robust
      }
    };
  
    // --- Data Fetching Effect ---
    // This useEffect fetches data when the component mounts
    useEffect(() => {
      
      fetchAssignments();
    }, []); // Empty dependency array: runs only once on mount
  
    // --- Filtering Logic (now uses the state variable `assignments`) ---
    const getFilteredAssignments = (tabStatus) => {
      if (tabStatus === "Available") {
        // For reviewer "Available" tab: submitted assignments not yet claimed
        return assignments.filter(assignment =>
          assignment.status === 'Submitted' && (!assignment.reviewersName || assignment.reviewersName.trim() === '')
        );
      }
      // For other tabs, filter by status
      return assignments.filter(assignment => assignment.status === tabStatus);
    };
  
    const displayAssignments = getFilteredAssignments(activeTab);
  
    return (
      <DashboardContainer>
        <ReviewHeader>
          <WelcomeTitle>Welcome back, Kufre! </WelcomeTitle>
          <WelcomeParagaph>This is info specific for testing of application</WelcomeParagaph>
        </ReviewHeader>
  
        <Tabs>
          <Tab
            key="Available"
            active={activeTab === "Available"}
            onClick={() => {
              setActiveTab("Available");
              setIsAvailable(true); // Keep this if 'isAvailable' dictates a specific view mode
            }}
          >
            Available
            <TabBadge>{getFilteredAssignments("Available").length}</TabBadge>
          </Tab>
          <Tab
            key="In Review"
            active={activeTab === "In Review"}
            onClick={() => {
              setActiveTab("In Review");
              setIsAvailable(false); // Likely means it's not the 'Available' tab
            }}
          >
            In Review
            <TabBadge>
              {getFilteredAssignments("In Review").length}
            </TabBadge>
          </Tab>
          <Tab
            key="Completed"
            active={activeTab === "Completed"}
            onClick={() => {
              setActiveTab("Completed");
              setIsAvailable(false);
            }}
          >
            Completed
            <TabBadge>
              {getFilteredAssignments("Completed").length}
            </TabBadge>
          </Tab>
          <Tab
            key="Needs Update"
            active={activeTab === "Needs Update"}
            onClick={() => {
              setActiveTab("Needs Update");
              setIsAvailable(false);
            }}
          >
            Rejected
            <TabBadge>
              {getFilteredAssignments("Needs Update").length}
            </TabBadge>
          </Tab>
        </Tabs>
  
        <AssignmentGrid>
          <LoadingSpinner isLoading={isLoading} />
          {error && <div>Error: {error.message}</div>}
          {(!isLoading && !error && displayAssignments.length === 0) && (
            <div>No assignments found for this category.</div>
          )}
  
          {/* Render based on `displayAssignments` */}
          {displayAssignments.map(assignment => (
            <AssignmentCard
              involved={"reviewer"} // Use the prop for the role here!
              id={assignment.id}
              key={assignment.id}
              status={assignment.status}
              title={assignment.assignmentType}
              course={assignment.course}
              branch={assignment.branch}
              description={assignment.description}
              feedback={assignment.feedback}
              submittedDate={assignment.dueDate} // Assuming dueDate acts as submittedDate here
              reviewersName={assignment.reviewersName} // Pass reviewersName
              // Pass all action handlers
              onEditClick={handleEditAssignment}
              onSubmitClick={handleSubmitAssignment}
              onViewClick={handleViewAssignment}
              onResubmitClick={handleResubmitAssignment}
              onClaimClick={handleClaimAssignment}
              onReclaimClick={handleReclaimAssignment}
            />
          ))}
        </AssignmentGrid>
      </DashboardContainer>
    );
  }


const Tabs = styled.div`
display: flex;
border-bottom: 1px solid #eee;
margin-bottom: 1.5rem;
overflow-x: auto;
padding-bottom: 2px;

`;

const Tab = styled.div`
   padding: 0.75rem 1.5rem;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    font-weight: 550;
    transition: all 0.3s;
    white-space: nowrap;
    position: relative;
    color: #666;
    line-height: 1.6;
     border-bottom: 4px solid transparent;
    transition: border-bottom-color 0.3s ease-in-out;
    ${({active})=> active && `
    border-bottom-color: red;
    
    `}

`;

const TabBadge = styled.span`
position: absolute;
    top: 0px;
    right: 5px;
    background-color: #4361ee;
    color: white;
    border-radius: 10px;
    padding: 0.15rem 0.5rem;
    font-size: 0.5rem;
    font-weight: 600;

`;

const ReviewHeader = styled.div`
padding: 1rem; /* 16px */

    /* border-b */
    border-bottom-width: 1px;
    border-bottom-style: solid;

    /* border-blue-500/30 */
    border-bottom-color: rgba(59, 130, 246, 0.3); 
    box-sizing: border-box;
    border-color: #506e8d;
    border-style: solid;
    border-radius: 10px;
    font-size: 1.25rem; /* 20px */
    line-height: 1.75rem; /* 28px */
    margin-bottom: 0.9rem;

    /* font-bold */
    font-weight: 700;
    background-color: #566dbb;
    max-width: 800px;
    

`;

const WelcomeTitle = styled.h1`
font-size: 1.5rem;
line-height: 2rem;
font-weight: 700;
margin-top: 0;
color: white;
`;

const WelcomeParagaph = styled.p`
margin-top: 0;
font-size: 0.95rem;
color: white;

`;

export default ReviewersDashboard