import { faICursor } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components"

const Item = styled.div `
    background-color: #f8f9fa;
    padding: 1.25rem;
    border-radius: 8px;
    transition: transform 0.3s, box-shadow 0.3s;
    box-sizing: border-box;
    line-height: 1.6;
    &:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
    


`;

const DetailLabel = styled.div`
    font-weight: 500;
    color: #666;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
`;
const DetailValue = styled.div`
font-size: 1.1rem;
font-weight: 500;

`;

const AssignmentDetailItem = ({itemLabel, itemValue, fontIcon}) => {


    return(

        <Item>
            <DetailLabel>
                {fontIcon}
                {itemLabel}
            </DetailLabel>
            <DetailValue>{itemValue}</DetailValue>

        </Item>
    );


}



export default AssignmentDetailItem