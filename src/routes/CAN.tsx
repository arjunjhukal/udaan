import React from "react";
import { useAppSelector } from "../store/hook";

// roles.ts
export type Role = "admin" | "editor" | "moderator" | "viewer" | "guest";

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
