import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ResponsiveDrawer from "../components/pages/layout/sidebar";
import { useAppSelector } from "../store/hook";
import { PATH } from "./PATH";

export default function Private() {
	const navigate = useNavigate();
	const user = useAppSelector((state) => state.auth.user);
	const token = useAppSelector((state) => state.auth.token);
	console.log("Private Route - User:", user, "Token:", token);
	React.useEffect(() => {
		if (!user) {
			navigate(PATH.AUTH.LOGIN.ROOT);
		}
	}, [user, navigate]);

	if (!user) return null;
	return (
		<div className="udaan__root">
			<ResponsiveDrawer>
				<Outlet />
			</ResponsiveDrawer>
		</div>
	);
}
