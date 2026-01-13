import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, FormHelperText, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { Add, ArrowDown2, Trash } from "iconsax-reactjs";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useAddOrUpdateOnboardingScreenMutation, useGetOnboardingScreenQuery } from "../../../../services/contentApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { OnBoardingProps } from "../../../../types/content";
import { YesNoSwitch } from "../../../atoms/YesNoSwitch";
import FileDragDrop from "../../../molecules/FileDragDrop";
import FooterAction from "../../../molecules/FooterAction";

const onBoardingCardsValidationSchema = Yup.object({
    icon_url: Yup.string().nullable(),

    icon: Yup.mixed<File>().when("icon_url", {
        is: (value: string | null | undefined) => !value,
        then: (schema) => schema.required("Icon is required"),
        otherwise: (schema) => schema.notRequired(),
    }),

    title: Yup.string().required("Title is required"),
    // description: Yup.string().required("Description is required"),
});

const onBoardingValidationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),

    layout: Yup.string()
        .oneOf(["square", "wide"], "Invalid layout")
        .required("Layout is required"),

    items: Yup.array()
        .of(onBoardingCardsValidationSchema)
        .min(1, "At least one child item is required"),
});


const validationSchema = Yup.object({
    pages: Yup.array().of(onBoardingValidationSchema).min(1, "At least one page is required")
});

interface FormValues {
    pages: OnBoardingProps[];
}

export default function OnBoardingScreenRoot() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { data } = useGetOnboardingScreenQuery();

    const [addOrUpdateOnboarding, { isLoading }] = useAddOrUpdateOnboardingScreenMutation();

    const formik = useFormik<FormValues>({
        initialValues: {
            pages: data?.data && data.data.length > 0 ? data.data : [
                {
                    icon: null,
                    icon_url: "",
                    title: "",
                    description: "",
                    layout: "square" as const,
                    items: [
                        {
                            icon: null,
                            icon_url: "",
                            title: "",
                            description: ""
                        }
                    ]
                }
            ]
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();

                values.pages.forEach((page, pageIndex) => {
                    // Append parent fields
                    if (page.icon instanceof File) {
                        formData.append(`pages[${pageIndex}][icon]`, page.icon);
                    }
                    if (page.icon_url) {
                        formData.append(`pages[${pageIndex}][icon_url]`, page.icon_url);
                    }
                    if (page.page_id) {
                        formData.append(`pages[${pageIndex}][page_id]`, page.page_id);
                    }
                    formData.append(`pages[${pageIndex}][title]`, page.title);
                    formData.append(`pages[${pageIndex}][description]`, page.description);
                    formData.append(`pages[${pageIndex}][layout]`, page.layout);
                    if (page.page_id) {
                        formData.append(`pages[${pageIndex}][page_id]`, page.page_id);
                    }

                    page.items.forEach((item, itemIndex) => {
                        if (item.icon instanceof File) {
                            formData.append(`pages[${pageIndex}][items][${itemIndex}][icon]`, item.icon);
                        }

                        if (item.icon_url) {
                            formData.append(`pages[${pageIndex}][items][${itemIndex}][icon_url]`, item.icon_url);
                        }

                        formData.append(`pages[${pageIndex}][items][${itemIndex}][title]`, item.title);
                        formData.append(`pages[${pageIndex}][items][${itemIndex}][description]`, item.description);
                    });
                });

                const response = await addOrUpdateOnboarding(formData).unwrap();
                dispatch(
                    showToast({
                        message: response?.message || "Onboarding Screen Updated Successfully",
                        severity: "success"
                    })
                );
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Failed to Update Onboarding Screen",
                        severity: "error"
                    })
                );
            }
        }
    });



    return (
        <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className="splash__root h-full flex flex-col justify-between overflow-hidden">
                <div className="flex justify-between items-center">
                    <div className="page__header flex flex-col gap-1.5">
                        <Typography variant="h5">{t("menus.content_management.onboarding_screen.root")}</Typography>
                        <Typography variant="subtitle2" color="text.middle">
                            {t("menus.content_management.onboarding_screen.message")}
                        </Typography>
                    </div>
                </div>
                <Divider className="mt-4! mb-6!" />

                <div className="h-full overflow-auto">
                    <FieldArray name="pages">
                        {({ push: pushPage, remove: removePage }) => (
                            <>
                                {formik.values.pages.map((page, pageIndex) => (
                                    <Accordion
                                        key={pageIndex}
                                        defaultExpanded={pageIndex === 0}
                                        className="mb-4"
                                        sx={{

                                            '&:before': { display: 'none' },
                                            boxShadow: 'none',
                                            borderRadius: '8px !important'
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ArrowDown2 size={20} />}
                                            sx={{
                                                borderRadius: '8px',
                                                '&.Mui-expanded': {
                                                    borderBottomLeftRadius: 0,
                                                    borderBottomRightRadius: 0,
                                                }
                                            }}
                                        >
                                            <div className="flex justify-between items-center w-full pr-4">
                                                <div className="flex items-center gap-2">
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        Page {pageIndex + 1}
                                                    </Typography>
                                                    {page.title && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            - {page.title}
                                                        </Typography>
                                                    )}

                                                </div>
                                                {formik.values.pages.length > 1 && (
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removePage(pageIndex);
                                                        }}
                                                        variant="text"
                                                        color="error"
                                                        startIcon={<Trash size={16} />}
                                                        size="small"
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ pt: 3 }}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <FileDragDrop
                                                        label="Page Icon"
                                                        initialPreview={page.icon_url}
                                                        onFileChange={(file) =>
                                                            formik.setFieldValue(`pages[${pageIndex}].icon`, file)
                                                        }
                                                        error={
                                                            formik.touched.pages?.[pageIndex]?.icon &&
                                                            Boolean((formik.errors.pages?.[pageIndex] as any)?.icon)
                                                        }
                                                        helperText={
                                                            formik.touched.pages?.[pageIndex]?.icon
                                                                ? ((formik.errors.pages?.[pageIndex] as any)?.icon as string)
                                                                : ""
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    {/* Title */}
                                                    <div className="mb-4">
                                                        <InputLabel className="required">Title</InputLabel>
                                                        <OutlinedInput
                                                            fullWidth
                                                            name={`pages[${pageIndex}].title`}
                                                            placeholder="Enter title"
                                                            value={page.title}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={
                                                                formik.touched.pages?.[pageIndex]?.title &&
                                                                Boolean((formik.errors.pages?.[pageIndex] as any)?.title)
                                                            }
                                                        />
                                                        {formik.touched.pages?.[pageIndex]?.title &&
                                                            (formik.errors.pages?.[pageIndex] as any)?.title && (
                                                                <FormHelperText error>
                                                                    {(formik.errors.pages?.[pageIndex] as any)?.title as string}
                                                                </FormHelperText>
                                                            )}
                                                    </div>

                                                    {/* Description */}
                                                    <div className="mb-4">
                                                        <InputLabel className="required">Description</InputLabel>
                                                        <OutlinedInput
                                                            fullWidth
                                                            multiline
                                                            rows={3}
                                                            name={`pages[${pageIndex}].description`}
                                                            placeholder="Enter description"
                                                            value={page.description}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={
                                                                formik.touched.pages?.[pageIndex]?.description &&
                                                                Boolean((formik.errors.pages?.[pageIndex] as any)?.description)
                                                            }
                                                        />
                                                        {formik.touched.pages?.[pageIndex]?.description &&
                                                            (formik.errors.pages?.[pageIndex] as any)?.description && (
                                                                <FormHelperText error>
                                                                    {(formik.errors.pages?.[pageIndex] as any)?.description as string}
                                                                </FormHelperText>
                                                            )}
                                                    </div>

                                                    {/* Layout Switch */}
                                                    <div>
                                                        <InputLabel>Is Wide Layout (yes for wide no for square)</InputLabel>
                                                        <YesNoSwitch
                                                            checked={page.layout === "wide"}
                                                            onChange={(e) =>
                                                                formik.setFieldValue(
                                                                    `pages[${pageIndex}].layout`,
                                                                    e.target.checked ? "wide" : "square"
                                                                )
                                                            }
                                                        />

                                                    </div>
                                                </div>
                                            </div>

                                            <Divider className="my-6!" />

                                            {/* Child Items */}
                                            <Typography className="mb-3!" variant="subtitle1" color="text.middle">
                                                Child Items
                                            </Typography>

                                            <FieldArray name={`pages[${pageIndex}].items`}>
                                                {({ push: pushItem, remove: removeItem }) => (
                                                    <>
                                                        {page.items.map((item, itemIndex) => (
                                                            <div
                                                                key={itemIndex}
                                                                className="child__wrapper px-4 lg:px-8 mb-6 py-4 rounded"
                                                                style={{
                                                                    borderColor: (formik.touched.pages?.[pageIndex]?.items?.[itemIndex] &&
                                                                        (formik.errors.pages?.[pageIndex] as any)?.items?.[itemIndex])
                                                                        ? '#d32f2f'
                                                                        : 'rgba(0, 0, 0, 0.12)',
                                                                    backgroundColor: (formik.touched.pages?.[pageIndex]?.items?.[itemIndex] &&
                                                                        (formik.errors.pages?.[pageIndex] as any)?.items?.[itemIndex])
                                                                        ? 'rgba(211, 47, 47, 0.02)'
                                                                        : 'transparent'
                                                                }}
                                                            >
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                                                        Child Item {itemIndex + 1}
                                                                    </Typography>
                                                                    {page.items.length > 1 && (
                                                                        <Button
                                                                            onClick={() => removeItem(itemIndex)}
                                                                            variant="text"
                                                                            color="error"
                                                                            startIcon={<Trash size={16} />}
                                                                            size="small"
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    )}
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    <div>
                                                                        <FileDragDrop
                                                                            label="Child Icon"
                                                                            required
                                                                            initialPreview={item.icon_url}
                                                                            onFileChange={(file) =>
                                                                                formik.setFieldValue(
                                                                                    `pages[${pageIndex}].items[${itemIndex}].icon`,
                                                                                    file
                                                                                )
                                                                            }
                                                                            error={
                                                                                formik.touched.pages?.[pageIndex]?.items?.[itemIndex]?.icon &&
                                                                                Boolean(
                                                                                    (formik.errors.pages?.[pageIndex] as any)?.items?.[itemIndex]?.icon
                                                                                )
                                                                            }
                                                                            helperText={
                                                                                formik.touched.pages?.[pageIndex]?.items?.[itemIndex]?.icon
                                                                                    ? ((formik.errors.pages?.[pageIndex] as any)?.items?.[itemIndex]
                                                                                        ?.icon as string)
                                                                                    : ""
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        {/* Child Title */}
                                                                        <div className="mb-4">
                                                                            <InputLabel className="required">Title</InputLabel>
                                                                            <OutlinedInput
                                                                                fullWidth
                                                                                name={`pages[${pageIndex}].items[${itemIndex}].title`}
                                                                                placeholder="Enter title"
                                                                                value={item.title}
                                                                                onChange={formik.handleChange}
                                                                                onBlur={formik.handleBlur}
                                                                                error={
                                                                                    formik.touched.pages?.[pageIndex]?.items?.[itemIndex]
                                                                                        ?.title &&
                                                                                    Boolean(
                                                                                        (formik.errors.pages?.[pageIndex] as any)?.items?.[itemIndex]
                                                                                            ?.title
                                                                                    )
                                                                                }
                                                                            />
                                                                            {formik.touched.pages?.[pageIndex]?.items?.[itemIndex]?.title &&
                                                                                (formik.errors.pages?.[pageIndex] as any)?.items?.[itemIndex]
                                                                                    ?.title && (
                                                                                    <FormHelperText error>
                                                                                        {
                                                                                            (formik.errors.pages?.[pageIndex] as any)?.items?.[
                                                                                                itemIndex
                                                                                            ]?.title as string
                                                                                        }
                                                                                    </FormHelperText>
                                                                                )}
                                                                        </div>

                                                                        {/* Child Description */}
                                                                        <div>
                                                                            <InputLabel className="required">Description</InputLabel>
                                                                            <OutlinedInput
                                                                                fullWidth
                                                                                multiline
                                                                                rows={2}
                                                                                name={`pages[${pageIndex}].items[${itemIndex}].description`}
                                                                                placeholder="Enter description"
                                                                                value={item.description}
                                                                                onChange={formik.handleChange}
                                                                                onBlur={formik.handleBlur}
                                                                                error={
                                                                                    formik.touched.pages?.[pageIndex]?.items?.[itemIndex]
                                                                                        ?.description &&
                                                                                    Boolean(
                                                                                        (formik.errors.pages?.[pageIndex] as any)?.items?.[itemIndex]
                                                                                            ?.description
                                                                                    )
                                                                                }
                                                                            />
                                                                            {formik.touched.pages?.[pageIndex]?.items?.[itemIndex]
                                                                                ?.description &&
                                                                                (formik.errors.pages?.[pageIndex] as any)?.items?.[itemIndex]
                                                                                    ?.description && (
                                                                                    <FormHelperText error>
                                                                                        {
                                                                                            (formik.errors.pages?.[pageIndex] as any)?.items?.[
                                                                                                itemIndex
                                                                                            ]?.description as string
                                                                                        }
                                                                                    </FormHelperText>
                                                                                )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <Button
                                                            onClick={() =>
                                                                pushItem({
                                                                    icon: null,
                                                                    icon_url: "",
                                                                    title: "",
                                                                    description: ""
                                                                })
                                                            }
                                                            variant="text"
                                                            color="primary"
                                                            startIcon={<Add size={18} />}
                                                        >
                                                            Add Another Child Item
                                                        </Button>
                                                    </>
                                                )}
                                            </FieldArray>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}

                                <Button
                                    onClick={() =>
                                        pushPage({
                                            icon: null,
                                            icon_url: "",
                                            title: "",
                                            description: "",
                                            layout: "square" as const,
                                            items: [
                                                {
                                                    icon: null,
                                                    icon_url: "",
                                                    title: "",
                                                    description: ""
                                                }
                                            ]
                                        })
                                    }
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Add size={20} />}
                                    className="mb-6"
                                >
                                    Add Onboarding Page
                                </Button>
                            </>
                        )}
                    </FieldArray>
                </div>

                <FooterAction
                    replaceLabel={isLoading ? "Updating Onboarding Screen..." : "Update Onboarding Screen"}
                />
            </form>
        </FormikProvider>
    );
}