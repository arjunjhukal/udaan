import { Box, Checkbox, Divider, FormControlLabel, InputLabel, OutlinedInput, Typography, useTheme } from "@mui/material";
import type { Dayjs } from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import { useGetAllCourseQuery } from "../../../services/courseApi";
import { useCreateNotificationMutation, useGetNotificationByIdQuery, useUpdateNotificationByIdMutation } from "../../../services/notificationApi";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch } from "../../../store/hook";
import { useCourseFilter } from "../../../store/useCourseFilter";
import type { CourseProps } from "../../../types/course";
import { NotificationInitialState, NotificationValidationSchema } from "../../../types/notification";
import { calcHasMore } from "../../../utils/calculateHasMore";
import { parseDate, parseTime } from "../../../utils/parseDateTime";
import MakuraDatePicker from "../../atoms/MakuraDatePicker";
import MakuraTimePicker from "../../atoms/MakuraTimePicker";
import TextEditor from "../../atoms/TextEditor";
import FileDragDrop from "../../molecules/FileDragDrop";
import FooterAction from "../../molecules/FooterAction";
import InfiniteScrolling from "../../molecules/InfiniteScrolling";
import CategoryFilter from "../../organism/CategoryFilter";



export default function NotificationManagementForm() {
    const { id } = useParams();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 10,
        search: ""
    })
    const [courseList, setCourseList] = useState<CourseProps[]>([]);
    const {
        megaCategories,
        categories,
        subCategories,
        positions,
        selections,
        handleCategoryChange,
        getCategoryFilterParams
    } = useCourseFilter();

    const categoryFilter = getCategoryFilterParams();
    const { data: courses, isLoading } = useGetAllCourseQuery({ ...qp, categoryFilter: { ...categoryFilter } });
    const [createNotification, { isLoading: creatingNotification }] = useCreateNotificationMutation();
    const { data } = useGetNotificationByIdQuery({ id: Number(id) }, { skip: !id });
    const [updateNotification, { isLoading: updatingNotification }] = useUpdateNotificationByIdMutation();

    const coursePagination = courses?.data?.pagination;
    const hasMoreCourses = calcHasMore(coursePagination);

    const fetchMoreCourses = () => {
        if (hasMoreCourses) {
            setQp(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
        }
    };

    const handleCourseSearch = (searchTerm: string) => {
        setQp(prev => ({
            ...prev,
            search: searchTerm,
            pageIndex: 1
        }));
    };

    const formik = useFormik({
        initialValues: id && data ? data?.data : NotificationInitialState,
        validationSchema: NotificationValidationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {

            try {
                const formData = new FormData();

                formData.append("name", values.name);
                formData.append("description", values.description);
                if (values.external_link) formData.append("external_link", values.external_link);
                if (values.notification_type) formData.append("notification_type", values.notification_type);
                if (values.scheduled_date) formData.append("scheduled_date", values.scheduled_date);
                if (values.scheduled_time) formData.append("scheduled_time", values.scheduled_time);

                // Arrays — convert each element to string
                values.target_students.forEach((item) => formData.append("target_students[]", item));
                values.megacategory_ids?.forEach((id) => formData.append("megacategory_ids[]", id.toString()));
                values.category_ids?.forEach((id) => formData.append("category_ids[]", id.toString()));
                values.subcategory_ids?.forEach((id) => formData.append("subcategory_ids[]", id.toString()));
                values.level_ids?.forEach((id) => formData.append("level_ids[]", id.toString()));
                values.course_ids?.forEach((id) => formData.append("course_ids[]", id.toString()));
                values.completion_status?.forEach((item) => formData.append("completion_status[]", item));
                values.delivery_methods?.forEach((item) => formData.append("delivery_methods[]", item));

                if (values.image) {
                    formData.append("image", values.image);
                }
                if (values.image_url) {
                    formData.append("image_url", values.image_url);
                }
                const response = id && data ? await updateNotification({
                    body: formData,
                    id: Number(id)
                }).unwrap() : await createNotification({ body: formData }).unwrap();

                dispatch(
                    showToast({
                        message: response.message || "Successfully Created Notification",
                        severity: "success"
                    })
                )
                formik.resetForm();
                navigate(PATH.NOTIFICATION_MANAGEMENT.ROOT)
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to Create Notification",
                        severity: "error"
                    })
                )
            }
        }
    })

    useEffect(() => {
        if (!selections) return;

        const megaIds = selections.mega_category || [];

        const categoryIds = Object.values(selections.category || {}).flat();
        const subCategoryIds = Object.values(selections.sub_category || {}).flat();

        const positionIds = selections.position_ids || [];

        formik.setFieldValue("megacategory_ids", megaIds);
        formik.setFieldValue("category_ids", categoryIds);
        formik.setFieldValue("subcategory_ids", subCategoryIds);
        formik.setFieldValue("level_ids", positionIds);

    }, [selections]);


    const [onlyNotPurchased, setOnlyNotPurchased] = useState(false);

    useEffect(() => {

        let isPurchased = formik.values.target_students.length === 1 &&
            formik.values.target_students[0] === "not_purchased";
        setOnlyNotPurchased(isPurchased)
    }, [formik.values.target_students])

    useEffect(() => {
        if (!courses?.data?.data) return;

        setCourseList(prev => {
            if (qp.pageIndex === 1) {
                return courses.data.data;
            }

            return [...prev, ...courses.data.data];
        });
    }, [courses, qp.pageIndex]);

    return (
        <form className="notification__form__wrapper" onSubmit={formik.handleSubmit}>
            {/* OVERVIEW START HERE */}
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
                <div className="flex flex-col col-span-1 gap-4">
                    <div className="col-span-1">
                        <InputLabel className="required">Name of the notification</InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="name"
                            placeholder="Enter the name of the notification"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <Typography variant="caption" color="error" className="mt-1">
                                {formik.errors.name}
                            </Typography>
                        )}
                    </div>
                    <div className="col-span-1">
                        <InputLabel >External Link</InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="external_link"
                            placeholder="https://www.example.com"
                            value={formik.values.external_link}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.external_link && Boolean(formik.errors.external_link)}
                        />
                        {formik.touched.external_link && formik.errors.external_link && (
                            <Typography variant="caption" color="error" className="mt-1">
                                {formik.errors.external_link}
                            </Typography>
                        )}
                    </div>
                </div>
                <div className="col-span-1">
                    <FileDragDrop
                        label="Notice Attachment"
                        onFileChange={(file) => formik.setFieldValue("image", file)}
                        initialFile={formik.values.image}
                        initialPreview={formik.values.image_url}
                        error={formik.touched.image && Boolean(formik.errors.image)}
                        helperText={formik.touched.image && formik.errors.image ? String(formik.errors.image) : ""}
                    />
                </div>
            </div>
            {/* OVERVIEW ENDS HERE */}
            {/* DESCRIPTION START HERE */}
            <div className="col-span-1 mt-6">
                <TextEditor
                    label="Notice Description"
                    required={true}
                    value={formik.values.description}
                    onChange={(value) => formik.setFieldValue("description", value)}
                    onBlur={() => formik.setFieldTouched("description")}
                />
                {formik.touched.description && formik.errors.description && (
                    <Typography variant="caption" color="error" className="mt-1">
                        {formik.errors.description}
                    </Typography>
                )}
            </div>
            {/* DESCRIPTION ENDS HERE */}

            {/* TARGET STUDENT START HERE */}
            <Typography variant="h5" className="mt-8!">Target Student</Typography>
            <Divider className="mt-2! mb-8!" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="col-span-1">
                    <FormControlLabel
                        className="p-4! rounded-lg w-full"
                        sx={{
                            border: `1px solid ${theme.palette.separator.dark}`
                        }}
                        control={
                            <Checkbox
                                checked={formik.values.target_students.includes("purchased")}
                                onChange={(e) => {
                                    const value = "purchased";
                                    const prev = formik.values.target_students || [];

                                    formik.setFieldValue(
                                        "target_students",
                                        e.target.checked
                                            ? [...prev, value]
                                            : prev.filter((v) => v !== value)
                                    );
                                }}
                            />

                        }
                        label={
                            <>
                                <Typography variant="subtitle2" color="text.dark">Purchased</Typography>
                                <Typography variant="caption">Select the student who have purchased course.</Typography>
                            </>
                        }
                    />
                </div>
                <div className="col-span-1">
                    <FormControlLabel
                        className="p-4! rounded-lg w-full"
                        sx={{
                            border: `1px solid ${theme.palette.separator.dark}`
                        }}
                        control={
                            <Checkbox
                                checked={formik.values.target_students.includes("not_purchased")}
                                onChange={(e) => {
                                    const value = "not_purchased";
                                    const prev = formik.values.target_students || [];

                                    formik.setFieldValue(
                                        "target_students",
                                        e.target.checked
                                            ? [...prev, value]
                                            : prev.filter((v) => v !== value)
                                    );
                                }}
                            />

                        }
                        label={
                            <>
                                <Typography variant="subtitle2" color="text.dark">Not Purchased</Typography>
                                <Typography variant="caption">Select all student who have not purchased course.</Typography>
                            </>
                        }
                    />
                </div>
                <div className="col-span-1">
                    <FormControlLabel
                        className="p-4! rounded-lg w-full"
                        sx={{
                            border: `1px solid ${theme.palette.separator.dark}`
                        }}
                        control={
                            <Checkbox
                                checked={formik.values.target_students.includes("free_trial")}
                                onChange={(e) => {
                                    const value = "free_trial";
                                    const prev = formik.values.target_students || [];

                                    formik.setFieldValue(
                                        "target_students",
                                        e.target.checked
                                            ? [...prev, value]
                                            : prev.filter((v) => v !== value)
                                    );
                                }}
                            />
                        }
                        label={
                            <>
                                <Typography variant="subtitle2" color="text.dark">Free Trial</Typography>
                                <Typography variant="caption">Select the student who is enrolling in free trial courses</Typography>
                            </>
                        }
                    />
                </div>
            </div>
            {formik.touched.target_students && formik.errors.target_students && (
                <Typography variant="caption" color="error" className="mt-2">
                    {formik.errors.target_students}
                </Typography>
            )}
            {/* TARGET STUDENT ENDS HERE */}

            {/* ADVANCE FILTER START HERE */}
            <Typography variant="h5" className="mt-8!">Advanced Filters</Typography>
            <Divider className="mt-2! mb-8!" />

            <Box className="rounded-md p-4" sx={{
                border: `1px solid ${theme.palette.separator.dark}`
            }}>
                <Typography variant="subtitle2" >Courses</Typography>
                <Divider className="mt-2! mb-3!" />
                <div className="input__field mb-4">
                    <FormControlLabel
                        className="p-4! rounded-lg w-full"
                        sx={{
                            border: `1px solid ${theme.palette.separator.dark}`
                        }}
                        control={
                            <Checkbox
                                checked={formik.values.notification_type === "all_course"}
                                onChange={() => {
                                    formik.setFieldValue("notification_type", "all_course");
                                    formik.setFieldValue("course_ids", []);
                                }}
                            />
                        }
                        label={
                            <>
                                <Typography variant="subtitle2" color="text.dark">All Course</Typography>
                            </>
                        }
                    />
                </div>
                <Box className="rounded-md p-4" sx={{
                    border: `1px solid ${theme.palette.separator.dark}`
                }}>

                    <div className="input__field">
                        <FormControlLabel
                            className="  w-full"

                            control={
                                <Checkbox
                                    checked={formik.values.notification_type === "specific_course"}
                                    onChange={() => {
                                        formik.setFieldValue("notification_type", "specific_course");
                                    }}
                                />
                            }
                            label={
                                <>
                                    <Typography variant="subtitle2" color="text.dark">By Specific Course</Typography>
                                </>
                            }
                        />
                    </div>
                    {formik.values.notification_type === "specific_course" && <div className="flex flex-col gap-4 lg:grid grid-cols-12 lg:gap-6 mt-4">
                        <div className="col-span-7">
                            <CategoryFilter
                                megaCategories={megaCategories || []}
                                categories={onlyNotPurchased ? undefined : categories || []}
                                subCategories={onlyNotPurchased ? undefined : subCategories || []}
                                positions={onlyNotPurchased ? undefined : positions || []}
                                selections={selections}
                                onChange={handleCategoryChange}
                                isRequired={false}
                            />
                        </div>

                        <div className="col-span-5">
                            <InputLabel>Select Course <Typography variant="caption" color="text.middle">(Select the course you want to add test)</Typography></InputLabel>
                            <InfiniteScrolling
                                key="notification-course-list"
                                scrollableId="notification-course-scrollable"
                                data={courseList || []}
                                hasMore={hasMoreCourses}
                                selectedItems={formik.values.course_ids || []}
                                onSelectionChange={(selectedIds) => {
                                    formik.setFieldValue("course_ids", selectedIds);
                                    formik.setFieldTouched("course_ids", true);
                                }}
                                fetchMore={fetchMoreCourses}
                                onSearch={handleCourseSearch}
                                loading={isLoading}
                                maxSelection={10}
                                itemLabelKey="name"
                                itemIdKey="id"
                                placeholder="Search courses..."
                            />
                        </div>
                    </div>}
                </Box>
                <Typography variant="subtitle2" className="mt-8!">Course Completion Status</Typography>
                <Divider className="mt-2! mb-3!" />
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="col-span-1">
                        <FormControlLabel
                            className="p-4! rounded-lg w-full"
                            sx={{
                                border: `1px solid ${theme.palette.separator.dark}`
                            }}
                            control={
                                <Checkbox
                                    checked={formik.values.completion_status?.includes("completed")}
                                    onChange={(e) => {
                                        const value = "completed";
                                        const prev = formik.values.completion_status || [];

                                        formik.setFieldValue(
                                            "completion_status",
                                            e.target.checked
                                                ? [...prev, value]
                                                : prev.filter((v) => v !== value)
                                        );
                                    }}
                                />
                            }
                            label={
                                <>
                                    <Typography variant="subtitle2" color="text.dark">Completed Course Only</Typography>
                                    <Typography variant="caption">Students who finished the course</Typography>
                                </>
                            }
                        />
                    </div>
                    <div className="col-span-1">
                        <FormControlLabel
                            className="p-4! rounded-lg w-full"
                            sx={{
                                border: `1px solid ${theme.palette.separator.dark}`
                            }}
                            control={
                                <Checkbox
                                    checked={formik.values.completion_status?.includes("not_complete")}
                                    onChange={(e) => {
                                        const value = "not_complete";
                                        const prev = formik.values.completion_status || [];

                                        formik.setFieldValue(
                                            "completion_status",
                                            e.target.checked
                                                ? [...prev, value]
                                                : prev.filter((v) => v !== value)
                                        );
                                    }}
                                />
                            }
                            label={
                                <>
                                    <Typography variant="subtitle2" color="text.dark">Not Completed / In Progress</Typography>
                                    <Typography variant="caption">Students still taking the course</Typography>
                                </>
                            }
                        />
                    </div>
                </div>
            </Box>
            {/* ADVANCE FILTER ENDS HERE */}

            {/* DELIVERY METHOD START HERE */}

            <Typography variant="h5" className="mt-8!">Delivery Method</Typography>
            <Divider className="mt-2! mb-8!" />
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                <div className="col-span-1">
                    <FormControlLabel
                        className="p-4! rounded-lg w-full"
                        sx={{
                            border: `1px solid ${theme.palette.separator.dark}`
                        }}
                        control={
                            <Checkbox
                                checked={formik.values.delivery_methods?.includes("push_notification")}
                                onChange={(e) => {
                                    const value = "push_notification";
                                    const prev = formik.values.delivery_methods || [];

                                    formik.setFieldValue(
                                        "delivery_methods",
                                        e.target.checked
                                            ? [...prev, value]
                                            : prev.filter((v) => v !== value)
                                    );
                                }}
                            />
                        }
                        label={
                            <>
                                <Typography variant="subtitle2" color="text.dark">Push Notification</Typography>
                                <Typography variant="caption">Send mobile/web push</Typography>
                            </>
                        }
                    />
                </div>
                <div className="col-span-1">
                    <FormControlLabel
                        className="p-4! rounded-lg w-full"
                        sx={{
                            border: `1px solid ${theme.palette.separator.dark}`
                        }}
                        control={
                            <Checkbox
                                checked={formik.values.delivery_methods?.includes("email_notification")}
                                onChange={(e) => {
                                    const value = "email_notification";
                                    const prev = formik.values.delivery_methods || [];

                                    formik.setFieldValue(
                                        "delivery_methods",
                                        e.target.checked
                                            ? [...prev, value]
                                            : prev.filter((v) => v !== value)
                                    );
                                }}
                            />
                        }
                        label={
                            <>
                                <Typography variant="subtitle2" color="text.dark">Email Notification</Typography>
                                <Typography variant="caption">Send Via Email</Typography>
                            </>
                        }
                    />
                </div>
                <div className="col-span-1">
                    <FormControlLabel
                        className="p-4! rounded-lg w-full"
                        sx={{
                            border: `1px solid ${theme.palette.separator.dark}`
                        }}
                        control={
                            <Checkbox
                                checked={formik.values.delivery_methods?.includes("sms_notification")}
                                onChange={(e) => {
                                    const value = "sms_notification";
                                    const prev = formik.values.delivery_methods || [];

                                    formik.setFieldValue(
                                        "delivery_methods",
                                        e.target.checked
                                            ? [...prev, value]
                                            : prev.filter((v) => v !== value)
                                    );
                                }}
                            />
                        }
                        label={
                            <>
                                <Typography variant="subtitle2" color="text.dark">WhatsApp / SMS</Typography>
                                <Typography variant="caption">Send via messaging</Typography>
                            </>
                        }
                    />
                </div>
                <div className="col-span-1">
                    <FormControlLabel
                        className="p-4! rounded-lg w-full"
                        sx={{
                            border: `1px solid ${theme.palette.separator.dark}`
                        }}
                        control={
                            <Checkbox
                                checked={formik.values.delivery_methods?.includes("notice_board")}
                                onChange={(e) => {
                                    const value = "notice_board";
                                    const prev = formik.values.delivery_methods || [];

                                    formik.setFieldValue(
                                        "delivery_methods",
                                        e.target.checked
                                            ? [...prev, value]
                                            : prev.filter((v) => v !== value)
                                    );
                                }}
                            />
                        }
                        label={
                            <>
                                <Typography variant="subtitle2" color="text.dark">Notice Boards</Typography>
                                <Typography variant="caption">Show in app notice panel</Typography>
                            </>
                        }
                    />
                </div>
            </div>
            {/* DELIVERY METHOD ENDS HERE */}

            {/* SCHEDULE NOTIFICATION START HERE */}

            <Typography variant="h5" className="mt-8!">Schedule Notification</Typography>
            <Divider className="mt-2! mb-8!" />
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
                <div className="col-span-1">
                    <InputLabel >Date</InputLabel>
                    <MakuraDatePicker
                        value={parseDate(formik.values.scheduled_date)} onChange={(date: Dayjs | null) => formik.setFieldValue('scheduled_date', date ? date.format('YYYY-MM-DD') : '')} placeholder="Start Date"
                    />
                </div>
                <div className="col-span-1">
                    <InputLabel>Time</InputLabel>
                    <MakuraTimePicker

                        value={parseTime(formik.values.scheduled_time)}
                        onChange={(time: Dayjs | null) =>
                            formik.setFieldValue(
                                "scheduled_time",
                                time ? time.format("HH:mm") : ""
                            )
                        }
                        placeholder="Select Time"
                    />

                </div>
            </div>
            {/* SCHEDULE NOTIFICATION START HERE */}
            <FooterAction
                handleConfirmationChange={() => { }}
                isEditMode={!!id}
                isLoading={creatingNotification || updatingNotification}
                buttonLabel="Notification"
            />
        </form>
    )
}
