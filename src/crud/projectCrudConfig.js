const projectCrudConfig = {
    title: "Project Management",
    entityName: "Project",
    apiEndpoint: "/projects",
    idField: "id",
    permissions: {
        view: "projects.view",
        create: "projects.create",
        update: "projects.update",
        delete: "projects.delete",
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
            optionsEndpoint: "/employees/options",
            placeholder: "Select employees",
        },
    ],
};

export default projectCrudConfig;
