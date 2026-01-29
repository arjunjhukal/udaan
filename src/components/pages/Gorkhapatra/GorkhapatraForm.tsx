import { Checkbox, FormControlLabel, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../routes/PATH";
import { useCreateGorkhapatraMutation, useEditGorkhapatraMutation, useGetGorkhapatraByIdQuery } from "../../../services/gorkhapatraApi";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch } from "../../../store/hook";
import { gorkhapatraInitialState } from "../../../types/gorkhapatra";
import TextEditor from "../../atoms/TextEditor";
import FileDragDrop from "../../molecules/FileDragDrop";
import FooterAction from "../../molecules/FooterAction";
import PageHeader from "../../organism/PageHeader";
const validationSchema = Yup.object({
    title: Yup.string().required("Title is requierd"),
})
export default function GorkhapatraForm() {
    const { id } = useParams();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    const { data } = useGetGorkhapatraByIdQuery({ id: Number(id) }, { skip: !id })
    const [createGorkhapatra, { isLoading }] = useCreateGorkhapatraMutation();
    const [updateGorkhapatra, { isLoading: updating }] = useEditGorkhapatraMutation();

    const GorkhapatraTypes = [
        { label: "Descriptive", value: "descriptive" },
        { label: "MCQs", value: "mcqs" }
    ]

    const formik = useFormik({
        initialValues: data ? data.data : gorkhapatraInitialState,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();

                formData.append("title", values.title)
                formData.append("description", values.description)
                formData.append("type", values.type)
                formData.append("content", values.content)
                formData.append("status", values.status)

                if (values.thumbnail) {
                    formData.append("thumbnail", values.thumbnail)
                }

                if (values.thumbnail_url) {
                    formData.append("thumbnail_url", values.thumbnail_url);
                }

                const response = id ? await updateGorkhapatra({ body: formData, id: Number(id) }).unwrap() : await createGorkhapatra(formData).unwrap();

                dispatch(
                    showToast({
                        message: response?.message || "Created gorkhapatra successfully.",
                        severity: "success"
                    })
                )
                navigate(PATH.GORKHAPATRA.ROOT);
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to create gorkhapatra.",
                        severity: "error"
                    })
                )
            }
        }
    })

    const handleSaveToDraft = () => {
        formik.setFieldValue("status", "draft");
        formik.handleSubmit();
    }

    const handleFileChange = (file: File | null) => {
        formik.setFieldValue("thumbnail", file);
        if (!file) {
            formik.setFieldValue("thumbnail_url", "");
        }
    };
    return (
        <div className="gorkhapatra__creations__root h-full overflow-hidden  flex flex-col">
            <PageHeader
                breadcrumb={[
                    {
                        title: t("menus.gorkhapatra.root"),
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M16 6H19C19.2652 6 19.5196 6.10536 19.7071 6.29289C19.8946 6.48043 20 6.73478 20 7V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20C17.4696 20 16.9609 19.7893 16.5858 19.4142C16.2107 19.0391 16 18.5304 16 18V5C16 4.73478 15.8946 4.48043 15.7071 4.29289C15.5196 4.10536 15.2652 4 15 4H5C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V17C4 17.7956 4.31607 18.5587 4.87868 19.1213C5.44129 19.6839 6.20435 20 7 20H18M8 8H12H8ZM8 12H12H8ZM8 16H12H8Z" fill="#1D82F5" />
                            <path d="M16 6H19C19.2652 6 19.5196 6.10536 19.7071 6.29289C19.8946 6.48043 20 6.73478 20 7V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20M18 20C17.4696 20 16.9609 19.7893 16.5858 19.4142C16.2107 19.0391 16 18.5304 16 18V5C16 4.73478 15.8946 4.48043 15.7071 4.29289C15.5196 4.10536 15.2652 4 15 4H5C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V17C4 17.7956 4.31607 18.5587 4.87868 19.1213C5.44129 19.6839 6.20435 20 7 20H18ZM8 8H12M8 12H12M8 16H12" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>,
                        url: PATH.GORKHAPATRA.ROOT,
                    },
                    {
                        title: `${t("actions.create")} ${t("messages.gorkhapatra")}`
                    }
                ]}
            />
            <form onSubmit={formik.handleSubmit} className="h-full overflow-hidden flex flex-col">
                <div className="h-full overflow-auto">
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <div className="flex flex-col gap-4 h-full">
                                <div className="input__field">
                                    <FileDragDrop
                                        onFileChange={handleFileChange}
                                        initialPreview={formik.values.thumbnail_url}
                                        label="Thumbnail"
                                    />
                                </div>
                                <div className="input__field">
                                    <InputLabel className="required">Title of Gorkhapatra</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        name="title"
                                        placeholder="Enter the title for the gorkhapatra"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.title && Boolean(formik.errors.title)}
                                    />
                                    {formik.touched.title && formik.errors.title && (
                                        <FormHelperText error={true} sx={{ mt: 0.5 }}>
                                            {formik.errors.title}
                                        </FormHelperText>
                                    )}
                                </div>
                                <div className="input__field ">
                                    <InputLabel className="required">Gorkhapatra Type</InputLabel>
                                    <div className="flex gap-2">
                                        {GorkhapatraTypes.map((item) => (
                                            <FormControlLabel
                                                className="items-center!"
                                                label={item.label}
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={item.value === formik.values.type}
                                                        onChange={() => formik.setFieldValue("type", item.value)}
                                                    />
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                                <TextEditor
                                    label="Description"
                                    value={formik.values.description}
                                    onChange={(newValue) => formik.setFieldValue("description", newValue)}
                                    onBlur={(newValue) => formik.setFieldValue("description", newValue)}
                                />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <TextEditor
                                label="Content"
                                value={formik.values.content}
                                onChange={(newValue) => formik.setFieldValue("content", newValue)}
                                onBlur={(newValue) => formik.setFieldValue("content", newValue)}
                            />
                        </div>
                    </div>
                </div>
                <FooterAction
                    handleConfirmationChange={() => navigate(PATH.GORKHAPATRA.ROOT)}
                    replaceLabel={
                        id
                            ? (formik.values.status === "published" && updating ? "Updating Gorkhapatra ..." : "Update Gorkhapatra")
                            : (formik.values.status === "published" && isLoading ? "Creating Gorkhapatra ..." : "Create Gorkhapatra")
                    }
                    onDraft={handleSaveToDraft}
                />

            </form>
        </div>
    )
}
