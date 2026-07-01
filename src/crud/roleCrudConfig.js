const roleCrudConfig = {
    title: "Role Management",
    entityName: "Role",
    apiEndpoint: "/roles",
    idField: "id",
    permissions: {
        view: "roles.view",
        create: "roles.manage",
        update: "roles.manage",
        delete: "roles.manage",
    },
    tableColumns: [
        { data: "id", title: "ID" },
        { data: "name", title: "Name" },
        { data: "guard_name", title: "Guard" },
        { data: "permissions_display", title: "Permissions" },
    ],
    fields: [
        {
            name: "name",
            label: "Name",
            required: true,
            placeholder: "Example: admin",
        },
        {
            name: "permissions",
            label: "Allowed Actions",
            type: "checkbox-group",
            grouped: true,
            defaultValue: [],
            options: [
                {
                    label: "Employees",
                    options: [
                        { value: "employees.view", label: "Read" },
                        { value: "employees.create", label: "Create" },
                        { value: "employees.update", label: "Update" },
                        { value: "employees.delete", label: "Delete" },
                    ],
                },
                {
                    label: "Departments",
                    options: [
                        { value: "departments.view", label: "Read" },
                        { value: "departments.create", label: "Create" },
                        { value: "departments.update", label: "Update" },
                        { value: "departments.delete", label: "Delete" },
                    ],
                },
                {
                    label: "Roles",
                    options: [
                        { value: "roles.view", label: "Read" },
                        { value: "roles.manage", label: "Create / Update / Delete" },
                    ],
                },
                {
                    label: "Permissions",
                    options: [
                        { value: "permissions.view", label: "Read" },
                        { value: "permissions.manage", label: "Create / Update / Delete" },
                    ],
                },
            ],
        },
    ],
};

export default roleCrudConfig;
