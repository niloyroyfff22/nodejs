import { useState, useEffect, useRef } from "preact/hooks";
import "./TopBar.css";
import SideNav from "./SideNav";

export default function Topbar({ user, onDeposit }) {
  const [open, setOpen] = useState(false);
  const textRef = useRef(null);

  // Restart marquee animation smoothly
  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    const handleAnimation = () => {
      text.style.animation = "none";
      void text.offsetHeight; // force reflow
      text.style.animation = "";
    };

    text.addEventListener("animationiteration", handleAnimation);

    return () => {
      text.removeEventListener("animationiteration", handleAnimation);
    };
  }, []);

  return (
    <>
      {/* TOPBAR */}
      <div class="topbar-wrapper">
        <div class="topbar">
          <div class="brand">
            <span class="hamb" onClick={() => setOpen(true)}>
              <div></div>
            </span>

            <a class="logo-text" href="/">
              Nikhil
            </a>
          </div>

          <div class="actions">
            {user ? (
              <>
                <a class="btn login" href="/logout">
                  LogOut
                </a>

                <button class="btn login" onClick={onDeposit}>
                  Deposit
                </button>
              </>
            ) : (
              <>
                <a class="btn login" href="/login">
                  Login
                </a>

                <a class="btn register" href="/signup">
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* NOTICE BAR */}
      <div class="notice-bar">
        <div class="notice-icon">🔊</div>
        <div class="notice-text">
          <span ref={textRef}>
            Welcome To Man99.live, সর্বদা বেস্ট সার্ভিস পেতে আমাদের সাথেই থাকুন!
          </span>
        </div>
      </div>

      {/* SIDENAV */}
      <SideNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}