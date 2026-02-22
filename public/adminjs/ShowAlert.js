function showAlert(message, title = "Alert") {

  // Overlay
  const overlay = document.createElement("div");
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

  // Modal
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    width: "320px",
    maxWidth: "90%",
    background: "linear-gradient(180deg,#0f766e,#064e3b)",
    color: "#ecfeff",
    borderRadius: "14px",
    padding: "20px 18px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 20px 40px rgba(0,0,0,.4)",
    animation: "scaleIn .25s ease"
  });

  // Close icon
  const close = document.createElement("span");
  close.innerHTML = "&times";
  Object.assign(close.style, {
    position: "absolute",
    top: "0px",
    right: "12px",
    cursor: "pointer",
    fontSize: "30px",
    opacity: .7
  });
  close.onclick = () => overlay.remove();

  // Title
  const h3 = document.createElement("h3");
  h3.innerText = title;
  Object.assign(h3.style, {
    marginBottom: "8px",
    fontSize: "18px",
    fontWeight: "600"
  });

  // Message
  const p = document.createElement("p");
  p.innerText = message;
  Object.assign(p.style, {
    fontSize: "14px",
    lineHeight: "1.5",
    opacity: .95
  });

  // Button
  const btn = document.createElement("button");
  btn.innerText = "OK";
  Object.assign(btn.style, {
    marginTop: "18px",
    padding: "10px 24px",
    border: "none",
    borderRadius: "999px",
    background: "#22d3ee",
    color: "#020617",
    fontWeight: "600",
    cursor: "pointer",
    transition: ".2s"
  });

  btn.onmouseenter = () => btn.style.background = "#67e8f9";
  btn.onmouseleave = () => btn.style.background = "#22d3ee";
  btn.onclick = () => overlay.remove();

  // Append
  modal.append(close, h3, p, btn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Animations
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0 }
      to { opacity: 1 }
    }
    @keyframes scaleIn {
      from { transform: scale(.9) }
      to { transform: scale(1) }
    }
  `;
  document.head.appendChild(style);
}