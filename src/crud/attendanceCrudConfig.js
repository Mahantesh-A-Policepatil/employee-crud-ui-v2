const currentYear = new Date().getFullYear();

const attendanceCrudConfig = {
  title: "Attendance Management",

  entityName: "Attendance",

  apiEndpoint: "/attendance",

  permissions: {
    view: "attendance.view",
    create: "attendance.create",
    update: "attendance.update",
    delete: "attendance.delete",
  },

  /**
   * Extra Toolbar Buttons
   */
  extraToolbarButtons: [
    {
      key: "upload",
      label: "Upload CSV",
      icon: "bi bi-upload",
      variant: "success",
    },
    {
      key: "template",
      label: "Download Template",
      icon: "bi bi-download",
      variant: "secondary",
    },
  ],

  /**
   * DataTable Columns
   */
  tableColumns: [
    {
      data: "employee_name",
      title: "Employee",
    },
    {
      data: "attendance_month",
      title: "Month",
    },
    {
      data: "attendance_year",
      title: "Year",
    },
    {
      data: "working_days",
      title: "Working",
    },
    {
      data: "present_days",
      title: "Present",
    },
    {
      data: "leave_days",
      title: "Leave",
    },
    {
      data: "lop_days",
      title: "LOP",
    },
    {
      data: "remarks",
      title: "Remarks",
    },
  ],

  /**
   * Form Fields
   */
  fields: [
    {
      name: "employee_id",
      label: "Employee",
      type: "select",
      required: true,
      optionsEndpoint: "/employees/options",
    },

    {
      name: "attendance_month",
      label: "Month",
      type: "select",
      required: true,
      options: [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
      ],
    },

    {
      name: "attendance_year",
      label: "Year",
      type: "number",
      defaultValue: currentYear,
      readOnly: true,
    },

    {
      name: "working_days",
      label: "Working Days",
      type: "number",
      required: true,
    },

    {
      name: "present_days",
      label: "Present Days",
      type: "number",
      required: true,
    },

    {
      name: "leave_days",
      label: "Leave Days",
      type: "number",
      defaultValue: 0,
    },

    {
      name: "lop_days",
      label: "LOP Days",
      type: "number",
      defaultValue: 0,
    },

    {
      name: "remarks",
      label: "Remarks",
      type: "textarea",
      rows: 3,
    },
  ],
};

export default attendanceCrudConfig;
