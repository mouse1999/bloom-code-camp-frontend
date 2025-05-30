import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
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
import { Link } from 'react-router-dom';

const SideMenu = ({
  isOpen,
  setIsOpen,
  isMobileView,
  menuItems,
  activeItem,
  setActiveItem

}) => {
  

  const onToggle = (id) => {
    setActiveItem(id);
    if(isMobileView) {
      setIsOpen(false)

    };
  }



  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>

      {
        isMobileView && (
          <ToggleButton onClick={() => setIsOpen(!isOpen)}>
          {
            isOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />
          }
        </ToggleButton>

        )
      }

        {isOpen && <SidebarTitle>Bloom Code Camp</SidebarTitle>}

        
      </SidebarHeader>

      <MenuItems>
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            active={activeItem === item.id}
            onClick={() => onToggle(item.id)}
            to={"/login"}
          >
            <MenuItemIcon>
              <FontAwesomeIcon icon={item.icon} />
            </MenuItemIcon>
            {isOpen && <MenuItemLabel>{item.label}</MenuItemLabel>}
          </MenuItem>
        ))}
      </MenuItems>

      <SidebarFooter>
        <LogoutButton>
          <FontAwesomeIcon icon={faSignOutAlt} />
          {isOpen && <span>Logout</span>}
        </LogoutButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};

// Styled Components
const SidebarContainer = styled.div`
  width: ${({ isOpen }) => (isOpen ? '17.5rem' : '5rem')};
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  color: white;
  padding: 1.5rem 0;
  transition: all 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 100;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    /* transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')}; */

    width: ${({ isOpen }) => (isOpen ? '12.5rem' : '5rem')};


    
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 500;
`;

const SidebarTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap;
  padding-left: 0.3rem;


   @media (max-width: 768px) {
   font-size: 0.8rem;
  font-weight: 600;

   
   }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
`;

const MenuItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

const MenuItem = styled(Link)`
  margin-bottom: 0.5rem;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  text-decoration: none;
  color: white;

  transition: all 0.3s;
  display: flex;
  align-items: center;
  background-color: ${({ active }) => (active ? 'rgba(255, 255, 255, 0.2)' : 'transparent')};
  position: relative;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background-color: ${({ active }) => (active ? 'white' : 'transparent')};
  }
`;

const MenuItemIcon = styled.div`
  margin-right: ${({ isOpen }) => (isOpen ? '2rem' : '0')};
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
`;

const MenuItemLabel = styled.span`
  white-space: nowrap;
  font-weight: 500;
  margin-left: 1rem;
  @media (max-width: 768px) {
   font-size: 0.8rem;
}
`;

const SidebarFooter = styled.div`
  padding: 1.5rem;
  margin-top: auto;
  margin-bottom: 5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  border-radius: 30px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default SideMenu;