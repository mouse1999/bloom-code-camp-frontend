// import React from 'react';
// import styled from 'styled-components';

// const FormContainer = styled.div`
//   max-width: 600px;
//   margin: 2rem auto;
//   padding: 2rem;
//   background: white;
//   border-radius: 8px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// `;

// const FormTitle = styled.h2`
//   font-size: 1.5rem;
//   color: #333;
//   margin-bottom: 1.5rem;
// `;

// const FormGroup = styled.div`
//   margin-bottom: 1.5rem;
// `;

// const Label = styled.label`
//   display: block;
//   margin-bottom: 0.5rem;
//   font-weight: 500;
//   color: #444;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 0.75rem;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   font-size: 1rem;
//   transition: border-color 0.2s;

//   &:focus {
//     outline: none;
//     border-color: #4CAF50;
//   }
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 0.75rem;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   font-size: 1rem;
//   min-height: 100px;
//   resize: vertical;
//   transition: border-color 0.2s;

//   &:focus {
//     outline: none;
//     border-color: #4CAF50;
//   }
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   justify-content: space-between;
//   gap: 1rem;
//   margin-top: 2rem;
// `;

// const Button = styled.button`
//   padding: 0.75rem 1.5rem;
//   border-radius: 4px;
//   font-size: 1rem;
//   cursor: pointer;
//   transition: all 0.2s;
// `;

// const PrimaryButton = styled(Button)`
//   background-color: #4CAF50;
//   color: white;
//   border: none;

//   &:hover {
//     background-color: #3e8e41;
//   }
// `;

// const SecondaryButton = styled(Button)`
//   background-color: transparent;
//   border: 1px solid #ddd;
//   color: #666;

//   &:hover {
//     background-color: #f5f5f5;
//   }
// `;

// const AssignmentForm = () => {
//   const [formData, setFormData] = React.useState({
//     title: '',
//     githubUrl: '',
//     branch: '',
//     notes: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//     // Add your form submission logic here

//   };

//   return (
//     <FormContainer>
//       <FormTitle>Create New Assignment</FormTitle>
//       <form onSubmit={handleSubmit}>
//         <FormGroup>
//           <Label htmlFor="title">Assignment Title:</Label>
//           <Input
//             type="text"
//             id="title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </FormGroup>

//         <FormGroup>
//           <Label htmlFor="githubUrl">GitHub URL:</Label>
//           <Input
//             type="url"
//             id="githubUrl"
//             name="githubUrl"
//             value={formData.githubUrl}
//             onChange={handleChange}
//             placeholder="https://github.com/your-repo"
//             required
//           />
//         </FormGroup>

//         <FormGroup>
//           <Label htmlFor="branch">Branch:</Label>
//           <Input
//             type="text"
//             id="branch"
//             name="branch"
//             value={formData.branch}
//             onChange={handleChange}
//             placeholder="main"
//             required
//           />
//         </FormGroup>

//         <FormGroup>
//           <Label htmlFor="notes">Submission Notes (Optional):</Label>
//           <TextArea
//             id="notes"
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//           />
//         </FormGroup>

//         <ButtonGroup>
//           <SecondaryButton type="button">Cancel</SecondaryButton>
//           <PrimaryButton type="submit">Submit Assignment</PrimaryButton>
//         </ButtonGroup>
//       </form>
//     </FormContainer>
//   );
// };


// export default AssignmentForm;
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// Modern font imports with responsive sizing
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  body {
    background-color: #a7f3d0;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #111827;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    padding: 1rem;
    box-sizing: border-box;

    /* Tablet styles */
    @media (max-width: 768px) {
      padding: 0.75rem;
      align-items: flex-start;
    }

    /* Mobile styles */
    @media (max-width: 480px) {
      padding: 0.5rem;
    }
  }
`;

const GlassPanel = styled.div`
  width: 90%; /* Fluid width with max constraint */
  margin: 2rem auto;
  height: 90%vh;
  padding: clamp(1.25rem, 5vw, 2rem);
  background: rgba(255, 255, 255, 0.9);
  border-radius: clamp(0.75rem, 2vw, 1rem);
  backdrop-filter: blur(10px);
  box-shadow:
    0 0.5rem 2rem rgba(0, 0, 0, 0.05),
    0 0.25rem 0.5rem rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-sizing: border-box;

  /* Tablet adjustments */
  @media (max-width: 768px) {
    margin: 1.5rem auto;
    width: 95%;
  }

  /* Mobile adjustments */
  @media (max-width: 480px) {
    margin: 1rem auto;
    padding: 1.25rem;
    backdrop-filter: blur(8px);
  }
`;

const FormHeader = styled.div`
  margin-bottom: clamp(1rem, 4vw, 2rem);
  text-align: center;
`;

const FormTitle = styled.h2`
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
  background: linear-gradient(90deg, #6366f1, #16a385);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  /* Mobile adjustments */
  @media (max-width: 480px) {
    margin-bottom: 0.25rem;
  }
`;

const FormSubtitle = styled.p`
  font-size: clamp(0.8rem, 3vw, 0.9rem);
  color: #6b7280;
  font-weight: 400;

  /* Mobile adjustments */
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: clamp(0.75rem, 3vw, 0.8rem);
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.025em;
`;

const InputField = styled.input`
  width: 100%;
  padding: clamp(0.7rem, 3vw, 0.8rem);
  border: 1px solid #e5e7eb;
  border-radius: clamp(0.5rem, 2vw, 0.75rem);
  font-size: clamp(0.85rem, 3vw, 0.9rem);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f9fafb;
  color: #111827;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 0.15rem rgba(99, 102, 241, 0.25);
    background-color: white;
  }

  &::placeholder {
    color: #9ca3af;
    font-size: clamp(0.75rem, 3vw, 0.85rem);
  }
`;

const TextAreaField = styled.textarea`
  width: 100%;
  padding: clamp(0.7rem, 3vw, 0.8rem);
  border: 1px solid #e5e7eb;
  border-radius: clamp(0.5rem, 2vw, 0.75rem);
  font-size: clamp(0.85rem, 3vw, 0.9rem);
  min-height: clamp(5rem, 15vw, 7rem);
  resize: vertical;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f9fafb;
  color: #111827;
  line-height: 1.6;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 0.15rem rgba(99, 102, 241, 0.25);
    background-color: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  margin-top: clamp(1rem, 3vw, 1.5rem);

  /* Stack buttons vertically on mobile */
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: clamp(0.7rem, 3vw, 0.8rem) clamp(1rem, 4vw, 1.5rem);
  border-radius: clamp(0.5rem, 2vw, 0.75rem);
  font-size: clamp(0.85rem, 3vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.025em;
  width: 100%;

  /* Full width buttons on mobile */
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const PrimaryAction = styled(Button)`
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  color: white;
  border: none;
  box-shadow: 0 0.25rem 0.5rem rgba(99, 102, 241, 0.2);

  &:hover {
    background: linear-gradient(135deg, #5a5af1, #3070f3);
    transform: translateY(-1px);
    box-shadow: 0 0.375rem 0.625rem rgba(99, 102, 241, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryAction = styled(Button)`
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #4b5563;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
    color: #fb1548;
  }
`;

const AssignmentForm = () => {
  const [formData, setFormData] = React.useState({
    title: '',
    githubUrl: '',
    branch: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <>
      <GlobalStyle />
      <GlassPanel>
        <FormHeader>
          <FormTitle>Create New Assignment</FormTitle>
          <FormSubtitle>Submit your project for review and feedback</FormSubtitle>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <InputLabel htmlFor="title">Assignment Title</InputLabel>
            <InputField
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter assignment title"
              required
            />
          </FormGroup>

          <FormGroup>
            <InputLabel htmlFor="githubUrl">GitHub Repository</InputLabel>
            <InputField
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
              required
            />
          </FormGroup>

          <FormGroup>
            <InputLabel htmlFor="branch">Branch Name</InputLabel>
            <InputField
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="main"
              required
            />
          </FormGroup>

          <FormGroup>
            <InputLabel htmlFor="notes">Notes <span style={{color: '#9ca3af', fontWeight: 'normal'}}>(Optional)</span></InputLabel>
            <TextAreaField
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional context for the reviewer..."
            />
          </FormGroup>

          <ButtonGroup>
            <SecondaryAction type="button">Cancel</SecondaryAction>
            <PrimaryAction type="submit">Submit Assignment</PrimaryAction>
          </ButtonGroup>
        </form>
      </GlassPanel>
    </>
  );
};

export default AssignmentForm;