import { Router } from "preact-router";
import { useState, useEffect, useRef } from "preact/hooks";
import { useAlert } from "./hooks/useAlert";
import TopBar from "./components/TopBar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DepositModal from './pages/Deposit';
export function App() {
  const { show, AlertComponent } = useAlert();
  
  const fakeUser = null; // remove if using real auth

  const openModal = () => {
    alert("Deposit modal open");
  };
  
  const hideTopBarRoutes = ['/spa/deposit', '/spa/login', '/spa/signup'];
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

console.log(currentPath);

  const handleRouteChange = (e) => {
    setCurrentPath(e.url);
  };

  const showTopBar = !hideTopBarRoutes.includes(currentPath);
  
  
    return (
        <>
          
         {showTopBar && <TopBar user={fakeUser} onDeposit={openModal} />}
            <main>
                <Router onChange={handleRouteChange}>
                    <Home path="/spa" />
                    <Signup path="/spa/signup" />
                    <Login path="/spa/login" />
                    <DepositModal path="/spa/deposit" />

                    <NotFound default />
                </Router>
            </main>
        </>
    );
}
function NotFound() {
    return <h1>404</h1>;
}
