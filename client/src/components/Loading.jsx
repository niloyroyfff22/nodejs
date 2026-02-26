import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

export default function Loading({ visible = false, text = "Loading..." }) {
  const loaderRef = useRef(null);
  const rafRef = useRef(null);
  const angleRef = useRef(0);

  // Spin animation
  useEffect(() => {
    if (!visible) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    function spin() {
      angleRef.current = (angleRef.current + 4) % 360;
      if (loaderRef.current) loaderRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      rafRef.current = requestAnimationFrame(spin);
    }
    spin();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      id="loading-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        animation: "fadeIn .25s ease",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
        <div
          ref={loaderRef}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.25)",
            borderTop: "3px solid #22d3ee",
            boxShadow: "0 0 12px rgba(34,211,238,.6)",
          }}
        ></div>
        <div style={{ fontSize: "14px", letterSpacing: "0.5px", opacity: 0.9 }}>{text}</div>
      </div>

      {/* Inject keyframes once */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
        `}
      </style>
    </div>
  );
}