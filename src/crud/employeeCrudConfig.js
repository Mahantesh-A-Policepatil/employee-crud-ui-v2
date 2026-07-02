const employeeCrudConfig = {
    title: "Employee Management",
    entityName: "Employee",
    apiEndpoint: "/employees",
    idField: "id",
    permissions: {
        view: "employees.view",
        create: "employees.create",
        update: "employees.update",
        delete: "employees.delete",
    },
    tableColumns: [
        { data: "name", title: "Name" },
        { data: "department_name", title: "Department" },
        { data: "project_name", title: "Project" },
        { data: "designation", title: "Designation" },
        { data: "phone", title: "Phone", type: "string" },
        { data: "email", title: "Email" },
    ],
    fields: [
        {
            name: "name",
            label: "Name",
            required: true,
        },
        {
            name: "department_id",
            label: "Department",
            type: "select",
            required: true,
            optionsEndpoint: "/departments/options",
        },
        {
            name: "project_id",
            label: "Project",
            type: "select",
            optionsEndpoint: "/projects/options",
        },
        {
            name: "designation",
            label: "Designation",
            required: true,
        },
        {
            name: "phone",
            label: "Phone",
            required: true,
            pattern: /^[0-9]{10}$/,
            patternMessage: "Must be 10 digits",
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            pattern: /^\S+@\S+\.\S+$/,
            patternMessage: "Invalid email",
        },
    ],
};

export default employeeCrudConfig;
