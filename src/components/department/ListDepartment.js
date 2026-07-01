import React from "react";
import CrudPage from "../crud/CrudPage";
import departmentCrudConfig from "../../crud/departmentCrudConfig";

function ListDepartment() {
    return <CrudPage config={departmentCrudConfig} />;
}

export default ListDepartment;
