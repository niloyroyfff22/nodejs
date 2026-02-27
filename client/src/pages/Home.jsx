import Loading from '../components/Loading';
import SplashScreen from '../components/SplashScreen';
import { useState, useEffect } from 'preact/hooks';
import { useAlert } from "../hooks/useAlert";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [splashDone, setSplashDone] = useState(
    sessionStorage.getItem("splashDone") === "true"
  );

  const { show, AlertComponent } = useAlert();

  useEffect(() => {
    // Only show splash if it wasn't done
    if (!splashDone) {
      const timer = setTimeout(() => {
        setSplashDone(true);
        sessionStorage.setItem("splashDone", "true");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [splashDone]);

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  // 🔹 Show Splash only if splashDone is false
  if (!splashDone) return <SplashScreen />;

  return (
    <>
      <div class="fade-in">
        <h1>Home Page</h1>

        <button onClick={simulateLoad}>Show Loading</button>
        <Loading visible={loading} text="Loading your data..." />
      </div>

      <button onClick={() => show("Login successful", "Success")}>
        Show Alert
      </button>

      {AlertComponent}
    </>
  );
}