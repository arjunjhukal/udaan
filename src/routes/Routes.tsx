import { Suspense, type ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";
import { createBrowserRouter, Outlet, RouterProvider, type RouteObject } from "react-router-dom";

import RouteErrorBoundary from "../components/organism/ErrorBoundary";
import { lazyWithRetry } from "../utils/lazyRetry";
import { PATH } from "./PATH";
import Private from "./Private";
import Unauthorized from "./Unauthorized";

function RouteFallback() {
  return (
    <Box className="w-full flex items-center justify-center" sx={{ minHeight: "60vh" }}>
      <CircularProgress size={32} />
    </Box>
  );
}

const S = (node: ReactNode) => <Suspense fallback={<RouteFallback />}>{node}</Suspense>;

const App = lazyWithRetry(() => import("../App"));
const LiveAnalyticsPage = lazyWithRetry(() => import("../components/pages/LiveAnalytics"));
const CategoryManagementRoot = lazyWithRetry(() => import("../components/pages/CategoryManagement"));
const AllCategories = lazyWithRetry(() => import("../components/pages/CategoryManagement/allCategory"));

const ActivityRoot = lazyWithRetry(() => import("../components/pages/ActivityLog"));
const ArchivedLogs = lazyWithRetry(() => import("../components/pages/ActivityLog/ArchivedLogs"));
const ContentManagementRoot = lazyWithRetry(() => import("../components/pages/ContentManagement"));
const HomeScreens = lazyWithRetry(() => import("../components/pages/ContentManagement/HomeScreens"));
const BannerRoot = lazyWithRetry(() => import("../components/pages/ContentManagement/HomeScreens/Banner"));
const FeaturedCourseRoot = lazyWithRetry(() => import("../components/pages/ContentManagement/HomeScreens/FeaturedCourse"));
const WelcomePopupRoot = lazyWithRetry(() => import("../components/pages/ContentManagement/HomeScreens/WelcomePopup"));
const OnBoardingScreenRoot = lazyWithRetry(() => import("../components/pages/ContentManagement/OnBoardingScreen"));
const PagesRoot = lazyWithRetry(() => import("../components/pages/ContentManagement/Pages"));
const PageCreationForm = lazyWithRetry(() => import("../components/pages/ContentManagement/Pages/PageCreationForm"));
const SplashScreenRoot = lazyWithRetry(() => import("../components/pages/ContentManagement/SplashScreen"));
const ControlsRoot = lazyWithRetry(() => import("../components/pages/Controls"));
const CourseManagementRoot = lazyWithRetry(() => import("../components/pages/CourseManagement/Course"));
const AllCourse = lazyWithRetry(() => import("../components/pages/CourseManagement/Course/allCourse"));
const CourseAnalyticsRootLayout = lazyWithRetry(() => import("../components/pages/CourseManagement/Course/analytics"));
const CreateCourseRoot = lazyWithRetry(() => import("../components/pages/CourseManagement/Course/createCourse"));
const CourseMedia = lazyWithRetry(() => import("../components/pages/CourseManagement/Course/createCourse/CourseMedia"));
const CourseCurriculumForm = lazyWithRetry(() => import("../components/pages/CourseManagement/Course/createCourse/CourseSubFields/Curriculum"));
const CourseTest = lazyWithRetry(() => import("../components/pages/CourseManagement/Course/createCourse/CourseSubFields/Test"));
const LiveClassRoot = lazyWithRetry(() => import("../components/pages/CourseManagement/LiveClass"));
const AllLiveClass = lazyWithRetry(() => import("../components/pages/CourseManagement/LiveClass/allLiveClass"));
const CreateLiveClassRoot = lazyWithRetry(() => import("../components/pages/CourseManagement/LiveClass/createLiveClass"));
const SetRoot = lazyWithRetry(() => import("../components/pages/CourseManagement/Sets"));
const AllSets = lazyWithRetry(() => import("../components/pages/CourseManagement/Sets/AllSets"));
const CreateSet = lazyWithRetry(() => import("../components/pages/CourseManagement/Sets/CreateSet"));
const QuizManagementRoot = lazyWithRetry(() => import("../components/pages/CourseManagement/quiz"));
const AllQuizes = lazyWithRetry(() => import("../components/pages/CourseManagement/quiz/allQuiz"));
const DeviceResetManagementRoot = lazyWithRetry(() => import("../components/pages/DeviceResetManagement"));
const DeviceResetDetailPage = lazyWithRetry(() => import("../components/pages/DeviceResetManagement/DeviceResetDetailPage"));
const DiscussionManagementRoot = lazyWithRetry(() => import("../components/pages/DiscussionManagement"));
const DiscussionDetail = lazyWithRetry(() => import("../components/pages/DiscussionManagement/DiscussionDetail"));
const DiscussionForm = lazyWithRetry(() => import("../components/pages/DiscussionManagement/DiscussionForm"));
const AllDiscussions = lazyWithRetry(() => import("../components/pages/DiscussionManagement/allDiscussions"));
const EnrollmentRoot = lazyWithRetry(() => import("../components/pages/Enrollments"));
const AllEntrollments = lazyWithRetry(() => import("../components/pages/Enrollments/AllEnrollments"));
const BundleEnrollmentPage = lazyWithRetry(() => import("../components/pages/Enrollments/BundleEnrollment"));
const TestEnrollmentPage = lazyWithRetry(() => import("../components/pages/Enrollments/TestEnrollment"));
const EbookRoot = lazyWithRetry(() => import("../components/pages/EbookManagement"));
const AllEbookRoot = lazyWithRetry(() => import("../components/pages/EbookManagement/allEbook"));
const EbookAssignedUsersRoot = lazyWithRetry(() => import("../components/pages/EbookManagement/assignedUsers"));
const CreateEbookRoot = lazyWithRetry(() => import("../components/pages/EbookManagement/createEbook"));
const GorkhapatraRoot = lazyWithRetry(() => import("../components/pages/Gorkhapatra"));
const AllGorkhapatraRoot = lazyWithRetry(() => import("../components/pages/Gorkhapatra/allGorkhapatra"));
const CreateGorkhapatraRoot = lazyWithRetry(() => import("../components/pages/Gorkhapatra/createGorkhapatra"));
const MediaManagementRoot = lazyWithRetry(() => import("../components/pages/MediaManagement"));
const AllMediaRoot = lazyWithRetry(() => import("../components/pages/MediaManagement/allMedia"));
const ModerationManagementRoot = lazyWithRetry(() => import("../components/pages/ModerationManagement"));
const WordModeration = lazyWithRetry(() => import("../components/pages/ModerationManagement/WordModeration"));
const NotificationRoot = lazyWithRetry(() => import("../components/pages/NotificationManagement"));
const AllNotificationsRoot = lazyWithRetry(() => import("../components/pages/NotificationManagement/allNotification"));
const CreateNotificationRoot = lazyWithRetry(() => import("../components/pages/NotificationManagement/createNotification"));
const RoleManagementRoot = lazyWithRetry(() => import("../components/pages/RoleManagement"));
const AllRoles = lazyWithRetry(() => import("../components/pages/RoleManagement/allRoles"));
const CreateRoleRoot = lazyWithRetry(() => import("../components/pages/RoleManagement/createRole"));
const AppSettingRoot = lazyWithRetry(() => import("../components/pages/Setting/AppSetting"));
const ChangePassword = lazyWithRetry(() => import("../components/pages/Setting/ChangePassword"));
const LinkedDevices = lazyWithRetry(() => import("../components/pages/Setting/LinkedDevices"));
const ProfilePageRoot = lazyWithRetry(() => import("../components/pages/Setting/Profile"));
const EsewaSettingRoot = lazyWithRetry(() => import("../components/pages/Setting/ApiSetting/Esewa"));
const KhaltiSettingRoot = lazyWithRetry(() => import("../components/pages/Setting/ApiSetting/Khalti"));
const SmsGatewayRoot = lazyWithRetry(() => import("../components/pages/Setting/ApiSetting/SmsGateway"));
const ZoomSettingRoot = lazyWithRetry(() => import("../components/pages/Setting/ApiSetting/Zoom"));
const CourseSettingRoot = lazyWithRetry(() => import("../components/pages/Setting/CourseSetting"));
const OmrSettingRoot = lazyWithRetry(() => import("../components/pages/Setting/OmrSetting"));
const EmailTemplatesRoot = lazyWithRetry(() => import("../components/pages/Setting/EmailTemplates"));
const LoginTypeRoot = lazyWithRetry(() => import("../components/pages/Setting/LoginType"));
const SiteInfoRoot = lazyWithRetry(() => import("../components/pages/Setting/SiteInfo"));
const SmtpSettingRoot = lazyWithRetry(() => import("../components/pages/Setting/Smtp"));
const SettingRoot = lazyWithRetry(() => import("../components/pages/Setting"));
const SubscriptionManagementRoot = lazyWithRetry(() => import("../components/pages/SubscriptionManagement"));
const TestAndQuestionManagementRoot = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement"));
const OmrSheetRoot = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/OmrSheets"));
const OmrFormatForm = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/OmrSheets/OmrFormatForm"));
const AllOmrSheets = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/OmrSheets/allOmr"));
const AllOmrFormats = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/OmrSheets/allOmrFormat"));
const QuestionManagementRoot = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/QuestionManagement"));
const TestManagementRoot = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/TestManagement"));
const AllIndividualTestListing = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/TestManagement/allIndividualTest"));
const SingleStudentSingleQuestion = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/TestManagement/checkSinlgeQuestion"));
const QuestionAnswerLisitingLayout = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/TestManagement/checkTest/Layout"));
const SingleStudentAnswerLayout = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/TestManagement/checkTest/SingleStudentAnswerLayout"));
const CreatTestRoot = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/TestManagement/createTest"));
const ResultRoot = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/TestManagement/result"));
const ViewTestRoot = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/TestManagement/viewTest"));
const TicketManagementRoot = lazyWithRetry(() => import("../components/pages/TicketManagement"));
const TicketTypes = lazyWithRetry(() => import("../components/pages/TicketManagement/TicketTypes"));
const AllTickets = lazyWithRetry(() => import("../components/pages/TicketManagement/allTickets"));
const TicketChats = lazyWithRetry(() => import("../components/pages/TicketManagement/chats"));
const TicketChatPage = lazyWithRetry(() => import("../components/pages/TicketManagement/chats/TicketChatPage"));
const TransactionManagementRoot = lazyWithRetry(() => import("../components/pages/TransactionManagement"));
const AllTransactionRoot = lazyWithRetry(() => import("../components/pages/TransactionManagement/allTransation"));
const AuthRoot = lazyWithRetry(() => import("../components/pages/auth"));
const Login = lazyWithRetry(() => import("../components/pages/auth/login"));
const NotFound = lazyWithRetry(() => import("../components/pages/layout/NotFound"));
const SingleFormAuthLayout = lazyWithRetry(() => import("../components/pages/layout/SingleFormAuthLayout"));
const AllPositions = lazyWithRetry(() => import("../components/pages/positionManagement/allPositions"));
const UserManagementRoot = lazyWithRetry(() => import("../components/pages/userManagement"));
const AllUsers = lazyWithRetry(() => import("../components/pages/userManagement/allUsers"));
const CreateUser = lazyWithRetry(() => import("../components/pages/userManagement/createUser"));
const ViewUserRoot = lazyWithRetry(() => import("../components/pages/userManagement/viewUser"));
const ProfileTab = lazyWithRetry(() => import("../components/pages/userManagement/viewUser/tabs/ProfileTab"));
const CoursesTab = lazyWithRetry(() => import("../components/pages/userManagement/viewUser/tabs/CoursesTab"));
const TransactionsTab = lazyWithRetry(() => import("../components/pages/userManagement/viewUser/tabs/TransactionsTab"));
const DeviceRequestsTab = lazyWithRetry(() => import("../components/pages/userManagement/viewUser/tabs/DeviceRequestsTab"));
const PerformanceTab = lazyWithRetry(() => import("../components/pages/userManagement/viewUser/tabs/PerformanceTab"));
const UserLoginHistory = lazyWithRetry(() => import("../components/pages/userManagement/viewUser/UserLoginHistory"));
const UserActivityHistory = lazyWithRetry(() => import("../components/pages/userManagement/viewUser/UserActivityHistory"));
const QuestionLabelsRoot = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/QuestionLabels"));
const QuestionLabelDetail = lazyWithRetry(() => import("../components/pages/TestAndQuestionManagement/QuestionLabels/detail"));

const routes: RouteObject[] = [
	{
		element: S(<AuthRoot />),
		children: [
			{
				path: PATH.AUTH.LOGIN.ROOT,
				element: S(
					<SingleFormAuthLayout>
						<Login requirePassword={true} />
					</SingleFormAuthLayout>
				),
			},
		],
	},

	{
		element: <Private />,
		children: [
			{ index: true, path: "/", element: S(<App />) },
			{ path: PATH.DASHBOARD.ROOT, element: S(<App />) },
			{ path: PATH.LIVE_ANALYTICS.ROOT, element: S(<LiveAnalyticsPage />) },
			{
				element: S(<Unauthorized permissions={["add_courses", "edit_courses", "delete_courses", "view_courses"]}><CourseManagementRoot /></Unauthorized>),
				children: [
					{ path: PATH.COURSE_MANAGEMENT.COURSES.ROOT, element: S(<AllCourse />) },
					{ path: PATH.COURSE_MANAGEMENT.COURSES.CREATE_COURSE.ROOT, element: S(<CreateCourseRoot />) },
					{
						path: PATH.COURSE_MANAGEMENT.COURSES.EDIT_COURSE.ROOT(),
						element: S(<CreateCourseRoot />),
						children: [
							{ path: PATH.COURSE_MANAGEMENT.COURSES.EDIT_COURSE.CURRICULUM.ROOT(), element: S(<CourseCurriculumForm />) },
							{ path: PATH.COURSE_MANAGEMENT.COURSES.EDIT_COURSE.VIDEOS.ROOT(), element: S(<CourseMedia type="videos" />) },
							{ path: PATH.COURSE_MANAGEMENT.COURSES.EDIT_COURSE.NOTES.ROOT(), element: S(<CourseMedia type="notes" />) },
							{ path: PATH.COURSE_MANAGEMENT.COURSES.EDIT_COURSE.AUDIOS.ROOT(), element: S(<CourseMedia type="audios" />) },
							{ path: PATH.COURSE_MANAGEMENT.COURSES.EDIT_COURSE.TEST.ROOT(), element: S(<CourseTest />) },
						]
					},
					{ path: PATH.COURSE_MANAGEMENT.COURSES.ANALYTICS.ROOT(), element: S(<CourseAnalyticsRootLayout />) },
				],
			},
			{
				element: S(<Unauthorized permissions={["add_enrollments", "edit_enrollments", "delete_enrollments", "view_enrollments"]}><EnrollmentRoot /></Unauthorized>),
				children: [
					{ path: "/enrollment", element: S(<AllEntrollments />) },
					{ path: PATH.ENROLLMENT.TEST_ANALYTICS.ROOT(), element: S(<TestEnrollmentPage />) },
					{ path: PATH.ENROLLMENT.BUNDLE_ANALYTICS.ROOT(), element: S(<BundleEnrollmentPage />) },
				]
			},
			{
				element: S(<Unauthorized permissions={["add_live_classes", "edit_live_classes", "delete_live_classes", "view_live_classes"]}><LiveClassRoot /></Unauthorized>),
				children: [
					{ path: PATH.COURSE_MANAGEMENT.LIVE_CLASSES.ROOT, element: S(<AllLiveClass />) },
					{ path: PATH.COURSE_MANAGEMENT.LIVE_CLASSES.CREATE_LIVE_CLASS.ROOT, element: S(<CreateLiveClassRoot />) },
					{ path: PATH.COURSE_MANAGEMENT.LIVE_CLASSES.EDIT_LIVE_CLASS.ROOT(), element: S(<CreateLiveClassRoot />) },
				],
			},
			{
				element: S(<Unauthorized permissions={["add_omr_sheets", "edit_omr_sheets", "delete_omr_sheets", "view_omr_sheets"]}><OmrSheetRoot /></Unauthorized>),
				children: [
					{ path: PATH.OMR.ROOT, element: S(<AllOmrSheets />) },
					{ path: PATH.OMR.FORMAT.ROOT, element: S(<AllOmrFormats />) },
					{ path: PATH.OMR.FORMAT.CREATE.ROOT, element: S(<OmrFormatForm />) },
					{ path: PATH.OMR.FORMAT.EDIT.ROOT(), element: S(<OmrFormatForm />) },
				],
			},
			{
				element: S(<Unauthorized permissions={["add_bundles", "edit_bundles", "delete_bundles", "view_bundles"]}><SetRoot /></Unauthorized>),
				children: [
					{ path: PATH.SET.ROOT, element: S(<AllSets />) },
					{ path: PATH.SET.CREATE_SET.ROOT, element: S(<CreateSet />) },
					{ path: PATH.SET.EDIT_SET.ROOT(), element: S(<CreateSet />) },
				],
			},
			{
				element: S(<Unauthorized permissions={["add_quizes", "edit_quizes", "delete_quizes", "view_quizes"]}><QuizManagementRoot /></Unauthorized>),
				children: [
					{ path: PATH.COURSE_MANAGEMENT.QUIZ.ROOT, element: S(<AllQuizes />) },
				],
			},
			{
				element: S(<Unauthorized permissions={["add_questions", "edit_questions", "delete_questions", "view_questions", "add_tests", "edit_tests", "delete_tests", "view_tests"]}><TestAndQuestionManagementRoot /></Unauthorized>),
				children: [
					{ path: PATH.TEST_QUESTION_MANAGEMENT.QUESTIONS.ROOT, element: S(<QuestionManagementRoot />) },
					{ path: PATH.TEST_QUESTION_MANAGEMENT.QUESTION_LABELS.ROOT, element: S(<QuestionLabelsRoot />) },
					{ path: PATH.TEST_QUESTION_MANAGEMENT.QUESTION_LABELS.DETAIL.ROOT(), element: S(<QuestionLabelDetail />) },
					{ path: PATH.TEST_QUESTION_MANAGEMENT.TEST.ROOT, element: S(<TestManagementRoot />) },
					{ path: PATH.TEST_QUESTION_MANAGEMENT.TEST.INDIVIDUAL_TEST.ROOT, element: S(<AllIndividualTestListing />) },
					{ path: PATH.TEST_QUESTION_MANAGEMENT.TEST.EDIT_TEST.ROOT(), element: S(<CreatTestRoot />) },
					{
						element: S(<ResultRoot />),
						children: [
							{ path: PATH.TEST_QUESTION_MANAGEMENT.TEST.VIEW_TEST.ROOT(), element: S(<ViewTestRoot />) },
							{
								element: S(<SingleStudentAnswerLayout />),
								children: [
									{ path: PATH.TEST_QUESTION_MANAGEMENT.TEST.CHECK_PAPER.ROOT(), element: S(<QuestionAnswerLisitingLayout />) },
									{ path: PATH.TEST_QUESTION_MANAGEMENT.TEST.CHECK_PAPER.CHECK_SUBJECTIVE_QUESTION.ROOT(), element: S(<SingleStudentSingleQuestion />) },
								]
							},
						],
					},
				],
			},
			{
				element: S(<Unauthorized permissions={["add_roles", "edit_roles", "delete_roles", "view_roles"]}><RoleManagementRoot /></Unauthorized>),
				children: [
					{ path: PATH.ROLES.ROOT, element: S(<AllRoles />) },
					{ path: PATH.ROLES.CREATE_ROLE.ROOT, element: S(<CreateRoleRoot />) },
					{ path: PATH.ROLES.EDIT_ROLE.ROOT(), element: S(<CreateRoleRoot />) },
				],
			},
			{
				element: S(<Unauthorized permissions={["add_users", "edit_users", "delete_users", "view_users"]}><UserManagementRoot /></Unauthorized>),
				children: [
					{ index: true, path: PATH.USER_MANAGEMENT.ROOT, element: S(<AllUsers />) },
					{ path: PATH.USER_MANAGEMENT.CREATE_USER.ROOT, element: S(<CreateUser />) },
					{ path: PATH.USER_MANAGEMENT.EDIT_USER.ROOT(), element: S(<CreateUser />) },
					{
						path: PATH.USER_MANAGEMENT.VIEW_USER.ROOT(),
						element: S(<ViewUserRoot />),
						children: [
							{ index: true, element: S(<ProfileTab />) },
							{ path: "profile", element: S(<ProfileTab />) },
							{ path: "courses", element: S(<CoursesTab />) },
							{ path: "transactions", element: S(<TransactionsTab />) },
							{ path: "device-requests", element: S(<DeviceRequestsTab />) },
							{ path: "performance", element: S(<PerformanceTab />) },
							{ path: "login-history", element: S(<UserLoginHistory />) },
							{ path: "activity-history", element: S(<UserActivityHistory />) },
						],
					},
				],
			},
			{
				element: S(<Unauthorized permissions={["add_categories", "edit_categories", "delete_categories", "view_categories", "add_positions", "edit_positions", "delete_positions", "view_positions"]}><CategoryManagementRoot /></Unauthorized>),
				children: [
					{
						path: PATH.CATEGORY_LEVEL_MANAGEMENT.CATEGORY.ROOT,
						element: S(<Unauthorized permissions={["add_categories", "edit_categories", "delete_categories", "view_categories"]}><AllCategories /></Unauthorized>),
					},
					{
						path: PATH.CATEGORY_LEVEL_MANAGEMENT.LEVEL_POSITION.ROOT,
						element: S(<Unauthorized permissions={["add_positions", "edit_positions", "delete_positions", "view_positions"]}><AllPositions /></Unauthorized>),
					},
				],
			},
			{
				path: PATH.SUBSCRIPTION_PLAN_MANAGEMENT.ROOT,
				element: S(<Unauthorized permissions={["add_subscriptions", "edit_subscriptions", "delete_subscriptions", "view_subscriptions"]}><SubscriptionManagementRoot /></Unauthorized>),
			},
			{
				element: S(<Unauthorized permissions={["add_transactions", "edit_transactions", "delete_transactions", "view_transactions"]}><TransactionManagementRoot /></Unauthorized>),
				children: [
					{ path: PATH.TRANSACTION_MANAGEMENT.ROOT, element: S(<AllTransactionRoot />) },
				],
			},
			{
				element: S(<Unauthorized permissions={["add_notifications", "edit_notifications", "delete_notifications", "view_notifications"]}><NotificationRoot /></Unauthorized>),
				children: [
					{ path: PATH.NOTIFICATION_MANAGEMENT.ROOT, element: S(<AllNotificationsRoot />) },
					{ path: PATH.NOTIFICATION_MANAGEMENT.CREATE_NOTIFICATION.ROOT, element: S(<CreateNotificationRoot />) },
					{ path: PATH.NOTIFICATION_MANAGEMENT.EDIT_NOTIFICATION.ROOT(), element: S(<CreateNotificationRoot />) },
				],
			},
			{
				element: S(<Unauthorized permissions={["add_ebooks", "edit_ebooks", "delete_ebooks", "view_ebooks"]}><EbookRoot /></Unauthorized>),
				children: [
					{ path: PATH.EBOOK.ROOT, element: S(<AllEbookRoot />) },
					{ path: PATH.EBOOK.CREATE_EBOOK.ROOT, element: S(<CreateEbookRoot />) },
					{ path: PATH.EBOOK.EDIT_EBOOK.ROOT(), element: S(<CreateEbookRoot />) },
					{ path: PATH.EBOOK.ASSIGNED_USERS.ROOT(), element: S(<EbookAssignedUsersRoot />) },
				],
			},
			{
				element: S(<Unauthorized permissions={["add_gorkhapatras", "edit_gorkhapatras", "delete_gorkhapatras", "view_gorkhapatras"]}><GorkhapatraRoot /></Unauthorized>),
				children: [
					{ path: PATH.GORKHAPATRA.ROOT, element: S(<AllGorkhapatraRoot />) },
					{ path: PATH.GORKHAPATRA.CREATE_GORKHAPATRA.ROOT, element: S(<CreateGorkhapatraRoot />) },
					{ path: PATH.GORKHAPATRA.EDIT_GORKHAPATRA.ROOT(), element: S(<CreateGorkhapatraRoot />) },
				],
			},
			{
				path: "/content-management",
				element: S(<Unauthorized permissions={["add_contents", "edit_contents", "delete_contents", "view_contents"]}><ContentManagementRoot /></Unauthorized>),
				children: [
					{ path: PATH.CONTENT_MANAGEMENT.SPLASH_SCREEN.ROOT, element: S(<SplashScreenRoot />) },
					{ path: PATH.CONTENT_MANAGEMENT.ONBOARDING_SCREEN.ROOT, element: S(<OnBoardingScreenRoot />) },
					{
						path: PATH.CONTENT_MANAGEMENT.HOME_SCREEN.ROOT, element: S(<HomeScreens />), children: [
							{ path: PATH.CONTENT_MANAGEMENT.HOME_SCREEN.WELCOME_POPUP.ROOT, element: S(<WelcomePopupRoot />) },
							{ path: PATH.CONTENT_MANAGEMENT.HOME_SCREEN.BANNER.ROOT, element: S(<BannerRoot />) },
							{ path: PATH.CONTENT_MANAGEMENT.HOME_SCREEN.FEATURED_COURSE.ROOT, element: S(<FeaturedCourseRoot />) },
						]
					},
					{ path: PATH.CONTENT_MANAGEMENT.PAGES.ROOT, element: S(<PagesRoot />) },
					{ path: PATH.CONTENT_MANAGEMENT.PAGES.CREATE_PAGE.ROOT, element: S(<PageCreationForm />) },
					{ path: PATH.CONTENT_MANAGEMENT.PAGES.EDIT_PAGE.ROOT(), element: S(<PageCreationForm />) },
				]
			},
			{
				path: PATH.SETTINGS.ROOT,
				element: S(<Unauthorized permissions={["add_settings", "edit_settings", "delete_settings", "view_settings"]}><SettingRoot /></Unauthorized>),
				children: [
					{ path: PATH.SETTINGS.SYSTEM.PROFILE.ROOT, element: S(<ProfilePageRoot />) },
					{ path: PATH.SETTINGS.SYSTEM.CHANGE_PASSWORD.ROOT, element: S(<ChangePassword />) },
					{ path: PATH.SETTINGS.SYSTEM.SITE_INFO.ROOT, element: S(<SiteInfoRoot />) },
					{ path: PATH.SETTINGS.SYSTEM.SMTP.ROOT, element: S(<SmtpSettingRoot />) },
					{ path: PATH.SETTINGS.SYSTEM.GENERAL.ROOT, element: S(<AppSettingRoot />) },
					{ path: PATH.SETTINGS.SYSTEM.LINKED_DEVICE.ROOT, element: S(<LinkedDevices />) },
					{ path: PATH.SETTINGS.SYSTEM.EMAIL_TEMPLATES.ROOT, element: S(<EmailTemplatesRoot />) },
					{ path: PATH.SETTINGS.SYSTEM.COURSE_SETTING.ROOT, element: S(<CourseSettingRoot />) },
					{ path: PATH.SETTINGS.SYSTEM.LOGIN_TYPE.ROOT, element: S(<LoginTypeRoot />) },
					{ path: PATH.SETTINGS.API.ZOOM.ROOT, element: S(<ZoomSettingRoot />) },
					{ path: PATH.SETTINGS.API.ESEWA.ROOT, element: S(<EsewaSettingRoot />) },
					{ path: PATH.SETTINGS.API.KHALTI.ROOT, element: S(<KhaltiSettingRoot />) },
					{ path: PATH.SETTINGS.API.SMS_GATEWAY.ROOT, element: S(<SmsGatewayRoot />) },
					{ path: PATH.SETTINGS.SYSTEM.CONTROLS.ROOT, element: S(<ControlsRoot />) },
					{ path: PATH.SETTINGS.SYSTEM.OMR_SETTING.ROOT, element: S(<OmrSettingRoot />) },
				],
			},
			{ path: PATH.ACTIVITY_LOG.ROOT, element: S(<ActivityRoot />) },
			{ path: PATH.ACTIVITY_LOG.ARCHIVED.ROOT, element: S(<ArchivedLogs />) },
			{
				element: S(<MediaManagementRoot />),
				children: [
					{ path: PATH.MEDIA_MANAGEMENT.ROOT, element: S(<AllMediaRoot />) },
				]
			},
			{
				element: S(<Unauthorized permissions={["view_discussions", "add_discussions", "edit_discussions", "delete_discussions", "hide_discussions"]}><DiscussionManagementRoot /></Unauthorized>),
				children: [
					{ path: PATH.DISCUSSION.ROOT, element: S(<AllDiscussions />) },
					{ path: PATH.DISCUSSION.CREATE.ROOT, element: S(<DiscussionForm />) },
					{ path: PATH.DISCUSSION.DETAIL.ROOT(), element: S(<DiscussionDetail />) },
					{ path: PATH.DISCUSSION.EDIT.ROOT(), element: S(<DiscussionForm />) },
				],
			},
			{
				element: S(<ModerationManagementRoot />),
				children: [
					{ path: PATH.MODERATION.ROOT, element: S(<WordModeration />) },
				],
			},
			{
				element: S(<DeviceResetManagementRoot />),
				children: [
					{ path: PATH.DEVICE_RESET.ROOT, element: S(<DeviceResetDetailPage />) },
					{ path: PATH.DEVICE_RESET.DETAIL.ROOT(), element: S(<DeviceResetDetailPage />) },
				],
			},
			{
				element: S(<Unauthorized permissions={["add_tickets", "edit_tickets", "delete_tickets", "view_tickets"]}><TicketManagementRoot /></Unauthorized>),
				children: [
					{ path: PATH.TICKET.ALL_TICKETS.ROOT, element: S(<AllTickets />) },
					{
						path: PATH.TICKET.CHATS.ROOT,
						element: S(<TicketChats />),
						children: [
							{ path: PATH.TICKET.CHAT_DETAIL.ROOT(), element: S(<TicketChatPage />) },
						],
					},
					{ path: PATH.TICKET.TICKET_TYPES.ROOT, element: S(<TicketTypes />) },
				],
			},
		],
	},

	{
		path: "*",
		element: S(<NotFound />),
	},
];

const router = createBrowserRouter([
	{
		element: <Outlet />,
		errorElement: <RouteErrorBoundary />,
		children: routes,
	},
]);

export default function GlobalRoutes() {
	return <RouterProvider router={router} />;
}
