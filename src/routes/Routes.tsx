import { Route, Routes } from "react-router-dom";
import App from "../App";
import RoleManagementRoot from "../components/pages/RoleManagement";
import RoleManagementForm from "../components/pages/RoleManagement/RoleManagementForm";
import AllRoles from "../components/pages/RoleManagement/allRoles";
import AuthRoot from "../components/pages/auth";
import Login from "../components/pages/auth/login";
import Register from "../components/pages/auth/register";
import NotFound from "../components/pages/layout/NotFound";
import { PATH } from "./PATH";
import Private from "./Private";

export default function GlobalRoutes() {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route element={<AuthRoot />}>
                <Route path={PATH.AUTH.LOGIN.ROOT} element={<Login />}></Route>
                <Route path={PATH.AUTH.REGISTER.ROOT} element={<Register />}></Route>
                <Route path={PATH.AUTH.LOGIN.ROOT} element={<Login />}></Route>
            </Route>
            <Route element={<Private />}>
                <Route path="/" element={<App />} />
                <Route path={PATH.DASHBOARD.ROOT} element={<App />} />
                <Route element={<RoleManagementRoot />}>
                    <Route path={PATH.ROLES.ROOT} element={<AllRoles />} />
                    <Route path={PATH.ROLES.CREATE_ROLE.ROOT} element={<RoleManagementForm />} />
                    <Route path={PATH.ROLES.EDIT_ROLE.ROOT} element={<RoleManagementForm />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Route>
        </Routes>
    )
}
