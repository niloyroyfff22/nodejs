import { Router } from "preact-router";
import { useState, useEffect, useRef } from "preact/hooks";
import TopBar from "./components/TopBar";
import Home from "./pages/Home";
import DepositModal from './pages/Deposit';
export function App() {
  
  const fakeUser = null; // remove if using real auth

  const openModal = () => {
    alert("Deposit modal open");
  };
  
  const hideTopBarRoutes = ['/spa/deposit', '/spa/login'];
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

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
