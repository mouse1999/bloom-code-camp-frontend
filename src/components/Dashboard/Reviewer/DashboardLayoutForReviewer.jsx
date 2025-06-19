import { useEffect, useState } from "react";
import CreateNewAssignment from "../Learner/CreateNewAssignment";
import Header from "../../Header/Header";
import SideMenu from "../../SideMenu/SideMenu";
import styled from "styled-components";
import { faBook, faChartLine, faCog, faGraduationCap, faTachometerAlt, faTasks } from "@fortawesome/free-solid-svg-icons";
import ReviewersDashboard from "./ReviewersDashboard";
import AssignmentView from "../Learner/AssignmentView";
import AssignmentReviewPage from "./AssignmentReviewPage"
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { Outlet } from "react-router-dom";

const DashboardLayoutForReviewer = ({ children = <AssignmentView/> }) => {

    const [isOpen, setIsOpen] = useState(true);
    const[isMobileView, setIsMobileView] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({
        username: '',
        roles: [],
        tokenType: ''
      });
      const value = {
        isLoading,
        setIsLoading,
        userData
      };

      const { logout } = useAuth();  
  

    const menuItems = [
        { icon: faTachometerAlt, label: 'Dashboard', id: 'Dashboard', path: '/reviewer' },
        { icon: faTasks, label: 'Learners', id: 'Learners' },
        { icon: faCog, label: 'Settings', id: 'Settings' }
      ];
  
    useEffect(() => {
  
      const checkMobile = () => {
        setIsMobileView(window.matchMedia("(max-width: 768px)").matches);
        //added to make the search menu open 
        if(!isMobileView) {
          setIsOpen(true);
  
        }
      }

    //this function will fetch assigment handled by a specific reviewer
  
      checkMobile();



      window.addEventListener('resize', checkMobile);
      return () => {
        window.removeEventListener('resize', checkMobile);
  
      };
  
    }, [] );


    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem('jwt token');
            if (!token) {
              console.warn('No authentication token found. Navigating to login.');
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


      const handleLogout = async () => {
    try {
      const token = localStorage.getItem('jwt token');
      if (!token) {
        console.warn('No token found during logout attempt. Clearing local storage.');
        
        
        return;
      }

      
      const response = await axios.post(
        'http://localhost:8081/api/users/logout',
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
      logout(); // Ensure logout is called to clear user state
    }
  };
    
  
    // i will not to check screen resize so it will handle the sidemenu dynamics
  
    return (
      <LayoutContainer>
        <SideMenu 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        isMobileView={isMobileView} 
        menuItems={menuItems}
        handleLogout={handleLogout} 
        
        />
        
        <MainContent isOpen={isOpen}>
          <Header handleLogout={handleLogout} userData={userData} />
          <ContentWrapper>

            <Outlet context={value} />

          </ContentWrapper>
        </MainContent>
      </LayoutContainer>
    );
  };
  
  // Styled ComponentsS
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
    flex-grow: 1;
    padding: 2rem;
    overflow-y: auto;
    
    @media (max-width: 768px) {
      /*padding: 1rem; */
    }
  `;
  
  
  
  
  export default DashboardLayoutForReviewer;