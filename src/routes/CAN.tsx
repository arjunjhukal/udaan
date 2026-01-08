import React from "react";
import { useAppSelector } from "../store/hook";

interface CanProps {
	permissions: string[];
	children: React.ReactNode;
}

export default function CAN({ permissions, children }: CanProps) {
	const user = useAppSelector(state => state.auth.user);

	const userPermissions = user?.permissions || [];

	const hasPermission = permissions.some((p) => userPermissions.includes(p));

	if (!hasPermission) return null;

	return <>{children}</>;
}
