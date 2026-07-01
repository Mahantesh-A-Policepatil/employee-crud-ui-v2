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
        { data: "id", title: "ID" },
        { data: "department_name", title: "Department" },
        { data: "name", title: "Name" },
        { data: "email", title: "Email" },
        { data: "phone", title: "Phone", type: "string" },
        { data: "designation", title: "Designation" },
    ],
    fields: [
        {
            name: "department_id",
            label: "Department",
            type: "select",
            required: true,
            optionsEndpoint: "/departments/options",
        },
        {
            name: "name",
            label: "Name",
            required: true,
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            pattern: /^\S+@\S+\.\S+$/,
            patternMessage: "Invalid email",
        },
        {
            name: "phone",
            label: "Phone",
            required: true,
            pattern: /^[0-9]{10}$/,
            patternMessage: "Must be 10 digits",
        },
        {
            name: "designation",
            label: "Designation",
            required: true,
        },
    ],
};

export default employeeCrudConfig;
