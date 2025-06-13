import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/Header/Header';
import SideMenu from '../components/SideMenu/SideMenu';
import AssignmentsDashboard from '../components/Dashboard/Learner/LearnersDashboard';
import CreateNewAssignment from '../components/Dashboard/Learner/CreateNewAssignment';
import AssignmentView from '../components/Dashboard/Learner/AssignmentView';
import { Outlet, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faTasks,
  faGraduationCap,
  faBook,
  faChartLine,
  faCog,
  faSignOutAlt,
  faBars,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const DashboardLayoutForLearners = ({ children = <CreateNewAssignment/> }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard'); 
  const [userData, setUserData] = useState({
    username: '',
    roles: [],
    tokenType: ''
  });
  const navigate = useNavigate();

  const [error, setError] = useState(null); 

  const outletContext = {
    isLoading,
    setIsLoading
  };

  const menuItems = [
    { icon: faTachometerAlt, label: 'Dashboard', id: 'dashboard' },
    { icon: faTasks, label: 'New Assignments', id: 'create', path: '/learner/create' },
    { icon: faGraduationCap, label: 'Learning Path', id: 'learning-path' },
    { icon: faBook, label: 'Resources', id: 'resources' },
    { icon: faChartLine, label: 'Progress', id: 'progress' },
    { icon: faCog, label: 'Settings', id: 'settings' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      setIsMobileView(isMobile);
      if (!isMobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt token');
        if (!token) {
          console.warn('No authentication token found. Navigating to login.');
          setIsLoggedIn(false); 
          setIsLoading(false); 
          return; 
        }

        const response = await axios.get('http://localhost:8081/api/users/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });

        setUserData(response.data);
        console.log("User data fetched successfully:", response.data);
        setIsLoggedIn(true); 
        setIsLoading(false);

      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error); 
        setIsLoading(false); 

        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);

          if (error.response.status === 401) {
            console.warn('Unauthorized access (401). Setting isLoggedIn to false.');
            setIsLoggedIn(false); 
          } else if (error.response.status === 403) {
            console.warn('Forbidden access (403).');
            //i will have to handle this later
          }
          
        } else if (error.request) {
          console.error('No response received from server:', error.request);
          // i will have to set a network error state for user display
        } else {
          console.error('Error setting up the request:', error.message);
        }
      }
    };

    fetchUserData();
  }, []); 

  
  useEffect(() => {
    if (!isLoggedIn && !isLoading) { 
      console.log('Navigating to login due to isLoggedIn being false.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate, isLoading]); 


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('jwt token');
      if (!token) {
        console.warn('No token found during logout attempt. Clearing local storage.');
        
        localStorage.removeItem('jwt token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        return;
      }

      
      const response = await axios.post(
        'http://localhost:8081/api/auth/logout',
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      console.log("Logout response:", response.data);

    } catch (error) {
      console.error('Logout error:', error);
      if (error.response) {
        console.error('Logout error response data:', error.response.data);
        console.error('Logout error response status:', error.response.status);
      } else if (error.request) {
        console.error('Logout error request:', error.request);
      } else {
        console.error('Logout error message:', error.message);
      }
      
    } finally {
      localStorage.removeItem('jwt token');
      localStorage.removeItem('user');
      setIsLoggedIn(false); 
    }
  };

  
  // if (isLoading) {

  //   return (
  //     <LoadingOverlay>
  //       <LoadingSpinner
  //         size="40px"
  //         thickness="4px"
  //         primaryColor="#156c7c"
  //         speed="0.8s"
  //         text="Loading user data..."
  //         textColor="#156c7c"
  //         textSize="16px"
  //       />
  //     </LoadingOverlay>
  //   );
  // }


  return (
    <LayoutContainer>
      <SideMenu isOpen={isOpen}
       setIsOpen={setIsOpen}
        isMobileView={isMobileView}
        menuItems={menuItems}
        handleLogout={handleLogout} />

      <MainContent isOpen={isOpen}>
        <Header handleLogout={handleLogout} userData={userData} />
        <ContentWrapper>
          {/* {isLoading && (
            <LoadingOverlay>
              <LoadingSpinner
                size="40px"
                thickness="4px"
                primaryColor="#156c7c"
                speed="0.8s"
                text="Loading user data..."
                textColor="#156c7c"
                textSize="16px"
              />
            </LoadingOverlay>
          )} */}
          <Outlet context={outletContext}/>
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
`;

const MainContent = styled.div`
  flex-grow: 1;
  margin-left: ${({ isOpen }) => (isOpen ? '280px' : '80px')};
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 80px;
    width: 350px;
  }
`;

const ContentWrapper = styled.div`
  position: relative; // This is crucial
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    /* padding: 1rem; */
  }
`;

const LoadingOverlay = styled.div`
 position: absolute; // Use fixed to cover the whole viewport
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9); 
  z-index: 9999; // Ensure it's on top
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default DashboardLayoutForLearners;