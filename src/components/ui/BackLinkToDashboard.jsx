import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const BackLinkWrapper = styled.button`
  color: #4361ee;
  margin-bottom: 1.5rem;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const BackLinkToDashboard = () => {
  const navigate = useNavigate();

  return (
    <BackLinkWrapper onClick={() => navigate(-1)}>
      <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
    </BackLinkWrapper>
  );
};

export default BackLinkToDashboard;