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
    ],
};

export default departmentCrudConfig;
