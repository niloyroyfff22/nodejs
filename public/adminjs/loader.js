let loadingRAF = null;

function ShowLoading() {

  // prevent duplicate
  if (document.getElementById("loading-overlay")) return;

  /* Overlay */
  const overlay = document.createElement("div");
  overlay.id = "loading-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.55)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    animation: "fadeIn .25s ease"
  });

  /* Loader wrapper */
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px"
  });

  /* Spinner ring */
  const loader = document.createElement("div");
  Object.assign(loader.style, {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "3px solid rgba(255,255,255,0.25)",
    borderTop: "3px solid #22d3ee",
    boxShadow: "0 0 12px rgba(34,211,238,.6)"
  });

  /* Loading text */
  const text = document.createElement("div");
  text.innerText = "Loading...";
  Object.assign(text.style, {
    fontSize: "14px",
    letterSpacing: "0.5px",
    opacity: 0.9
  });

  /* Smooth spin using RAF */
  let angle = 0;
  function spin() {
    angle = (angle + 4) % 360;
    loader.style.transform = `rotate(${angle}deg)`;
    loadingRAF = requestAnimationFrame(spin);
  }
  spin();

  wrapper.append(loader, text);
  overlay.appendChild(wrapper);
  document.body.appendChild(overlay);

  /* Animations (inject once) */
  if (!document.getElementById("loading-style")) {
    const style = document.createElement("style");
    style.id = "loading-style";
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0 }
        to { opacity: 1 }
      }
    `;
    document.head.appendChild(style);
  }
}

function HideLoading() {
  const overlay = document.getElementById("loading-overlay");
  if (!overlay) return;

  if (loadingRAF) {
    cancelAnimationFrame(loadingRAF);
    loadingRAF = null;
  }

  overlay.remove();
}

