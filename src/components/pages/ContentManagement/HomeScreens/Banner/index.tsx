import { Autocomplete, Box, Button, Divider, IconButton, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { Add, Trash } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useAddOrUpdateBannerMutation, useGetAllBannerQuery } from "../../../../../services/contentApi";
import { useGetAllCourseQuery } from "../../../../../services/courseApi";
import { useGetAllLiveClassQuery } from "../../../../../services/liveClass";
import { useGetAllTestQuery } from "../../../../../services/questionApi";
import { showToast } from "../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../store/hook";
import { bannerInitialState, type BannerPayload, type NotifiableType } from "../../../../../types/content";
import TextEditor from "../../../../atoms/TextEditor";
import FileDragDrop from "../../../../molecules/FileDragDrop";

const bannerValidationSchema = Yup.object({
    json: Yup.object({
        title: Yup.string().required("Top Label is required"),
        sub_title: Yup.string().required("Heading is required"),
        description: Yup.string().required("Subheading/Body is required"),
        btn_title: Yup.string().required("Button Label is required"),
        notifiable_type: Yup.string().required("Button Link Type is required"),
        notifiable_id: Yup.number()
            .nullable(),
        status: Yup.boolean(),
        image_url: Yup.string().nullable()
    }),

    file: Yup.object({
        image: Yup.mixed()
            .nullable()
            .test("image-required", "Image is required", function (value) {
                const parent = this.from?.[1]?.value;
                const image_url = parent?.json?.image_url;

                if (image_url) {
                    return true;
                }
                return value != null;
            })
    })
});

const validationSchema = Yup.object({
    banners: Yup.array().of(bannerValidationSchema).min(1, "At least one banner is required")
});

const notifiableTypes: NotifiableType[] = ['general', 'live_class', 'course', 'mcq', 'subjective', 'offline'];

type NotifiableOption = { id: number; label: string };

export default function BannerRoot() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [notifiableIds, setNotifiableIds] = useState<NotifiableOption[]>([]);
    const [addOrUpdateBanner, { isLoading }] = useAddOrUpdateBannerMutation();
    const { data: bannersData } = useGetAllBannerQuery();
    const [searchText, setSearchText] = useState("");

    const formik = useFormik<{ banners: BannerPayload[] }>({
        initialValues: { banners: [bannerInitialState] },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                values.banners.forEach((banner, index) => {
                    formData.append(`banners[${index}][json][title]`, banner.json.title);
                    formData.append(`banners[${index}][json][sub_title]`, banner.json.sub_title);
                    formData.append(`banners[${index}][json][description]`, banner.json.description);
                    formData.append(`banners[${index}][json][btn_title]`, banner.json.btn_title);
                    formData.append(`banners[${index}][json][notifiable_type]`, banner.json.notifiable_type || '');
                    formData.append(`banners[${index}][json][notifiable_id]`, banner.json.notifiable_id?.toString() || '');
                    formData.append(`banners[${index}][json][status]`, banner.json.status.toString());
                    if (banner.json.image_url) formData.append(`banners[${index}][json][image_url]`, banner.json.image_url);
                    if (banner.file.image) formData.append(`banners[${index}][file][image]`, banner.file.image);
                });
                await addOrUpdateBanner(formData).unwrap();
                dispatch(showToast({ message: "Banner Created Successfully", severity: "success" }));
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Unable to Add Banner(s).", severity: "error" }));
            }
        }
    });

    const { data: liveClass } = useGetAllLiveClassQuery({ pageIndex: 1, pageSize: 10, search: searchText });
    const { data: courses } = useGetAllCourseQuery({ pageIndex: 1, pageSize: 10, search: searchText });
    const { data: mcqs } = useGetAllTestQuery({ pageIndex: 1, pageSize: 10, type: "mcq", search: searchText });
    const { data: subjectives } = useGetAllTestQuery({ pageIndex: 1, pageSize: 10, type: "subjective", search: searchText });

    useEffect(() => {
        if (bannersData?.data && bannersData.data.length) {
            formik.setValues({ banners: bannersData.data });
        }
    }, [bannersData]);

    // Populate notifiable options based on type and search
    useEffect(() => {
        const banner = formik.values.banners[0];
        const type = banner?.json?.notifiable_type;
        if (!type || type === "general") return setNotifiableIds([]);

        let data: any[] = [];
        switch (type) {
            case "live_class": data = liveClass?.data?.data || []; break;
            case "course": data = courses?.data?.data || []; break;
            case "mcq": data = mcqs?.data?.data || []; break;
            case "subjective": data = subjectives?.data?.data || []; break;
        }

        const options = data.map(item => ({ id: item.id, label: item.name }));
        setNotifiableIds(options);

        if (banner.json.notifiable_id) {
            const selected = options.find(item => item.id === banner.json.notifiable_id);
            if (selected) formik.setFieldValue(`banners[0].json.notifiable_id`, selected.id);
        }
    }, [formik.values.banners, liveClass, courses, mcqs, subjectives, searchText]);

    const handleFileChange = (index: number, file: File | null) => {
        formik.setFieldValue(`banners.${index}.file.image`, file);
    };

    return (
        <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className="banner__root h-full flex flex-col justify-between overflow-hidden">
                <Typography variant="h5">{t("menus.content_management.home_screen.banner.root")}</Typography>
                <div className="h-full overflow-auto">
                    <FieldArray name="banners">
                        {({ push, remove }) => (
                            <>
                                {formik.values.banners.map((banner, index) => {
                                    const errors = formik.errors.banners?.[index] as any;
                                    const touched = formik.touched.banners?.[index] as any;

                                    return (
                                        <Box key={index} className="mt-5">
                                            <Box className="flex items-center justify-between mb-4">
                                                <Typography variant="subtitle1">Banner {index + 1}</Typography>
                                                {formik.values.banners.length > 1 && (
                                                    <IconButton color="error" onClick={() => remove(index)} size="small">
                                                        <Trash size={20} />
                                                    </IconButton>
                                                )}
                                            </Box>

                                            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
                                                <div className="col-span-1">
                                                    <div className="input__field mb-4 lg:mb-6">
                                                        <InputLabel className="required">Top Label</InputLabel>
                                                        <OutlinedInput
                                                            fullWidth
                                                            name={`banners.${index}.json.title`}
                                                            value={banner.json.title}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={touched?.json?.title && Boolean(errors?.json?.title)}
                                                            placeholder="Enter Top Label"
                                                        />
                                                        {touched?.json?.title && errors?.json?.title && <Typography color="error">{errors.json.title}</Typography>}

                                                    </div>
                                                    <div className="input__field">
                                                        <InputLabel className="required">Heading</InputLabel>
                                                        <OutlinedInput
                                                            fullWidth
                                                            name={`banners.${index}.json.sub_title`}
                                                            value={banner.json.sub_title}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={touched?.json?.sub_title && Boolean(errors?.json?.sub_title)}
                                                            placeholder="Enter Heading"
                                                        />
                                                        {touched?.json?.sub_title && errors?.json?.sub_title && <Typography color="error">{errors.json.sub_title}</Typography>}
                                                    </div>
                                                </div>

                                                <div className="col-span-1">
                                                    <TextEditor
                                                        label="Subheading/ Body"
                                                        required
                                                        value={banner.json.description}
                                                        onChange={(value: string) => formik.setFieldValue(`banners.${index}.json.description`, value)}
                                                    />
                                                    {touched?.json?.description && errors?.json?.description && <Typography color="error">{errors.json.description}</Typography>}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-4 md:grid md:grid-cols-12 md:gap-6 my-4 lg:my-6">
                                                <div className="col-span-6">
                                                    <InputLabel className="required">Button Label</InputLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        name={`banners.${index}.json.btn_title`}
                                                        value={banner.json.btn_title}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={touched?.json?.btn_title && Boolean(errors?.json?.btn_title)}
                                                        placeholder="Enter Button Label"
                                                    />
                                                    {touched?.json?.btn_title && errors?.json?.btn_title && <Typography color="error">{errors.json.btn_title}</Typography>}
                                                </div>

                                                <div className="col-span-3">
                                                    <InputLabel className="required">Button Link Type</InputLabel>
                                                    <Autocomplete
                                                        disableClearable
                                                        options={notifiableTypes}
                                                        value={banner.json.notifiable_type || undefined}
                                                        onChange={(_, newValue) => formik.setFieldValue(`banners.${index}.json.notifiable_type`, newValue ?? undefined)}
                                                        onBlur={formik.handleBlur}
                                                        getOptionLabel={(option) => option.replace(/_/g, ' ')}
                                                        isOptionEqualToValue={(option, value) => option === value}
                                                        renderInput={(params) => (
                                                            <TextField {...params} placeholder="Select Type" error={touched?.json?.notifiable_type && Boolean(errors?.json?.notifiable_type)} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="col-span-3">
                                                    <InputLabel >Button Link Value</InputLabel>
                                                    <Autocomplete
                                                        options={notifiableIds}
                                                        value={notifiableIds.find(item => item.id === banner.json.notifiable_id) || null}
                                                        onChange={(_, newValue) => formik.setFieldValue(`banners.${index}.json.notifiable_id`, newValue?.id ?? null)}
                                                        onInputChange={(_, value, reason) => { if (reason === "input") setSearchText(value); }}
                                                        getOptionLabel={(option) => option.label}
                                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                        renderInput={(params) => <TextField {...params} placeholder="Select Item" error={touched?.json?.notifiable_id && Boolean(errors?.json?.notifiable_id)} />}
                                                    />
                                                </div>
                                            </div>

                                            <FileDragDrop
                                                label="Image"
                                                required={true}
                                                initialPreview={banner.json.image_url || ""}
                                                initialFile={banner.file.image || null}
                                                onFileChange={(file) => handleFileChange(index, file)}
                                                error={touched?.file?.image && Boolean(errors?.file?.image)}
                                            />
                                            {touched?.file?.image && errors?.file?.image && <Typography color="error">{errors.file.image}</Typography>}
                                            {index < formik.values.banners.length - 1 && <Divider className="my-6!" />}
                                        </Box>
                                    );
                                })}

                                <Button variant="text" color="primary" startIcon={<Add />} onClick={() => push(bannerInitialState)}>Add Banner</Button>
                            </>
                        )}
                    </FieldArray>
                </div>
                <Divider className="mt-6!" />
                <Box className="mt-6 flex justify-end gap-4 pb-4 lg:pb-6">
                    <Button onClick={() => formik.resetForm()} variant="contained" color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isLoading}>{isLoading ? "Creating Banner..." : "Create Banner"}</Button>
                </Box>
            </form>
        </FormikProvider>
    );
}
