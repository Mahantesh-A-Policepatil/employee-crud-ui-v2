const roleCrudConfig = {
    title: "Role Management",
    entityName: "Role",
    apiEndpoint: "/roles",
    idField: "id",
    permissions: {
        view: "roles.read",
        create: "roles.create",
        update: "roles.update",
        delete: "roles.delete",
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
            permissionMatrix: true,
            defaultValue: [],
            optionsEndpoint: "/permissions/grouped-options",
        },
    ],
};

export default roleCrudConfig;
