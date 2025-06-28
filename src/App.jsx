
import { useState } from "react";
import LogButton from "../../../Bloom F-end/bloom-learners/src/components/buttons/LogButton";
import SearchBar from "./components/common/SearchBar";
import Logo from "../../../Bloom F-end/bloom-learners/src/components/layout/Logo";
import SignUpButton from "../../../Bloom F-end/bloom-learners/src/components/buttons/SignUpButton";
import AssignmentForm from "../../../Bloom F-end/bloom-learners/src/components/layout/AssignmentForm";
import {EditButton} from "../../../Bloom F-end/bloom-learners/src/components/layout/EditButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import UserInfo from "../../../Bloom F-end/bloom-learners/src/components/navbar/nav-wrappers/UserInfo";
import UserProfile from "../../../Bloom F-end/bloom-learners/src/components/navbar/nav-wrappers/UserProfile";
import Navbar from "../../../Bloom F-end/bloom-learners/src/components/navbar/Navbar";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ParentComponent from "../../../Bloom F-end/bloom-learners/src/components/feature/ParentComponent";
import AssignmentSubmissionForm from "./components/Dashboard/Learner/SubmitAssignmentForm";
import TopNavigationBar from "../../../Bloom F-end/bloom-learners/src/components/layout/TopNavigationBar";
import DashboardLayout from "./pages/DashboardLayoutForLearners";
import SubmitAssignmentForm from "./components/Dashboard/Learner/SubmitAssignmentForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Nav/Header";
import SideMenu from "./components/Nav/SideMenu";
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
    // The 'isLoggedIn' state and 'onclickbutton' are now managed by AuthContext,
    // so they are no longer needed directly in App.js. You can remove them.
    // const [isLoggedIn, setIsLogin] = useState(false);
    // const onclickbutton = () => { setIsLogin(!isLoggedIn) };

    return (
        <BrowserRouter>
            {/* Wrap your entire application's routes with AuthProvider.
              This makes the AuthContext value (including login/logout functions and user data)
              available to all components rendered within these Routes, including LoginPage and ProtectedRoute.
            */}
            <AuthProvider> 
                <Routes>
                    {/* Public Routes: These routes are accessible to all users, 
                      regardless of their authentication status.
                    */}
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}
                    
                    {/* Default or Home Page: A simple landing page.
                        You might later redirect from here based on authentication status.
                    */}
                    <Route path="/" element={<div>Welcome to the Application! Please Login or Register.</div>} />

                    {/* Protected Routes for Learners:
                      The parent route '/learner' is protected. If the user is authenticated 
                      and has the 'learner' role, the DashboardLayoutForLearners will be rendered.
                      Any nested routes within this <Route> will then be rendered by DashboardLayoutForLearners's <Outlet />.
                    */}
                    <Route
                        path="/learner"
                        element={
                            <ProtectedRoute allowedRoles={['ROLE_LEARNER']}>
                                <DashboardLayoutForLearners />
                            </ProtectedRoute>
                        }
                    >
                        {/* Child Routes for Learners: Paths are relative to the parent '/learner' path.
                          They inherit the protection from the parent <ProtectedRoute>.
                        */}
                        <Route index element={<LearnersDashboard />} /> {/* Matches: /learner */}
                        <Route path="create" element={<CreateNewAssignment />} /> {/* Matches: /learner/create */}
                        <Route path="assignments/:assignmentId/edit" element={<EditAssignmentForm />} /> {/* Matches: /learner/assignments/:assignmentId/edit */}
                        <Route path="assignments/:assignmentId/view" element={<AssignmentView />} /> {/* Matches: /learner/assignments/:assignmentId/view */}
                        <Route path="assignments/:assignmentId/reject" element={<RejectedAssignmentView />} /> {/* Matches: /learner/assignments/:assignmentId/reject */}
                    </Route>

                    {/* Protected Routes for Reviewers:
                      Similar to learners, but for the 'reviewer' role.
                      You can create a separate layout for reviewers or directly render the dashboard.
                    */}
                    <Route
                        path="/reviewer"
                        element={
                            <ProtectedRoute allowedRoles={['ROLE_REVIEWER']}>
                               <DashboardLayoutForReviewer/>
                                {/* If you have a specific layout for reviewers, use it here */}
                                {/* <DashboardLayoutForReviewers> */}
                                {/* <ReviewerDashboard /> */}
                                {/* {</DashboardLayoutForReviewers>} */}
                            </ProtectedRoute>
                        }
                    >
                        
                        <Route index element={<ReviewersDashboard />} /> // Matches: /reviewer/dashboard
                        <Route path="assignments/:assignmentId/edit" element={<AssignmentReviewPage/>} /> {/* Matches: /reviewer/assignments/:assignmentId/view */}
                        <Route path="assignments/:assignmentId/view" element={<AssignmentView />} /> {/* Matches: /reviewer/assignments/:assignmentId/view */}
                        

                    </Route>

                    {/* Shared Protected Routes: Routes accessible by multiple roles.
                      For example, both learners and reviewers might be able to view assignment details.
                    */}
                    <Route
                        path="/shared/assignments/:assignmentId/view" // A common path for viewing
                        element={
                            <ProtectedRoute allowedRoles={['learner', 'reviewer']}> 
                                <AssignmentView />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch-all Route: This route acts as a fallback for any unmatched URLs.
                      It should always be the last <Route> in your <Routes> list.
                      It's common to redirect to an UnauthorizedPage or a custom 404 Not Found page here.
                    */}
                    {/* <Route path="*" element={<UnauthorizedPage />} />  */}
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
