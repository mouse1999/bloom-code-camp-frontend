import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchBar from '../common/SearchBar';
import {
  faUser,
  faCog,
  faQuestionCircle,
  faSignOutAlt,
  faUserCircle,
  faCaretDown
} from '@fortawesome/free-solid-svg-icons';

const Header = ({
  activeHeaderTitle,
  handleLogout,
  userData
}) => {
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

  // Close dropdown on click outside (for mobile)
  useEffect(() => {
    if (!isMobileView || !isDropdownOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.user-profile-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isDropdownOpen, isMobileView]);

  return (
    <HeaderContainer>
      <HeaderLeft>
        <HeaderTitle>{activeHeaderTitle}</HeaderTitle>
      </HeaderLeft>
      <HeaderRight>
        <HeaderActions>
          <SearchBarWrapper>
            <SearchBar setSearchQuery={setSearchQuery} />
          </SearchBarWrapper>
          <UserProfile
            className="user-profile-dropdown"
            onClick={isMobileView ? toggleDropdown : undefined}
          >
            <UserButton>
              <UserAvatar>
                <FontAwesomeIcon icon={faUserCircle} />
              </UserAvatar>
              <UserName>{userData.username || "User"}</UserName>
              <FontAwesomeIcon icon={faCaretDown} />
            </UserButton>
            <UserDropdown isOpen={isDropdownOpen} isMobileView={isMobileView}>
              <DropdownItem>
                <DropdownIcon icon={faUser} />
                Profile
              </DropdownItem>
              <DropdownItem>
                <DropdownIcon icon={faCog} />
                Settings
              </DropdownItem>
              <DropdownItem>
                <DropdownIcon icon={faQuestionCircle} />
                Help
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                <DropdownIcon icon={faSignOutAlt} />
                Logout
              </DropdownItem>
            </UserDropdown>
          </UserProfile>
        </HeaderActions>
      </HeaderRight>
    </HeaderContainer>
  );
};

// Styled Components

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 90;

  @media (max-width: 900px) {
    padding: 0.6rem 1rem;
  }
  @media (max-width: 600px) {
    padding: 0.5rem 0.5rem;
    height: auto;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 1.7rem;
  font-weight: 700;
  color: #212529;
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 900px) {
    font-size: 1.2rem;
  }
  @media (max-width: 600px) {
    font-size: 1.05rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-right: 1rem;

  @media (max-width: 768px) {
    gap: 2rem;
  }
  @media (max-width: 600px) {
    gap: 2rem;
  }
`;

const SearchBarWrapper = styled.div`
  min-width: 220px;
  max-width: 320px;
  width: 100%;

  @media (max-width: 900px) {
    min-width: 120px;
    max-width: 200px;
  }
  @media (max-width: 600px) {
    min-width: 90px;
    max-width: 120px;
  }
`;

const UserProfile = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  padding: 0.5rem 0.7rem;
  border-radius: 9999px;
  transition: background 0.2s;
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
  font-size: 1rem;
  color: #212529;

  @media (max-width: 900px) {
    display: none;
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  width: 200px;
  padding: 0.5rem 0;
  opacity: ${({ isOpen, isMobileView }) => (isOpen && isMobileView ? '1' : '0')};
  visibility: ${({ isOpen, isMobileView }) => (isOpen && isMobileView ? 'visible' : 'hidden')};
  transition: all 0.3s;
  z-index: 95;

  @media (min-width: 769px) {
    opacity: 0;
    visibility: hidden;
    top: 100%;
    right: 0;
    ${UserProfile}:hover & {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const DropdownItem = styled.a`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #212529;
  text-decoration: none;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover, &:focus {
    background-color: #f5f7fa;
    outline: none;
  }
`;

const DropdownIcon = styled(FontAwesomeIcon)`
  margin-right: 0.75rem;
  color: #4361ee;
`;

export default Header;