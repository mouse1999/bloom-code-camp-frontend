
import { useState } from "react";
import LogButton from "./components/buttons/LogButton";
import SearchBar from "./components/ui/SearchBar";
import Logo from "./components/layout/Logo";
import SignUpButton from "./components/buttons/SignUpButton";
import AssignmentForm from "./components/layout/AssignmentForm";
import {EditButton} from "./components/layout/EditButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import UserInfo from "./components/navbar/nav-wrappers/UserInfo";
import UserProfile from "./components/navbar/nav-wrappers/UserProfile";
import Navbar from "./components/navbar/Navbar";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ParentComponent from "./features/ParentComponent";
import AssignmentSubmissionForm from "./features/SubmitAssignmentForm";
import TopNavigationBar from "./components/layout/TopNavigationBar";
import DashboardLayout from "./pages/DashboardLayoutForLearners";
import SubmitAssignmentForm from "./features/SubmitAssignmentForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import SideMenu from "./components/SideMenu/SideMenu";
import DashboardLayoutForLearners from "./pages/DashboardLayoutForLearners";
import DashboardLayoutForReviewer from "./components/Dashboard/Reviewer/DashboardLayoutForReviewer";
import LearnersDashboard from "./components/Dashboard/Learner/LearnersDashboard";
import CreateNewAssignment from "./components/Dashboard/Learner/CreateNewAssignment";





function App() {
    const [isLoggedIn, setIsLogin] = useState(false);
    const onclickbutton = () => {
        setIsLogin(!isLoggedIn)
    }


    return(
        <BrowserRouter>
      <Routes>
        < Route path="/learner" element={<DashboardLayoutForLearners/>}>
          <Route index element={<LearnersDashboard/>} />
          {/* <Route path="/learner/login" element={<LoginPage/>}/> */}
          <Route path="/learner/create" element={<CreateNewAssignment/>}/>
        </Route>
        <Route path="/register" element={<RegistrationPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        


        
      </Routes>
    </BrowserRouter>
    );
  
}

export default App