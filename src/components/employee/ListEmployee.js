import React from "react";
import CrudPage from "../crud/CrudPage";
import employeeCrudConfig from "../../crud/employeeCrudConfig";

function ListEmployee() {
    return <CrudPage config={employeeCrudConfig} />;
}

export default ListEmployee;
