import { Autocomplete, Box, Button, FormHelperText, InputLabel, OutlinedInput, TextField, Typography, useTheme } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { useCreateCategoryMutation, useEditCategoryMutation } from "../../../services/categoryApi";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch } from "../../../store/hook";
import type { CategoryProps } from "../../../types/category";
import ConfirmationDialog from "../../organism/ConfirmationDialog";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    slug: Yup.string().required("Slug is required"),
    parent_id: Yup.string().nullable(),
});

// Function to generate slug from name
const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z\s-]/g, '') // Remove special characters and numbers, keep only letters, spaces, and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

// Flatten nested categories but track level for indentation
const flattenCategoriesWithLevels = (
    categories: CategoryProps[],
    level = 0
): (CategoryProps & { level: number })[] => {
    const flattened: (CategoryProps & { level: number })[] = [];

    categories.forEach((category) => {
        const { sub_category, ...rest } = category;

        // Always push current category
        flattened.push({ ...rest, level });

        // Only go one level deep
        if (level < 1 && sub_category && sub_category.length > 0) {
            flattened.push(...flattenCategoriesWithLevels(sub_category, level + 1));
        }
    });

    return flattened;
};


export default function CategoryManagementForm({
    category,
    data,
    setCategory
}: {
    category: CategoryProps,
    data: CategoryProps[],
    setCategory: (newValue: CategoryProps) => void
}) {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState<boolean>(false);


    const [createCategory, { isLoading }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useEditCategoryMutation();


    const flattenedData = React.useMemo(() => flattenCategoriesWithLevels(data), [data]);


    const isEditMode = Boolean(category.id);


    React.useEffect(() => {
        setIsSlugManuallyEdited(false);
    }, [category.id]);

    const formik = useFormik({
        initialValues: category,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (isEditMode) {
                try {
                    const response = await updateCategory({ body: values, id: category.id?.toString() || "" }).unwrap();
                    dispatch(
                        showToast({
                            message: response?.message || "Updated created Successfully",
                            severity: "success"
                        })
                    )
                } catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Unable to updated category",
                            severity: "error"
                        })
                    )
                }
            }
            else {
                try {
                    const response = await createCategory(values).unwrap();
                    dispatch(
                        showToast({
                            message: response?.message || "Category created Successfully",
                            severity: "success"
                        })
                    )
                } catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Unable to create category",
                            severity: "error"
                        })
                    )
                }
            }
            setCategory({ id: undefined, name: "", slug: "", parent_id: null });
        },
    });

    const handleComfirmationChange = () => {
        if (formik.dirty) {
            setOpenConfirm((prev) => !prev)
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        formik.setFieldValue("name", newName);

        if (!isSlugManuallyEdited) {
            formik.setFieldValue("slug", generateSlug(newName));
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSlugManuallyEdited(true);
        formik.handleChange(e);
    };

    // Find the selected parent category object based on parent_id
    const selectedParent = React.useMemo(() => {
        if (!formik.values.parent_id) return null;
        return flattenedData.find(cat => cat.id?.toString() === formik.values.parent_id?.toString()) || null;
    }, [formik.values.parent_id, flattenedData]);

    return (
        <>
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
                <div className="input__field">
                    <InputLabel htmlFor="name" className="required">
                        Name
                    </InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="name"
                        name="name"
                        placeholder="Enter the name of the category"
                        value={formik.values.name}
                        onChange={handleNameChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <FormHelperText error sx={{ mt: 0.5 }}>
                            {formik.errors.name}
                        </FormHelperText>
                    )}
                </div>

                {/* Parent Destination */}
                <div className="input__field">
                    <InputLabel htmlFor="parent">
                        Parent Destination
                    </InputLabel>
                    <Autocomplete
                        options={flattenedData}
                        getOptionLabel={(option) => option.name}
                        value={selectedParent}
                        onChange={(_event, newValue) => {
                            formik.setFieldValue("parent_id", newValue ? newValue.id?.toString() : null);
                        }}
                        onBlur={formik.handleBlur}
                        isOptionEqualToValue={(option, value) =>
                            option.id?.toString() === value?.id?.toString()
                        }
                        renderOption={(props, option) => (
                            <li
                                {...props}
                                style={{
                                    paddingLeft: `${option.level * 16}px`,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="body2" color="text.primary">
                                    {option.name}
                                </Typography>
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select Parent Category"
                                error={formik.touched.parent_id && Boolean(formik.errors.parent_id)}
                            />
                        )}
                    />

                    {formik.touched.parent_id && formik.errors.parent_id && (
                        <FormHelperText error>{formik.errors.parent_id}</FormHelperText>
                    )}
                </div>

                {/* Slug Field */}
                <div className="input__field">
                    <InputLabel htmlFor="slug" className="required">
                        Slug
                    </InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="slug"
                        name="slug"
                        placeholder="Enter the slug of the category"
                        value={formik.values.slug}
                        onChange={handleSlugChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.slug && Boolean(formik.errors.slug)}
                    />
                    {formik.touched.slug && formik.errors.slug && (
                        <FormHelperText error sx={{ mt: 0.5 }}>
                            {formik.errors.slug}
                        </FormHelperText>
                    )}
                </div>

                <Box
                    className="footer__action flex justify-end items-center gap-2 pt-6 mt-2 sticky -bottom-5"
                    sx={{
                        borderTop: `1px solid ${theme.palette.seperator.dark}`,
                        background: theme.palette.primary.contrastText,
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            background: theme.palette.seperator.dark,
                            color: theme.palette.text.middle
                        }}
                        onClick={handleComfirmationChange}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isLoading}
                    >
                        <Typography variant="body2">
                            {isEditMode ? (isUpdating ? "Updating" : "Update") : (isLoading ? "Creating" : "Create")} Category
                        </Typography>
                    </Button>
                </Box>
            </form>
            <ConfirmationDialog
                title="Cancel Category"
                description="All the recent changes will be lost completely. Are you sure."
                open={openConfirm}
                setOpen={handleComfirmationChange}
                onSave={() => {
                    setCategory({ id: undefined, name: "", slug: "", parent_id: null })
                    handleComfirmationChange();
                }}
            />
        </>
    );
}