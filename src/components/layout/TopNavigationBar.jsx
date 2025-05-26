import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faBell, 
  faUserCircle,
  faCaretDown,
  faSignOutAlt,
  faCog,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../ui/SearchBar';

const TopNavigationBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login');
  };

  return (
    <NavbarContainer isScrolled={isScrolled}>
      <NavbarContent>
        <LeftSection>
          <Logo to="/">EduPlatform</Logo>
          <MobileMenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
            ☰
          </MobileMenuButton>
        </LeftSection>

        <CenterSection showMobileMenu={showMobileMenu}>
          <NavLink to="/">
            <Icon icon={faHome} />
            <span>Home</span>
          </NavLink>
          <SearchBar />
        </CenterSection>

        <RightSection>
          <UserDropdown>
            <UserButton onClick={() => setShowUserDropdown(!showUserDropdown)}>
              <UserAvatar>
                <Icon icon={faUserCircle} />
              </UserAvatar>
              <UserName>John Doe</UserName>
              <Icon icon={faCaretDown} />
            </UserButton>

            {showUserDropdown && (
              <DropdownMenu>
                <DropdownItem>
                  <Icon icon={faUserCircle} />
                  <span>Profile</span>
                </DropdownItem>
                <DropdownItem>
                  <Icon icon={faCog} />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={handleLogout}>
                  <Icon icon={faSignOutAlt} />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            )}
          </UserDropdown>
        </RightSection>
      </NavbarContent>
    </NavbarContainer>
  );
};

// Styled Components
const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${props => props.isScrolled ? 'rgba(255, 255, 255, 0.95)' : '#ffffff'};
  box-shadow: ${props => props.isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.8rem 1.5rem;
  height: 60px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  gap: 2rem;
  padding: 0 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    display: ${props => props.showMobileMenu ? 'flex' : 'none'};
    z-index: 999;
    gap: 0.2rem;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  text-decoration: none;
  margin-right: 2rem;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4b5563;

  @media (max-width: 768px) {
    display: block;
    z-index:
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  white-space: nowrap;

  &:hover {
    color: #3b82f6;
  }

  span {
    margin-left: 0.5rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    width: 100%;
  }
`;

const UserDropdown = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const UserAvatar = styled.div`
  margin-right: 0.5rem;
  font-size: 1.5rem;
  color: #3b82f6;
`;

const UserName = styled.span`
  margin-right: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    display: none;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 200px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  z-index: 1000;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f9fafb;
    color: #3b82f6;
  }

  span {
    margin-left: 0.75rem;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background-color: #f3f4f6;
  margin: 0.5rem 0;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 1rem;
`;

export default TopNavigationBar;