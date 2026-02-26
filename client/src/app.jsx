import { Router } from "preact-router";
import Home from "./pages/Home";
export function App() {
    return (
        <>
            <main>
                <Router>
                    <Home path="/" />

                    <NotFound default />
                </Router>
            </main>
        </>
    );
}
function NotFound() {
    return <h1>404</h1>;
}
