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
	COURSE_MANAGEMENT: {
		ROOT: "/course-management",
		COURSES: {
			ROOT: "/courses"
		},
		LIVE_CLASSES: {
			ROOT: "/live-classes"
		},
		QUIZ: {
			ROOT: "/quiz"
		}
	},
	ROLES: {
		ROOT: "/role-management",
		CREATE_ROLE: {
			ROOT: "/role-management/create-role",
		},
		EDIT_ROLE: {
			ROOT: (id?: string) =>
				id ? `/role-management/${id}` : "/role-management/:id",
		},
	},
	USER: {
		ROOT: "/users",
	}
};
