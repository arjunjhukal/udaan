import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages & Layouts
import App from "../App";
import CategoryManagementRoot from "../components/pages/CategoryManagement";
import AllCategories from "../components/pages/CategoryManagement/allCategory";

import ActivityRoot from "../components/pages/ActivityLog";
import ContentManagementRoot from "../components/pages/ContentManagement";
import HomeScreens from "../components/pages/ContentManagement/HomeScreens";
import BannerRoot from "../components/pages/ContentManagement/HomeScreens/Banner";
import FeaturedCourseRoot from "../components/pages/ContentManagement/HomeScreens/FeaturedCourse";
import WelcomePopupRoot from "../components/pages/ContentManagement/HomeScreens/WelcomePopup";
import OnBoardingScreenRoot from "../components/pages/ContentManagement/OnBoardingScreen";
import PagesRoot from "../components/pages/ContentManagement/Pages";
import PageCreationForm from "../components/pages/ContentManagement/Pages/PageCreationForm";
import SplashScreenRoot from "../components/pages/ContentManagement/SplashScreen";
import CourseManagementRoot from "../components/pages/CourseManagement/Course";
import AllCourse from "../components/pages/CourseManagement/Course/allCourse";
import CourseAnalyticsRootLayout from "../components/pages/CourseManagement/Course/analytics";
import CreateCourseRoot from "../components/pages/CourseManagement/Course/createCourse";
import LiveClassRoot from "../components/pages/CourseManagement/LiveClass";
import AllLiveClass from "../components/pages/CourseManagement/LiveClass/allLiveClass";
import CreateLiveClassRoot from "../components/pages/CourseManagement/LiveClass/createLiveClass";
import QuizManagementRoot from "../components/pages/CourseManagement/quiz";
import AllQuizes from "../components/pages/CourseManagement/quiz/allQuiz";
import EnrollmentRoot from "../components/pages/Enrollments";
import AllEntrollments from "../components/pages/Enrollments/AllEnrollments";
import MediaManagementRoot from "../components/pages/MediaManagement";
import AllMediaRoot from "../components/pages/MediaManagement/allMedia";
import NotificationRoot from "../components/pages/NotificationManagement";
import AllNotificationsRoot from "../components/pages/NotificationManagement/allNotification";
import CreateNotificationRoot from "../components/pages/NotificationManagement/createNotification";
import RoleManagementRoot from "../components/pages/RoleManagement";
import AllRoles from "../components/pages/RoleManagement/allRoles";
import CreateRoleRoot from "../components/pages/RoleManagement/createRole";
import SettingRoot from "../components/pages/Setting";
import AppSettingRoot from "../components/pages/Setting/AppSetting";
import ChangePassword from "../components/pages/Setting/ChangePassword";
import LinkedDevices from "../components/pages/Setting/LinkedDevices";
import ProfilePageRoot from "../components/pages/Setting/Profile";
import SubscriptionManagementRoot from "../components/pages/SubscriptionManagement";
import TestAndQuestionManagementRoot from "../components/pages/TestAndQuestionManagement";
import QuestionManagementRoot from "../components/pages/TestAndQuestionManagement/QuestionManagement";
import TestManagementRoot from "../components/pages/TestAndQuestionManagement/TestManagement";
import SingleStudentSingleQuestion from "../components/pages/TestAndQuestionManagement/TestManagement/checkSinlgeQuestion";
import QuestionAnswerLisitingLayout from "../components/pages/TestAndQuestionManagement/TestManagement/checkTest/Layout";
import SingleStudentAnswerLayout from "../components/pages/TestAndQuestionManagement/TestManagement/checkTest/SingleStudentAnswerLayout";
import CreatTestRoot from "../components/pages/TestAndQuestionManagement/TestManagement/createTest";
import ResultRoot from "../components/pages/TestAndQuestionManagement/TestManagement/result";
import ViewTestRoot from "../components/pages/TestAndQuestionManagement/TestManagement/viewTest";
import TransactionManagementRoot from "../components/pages/TransactionManagement";
import AllTransactionRoot from "../components/pages/TransactionManagement/allTransation";
import AuthRoot from "../components/pages/auth";
import Login from "../components/pages/auth/login";
import NotFound from "../components/pages/layout/NotFound";
import SingleFormAuthLayout from "../components/pages/layout/SingleFormAuthLayout";
import AllPositions from "../components/pages/positionManagement/allPositions";
import UserManagementRoot from "../components/pages/userManagement";
import AllUsers from "../components/pages/userManagement/allUsers";
import CreateUser from "../components/pages/userManagement/createUser";
import { PATH } from "./PATH";
import Private from "./Private";
import Unauthorized from "./Unauthorized";

const router = createBrowserRouter([
	{
		element: <AuthRoot />,
		children: [
			{
				path: PATH.AUTH.LOGIN.ROOT,
				element: (
					<SingleFormAuthLayout>
						<Login requirePassword={true} />
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
				element: <Unauthorized permissions={["add_courses", "edit_courses", "delete_courses", "view_courses"]}><CourseManagementRoot /></Unauthorized>,
				children: [
					{ path: PATH.COURSE_MANAGEMENT.COURSES.ROOT, element: <AllCourse /> },
					{ path: PATH.COURSE_MANAGEMENT.COURSES.CREATE_COURSE.ROOT, element: <CreateCourseRoot /> },
					{ path: PATH.COURSE_MANAGEMENT.COURSES.EDIT_COURSE.ROOT(), element: <CreateCourseRoot /> },
					{ path: PATH.COURSE_MANAGEMENT.COURSES.ANALYTICS.ROOT(), element: <CourseAnalyticsRootLayout /> },
				],
			},
			{
				element: <Unauthorized permissions={["add_courses", "edit_courses", "delete_courses", "view_courses"]} >
					<EnrollmentRoot />
				</Unauthorized>,
				children: [
					{ path: "/enrollment", element: <AllEntrollments /> }
				]
			},
			{
				element: <Unauthorized permissions={["add_live_classes", "edit_live_classes", "delete_live_classes", "view_live_classes"]}> <LiveClassRoot /></Unauthorized>,
				children: [
					{ path: PATH.COURSE_MANAGEMENT.LIVE_CLASSES.ROOT, element: <AllLiveClass /> },
					{ path: PATH.COURSE_MANAGEMENT.LIVE_CLASSES.CREATE_LIVE_CLASS.ROOT, element: <CreateLiveClassRoot /> },
					{ path: PATH.COURSE_MANAGEMENT.LIVE_CLASSES.EDIT_LIVE_CLASS.ROOT(), element: <CreateLiveClassRoot /> },
				],
			},
			{
				element: <Unauthorized permissions={["add_quizes", "edit_quizes", "delete_quizes", "view_quizes"]}><QuizManagementRoot /></Unauthorized>,
				children: [
					{ path: PATH.COURSE_MANAGEMENT.QUIZ.ROOT, element: <AllQuizes /> },
				],
			},
			{
				element: <Unauthorized permissions={["add_questions", "edit_questions", "delete_questions", "view_questions", "add_tests", "edit_tests", "delete_tests", "view_tests"]}><TestAndQuestionManagementRoot /></Unauthorized>,
				children: [
					{
						path: PATH.TEST_QUESTION_MANAGEMENT.QUESTIONS.ROOT,
						element: <QuestionManagementRoot />,
					},
					{
						path: PATH.TEST_QUESTION_MANAGEMENT.TEST.ROOT,
						element: <TestManagementRoot />,
					},
					{
						path: PATH.TEST_QUESTION_MANAGEMENT.TEST.EDIT_TEST.ROOT(),
						element: <CreatTestRoot />,
					},
					{
						element: <ResultRoot />,
						children: [
							{
								path: PATH.TEST_QUESTION_MANAGEMENT.TEST.VIEW_TEST.ROOT(),
								element: <ViewTestRoot />,
							},
							{
								element: <SingleStudentAnswerLayout />,
								children: [
									{
										path: PATH.TEST_QUESTION_MANAGEMENT.TEST.CHECK_PAPER.ROOT(),
										element: <QuestionAnswerLisitingLayout />

									},
									{
										path: PATH.TEST_QUESTION_MANAGEMENT.TEST.CHECK_PAPER.CHECK_SUBJECTIVE_QUESTION.ROOT(),
										element: <SingleStudentSingleQuestion />,
									},
								]
							},
						],
					},
				],
			},
			{
				element: <Unauthorized permissions={["add_roles", "edit_roles", "delete_roles", "view_roles"]}>
					<RoleManagementRoot />
				</Unauthorized>,
				children: [
					{ path: PATH.ROLES.ROOT, element: <AllRoles /> },
					{ path: PATH.ROLES.CREATE_ROLE.ROOT, element: <CreateRoleRoot /> },
					{ path: PATH.ROLES.EDIT_ROLE.ROOT(), element: <CreateRoleRoot /> },
				],
			},
			{
				element: <Unauthorized permissions={["add_users", "edit_users", "delete_users", "view_users"]}><UserManagementRoot /></Unauthorized>,
				children: [
					{ index: true, path: PATH.USER_MANAGEMENT.ROOT, element: <AllUsers /> },
					{ path: PATH.USER_MANAGEMENT.CREATE_USER.ROOT, element: <CreateUser /> },
					{ path: PATH.USER_MANAGEMENT.EDIT_USER.ROOT(), element: <CreateUser /> },
				],
			},
			{
				element: <Unauthorized permissions={["add_categories", "edit_categories", "delete_categories", "view_categories", "add_positions", "edit_positions", "delete_positions", "view_positions"]}
				> <CategoryManagementRoot /></Unauthorized >,
				children: [
					{
						path: PATH.CATEGORY_LEVEL_MANAGEMENT.CATEGORY.ROOT,
						element: <Unauthorized permissions={["add_categories", "edit_categories", "delete_categories", "view_categories"]}>
							<AllCategories />
						</Unauthorized>
					},
					{
						path: PATH.CATEGORY_LEVEL_MANAGEMENT.LEVEL_POSITION.ROOT, element:
							<Unauthorized permissions={["add_positions", "edit_positions", "delete_positions", "view_positions"]}>
								<AllPositions />
							</Unauthorized>
					},
				],
			},
			{
				path: PATH.SUBSCRIPTION_PLAN_MANAGEMENT.ROOT,
				element: <Unauthorized permissions={["add_subscriptions", "edit_subscriptions", "delete_subscriptions", "view_subscriptions"]}> <SubscriptionManagementRoot /></Unauthorized>,
			},
			{
				element:
					<Unauthorized permissions={["add_transactions", "edit_transactions", "delete_transactions", "view_transactions"]}> <TransactionManagementRoot />
					</Unauthorized>,
				children: [
					{ path: PATH.TRANSACTION_MANAGEMENT.ROOT, element: <AllTransactionRoot /> },
				],
			},
			{
				element: <Unauthorized permissions={["add_notifications", "edit_notifications", "delete_notifications", "view_notifications"]}> <NotificationRoot /></Unauthorized>,
				children: [
					{ path: PATH.NOTIFICATION_MANAGEMENT.ROOT, element: <AllNotificationsRoot /> },
					{ path: PATH.NOTIFICATION_MANAGEMENT.CREATE_NOTIFICATION.ROOT, element: <CreateNotificationRoot /> },
					{ path: PATH.NOTIFICATION_MANAGEMENT.EDIT_NOTIFICATION.ROOT(), element: <CreateNotificationRoot /> },
				],
			},
			{
				path: "/content-management",
				element: <Unauthorized permissions={["add_contents", "edit_contents", "delete_contents", "view_contents"]}> <ContentManagementRoot /></Unauthorized>,
				children: [
					{ path: PATH.CONTENT_MANAGEMENT.SPLASH_SCREEN.ROOT, element: <SplashScreenRoot /> },
					{ path: PATH.CONTENT_MANAGEMENT.ONBOARDING_SCREEN.ROOT, element: <OnBoardingScreenRoot /> },
					{
						path: PATH.CONTENT_MANAGEMENT.HOME_SCREEN.ROOT, element: <HomeScreens />, children: [
							{ path: PATH.CONTENT_MANAGEMENT.HOME_SCREEN.WELCOME_POPUP.ROOT, element: <WelcomePopupRoot /> },
							{ path: PATH.CONTENT_MANAGEMENT.HOME_SCREEN.BANNER.ROOT, element: <BannerRoot /> },
							{ path: PATH.CONTENT_MANAGEMENT.HOME_SCREEN.FEATURED_COURSE.ROOT, element: <FeaturedCourseRoot /> },
						]
					},
					{ path: PATH.CONTENT_MANAGEMENT.PAGES.ROOT, element: <PagesRoot /> },
					{ path: PATH.CONTENT_MANAGEMENT.PAGES.CREATE_PAGE.ROOT, element: <PageCreationForm /> },
					{ path: PATH.CONTENT_MANAGEMENT.PAGES.EDIT_PAGE.ROOT(), element: <PageCreationForm /> },
				]
			},
			{
				path: PATH.SETTINGS.ROOT, element: <Unauthorized permissions={["add_settings", "edit_settings", "delete_settings", "view_settings"]}><SettingRoot /></Unauthorized>,
				children: [
					{ path: PATH.SETTINGS.PROFILE.ROOT, element: <ProfilePageRoot /> },
					{ path: PATH.SETTINGS.CHANGE_PASSWORD.ROOT, element: <ChangePassword /> },
					{ path: PATH.SETTINGS.LINKED_DEVICE.ROOT, element: <LinkedDevices /> },
					{ path: PATH.SETTINGS.APP_SETTINGS.ROOT, element: <AppSettingRoot /> },
				]
			},
			{
				path: PATH.ACTIVITY_LOG.ROOT,
				element: <ActivityRoot />
			},
			{
				element: <MediaManagementRoot />,
				children: [
					{ path: PATH.MEDIA_MANAGEMENT.ROOT, element: <AllMediaRoot /> },
				]
			}
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
