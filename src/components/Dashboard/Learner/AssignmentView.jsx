import styled from "styled-components";
import BackLinkToDashboard from "../../ui/BackLinkToDashboard";
import { DashboardContainer } from "./LearnersDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AssignmentDetailItem from "../../ui/AssignmentDetailItem";
import { useEffect, useState } from "react";
import { faCheckCircle, faClock, faExclamationCircle, faInfoCircle, faUserCircle } from "@fortawesome/free-solid-svg-icons";

const AssignmentViewContainer = styled.div`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;

    


`;
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
`;

// const StatusSpan = styled.span`
// padding: 0.5rem 1.25rem;
//     border-radius: 30px;
//     font-weight: 600;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//     font-size: 0.85rem;
//     background-color: rgba(46, 204, 113, 0.1);
//     color: #2ecc71;

// `;
const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  background-color: ${({ status }) => {
    switch(status) {
      case 'in-progress': return 'rgba(243, 156, 18, 0.1)';
      case 'submitted': return 'rgba(52, 152, 219, 0.1)';
      case 'completed': return 'rgba(46, 204, 113, 0.1)';
      case 'rejected': return 'rgba(231, 76, 60, 0.1)';
      default: return '#f1f3f5';
    }
  }};
  
  color: ${({ status }) => {
    switch(status) {
      case 'in-progress': return '#f39c12';
      case 'submitted': return '#3498db';
      case 'completed': return '#2ecc71';
      case 'rejected': return '#e74c3c';
      default: return '#495057';
    }
  }};
  `;

const SectionTitle = styled.div`
    
    font-weight: 600;
    margin-bottom: 1.25rem;
    color: #212529;
    display: flex;
    align-items: center;
    gap: 0.75rem;

`;

const AssignmentDetails = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

`;


const AssignmentView = () => {

const [assignmentDetail, setAssignmentDetail] = useState([
    {
      label: "SubmittedDate",
      value: "May 20, 2024", // or whatever toLocaleDateString formats to
      icon: faUserCircle
    }
]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [assignment, setAssignment] = useState({})



    const processAssignmentForDisplay = (assignmentData) => {
        const details = [];
      
        const assignmentMapping = {
            "Submitted Date": { value: assignmentData.submittedAt, icon: faUserCircle },
            "Reviewed Date": { value: assignmentData.reviewedAt, icon: faUserCircle },
            "Branch": { value: assignmentData.branch, icon: faUserCircle },
            "Reviewer": { value: assignmentData.reviewerId, icon: faUserCircle },
            "GitHub Repository URL": { value: assignmentData.githubUrl, icon: faUserCircle },
    
          };
      
    
        for (const label in assignmentMapping) {
            const { value: rawValue, icon: defaultIcon }= assignmentMapping[label];
      
        if (rawValue !== null && typeof rawValue !== 'undefined') {
            let formattedValue = rawValue;
            let displayIcon = defaultIcon
      
            // Format dates if they exist
            if (label.includes("Date") && rawValue instanceof Date === false) { // Ensure it's not already a Date object
              try {
                const date = new Date(rawValue);
                if (!isNaN(date)) { // Check if it's a valid date
                    formattedValue = date.toLocaleDateString(); 
        
                }
              } catch (e) {
        
                formattedValue = rawValue;
              }

            }else if (label === "GitHub Repository URL") {
                formattedValue = <a href={rawValue} target="_blank" rel="noopener noreferrer">{rawValue}</a>;
            }
            
           details.push({
           label: label,
           value: formattedValue,
           icon: displayIcon 
               });
           }
        }
        return details;
      };

/*
      useEffect(() => {
        const fetchAndProcessAssignment = async () => {
          try {
            setLoading(true);
            setError(null); // Clear previous errors
    
            const rawData = await mockFetchAssignmentFromDB(assignmentId);
    
            if (rawData) {
              const processedData = processAssignmentForDisplay(rawData);
              setAssignmentDetail(processedData);
            } else {
              
              setAssignmentDetail([]);
              setError(`Assignment with ID "${assignmentId}" not found.`);
            }
          } catch (err) {
            console.error("Error fetching or processing assignment:", err);
            setError("Failed to load assignment details. Please try again.");
            setAssignmentDetail([]); // Clear data on error
          } finally {
            setLoading(false); //sets loading to false when done
          }
        };
    
        fetchAndProcessAssignment(); // Call the async function
      }, [assignmentId]);   
       */

    useEffect(()=> {

         const rawData = {
          id: "assign-123",
          title: "React Hooks Deep Dive",
          githubUrl: "https://github.com/user/react-hooks-example",
          branch: "main",
          submittedAt: "2024-05-20T10:00:00Z",
          reviewedAt: '', 
          reviewerId: '',
          dueDate: "2024-05-25T23:59:59Z",
          status: "in-progress",
          notes: ""
        }
        setAssignment(rawData);


        const processedData = processAssignmentForDisplay(rawData);
        console.log(processedData);
        setAssignmentDetail(processedData);


    }, []);



      
    return(

        <DashboardContainer>
            
            <>
            <BackLinkToDashboard></BackLinkToDashboard>
            <AssignmentViewContainer>
                <Header>
                    <h2>Full stack Application</h2>
                <StatusBadge status={assignment.status}>
                      {assignment.status === 'in-progress' && <FontAwesomeIcon icon={faClock} />}
                      {assignment.status === 'submitted' && <FontAwesomeIcon icon={faExclamationCircle} />}
                      {assignment.status === 'completed' && <FontAwesomeIcon icon={faCheckCircle} />}
                      {assignment.status === 'rejected' && <FontAwesomeIcon icon={ faUserCircle} />}
                      {assignment.status.replace('-', ' ')}
               </StatusBadge>
                </Header>
                <SectionTitle>
                    <FontAwesomeIcon icon={faInfoCircle} color="#4361ee"></FontAwesomeIcon>
                    <h3>Assignment Details</h3>

                </SectionTitle>

                <AssignmentDetails>
                    
                    {
                        assignmentDetail.map((item) => (
                            <AssignmentDetailItem
                            itemLabel={item.label}
                            itemValue={item.value}
                            key={item.label}
                            fontIcon={<FontAwesomeIcon icon={item.icon} color="#4361ee"/>}
                            />

                        ))
                    }
                </AssignmentDetails>
                {

                }


            </AssignmentViewContainer>
            </>
            


        </DashboardContainer>
    );



}

export default AssignmentView