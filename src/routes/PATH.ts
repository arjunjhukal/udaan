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
			ROOT: "/courses",
			CREATE_COURSE: {
				ROOT: "/courses/create-course",
			},
			EDIT_COURSE: {
				ROOT: (id?: string) =>
					id ? `/courses/${id}` : "/courses/:id",
			},
		},
		LIVE_CLASSES: {
			ROOT: "/live-classes",
			CREATE_LIVE_CLASS: {
				ROOT: "/live-classes/create-live-class",
			},
			EDIT_LIVE_CLASS: {
				ROOT: (id?: string) =>
					id ? `/live-classes/${id}` : "/live-classes/:id",
			},
		},
		QUIZ: {
			ROOT: "/quiz",
			CREATE_QUIZ: {
				ROOT: "/quiz/create-quiz",
			},
			EDIT_QUIZ: {
				ROOT: (id?: string) =>
					id ? `/quiz/${id}` : "/quiz/:id",
			},
		}
	},
	CATEGORY_LEVEL_MANAGEMENT: {
		ROOT: "/category-level-management",
		CATEGORY: {
			ROOT: "/category"
		},
		LEVEL_POSITION: {
			ROOT: "/position"
		},
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
	USER_MANAGEMENT: {
		ROOT: "/user-management",
		CREATE_USER: {
			ROOT: "/user-management/create-user",
		},
		EDIT_USER: {
			ROOT: (id?: string) =>
				id ? `/user-management/${id}` : "/user-management/:id",
		},
	}
};
