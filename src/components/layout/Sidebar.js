import React from "react";
import { NavLink } from "react-router-dom";
import { getSidebarRoutes } from "../../config/routes";
import { useAuth } from "../../contexts/AuthContext";

function Sidebar() {
    const { hasPermission } = useAuth();
    const sidebarRoutes = getSidebarRoutes(hasPermission);

    return (
        <aside className="app-sidebar text-white">
            <h4>
                <span className="sidebar-brand-icon" aria-hidden="true">&#10022;</span>
                <span>Laravel+React App</span>
            </h4>
            <hr />

            <ul className="nav flex-column">
                {sidebarRoutes.map((route) => (
                    <li className="nav-item mb-2" key={route.path}>
                        <NavLink
                            to={route.path}
                            end={route.path === "/"}
                            className={({ isActive }) =>
                                `nav-link text-white${isActive ? " active" : ""}`
                            }
                        >
                            <span className="nav-icon" aria-hidden="true">{route.sidebar.icon}</span>
                            <span className="nav-label">{route.sidebar.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
