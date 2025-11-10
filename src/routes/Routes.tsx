import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages & Layouts
import App from "../App";
import RoleManagementRoot from "../components/pages/RoleManagement";
import AllRoles from "../components/pages/RoleManagement/allRoles";
import CreateRoleRoot from "../components/pages/RoleManagement/createRole";
import AuthRoot from "../components/pages/auth";
import Login from "../components/pages/auth/login";
import Register from "../components/pages/auth/register";
import VerifyOTP from "../components/pages/auth/verifyOtp";
import AuthLayout from "../components/pages/layout/AuthLayout";
import NotFound from "../components/pages/layout/NotFound";
import SingleFormAuthLayout from "../components/pages/layout/SingleFormAuthLayout";
import UserManagementRoot from "../components/pages/userManagement";
import CAN from "./CAN";
import { PATH } from "./PATH";
import Private from "./Private";
import AllUsers from "../components/pages/userManagement/allUsers";
import CreateUser from "../components/pages/userManagement/createUser";

const router = createBrowserRouter([
	{
		element: <AuthRoot />,
		children: [
			{
				path: PATH.AUTH.ADMIN_LOGIN.ROOT,
				element: (
					<SingleFormAuthLayout>
						<Login requirePassword={true} />
					</SingleFormAuthLayout>
				),
			},
			{
				element: <AuthLayout />,
				children: [
					{ index: true, path: PATH.AUTH.LOGIN.ROOT, element: <Login /> },
					{ path: PATH.AUTH.REGISTER.ROOT, element: <Register /> },
				],
			},
			{
				path: PATH.AUTH.VERIFY_OTP.ROOT,
				element: (
					<SingleFormAuthLayout>
						<VerifyOTP />
					</SingleFormAuthLayout>
				),
			},
		],
	},

	// 🔒 PRIVATE MODULE
	{
		element: <Private />,
		children: [
			{
				index: true,
				path: "/",
				element: <App />,
			},
			{
				path: PATH.DASHBOARD.ROOT,
				element: <App />,
			},
			{
				element: <CAN permissions={["add_roles", "edit_roles", "delete_roles", "view_roles"]}>
					<RoleManagementRoot />
				</CAN>,
				children: [
					{ path: PATH.ROLES.ROOT, element: <AllRoles /> },
					{ path: PATH.ROLES.CREATE_ROLE.ROOT, element: <CAN permissions={["add_roles", "edit_roles"]}><CreateRoleRoot /> </CAN> },
					{ path: PATH.ROLES.EDIT_ROLE.ROOT(), element: <CAN permissions={["add_roles", "edit_roles"]}><CreateRoleRoot /></CAN> },
				],
			},
			{
				element: <UserManagementRoot />,
				children: [
					{ path: PATH.USER_MANAGEMENT.ROOT, element: <AllUsers /> },
					{ path: PATH.USER_MANAGEMENT.CREATE_USER.ROOT, element: <CreateUser /> },
					{ path: PATH.USER_MANAGEMENT.EDIT_ROLE.ROOT(), element: <CreateUser /> },
				],
			},
		],
	},

	{
		path: "*",
		element: <NotFound />,
	},
]);

export default function GlobalRoutes() {
	return <RouterProvider router={router} />;
}
