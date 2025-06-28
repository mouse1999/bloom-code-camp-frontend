

import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayoutForLearners from "./pages/DashboardLayoutForLearners";
import DashboardLayoutForReviewer from "./pages/DashboardLayoutForReviewer";
import LearnersDashboard from "./components/Dashboard/Learner/LearnersDashboard";
import CreateNewAssignment from "./components/Dashboard/Learner/CreateNewAssignment";
import EditAssignmentForm from "./components/Dashboard/Learner/EditAssignmentForm";
import AssignmentView from "./components/Dashboard/Learner/AssignmentView"
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import ReviewersDashboard from "./components/Dashboard/Reviewer/ReviewersDashboard";
import AssignmentReviewPage from "./components/Dashboard/Reviewer/AssignmentReviewPage";
import RejectedAssignmentView from "./pages/RejectedAssignmentView";


function App() {
    
    return (
        <BrowserRouter>
            <AuthProvider> 
                <Routes>
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<div>Welcome to the Application! Please Login or Register.</div>} />
                    <Route
                        path="/learner"
                        element={
                            <ProtectedRoute allowedRoles={['ROLE_LEARNER']}>
                                <DashboardLayoutForLearners />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<LearnersDashboard />} /> 
                        <Route path="create" element={<CreateNewAssignment />} /> 
                        <Route path="assignments/:assignmentId/view" element={<AssignmentView />} /> 
                        <Route path="assignments/:assignmentId/reject" element={<RejectedAssignmentView />} /> 
                        <Route path="assignments/:assignmentId/edit" element={<EditAssignmentForm />} /> 
                    </Route>
                    <Route
                        path="/reviewer"
                        element={
                            <ProtectedRoute allowedRoles={['ROLE_REVIEWER']}>
                               <DashboardLayoutForReviewer/>
                            </ProtectedRoute>
                        }
                    >
                        
                        <Route index element={<ReviewersDashboard />} /> // Matches: /reviewer/dashboard
                        <Route path="assignments/:assignmentId/edit" element={<AssignmentReviewPage/>} /> {/* Matches: /reviewer/assignments/:assignmentId/view */}
                        <Route path="assignments/:assignmentId/view" element={<AssignmentView />} /> {/* Matches: /reviewer/assignments/:assignmentId/view */}
                        

                    </Route>

                    
                    <Route
                        path="/shared/assignments/:assignmentId/view" 
                        element={
                            <ProtectedRoute allowedRoles={['learner', 'reviewer']}> 
                                <AssignmentView />
                            </ProtectedRoute>
                        }
                    />
                    {/* <Route path="*" element={<UnauthorizedPage />} />  */}
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
