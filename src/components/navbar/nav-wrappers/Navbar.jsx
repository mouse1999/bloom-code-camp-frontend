// Navbar.js
import { useState } from 'react';
import styled from "styled-components";
import UserProfile from "./UserProfile";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBars, faUser, faEnvelope, faUsers } from '@fortawesome/free-solid-svg-icons';
import NavbarLink from "./NavbarLink";

const NavbarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 250px;
  background: #f8fafc;
  padding: 5px;
  height: 100vh;
  position: fixed;
`;

const NavForLinks = styled.nav`
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

function Navbar() {
    const [activeTab, setActiveTab] = useState(0);
    
    const navLinkList = [
        { icon: <FontAwesomeIcon icon={faHome} />, message: "Dashboard" },
        { icon: <FontAwesomeIcon icon={faBars} />, message: "Menu" },
        { icon: <FontAwesomeIcon icon={faUser} />, message: "Profile" },
        { icon: <FontAwesomeIcon icon={faEnvelope} />, message: "Contact" },
        { icon: <FontAwesomeIcon icon={faUsers} />, message: "Users" }
    ];

    return (
        <NavbarContainer>
            <NavForLinks>
            {navLinkList.map((item, index) => (
                <NavbarLink
                    onClick={() => setActiveTab(index)}
                    fontElement={item.icon}
                    navLinkTitle={item.message}
                    activeTab={activeTab}
                    key={index}
                    index={index}
                />
            ))}
            </NavForLinks>
            <UserProfile name="Kufre Edward" roles={['Admin', 'User']} />
        </NavbarContainer>
    );
}

export default Navbar;