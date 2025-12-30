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
				ROOT: (id?: number) =>
					id ? `/courses/${id}` : "/courses/:id",
			},
		},
		LIVE_CLASSES: {
			ROOT: "/live-classes",
			CREATE_LIVE_CLASS: {
				ROOT: "/live-classes/create-live-class",
			},
			EDIT_LIVE_CLASS: {
				ROOT: (id?: number) =>
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
	},
	TEST_QUESTION_MANAGEMENT: {
		ROOT: "/test-question-management/",
		QUESTIONS: {
			ROOT: "/questions",
		},
		TEST: {
			ROOT: "/test",
			CREATE_TEST: {
				ROOT: "/test/create-test",
			},
			EDIT_TEST: {
				ROOT: (id?: number) =>
					id ? `/test/${id}` : "/test/:id",
			},
			VIEW_TEST: {
				ROOT: (id?: number) =>
					id ? `/test/${id}/view` : "/test/:id/view",
			},
			CHECK_PAPER: {
				ROOT: (id?: number, resultId?: number) =>
					id && resultId ? `/test/${id}/check-paper/${resultId}` : "/test/:id/check-paper/:resultId",
				CHECK_SUBJECTIVE_QUESTION: {
					ROOT: (id?: number, resultId?: number, questionId?: number) =>
						id && resultId ? `/test/${id}/check-paper/${resultId}/question/${questionId}` : "/test/:id/check-paper/:resultId/question/:questionId"
				}
			}
		}
	},
	SUBSCRIPTION_PLAN_MANAGEMENT: {
		ROOT: "/subscription-management"
	},
	TRANSACTION_MANAGEMENT: {
		ROOT: "/transaction-management"
	},
	NOTIFICATION_MANAGEMENT: {
		ROOT: "/notification-management",
		CREATE_NOTIFICATION: {
			ROOT: "/notification-management/create",
		},
		EDIT_NOTIFICATION: {
			ROOT: (id?: number) =>
				id ? `/notification-management/${id}` : "/notification-management/:id",
		},
	},
	CONTENT_MANAGEMENT: {
		ROOT: "/content-management",
		SPLASH_SCREEN: {
			ROOT: "/content-management/splash-screen"
		},
		ONBOARDING_SCREEN: {
			ROOT: "/content-management/onboarding-screen"
		},
		HOME_SCREEN: {
			ROOT: "/content-management/home-screen",
			WELCOME_POPUP: {
				ROOT: "/content-management/home-screen/welcome-popup"
			},
			BANNER: {
				ROOT: "/content-management/home-screen/banner"
			},
			FEATURED_COURSE: {
				ROOT: "/content-management/home-screen/featured-course"
			}
		},
		PAGES: {
			ROOT: "/content-management/pages",
			CREATE_PAGE: {
				ROOT: "/content-management/pages/create"
			},
			EDIT_PAGE: {
				ROOT: (id?: string) => id ? `/content-management/pages/${id}` : `/content-management/pages/:id`
			}
		}
	},
	SETTINGS: {
		ROOT: "/settings",
		PROFILE: {
			ROOT: "/settings/profile"
		},
		CHANGE_PASSWORD: {
			ROOT: "/settings/change-password"
		},
		LINKED_DEVICE: {
			ROOT: "/settings/linked-devices"
		},
		APP_SETTINGS: {
			ROOT: "/settings/app-settings"
		}
	},
	ACTIVITY_LOG: {
		ROOT: "/activity-log"
	}
};
