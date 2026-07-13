import React from "react";
import CrudPage from "../crud/CrudPage";
import attendanceCrudConfig from "../../crud/attendanceCrudConfig";

function ListAttendance() {
  return <CrudPage config={attendanceCrudConfig} />;
}

export default ListAttendance;
