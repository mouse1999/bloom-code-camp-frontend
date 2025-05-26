import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchBar from '../ui/SearchBar';
import { useEffect } from 'react';
import { 
  faUser, 
  faCog, 
  faQuestionCircle, 
  faSignOutAlt,
  faUserCircle,
  faCaretDown
} from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {

    const checkMobile = () => {
      setIsMobileView(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []); 

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev); 
  };



  return (
    <HeaderContainer>
      <HeaderTitle>My Assignments</HeaderTitle>
      
      <HeaderActions>
        <SearchBar setSearchQuery={setSearchQuery}></SearchBar>
        
        <UserProfile onClick={isMobileView ? toggleDropdown: undefined}>
          <UserButton>
            <UserAvatar>
              <FontAwesomeIcon icon={faUserCircle} />
            </UserAvatar>
            <UserName>John Doe</UserName>
            <FontAwesomeIcon icon={faCaretDown} />
          </UserButton>
          
          <UserDropdown isOpen={isDropdownOpen} isMobileView={isMobileView}>
            <DropdownItem href="#">
              <DropdownIcon icon={faUser} />
              Profile
            </DropdownItem>
            <DropdownItem href="#">
              <DropdownIcon icon={faCog} />
              Settings
            </DropdownItem>
            <DropdownItem href="#">
              <DropdownIcon icon={faQuestionCircle} />
              Help
            </DropdownItem>
            <DropdownItem href="#">
              <DropdownIcon icon={faSignOutAlt} />
              Logout
            </DropdownItem>
          </UserDropdown>
        </UserProfile>
      </HeaderActions>
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1.5rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 90;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  
  padding: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  padding: 0.5rem;
  border-radius: 9999px;
  transition: all 0.2s;
  gap: 0.5rem;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const UserAvatar = styled.div`
  font-size: 1.5rem;
  color: #3b82f6;
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    display: none;
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 200px;
  padding: 0.5rem 0;
  opacity: ${({ isOpen, isMobileView }) => (isOpen && isMobileView? '1' : '0')};
  visibility: ${({ isOpen, isMobileView }) => (isOpen && isMobileView ? 'visible' : 'hidden')};
  transition: all 0.3s;
  z-index: 95;
  
`;

const DropdownItem = styled.a`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #212529;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #f5f7fa;
  }
`;

const DropdownIcon = styled(FontAwesomeIcon)`
  margin-right: 0.75rem;
  color: #4361ee;
`;

const UserProfile = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;


  @media (min-width: 769px) { /* This media query targets larger screens */
    &:hover {
        ${UserDropdown} {
            opacity: 1;
            visibility: visible;
            top: 100%;
        }
    }
} 
`;

export default Header;