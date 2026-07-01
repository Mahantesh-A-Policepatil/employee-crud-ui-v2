import { createEmptyForm, formatValidationErrors, validateForm } from "./crudUtils";

describe("crudUtils", () => {
    const fields = [
        { name: "name", label: "Name", required: true },
        {
            name: "email",
            label: "Email",
            required: true,
            pattern: /^\S+@\S+\.\S+$/,
            patternMessage: "Invalid email",
        },
        {
            name: "roles",
            label: "Roles",
            type: "checkbox-group",
            defaultValue: [],
        },
    ];

    test("createEmptyForm applies defaults", () => {
        expect(createEmptyForm(fields)).toEqual({
            id: null,
            name: "",
            email: "",
            roles: [],
        });
    });

    test("validateForm returns required and pattern errors", () => {
        const errors = validateForm(fields, {
            id: null,
            name: "",
            email: "invalid-email",
            roles: [],
        });

        expect(errors).toEqual({
            name: "Name is required",
            email: "Invalid email",
        });
    });

    test("formatValidationErrors keeps first server message", () => {
        expect(
            formatValidationErrors({
                email: ["Email is already taken.", "Email must be valid."],
            })
        ).toEqual({
            email: "Email is already taken.",
        });
    });
});
