import { useEffect } from "preact/hooks";

export default function AlertModal({
    open,
    title = "Alert",
    message,
    onClose
}) {
    if (!open) return null;

    useEffect(() => {
        // prevent body scroll
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <>
            <div style={overlayStyle} onClick={onClose}>
                <div style={modalStyle} onClick={e => e.stopPropagation()}>
                    <span style={closeStyle} onClick={onClose}>
                        &times;
                    </span>

                    <h3 style={titleStyle}>{title}</h3>
                    <p style={messageStyle}>{message}</p>

                    <button
                        style={buttonStyle}
                        onClick={onClose}
                        onMouseEnter={e =>
                            (e.target.style.background = "#67e8f9")
                        }
                        onMouseLeave={e =>
                            (e.target.style.background = "#22d3ee")
                        }
                    >
                        OK
                    </button>
                </div>
            </div>

            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes scaleIn {
            from { transform: scale(.9) }
            to { transform: scale(1) }
          }
        `}
            </style>
        </>
    );
}

/* ---------- Styles ---------- */

const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.55)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    animation: "fadeIn .25s ease"
};

const modalStyle = {
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
};

const closeStyle = {
    position: "absolute",
    top: "0px",
    right: "12px",
    cursor: "pointer",
    fontSize: "30px",
    opacity: 0.7
};

const titleStyle = {
    marginBottom: "8px",
    fontSize: "18px",
    fontWeight: "600"
};

const messageStyle = {
    fontSize: "14px",
    lineHeight: "1.5",
    opacity: 0.95
};

const buttonStyle = {
    marginTop: "18px",
    padding: "10px 24px",
    border: "none",
    borderRadius: "999px",
    background: "#22d3ee",
    color: "#020617",
    fontWeight: "600",
    cursor: "pointer",
    transition: ".2s"
};
