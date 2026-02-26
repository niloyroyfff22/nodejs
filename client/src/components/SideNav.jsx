import { useEffect } from "preact/hooks";
import { route } from "preact-router";

export default function SideNav({ open, onClose }) {
    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    if (!open) return null;

    return (
        <div class="navbar-main" onClick={onClose}>
            <div class="navbar" onClick={e => e.stopPropagation()}>
                <div class="sidenav-header">
                    <div class="titlelogo">MAN99</div>
                    <div class="closenav" onClick={onClose}>
                        &times;
                    </div>
                </div>

                {/* SPA Link */}
                <div
                    class="nav-item"
                    onClick={() => {
                        onClose();
                        route("/login");
                    }}
                >
                    📁 <span>Login page</span>
                </div>
            </div>
        </div>
    );
}
