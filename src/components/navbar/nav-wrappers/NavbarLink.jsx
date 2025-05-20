import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavbarLinkContainer = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  text-decoration: none;
  color: inherit;
  white-space: nowrap;
  transition: all 0.2s ease;
  width: 12rem;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.active {
    font-weight: bold;
    color: #2563eb;
  }

  &.activate {
    background: #66bfdb;
  }


  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  margin-right: 2px;  // This controls the exact gap you want
  font-size: inherit;
`;

const TitleSpan = styled.span`
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 5px;  // Explicitly remove any left margin

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

function NavbarLink({ fontElement, navLinkTitle, onClick, activeTab, index }) {
  return (
    <NavbarLinkContainer
      to='/to'
      onClick={onClick}
      className={activeTab === index ? 'activate' : ''}
    >
      <IconWrapper>{fontElement}</IconWrapper>
      <TitleSpan>{navLinkTitle}</TitleSpan>
    </NavbarLinkContainer>
  );
}

export default NavbarLink;