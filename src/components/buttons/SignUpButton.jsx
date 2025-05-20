import styled from "styled-components";
const SignUp = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  min-width: 100px;
  text-align: center;

  &:hover {
    background-color: #388E3C;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    min-width: 80px;
  }

  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
    min-width: 70px;
  }
`;

function SignUpButton() {
    return(
        <SignUp aria-label={'Sign Up'} >Sign Up</SignUp>
    );


}

export default SignUpButton