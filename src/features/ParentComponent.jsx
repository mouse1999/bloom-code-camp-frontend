// Parent component usage example
import { useState } from "react";
import ChooseAssignmentPopUp from "./ChooseAssignmentPopUp";
import AssignmentForm from "../components/layout/AssignmentForm";
function ParentComponent() {
    const [showPopup, setShowPopup] = useState(false);
    const [assignmentSelected, setAssignmentSelected] = useState(null);
    
    // Sample assignments data
    const assignments = [
        { id: 1, name: 'Math Homework', dueDate: '2023-06-15', isSubmitted: false },
        { id: 2, name: 'Science Project', dueDate: '2023-06-20', isSubmitted: true },
        { id: 3, name: 'English Essay', dueDate: '2023-06-18', isSubmitted: false },
        { id: 4, name: 'History Reading', dueDate: '2023-06-22', isSubmitted: true },
        { id: 5, name: 'Biology Lab Report', dueDate: '2023-06-25', isSubmitted: false },
        { id: 6, name: 'Computer Quiz', dueDate: '2023-06-28', isSubmitted: false },
        { id: 7, name: 'Art Sketch', dueDate: '2023-07-01', isSubmitted: true },
        { id: 8, name: 'Music Composition', dueDate: '2023-07-03', isSubmitted: false },
        { id: 9, name: 'Geography Presentation', dueDate: '2023-07-05', isSubmitted: true },
      ];
      
  
    const handleSubmitAssignment = async (assignmentId) => {
      // Your submission logic here
      console.log('Submitting assignment:', assignmentId);
      return true; // Return true if successfuls
    };

    const getSelectedAssignment = (assignment) => {

        setAssignmentSelected(assignment);
    }

    const onChoose = () => {
        setShowPopup(false);
    }
  
    return (
      <div>
        <button onClick={() => setShowPopup(true)}>Choose Assignment</button>
        
        {showPopup && (
          <ChooseAssignmentPopUp
            assignments={assignments}
            onClose={() => setShowPopup(false)}
            onSubmit={handleSubmitAssignment}
            onSelectAssignment={getSelectedAssignment}
            onChoose={onChoose}
          />
        )}
        {
            assignmentSelected && (
                <AssignmentForm></AssignmentForm>
            )
        }
        
        
      </div>
    );
  }

  export default ParentComponent