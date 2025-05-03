
import { useState } from "react";
import LogButton from "./components/buttons/LogButton";
import SearchBar from "./components/ui/SearchBar";
import Logo from "./components/layout/Logo";

function App() {
    const [isLoggedIn, setIsLogin] = useState(false);
    const onclickbutton = () => {
        setIsLogin(!isLoggedIn)
    }


    return(
        // <SearchBar/>
        // <SearchBarOne></SearchBarOne>
        <>
        
        <LogButton isLoggedIn={isLoggedIn} onClick={onclickbutton} ></LogButton>
        <SearchBar/>

        <Logo></Logo>

        </>

    );
  
}

export default App