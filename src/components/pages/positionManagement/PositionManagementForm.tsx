import { Box, Button, FormHelperText, InputLabel, OutlinedInput, Typography, useTheme } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { useCreatePositionMutation, useUpdatePositionMutation } from "../../../services/positionApi";
import { showToast } from "../../../slice/toastSlice";
import { useAppDispatch } from "../../../store/hook";
import type { positionProps } from "../../../types/position";
import { generateSlug } from "../../../utils/generateSlug";
import ConfirmationDialog from "../../organism/ConfirmationDialog";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    slug: Yup.string().required("Slug is required"),
});

export default function PositionManagementForm({ position, setPosition }: { position: positionProps, setPosition: React.Dispatch<React.SetStateAction<positionProps>> }) {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState<boolean>(false);
    const isEditMode = Boolean(position.id);

    const [createPosition, { isLoading }] = useCreatePositionMutation();
    const [updatePosition, { isLoading: isUpdating }] = useUpdatePositionMutation();

    const formik = useFormik({
        initialValues: position,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (isEditMode) {
                try {
                    const response = await updatePosition({ body: values, id: position.id?.toString() || "" }).unwrap();
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
                    const response = await createPosition(values).unwrap();
                    dispatch(
                        showToast({
                            message: response?.message || "Position created Successfully",
                            severity: "success"
                        })
                    )
                } catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Unable to create position",
                            severity: "error"
                        })
                    )
                }
            }
            setPosition({ id: undefined, name: "", slug: "" });
        },
    });

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

    const handleConfirmationChange = () => {
        if (formik.dirty) {
            setOpenConfirm((prev) => !prev)
        }
    }

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
                        onClick={handleConfirmationChange}
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
                            {isEditMode ? (isUpdating ? "Updating" : "Update") : (isLoading ? "Creating" : "Create")} Positon
                        </Typography>
                    </Button>
                </Box>
            </form>
            <ConfirmationDialog
                title="Cancel Position"
                description="All the recent changes will be lost completely. Are you sure."
                open={openConfirm}
                setOpen={handleConfirmationChange}
                onSave={() => {
                    setPosition({ id: undefined, name: "", slug: "" });
                    handleConfirmationChange();
                }}
            />
        </>
    )
}
