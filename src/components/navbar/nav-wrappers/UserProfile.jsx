import styled from "styled-components";
import UserInfo from "./UserInfo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const UserProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background-color: inherit;
  /*border-radius: 8px; */
  width: 100%;
  max-width: 400px;
  margin-bottom: 1.6rem;
  box-sizing: border-box;
  border-top: 1px solid #eff2f5; 

  @media (max-width: 480px) {
    gap: 12px;
    padding: 8px;
  }
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #e2e8f0;
  color: #4a5568;
  font-size: 1.5rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

function UserProfile({ name, roles }) {
  return (
    <UserProfileContainer>
      <Avatar>
        <FontAwesomeIcon icon={faUser} />  
      </Avatar>
      <UserInfo name={name} roles={roles} />
    </UserProfileContainer>
  );
}

export default UserProfile;