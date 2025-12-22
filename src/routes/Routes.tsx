import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages & Layouts
import App from "../App";
import CategoryManagementRoot from "../components/pages/CategoryManagement";
import AllCategories from "../components/pages/CategoryManagement/allCategory";

import CourseManagementRoot from "../components/pages/CourseManagement/Course";
import AllCourse from "../components/pages/CourseManagement/Course/allCourse";
import CreateCourseRoot from "../components/pages/CourseManagement/Course/createCourse";
import LiveClassRoot from "../components/pages/CourseManagement/LiveClass";
import AllLiveClass from "../components/pages/CourseManagement/LiveClass/allLiveClass";
import CreateLiveClassRoot from "../components/pages/CourseManagement/LiveClass/createLiveClass";
import QuizManagementRoot from "../components/pages/CourseManagement/quiz";
import AllQuizes from "../components/pages/CourseManagement/quiz/allQuiz";
import NotificationRoot from "../components/pages/NotificationManagement";
import AllNotificationsRoot from "../components/pages/NotificationManagement/allNotification";
import CreateNotificationRoot from "../components/pages/NotificationManagement/createNotification";
import RoleManagementRoot from "../components/pages/RoleManagement";
import AllRoles from "../components/pages/RoleManagement/allRoles";
import CreateRoleRoot from "../components/pages/RoleManagement/createRole";
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
				element: <CourseManagementRoot />,
				children: [
					{ path: PATH.COURSE_MANAGEMENT.COURSES.ROOT, element: <AllCourse /> },
					{ path: PATH.COURSE_MANAGEMENT.COURSES.CREATE_COURSE.ROOT, element: <CreateCourseRoot /> },
					{ path: PATH.COURSE_MANAGEMENT.COURSES.EDIT_COURSE.ROOT(), element: <CreateCourseRoot /> },
				],
			},
			{
				element: <LiveClassRoot />,
				children: [
					{ path: PATH.COURSE_MANAGEMENT.LIVE_CLASSES.ROOT, element: <AllLiveClass /> },
					{ path: PATH.COURSE_MANAGEMENT.LIVE_CLASSES.CREATE_LIVE_CLASS.ROOT, element: <CreateLiveClassRoot /> },
					{ path: PATH.COURSE_MANAGEMENT.LIVE_CLASSES.EDIT_LIVE_CLASS.ROOT(), element: <CreateLiveClassRoot /> },
				],
			},
			{
				element: <QuizManagementRoot />,
				children: [
					{ path: PATH.COURSE_MANAGEMENT.QUIZ.ROOT, element: <AllQuizes /> },
				],
			},
			{
				element: <TestAndQuestionManagementRoot />,
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
				element: <RoleManagementRoot />,
				children: [
					{ path: PATH.ROLES.ROOT, element: <AllRoles /> },
					{ path: PATH.ROLES.CREATE_ROLE.ROOT, element: <CreateRoleRoot /> },
					{ path: PATH.ROLES.EDIT_ROLE.ROOT(), element: <CreateRoleRoot /> },
				],
			},
			{
				element: <UserManagementRoot />,
				children: [
					{ index: true, path: PATH.USER_MANAGEMENT.ROOT, element: <AllUsers /> },
					{ path: PATH.USER_MANAGEMENT.CREATE_USER.ROOT, element: <CreateUser /> },
					{ path: PATH.USER_MANAGEMENT.EDIT_USER.ROOT(), element: <CreateUser /> },
				],
			},
			{
				element: <CategoryManagementRoot />,
				children: [
					{ path: PATH.CATEGORY_LEVEL_MANAGEMENT.CATEGORY.ROOT, element: <AllCategories /> },
					{ path: PATH.CATEGORY_LEVEL_MANAGEMENT.LEVEL_POSITION.ROOT, element: <AllPositions /> },
				],
			},
			{
				path: PATH.SUBSCRIPTION_PLAN_MANAGEMENT.ROOT,
				element: <SubscriptionManagementRoot />,
			},
			{

				element: <TransactionManagementRoot />,
				children: [
					{ path: PATH.TRANSACTION_MANAGEMENT.ROOT, element: <AllTransactionRoot /> },
				],
			},
			{

				element: <NotificationRoot />,
				children: [
					{ path: PATH.NOTIFICATION_MANAGEMENT.ROOT, element: <AllNotificationsRoot /> },
					{ path: PATH.NOTIFICATION_MANAGEMENT.CREATE_NOTIFICATION.ROOT, element: <CreateNotificationRoot /> },
					{ path: PATH.NOTIFICATION_MANAGEMENT.EDIT_NOTIFICATION.ROOT(), element: <CreateNotificationRoot /> },
				],
			},
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
