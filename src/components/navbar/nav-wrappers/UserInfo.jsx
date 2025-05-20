import styled from "styled-components";

const RolesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  max-width: 100%;
`;

const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const RoleBadge = styled.span`
  background-color: #e2e8f0;
  color: #4a5568;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background-color: #cbd5e0;
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 3px 6px;
  }
`;

function UserInfo({ name, roles = [] }) {
  return (
    <UserInfoWrapper>
      <UserName>{name}</UserName>
      <RolesContainer>
        {roles.map((role, index) => (
          <RoleBadge key={index}>{role}</RoleBadge>
        ))}
      </RolesContainer>
    </UserInfoWrapper>
  );
}

export default UserInfo;