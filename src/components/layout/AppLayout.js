import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import LoadingOverlay from "../common/LoadingOverlay";
import Sidebar from "./Sidebar";

function AppLayout({ children, loading = false, mainClassName = "crud-page employee-page flex-grow-1" }) {
    return (
        <div className="app-shell d-flex">
            <Sidebar />

            <div className="main-shell flex-grow-1 d-flex flex-column">
                <Header />
                <main className={mainClassName}>{children}</main>
                <Footer />
            </div>

            <LoadingOverlay show={loading} />
        </div>
    );
}

export default AppLayout;
