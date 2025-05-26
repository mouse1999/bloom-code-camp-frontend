// Navbar.js
import { useState, useEffect } from 'react';
import styled from "styled-components";
import UserProfile from "./nav-wrappers/UserProfile";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBars, faUser, faEnvelope, faUsers } from '@fortawesome/free-solid-svg-icons';
import NavbarLink from "./nav-wrappers/NavbarLink";

const NavbarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 8px;
  width: 250px;
  background: #f8fafc;
  padding: 5px;
  height: calc(100vh - 60px); /* Full height minus the top nav */
  position: fixed;
  top: 60px; /* Push below top nav */
  left: 0;
  z-index: 90;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
`;


const NavForLinks = styled.nav`
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;

`;

const MobileMenuToggle = styled.button`
  /* Make it visible by default for debugging */
  display: none;
  align-items: center; /* Inherited from smaller screen styles */
  justify-content: center; /* Inherited from smaller screen styles */

  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  z-index: 2000; /* Ensure it stays above other elements */

  /* Default position for debugging on larger screens */
  position: static; /* Reset position for easier debugging, or set a fixed position */
  margin: 10px; /* Add some margin to see it clearly */
  width: auto; /* Allow width to adjust */
  height: auto; /* Allow height to adjust */
  padding: 8px; /* Default padding */
  border-radius: 8px; /* Default border-radius */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Keep shadow for visibility */
  border: 1px solid #e2e8f0; /* Keep border for visibility */
  background: #f8fafc; /* Keep background for visibility */
  


  @media (max-width: 768px) {
    /* These styles will still apply and override the defaults for smaller screens */
    /* display: block; // No longer needed as it's already display: flex */
    position: absolute;
    top: 10px;
    right: -40px; /* This might still hide it if the sidebar is off-screen */
    
    background: #f8fafc;
    padding: 8px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex; // No longer needed as it's already display: flex 
    align-items: center; // No longer needed as it's already display: flex 
    justify-content: center; // No longer needed as it's already display: flex 
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border: 1px solid #e2e8f0;
  }

  @media (max-width: 480px) {
    /* display: none; // COMMENT THIS OUT or REMOVE IT to keep it visible */
    /* If you want it to behave exactly like the 768px breakpoint, you can remove this entire media query */
    /* Or if you want different styles, define them here, but ensure display is not 'none' */
    display: flex; /* Ensure it remains visible */
    /* You might want to adjust its position here too if it's still off-screen */
    right: 10px; /* Example: Move it to the right edge for very small screens */
  }
`;

function Navbar() {
    const [activeTab, setActiveTab] = useState(0);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);


    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 1024 );
            if (window.innerWidth > 1024) setIsMobileOpen(false); // Auto-close when resizing to desktop
        };

        // Set initial value
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    const navLinkList = [
        { icon: <FontAwesomeIcon icon={faHome} />, message: "Create Assignment" , to : '/submit'},
        { icon: <FontAwesomeIcon icon={faBars} />, message: "Menu",to : '' },
        { icon: <FontAwesomeIcon icon={faUser} />, message: "Profile", to : '/submit' },
        { icon: <FontAwesomeIcon icon={faEnvelope} />, message: "Contact", to : '/submit' },
        { icon: <FontAwesomeIcon icon={faUsers} />, message: "Users", to : '/submit' }
    ];

    return (
        <>
        <MobileMenuToggle onClick={() =>setIsMobileOpen(!isMobileOpen) }>
        {isMobileOpen ? '✕' : '☰'}
        </MobileMenuToggle>


        <NavbarContainer style={{ 
        transform: isMobileView && !isMobileOpen ? 'translateX(-100%)' : 'translateX(0)'
      }}
        >
            <NavForLinks>
            {navLinkList.map((item, index) => (
                <NavbarLink
                    onClick={() => {
                        setActiveTab(index);
                        if(window.innerWidth <= 1024) {
                            setIsMobileOpen(false);
                        }
                    }}
                    fontElement={item.icon}
                    navLinkTitle={item.message}
                    activeTab={activeTab}
                    key={index}
                    index={index}
                    to={item.to}
                    
                />
            ))}
            </NavForLinks>
            <UserProfile name="Kufre Edward" roles={['Admin']} />
        </NavbarContainer>
        </>
    );
}

export default Navbar;