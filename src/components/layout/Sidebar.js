import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Sidebar() {
    const { navigation } = useAuth();

    return (
        <aside className="app-sidebar text-white">
            <h4>
                <span className="sidebar-brand-icon" aria-hidden="true">&#10022;</span>
                <span>Laravel+React App</span>
            </h4>
            <hr />

            <ul className="nav flex-column">
                {navigation.map((item) => (
                    <li className="nav-item mb-2" key={item.key}>
                        <NavLink
                            to={item.path}
                            end={item.path === "/"}
                            className={({ isActive }) =>
                                `nav-link text-white${isActive ? " active" : ""}`
                            }
                        >
                            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
