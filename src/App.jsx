
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
import Navbar from "./components/navbar/nav-wrappers/Navbar";

function App() {
    const [isLoggedIn, setIsLogin] = useState(false);
    const onclickbutton = () => {
        setIsLogin(!isLoggedIn)
    }


    return(
        // <SearchBar/>
        // <SearchBarOne></SearchBarOne>
        <>
        
        {/* <LogButton isLoggedIn={isLoggedIn} onClick={onclickbutton} ></LogButton>
        <SearchBar/>

        <Logo></Logo>
        <SignUpButton>
            
        </SignUpButton>
        <EditButton>
            <FontAwesomeIcon icon={faEdit} />
            Edit
        </EditButton>
        <AssignmentForm></AssignmentForm> */}

        {/* <UserProfile name={"Kufre Edward"} roles={["Admin"]}></UserProfile> */}
        <Navbar></Navbar>


        </>

    );
  
}

export default App