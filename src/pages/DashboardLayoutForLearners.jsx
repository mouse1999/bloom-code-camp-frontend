// DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/Header/Header';
import SideMenu from '../components/SideMenu/SideMenu';
import AssignmentsDashboard from '../components/Dashboard/Learner/LearnersDashboard';
import CreateNewAssignment from '../components/Dashboard/Learner/CreateNewAssignment';
import AssignmentView from '../components/Dashboard/Learner/AssignmentView';

const DashboardLayoutForLearners = ({ children = <CreateNewAssignment/> }) => {
  const [isOpen, setIsOpen] = useState(true);
  const[isMobileView, setIsMobileView] = useState(false);

  const menuItems = [
    { icon: faTachometerAlt, label: 'Dashboard', id: 'dashboard' },
    { icon: faTasks, label: 'Assignments', id: 'assignments' },
    { icon: faGraduationCap, label: 'Learning Path', id: 'learning-path' },
    { icon: faBook, label: 'Resources', id: 'resources' },
    { icon: faChartLine, label: 'Progress', id: 'progress' },
    { icon: faCog, label: 'Settings', id: 'settings' },
  ];


  useEffect(() => {

    const checkMobile = () => {
      setIsMobileView(window.matchMedia("(max-width: 768px)").matches);
      //added to make the search menu open 
      if(!isMobileView) {
        setIsOpen(true);

      }
    }

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);

    };

  }, [] );

  

  // i will not to check screen resize so it will handle the sidemenu dynamics

  return (
    <LayoutContainer>
      <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} isMobileView={isMobileView} menuItems={menuItems} />
      
      <MainContent isOpen={isOpen}>
        <Header />
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

// Styled Components
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




export default DashboardLayoutForLearners;