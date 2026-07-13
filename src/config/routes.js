import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ForgotPassword from "../components/auth/ForgotPassword";
import ListDepartment from "../components/department/ListDepartment";
import ListEmployee from "../components/employee/ListEmployee";
import ListRole from "../components/role/ListRole";
import ListUserRole from "../components/userRole/ListUserRole";
import ListProject from "../components/project/ListProject";
import ListAttendance from "../components/attendance/ListAttendance";
import UserSettings from "../components/user/UserSettings";

export const PROTECTED_ROUTES = [
  {
    path: "/",
    permission: "employees.view",
    sidebar: {
      label: "Employee Management",
      icon: "💼",
    },
    Component: ListEmployee,
  },
  {
    path: "/attendance",
    permission: "attendance.view",
    sidebar: {
      label: "Attendance Management",
      icon: "📅",
    },
    Component: ListAttendance,
  },
  {
    path: "/projects",
    permission: "projects.view",
    sidebar: {
      label: "Project Management",
      icon: "📁",
    },
    Component: ListProject,
  },
  {
    path: "/departments",
    permission: "departments.view",
    sidebar: {
      label: "Department Management",
      icon: "🏢",
    },
    Component: ListDepartment,
  },
  {
    path: "/roles",
    permission: "roles.view",
    sidebar: {
      label: "Role Management",
      icon: "🔑",
    },
    Component: ListRole,
  },
  {
    path: "/user-roles",
    permission: "roles.manage",
    sidebar: {
      label: "User Role Assignment",
      icon: "✓",
    },
    Component: ListUserRole,
  },
  {
    path: "/settings",
    permission: null,
    sidebar: null,
    Component: UserSettings,
  },
];

export const PUBLIC_ROUTES = [
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/forgot-password", Component: ForgotPassword },
];

/**
 * @param {(permission: string) => boolean} hasPermission
 * @returns {string}
 */
export function getDefaultAccessibleRoute(hasPermission) {
  const match = PROTECTED_ROUTES.find(
    (route) => route.permission && hasPermission(route.permission),
  );

  return match?.path || "/settings";
}

/**
 * @param {(permission: string) => boolean} hasPermission
 */
export function getSidebarRoutes(hasPermission) {
  return PROTECTED_ROUTES.filter(
    (route) => route.sidebar && hasPermission(route.permission),
  );
}
