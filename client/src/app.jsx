import { Router } from "preact-router";
import TopBar from "./components/TopBar";
import Home from "./pages/Home";
export function App() {
  
  const fakeUser = null; // remove if using real auth

  const openModal = () => {
    alert("Deposit modal open");
  };
  
    return (
        <>
          <TopBar user={fakeUser} onDeposit={openModal} />
            <main>
                <Router>
                    <Home path="/spa" />

                    <NotFound default />
                </Router>
            </main>
        </>
    );
}
function NotFound() {
    return <h1>404</h1>;
}
