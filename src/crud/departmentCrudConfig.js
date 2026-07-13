const departmentCrudConfig = {
  title: "Department Management",
  entityName: "Department",
  apiEndpoint: "/departments",
  idField: "id",
  permissions: {
    view: "departments.view",
    create: "departments.create",
    update: "departments.update",
    delete: "departments.delete",
  },
  tableColumns: [
    { data: "id", title: "ID" },
    { data: "name", title: "Name" },
    { data: "description", title: "Description" },
    { data: "employees_count", title: "Employees" },
  ],
  fields: [
    {
      name: "name",
      label: "Name",
      required: true,
    },
    {
      name: "description",
      label: "Description",
    },
    {
      name: "employee_ids",
      label: "Employees",
      type: "multi-select",
      defaultValue: [],
      optionsEndpoint: "/employees/department-options",
      placeholder: "Select employees",
      selectedTable: {
        title: "Selected Department Employees",
        emptyMessage: "No employees selected.",
        columns: [
          { title: "Name", data: "name" },
          { title: "Email", data: "email" },
          { title: "Designation", data: "designation" },
          {
            title: "Project",
            data: "project.name",
            fallbackData: "description",
            fallback: "—",
          },
        ],
      },
    },
  ],
  expandableRows: {
    title: "Department Employees",
    emptyMessage: "No employees belong to this department.",
    columns: [
      { title: "Name", data: "name" },
      { title: "Email", data: "email" },
      { title: "Designation", data: "designation" },
      { title: "Project", data: "project.name", fallback: "—" },
    ],
  },
};

export default departmentCrudConfig;
