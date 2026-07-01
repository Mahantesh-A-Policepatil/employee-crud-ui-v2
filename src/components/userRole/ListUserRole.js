import React from "react";
import CrudPage from "../crud/CrudPage";
import userRoleCrudConfig from "../../crud/userRoleCrudConfig";

function ListUserRole() {
    return <CrudPage config={userRoleCrudConfig} />;
}

export default ListUserRole;
