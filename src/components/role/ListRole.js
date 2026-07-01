import React from "react";
import CrudPage from "../crud/CrudPage";
import roleCrudConfig from "../../crud/roleCrudConfig";

function ListRole() {
    return <CrudPage config={roleCrudConfig} />;
}

export default ListRole;
