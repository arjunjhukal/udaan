export const PATH = {
	AUTH: {
		ADMIN_LOGIN: {
			ROOT: "/auth/admin-login",
		},
		LOGIN: {
			ROOT: "/auth/login",
		},
		REGISTER: {
			ROOT: "/auth/register",
		},
		VERIFY_OTP: {
			ROOT: "/auth/verify-otp",
		},
		FORGOT_OTP: {
			ROOT: "/auth/forgot-otp",
		},
	},
	DASHBOARD: {
		ROOT: "/dashboard",
	},
	ROLES: {
		ROOT: "/roles",
		CREATE_ROLE: {
			ROOT: "/roles/create-role",
		},
		EDIT_ROLE: {
			ROOT: "/roles/:id",
		},
	},
};
