import React, { useEffect, useState } from 'react'
import { AssignmentGrid, DashboardContainer } from '../Learner/LearnersDashboard'
import styled from 'styled-components'
import LoadingSpinner from '../../common/LoadingSpinner';
import AssignmentCard from '../../common/AssignmentCard';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth} from '../../../context/AuthContext';



function ReviewersDashboard({}) { 
    
    const [assignments, setAssignments] = useState([]);
    const [activeTab, setActiveTab] = useState("Available"); // Default active tab
    const [isLoading, setIsLoading] = useState(true);
    const [availableBadgeLength, setAvailableBadgeLength] = useState(0);
    const [error, setError] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true); // Assuming 'Available' is the initial tab
    const { userData } = useOutletContext(); // Assuming you have a context for loading state
    const [submittedAssignments, setSubmittedAssignments] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const fetchAssignments = async (tab) => {
      try {
        setIsLoading(true);
        const token = currentUser?.token || localStorage.getItem('jwt token');
        console.log("Current user token:", token);
        if (!token) {
          throw new Error('No authentication token found');
        }

        let endpoint = 'https://bloomcamp.onrender.com/api';
        if (tab && tab == 'Available') {
          endpoint += `/reviewer/assignments/claim-reclaim`;
        }else{
          endpoint += `/reviewer/assignments?status=${encodeURIComponent(tab)}`;
        }

        const response = await axios.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(`Assignments fetched for tab "${tab}":`, response.data);
        console.log(response.data);

        setAssignments(response.data);
        
        setError(null);
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message);
          console.log(`Error fetching assignments for tab "${tab}":`, err.response.data.message);
        } else if (err.request) {
          setError('No response from server. Please try again later.');
        } else {
          setError(err.message);
          console.log(`Error fetching assignments for tab "${tab}":`, err.message);
        }
        setAssignments([]); // Ensure assignments are cleared on error
      } finally {
        setIsLoading(false);
      }
  };

    
  
  // Function to fetch assignments with status "Submitted"
  const fetchClaimAndUnclaimAssignments = async () => {
    try {
      setIsLoading(true);
      const token = currentUser?.token || localStorage.getItem('jwt token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const endpoint = 'https://bloomcamp.onrender.com/api/reviewer/assignments/claim-reclaim';

      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("Submitted assignments fetched:", response.data);
      
  
      setAvailableBadgeLength(response.data.length);
      setError(null);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
        console.log("Error fetching submitted assignments:", err.response.data.message);
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError(err.message);
        console.log("Error fetching submitted assignments:", err.message);
      }
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleEdit = (assignmentId) => {
    console.log(`Editing assignment: ${assignmentId}`);
    navigate(`/reviewer/assignments/${assignmentId}/edit`); // Assuming navigate is available from react-router-dom
  };

  const handleView = (assignmentId) => {
    console.log(`Viewing assignment: ${assignmentId}`);
    navigate(`/reviewer/assignments/${assignmentId}/view`); // Assuming navigate is available from react-router-dom
  };

  


    const handleClaim = async (assignmentId) => {
    console.log(`Claiming assignment: ${assignmentId}`);
    try {
      const token = currentUser?.token || localStorage.getItem('jwt token');
      console.log("Current user token:", token);
      if (!token) {
        throw new Error('No authentication token found');
        return
      }
      const response = await axios.get(`https://bloomcamp.onrender.com/api/assignments/${assignmentId}/claim`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          withCredentials: true
        }
      });
      fetchAssignments("Available");
      fetchClaimAndUnclaimAssignments();
      
      
    } catch (err) {
      console.error(`Error claiming assignment ${assignmentId}:`, err);
      alert(`Failed to claim this assignment`);
      fetchAssignments("Available");

    }
  };

  const handleReclaim = async (assignmentId) => {
    console.log(`reclaiming assignment: ${assignmentId}`);
    try {
      const token = currentUser?.token || localStorage.getItem('jwt token');
      console.log("Current user token:", token);
      if (!token) {
        throw new Error('No authentication token found');
        return
      }
      const response = await axios.put(`https://bloomcamp.onrender.com/api/reviewer/assignments/${assignmentId}/reclaim`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          withCredentials: true
        }
      });
      fetchAssignments("Available");
      fetchClaimAndUnclaimAssignments();
      
      
    } catch (err) {
      console.error(`Error reclaiming assignment ${assignmentId}:`, err);
      alert(`Failed to reclaim assignment ${assignmentId}. Error: ${err.message}`);
      fetchAssignments("Available");

    }
  };

  
    useEffect(() => {
      fetchAssignments(activeTab);
       
        // eslint-disable-next-line
      }, [activeTab]);

    useEffect(() => {
      fetchClaimAndUnclaimAssignments();
    }, []);

    useEffect(() => {
      console.log('Current loading state:', isLoading);
      }, [isLoading]);
  
    return (
  <DashboardContainer>
    <ReviewHeader>
      <HeaderLeft>
        <AvatarContainer>
          <UserAvatar src="/src/assets/avatar.jpg" alt="User Avatar" />
          <OnlineIndicator />
        </AvatarContainer>
        <WelcomeContent>
          <WelcomeText>Welcome back,</WelcomeText>
          <UserName>{userData.username}</UserName>
          <DashboardType>
            <Badge>Reviewer Dashboard</Badge>
          </DashboardType>
        </WelcomeContent>
      </HeaderLeft>
      
      <HeaderRight>
        <StatsContainer>
          <StatItem>
            <StatNumber>24</StatNumber>
            <StatLabel>Reviews Completed</StatLabel>
          </StatItem>
          <StatDivider />
          <StatItem>
            <StatNumber>5</StatNumber>
            <StatLabel>Pending Reviews</StatLabel>
          </StatItem>
          <StatDivider />
          <StatItem>
            <StatNumber>98%</StatNumber>
            <StatLabel>Avg. Rating</StatLabel>
          </StatItem>
        </StatsContainer>
      </HeaderRight>
    </ReviewHeader>

    <TabsContainer>
      <Tabs>
        <Tab
          key="Available"
          active={activeTab === "Available"}
          onClick={() => {
            setActiveTab("Available");
            setIsAvailable(true);
          }}
        >
          Available
          {availableBadgeLength > 0 && (
            <TabBadge>{availableBadgeLength}</TabBadge>
          )}
        </Tab>
        <Tab
          key="In Review"
          active={activeTab === "In Review"}
          onClick={() => {
            setActiveTab("In Review");
            setIsAvailable(false);
          }}
        >
          In Review
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
        </Tab>
      </Tabs>
    </TabsContainer>
    {assignments.length === 0 && !isLoading ? (
      <TextMessage>No assignments found for this filter.</TextMessage>
    ) : (
      <AssignmentGrid>
      {assignments.map(assignment => (
        <AssignmentCard
          key={assignment.id}
          id={assignment.id}
          submittedDate={assignment.createdAt}
          ReviewedDate={assignment.reviewedAt}
          branch={assignment.branch}
          title={assignment.assignmentType}
          reviewer={assignment.codeReviewerName}
          learner={assignment.learnerName}
          gitHubURL={assignment.githubUrl}
          videoUrl={assignment.reviewVideoUrl}
          status={assignment.status}
          assignmentNumber={assignment.assignmentNumber}
          involved={"reviewer"}
          onEditClick={handleEdit}
          onViewClick={handleView}
          onClaimClick={handleClaim}
          onReclaimClick={handleReclaim}
        />
      ))}
    </AssignmentGrid>

    )}

    
  </DashboardContainer>
);

  }


const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  border: 1px solid #EAECF0;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 16px;
    border-radius: 10px;
  }

  @media (max-width: 600px) {
    padding: 10px 4px;
    border-radius: 7px;
    margin-bottom: 12px;
    gap: 0.7rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const UserAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #F4F6F8;

  @media (max-width: 600px) {
    width: 38px;
    height: 38px;
    border-width: 2px;
  }
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  background-color: #12B76A;
  border-radius: 50%;
  border: 2px solid #FFFFFF;

  @media (max-width: 600px) {
    width: 9px;
    height: 9px;
    border-width: 1.2px;
  }
`;

const WelcomeContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const WelcomeText = styled.span`
  font-size: 14px;
  color: #667085;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const UserName = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #101828;
  margin: 4px 0;

  @media (max-width: 600px) {
    font-size: 15px;
    margin: 2px 0;
  }
`;

const DashboardType = styled.div`
  margin-top: 4px;
`;

const Badge = styled.span`
  display: inline-block;
  background-color: #F0F5FF;
  color: #3B82F6;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;

  @media (max-width: 600px) {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
  }
`;

const HeaderRight = styled.div`
  @media (max-width: 900px) {
    width: 100%;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F9FAFB;
  border-radius: 12px;
  padding: 8px 12px;

  @media (max-width: 600px) {
    gap: 4px;
    padding: 5px 6px;
    border-radius: 7px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 8px;

  @media (max-width: 600px) {
    padding: 0 4px;
  }
`;

const StatNumber = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #101828;

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: rgb(98, 137, 221);

  @media (max-width: 600px) {
    font-size: 9px;
  }
`;

const StatDivider = styled.div`
  width: 1px;
  height: 32px;
  background-color: #EAECF0;

  @media (max-width: 600px) {
    height: 18px;
  }
`;

const TabsContainer = styled.div`
  margin: 1.5rem 0;

  @media (max-width: 600px) {
    margin: 0.7rem 0;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 600px) {
    gap: 0.4rem;
    margin-bottom: 0.7rem;
  }
`;

const Tab = styled.div`
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
  position: relative;
  color: #64748b;
  font-size: 0.95rem;

  ${({ active }) => active && `
    border-bottom-color: #3b82f6;
    color: #1e293b;
  `}

  &:hover {
    color: #1e293b;
  }

  @media (max-width: 600px) {
    font-size: 0.78rem;
    padding: 0.3rem 0.5rem;
  }
`;

const TabBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #3b82f6;
  color: white;
  border-radius: 9999px;
  padding: 0.15rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;

  @media (max-width: 600px) {
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
    top: -3px;
    right: -3px;
  }
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

  @media (max-width: 600px) {
    padding: 0.7rem 0.5rem;
    font-size: 0.85rem;
    border-radius: 7px;
    margin: 0.7rem 0;
    max-width: 98vw;
  }
`;


export default ReviewersDashboard