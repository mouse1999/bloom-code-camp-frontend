import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";

const BackLinkWrapper = styled(Link)`
  color: #4361ee;
  margin-bottom: 1.5rem;
  color: #4361ee;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
 align-items: center;
  gap: 0.5rem;
  &: hover {
  text-decoration: underline;
  
  }

`;

const BackLinkToDashboard = () => {


    return(
        <BackLinkWrapper>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
        </BackLinkWrapper>
    );


}


export default BackLinkToDashboard