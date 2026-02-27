import { useEffect, useState } from "preact/hooks";
import "./SplashScreen.css";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const wait = 3000; // 3 seconds

    const timer = setTimeout(() => {
      setFadeOut(true);

      setTimeout(() => {
        setVisible(false);

        // Splash finished event
        window.dispatchEvent(new Event("splashFinished"));
      }, 800); // match CSS transition time
    }, wait);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div class={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
      <div class="splash-content">
        <img src="/img/logo.png" alt="Logo" class="logo" />
        <h1 class="app-name">Man99</h1>
        <div class="loader"></div>
      </div>
    </div>
  );
}