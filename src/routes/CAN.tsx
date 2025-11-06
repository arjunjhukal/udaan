import React from "react";

// roles.ts
export type Role = "admin" | "editor" | "moderator" | "viewer" | "guest";

interface CanProps {
	permissions: string[];
	children: React.ReactNode;
}

export default function CAN({ permissions, children }: CanProps) {
	const user = {
		role: "admin",
		permissions: [
			"create_user",
			"edit_user",
			"delete_user",
			"view_user",
			"create_role",
		],
	};

	const userPermissions = user.permissions || [];

	const hasPermission = permissions.some((p) => userPermissions.includes(p));

	if (!hasPermission) return null;

	return <>{children}</>;
}
