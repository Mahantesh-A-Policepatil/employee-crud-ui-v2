import { getDefaultAccessibleRoute, getSidebarRoutes } from "./routes";

describe("routes config", () => {
    const hasPermission = (permission) => permission === "departments.view";

    test("getDefaultAccessibleRoute returns first permitted route", () => {
        expect(getDefaultAccessibleRoute(hasPermission)).toBe("/departments");
    });

    test("getDefaultAccessibleRoute falls back to settings", () => {
        expect(getDefaultAccessibleRoute(() => false)).toBe("/settings");
    });

    test("getSidebarRoutes excludes routes without sidebar metadata", () => {
        const routes = getSidebarRoutes(hasPermission);

        expect(routes).toHaveLength(1);
        expect(routes[0].path).toBe("/departments");
        expect(routes.every((route) => route.sidebar)).toBe(true);
    });
});
