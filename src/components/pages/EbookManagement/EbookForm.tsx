import { Autocomplete, Checkbox, Divider, FormControlLabel, FormHelperText, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../routes/PATH";
import { useGetAllCategoryRelatedToMegaCategoryQuery, useGetAllMegaCategoryQuery, useGetAllSubCategoryRelatedToCategoryQuery } from "../../../services/categoryApi";
import { useCreateEbookMutation, useEditEbookMutation, useGetEbookByIdQuery } from "../../../services/ebookApi";
import { useGetAllPositionQuery } from "../../../services/positionApi";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch } from "../../../store/hook";
import type { DiscountTypeProps } from "../../../types/course";
import { ebookInitialState, type EbookProps } from "../../../types/ebook";
import { getApiErrorMessage } from "../../../utils/apiError";
import { createEbookFormData } from "../../../utils/ebookFormData";
import MakuraDatePicker from "../../atoms/MakuraDatePicker";
import TextEditor from "../../atoms/TextEditor";
import FileDragDrop from "../../molecules/FileDragDrop";
import FooterAction from "../../molecules/FooterAction";
import PdfDragDrop from "../../molecules/PdfDragDrop";
import CategoryFilter from "../../organism/CategoryFilter";
import PageHeader from "../../organism/PageHeader";
import EbookIcon from "./EbookIcon";

const discountTypeOptions: { label: string; value: DiscountTypeProps }[] = [
    { label: "Percentage", value: "percentage" },
    { label: "Amount", value: "amount" },
];

const validationSchema = (isEdit: boolean) => Yup.object().shape({
    title: Yup.string()
        .required("eBook title is required")
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must not exceed 200 characters"),
    author: Yup.string().max(150, "Author must not exceed 150 characters"),
    description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
    is_downloadable: Yup.boolean().required(),
    price: Yup.string()
        .required("Price is required")
        .test("non-negative-price", "Price cannot be negative", (value) => Number(value) >= 0),
    discount: Yup.number()
        .min(0, "Discount must be at least 0")
        .when("discount_type", {
            is: "percentage",
            then: (schema) => schema.max(100, "Percentage discount cannot exceed 100"),
            otherwise: (schema) => schema,
        })
        .test("discount-within-price", "Discount cannot exceed the price", function (value) {
            const { discount_type, price } = this.parent;
            if (discount_type !== "amount") return true;
            return Number(value || 0) <= Number(price || 0);
        }),
    thumbnail: isEdit
        ? Yup.mixed().notRequired()
        : Yup.mixed()
            .required("Thumbnail is required")
            .test("fileSize", "Thumbnail must be less than 2MB", (value) => !!value && (value as File).size <= 2 * 1024 * 1024),
    file: isEdit
        ? Yup.mixed().notRequired()
        : Yup.mixed()
            .required("eBook PDF is required")
            .test("fileType", "Only PDF files are allowed", (value) => !!value && (value as File).type === "application/pdf"),
    selections: Yup.object().shape({
        mega_category: Yup.array().of(Yup.number()).min(1, "Please select at least one mega category"),
    }),
});

export default function EbookForm() {
    const { id } = useParams();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { data } = useGetEbookByIdQuery({ id: Number(id) }, { skip: !id });
    const [createEbook, { isLoading }] = useCreateEbookMutation();
    const [updateEbook, { isLoading: updating }] = useEditEbookMutation();

    const { data: megaCategories, isLoading: loadingMegaCategory } = useGetAllMegaCategoryQuery();
    const { data: positions } = useGetAllPositionQuery({ pageIndex: 1, pageSize: 20, search: "" });

    const initialValues = useMemo<EbookProps>(() => {
        if (!data?.data) return ebookInitialState;
        const ebook = data.data;
        return {
            ...ebookInitialState,
            ...ebook,
            price: ebook.price?.toString() ?? "",
            author: ebook.author ?? "",
            published_date: ebook.published_date ? dayjs(ebook.published_date).format("YYYY-MM-DD") : "",
            discount: Number(ebook.discount ?? 0),
            is_downloadable: Boolean(ebook.is_downloadable),
            thumbnail: null,
            file: null,
            selections: {
                mega_category: ebook.selections?.mega_category ?? [],
                category: ebook.selections?.category ?? {},
                sub_category: ebook.selections?.sub_category ?? {},
                position_ids: ebook.selections?.position_ids ?? [],
            },
        };
    }, [data]);

    const formik = useFormik<EbookProps>({
        initialValues,
        validationSchema: validationSchema(Boolean(id)),
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const formData = createEbookFormData(values);
                const response = id
                    ? await updateEbook({ body: formData, id: Number(id) }).unwrap()
                    : await createEbook(formData).unwrap();

                dispatch(
                    showToast({
                        message: response?.message || (id ? "eBook updated successfully." : "eBook created successfully."),
                        severity: "success",
                    })
                );
                navigate(PATH.EBOOK.ROOT);
            } catch (e) {
                dispatch(
                    showToast({
                        message: getApiErrorMessage(e, id ? "Unable to update eBook." : "Unable to create eBook."),
                        severity: "error",
                    })
                );
            }
        },
    });

    const { data: categories } = useGetAllCategoryRelatedToMegaCategoryQuery(
        { currentCategory: (formik.values.selections?.mega_category || []).join(",") },
        { skip: !formik.values.selections?.mega_category?.length }
    );
    const { data: subCategories } = useGetAllSubCategoryRelatedToCategoryQuery(
        {
            currentCategory: formik.values.selections?.category
                ? Object.values(formik.values.selections.category).flat().join(",")
                : "",
        },
        {
            skip: !formik.values.selections?.category || !Object.values(formik.values.selections.category).length,
        }
    );

    const handleCategoryChange = (type: "mega" | "category" | "sub" | "position", ids: number[], parentId?: number) => {
        switch (type) {
            case "mega":
                formik.setFieldValue("selections.mega_category", ids);
                formik.setFieldValue("selections.category", {});
                formik.setFieldValue("selections.sub_category", {});
                break;
            case "category":
                formik.setFieldValue(`selections.category.${parentId}`, ids);
                formik.setFieldValue("selections.sub_category", {});
                break;
            case "sub":
                formik.setFieldValue(`selections.sub_category.${parentId}`, ids);
                break;
            case "position":
                formik.setFieldValue("selections.position_ids", ids);
                break;
        }
    };

    const handleThumbnailChange = (file: File | null) => {
        formik.setFieldValue("thumbnail", file);
        if (!file) formik.setFieldValue("thumbnail_url", "");
    };

    const handlePdfChange = (file: File | null) => {
        formik.setFieldValue("file", file);
        if (!file) {
            formik.setFieldValue("file_url", "");
            formik.setFieldValue("file_name", "");
            formik.setFieldValue("file_size", undefined);
        }
    };

    const submitWithStatus = async (status: EbookProps["status"]) => {
        await formik.setFieldValue("status", status);
        formik.handleSubmit();
    };

    const submitting = isLoading || updating;

    return (
        <div className="ebook__form__root h-full overflow-hidden flex flex-col">
            <PageHeader
                breadcrumb={[
                    { title: t("menus.ebook.root"), icon: <EbookIcon />, url: PATH.EBOOK.ROOT },
                    { title: `${id ? t("actions.edit") : t("actions.create")} ${t("messages.ebook")}` },
                ]}
            />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submitWithStatus("published");
                }}
                className="h-full overflow-hidden flex flex-col"
            >
                <div className="h-full overflow-auto">
                    <div className="flex flex-col 2xl:grid 2xl:grid-cols-2 gap-4 lg:gap-6 mb-6">
                        <FileDragDrop
                            required
                            label="Thumbnail"
                            maxSize={2}
                            onFileChange={handleThumbnailChange}
                            initialFile={formik.values.thumbnail}
                            initialPreview={formik.values.thumbnail_url}
                            error={formik.touched.thumbnail && Boolean(formik.errors.thumbnail)}
                            helperText={formik.touched.thumbnail && formik.errors.thumbnail ? String(formik.errors.thumbnail) : ""}
                        />
                        <PdfDragDrop
                            required
                            label="eBook PDF"
                            maxSize={50}
                            onFileChange={handlePdfChange}
                            initialFile={formik.values.file}
                            initialName={formik.values.file_name}
                            initialUrl={formik.values.file_url}
                            initialSize={formik.values.file_size}
                            error={formik.touched.file && Boolean(formik.errors.file)}
                            helperText={formik.touched.file && formik.errors.file ? String(formik.errors.file) : ""}
                        />
                    </div>

                    <div className="input__field mb-6">
                        <InputLabel className="required">Title</InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="title"
                            placeholder="Enter the eBook title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                        />
                        {formik.touched.title && formik.errors.title && (
                            <FormHelperText error sx={{ mt: 0.5 }}>{formik.errors.title}</FormHelperText>
                        )}
                    </div>

                    <div className="flex flex-col 2xl:grid 2xl:grid-cols-2 gap-4 lg:gap-6 mb-6">
                        <div className="input__field">
                            <InputLabel>Author</InputLabel>
                            <OutlinedInput
                                fullWidth
                                name="author"
                                placeholder="Enter the author name"
                                value={formik.values.author}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.author && Boolean(formik.errors.author)}
                            />
                            {formik.touched.author && formik.errors.author && (
                                <FormHelperText error sx={{ mt: 0.5 }}>{formik.errors.author}</FormHelperText>
                            )}
                        </div>
                        <div className="input__field">
                            <InputLabel>Published Date</InputLabel>
                            <MakuraDatePicker
                                value={formik.values.published_date ? dayjs(formik.values.published_date) : null}
                                onChange={(newValue) =>
                                    formik.setFieldValue("published_date", newValue ? newValue.format("YYYY-MM-DD") : "")
                                }
                                maxDate={dayjs()}
                                placeholder="Select published date"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col 2xl:grid 2xl:grid-cols-2 gap-4 lg:gap-6">
                        <div className="col-span-1">
                            <div className="input__field">
                                <TextEditor
                                    required
                                    label="Description"
                                    value={formik.values.description}
                                    onChange={(value: string) => formik.setFieldValue("description", value)}
                                    onBlur={() => formik.setFieldTouched("description")}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <FormHelperText error sx={{ mt: 0.5 }}>{formik.errors.description}</FormHelperText>
                                )}
                            </div>
                        </div>
                        <div className="col-span-1">
                            <CategoryFilter
                                megaCategories={megaCategories?.data || []}
                                categories={categories?.data || []}
                                subCategories={subCategories?.data || []}
                                positions={positions?.data?.data || []}
                                selections={formik.values.selections}
                                onChange={handleCategoryChange}
                                loadingMegaCategory={loadingMegaCategory}
                            />
                            {formik.touched.selections?.mega_category && formik.errors.selections?.mega_category && (
                                <FormHelperText error sx={{ mt: 0.5 }}>
                                    {String(formik.errors.selections.mega_category)}
                                </FormHelperText>
                            )}
                        </div>
                    </div>

                    <Divider sx={{ marginTop: "36px", marginBottom: "36px" }} />

                    <Typography variant="h5" className="pb-2">Pricing & Access</Typography>
                    <Divider className="mb-8!" />

                    <div className="input__field mb-6">
                        <FormControlLabel
                            className="items-center!"
                            label="Allow users to download this eBook"
                            control={
                                <Checkbox
                                    color="primary"
                                    name="is_downloadable"
                                    checked={formik.values.is_downloadable}
                                    onChange={(e) => formik.setFieldValue("is_downloadable", e.target.checked)}
                                />
                            }
                        />
                        <FormHelperText>
                            When off, users can only read this eBook online — download and offline save are hidden.
                        </FormHelperText>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                            <div className="col-span-2">
                                <div className="input__field">
                                    <InputLabel className="required">Price</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        type="number"
                                        name="price"
                                        placeholder="Enter Price"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.price && Boolean(formik.errors.price)}
                                    />
                                    {formik.touched.price && formik.errors.price && (
                                        <FormHelperText error sx={{ mt: 0.5 }}>{formik.errors.price}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2 lg:col-span-1">
                                <div className="input__field">
                                    <InputLabel>Discount</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        type="number"
                                        name="discount"
                                        placeholder="Enter Discount"
                                        value={formik.values.discount}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.discount && Boolean(formik.errors.discount)}
                                    />
                                    {formik.touched.discount && formik.errors.discount && (
                                        <FormHelperText error sx={{ mt: 0.5 }}>{formik.errors.discount}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2 lg:col-span-1">
                                <div className="input__field">
                                    <InputLabel>Discount Type</InputLabel>
                                    <Autocomplete
                                        options={discountTypeOptions}
                                        value={discountTypeOptions.find((option) => option.value === formik.values.discount_type) || discountTypeOptions[0]}
                                        getOptionLabel={(option) => option.label}
                                        onChange={(_e, value) =>
                                            formik.setFieldValue("discount_type", (value?.value as DiscountTypeProps) || "percentage")
                                        }
                                        renderInput={(params) => <TextField {...params} placeholder="Select discount type" />}
                                    />
                                </div>
                            </div>
                    </div>
                </div>

                <FooterAction
                    handleConfirmationChange={() => navigate(PATH.EBOOK.ROOT)}
                    isLoading={submitting}
                    isUpdating={updating}
                    isEditMode={Boolean(id)}
                    onDraft={() => submitWithStatus("draft")}
                    replaceLabel={
                        id
                            ? (submitting ? "Updating eBook ..." : "Update eBook")
                            : (submitting ? "Creating eBook ..." : "Create eBook")
                    }
                />
            </form>
        </div>
    );
}
