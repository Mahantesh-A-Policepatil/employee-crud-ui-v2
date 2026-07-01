import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <nav className="app-header navbar navbar-dark px-3">
            <span className="navbar-brand mb-0 h5">
                <span className="brand-icon" aria-hidden="true">&#9638;</span>
                <span>Employee Demo App</span>
            </span>

            <div className="user-menu-dropdown dropdown">
                <button
                    className="user-menu-button"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    title={user?.name}
                >
                    <span className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                    <span className="user-name">{user?.name || "User"}</span>
                    <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.5 6L8 9.5 11.5 6" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <ul className="dropdown-menu dropdown-menu-end user-dropdown-menu">
                    <li>
                        <button className="dropdown-item user-settings-item" onClick={() => navigate("/settings")}>
                            <span className="dropdown-icon" aria-hidden="true">⚙</span>
                            <span className="item-text">User Settings</span>
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item logout-item" onClick={handleLogout}>
                            <span className="dropdown-icon" aria-hidden="true">⎋</span>
                            <span className="item-text">Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Header;
