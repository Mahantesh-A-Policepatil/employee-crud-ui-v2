const userRoleCrudConfig = {
    title: "User Role Assignment",
    entityName: "User Role",
    apiEndpoint: "/user-roles",
    idField: "id",
    permissions: {
        view: "roles.manage",
        create: "roles.manage",
        update: "roles.manage",
        delete: "roles.manage",
    },
    tableColumns: [
        { data: "id", title: "ID" },
        { data: "name", title: "User" },
        { data: "email", title: "Email" },
        { data: "roles_display", title: "Roles" },
    ],
    fields: [
        {
            name: "user_id",
            label: "User",
            type: "select",
            required: true,
            optionsEndpoint: "/user-options",
            hideOnEdit: true,
        },
        {
            name: "roles",
            label: "Roles",
            type: "checkbox-group",
            optionsEndpoint: "/role-options",
            defaultValue: [],
        },
    ],
};

export default userRoleCrudConfig;
