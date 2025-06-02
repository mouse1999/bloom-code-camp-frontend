import { useEffect, useState } from "react";
import CreateNewAssignment from "../Learner/CreateNewAssignment";
import Header from "../../Header/Header";
import SideMenu from "../../SideMenu/SideMenu";
import styled from "styled-components";
import { faBook, faChartLine, faCog, faGraduationCap, faTachometerAlt, faTasks } from "@fortawesome/free-solid-svg-icons";
import ReviewersDashboard from "./ReviewersDashboard";
import AssignmentView from "../Learner/AssignmentView";
import ReviewerAssignmentView from "./ReviewerAssignmentView";

const DashboardLayoutForReviewer = ({ children = <AssignmentView/> }) => {

    const [isOpen, setIsOpen] = useState(true);
    const[isMobileView, setIsMobileView] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const [assignments, setAssignment] = useState({});
  

    const menuItems = [
        { icon: faTachometerAlt, label: 'Dashboard', id: 'Dashboard' },
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

        const fetchAssignments = () => {



        }
        fetchAssignments();



    }, []);
    
  
    
  
    // i will not to check screen resize so it will handle the sidemenu dynamics
  
    return (
      <LayoutContainer>
        <SideMenu 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        isMobileView={isMobileView} 
        menuItems={menuItems} 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        />
        
        <MainContent isOpen={isOpen}>
          <Header activeHeaderTitle={activeItem}  />
          <ContentWrapper>
            {children}
        
    
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