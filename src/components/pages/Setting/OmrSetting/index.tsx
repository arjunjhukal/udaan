import {
    Alert,
    Button,
    Divider,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Switch,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetOmrSettingsQuery, useUpdateOmrSettingsMutation } from "../../../../services/settingApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { OmrSettingProps } from "../../../../types/setting";

const validationSchema = Yup.object({
    max_attempt: Yup.number()
        .nullable()
        .min(0, "Must be 0 (unlimited) or a positive number")
        .integer("Must be a whole number"),
});

export default function OmrSettingRoot() {
    const dispatch = useAppDispatch();
    const { data } = useGetOmrSettingsQuery();
    const [updateOmr, { isLoading }] = useUpdateOmrSettingsMutation();

    const formik = useFormik<OmrSettingProps>({
        initialValues: {
            max_attempt: data?.data?.max_attempt ?? null,
            override_all: data?.data?.override_all ?? false,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const payload: OmrSettingProps = {
                    ...values,
                    max_attempt: values.max_attempt === 0 ? null : values.max_attempt,
                };
                const res = await updateOmr(payload).unwrap();
                dispatch(showToast({ message: res?.message || "OMR settings updated", severity: "success" }));
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Unable to update OMR settings", severity: "error" }));
            }
        },
    });

    const maxAttemptDisplay = formik.values.max_attempt === null ? "" : String(formik.values.max_attempt);

    return (
        <form onSubmit={formik.handleSubmit} className="app__settings__page__root pb-4 lg:pb-6">
            <Typography variant="h5">OMR Setting</Typography>
            <Divider className="mt-4! mb-6!" />

            <Typography variant="subtitle1" fontWeight={600} className="mb-1!">
                Global Max Attempts
            </Typography>
            <Typography variant="body2" color="text.secondary" className="mb-4!">
                The default maximum number of attempts allowed across all OMR tests.
                Leave blank or set to 0 for unlimited.
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <InputLabel>Max Attempts (0 = unlimited)</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="max_attempt"
                        type="number"
                        inputProps={{ min: 0, step: 1 }}
                        value={maxAttemptDisplay}
                        onChange={(e) => {
                            const val = e.target.value;
                            formik.setFieldValue("max_attempt", val === "" ? null : Number(val));
                        }}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. 3  (leave blank for unlimited)"
                        error={Boolean(formik.touched.max_attempt && formik.errors.max_attempt)}
                    />
                    {formik.touched.max_attempt && formik.errors.max_attempt && (
                        <FormHelperText error>{formik.errors.max_attempt}</FormHelperText>
                    )}
                </div>
            </div>

            <Divider className="mt-2! mb-6!" />

            <Typography variant="subtitle1" fontWeight={600} className="mb-1!">
                Override Behavior
            </Typography>
            <Typography variant="body2" color="text.secondary" className="mb-4!">
                Controls whether the global limit takes precedence over limits set on individual OMR tests.
            </Typography>

            <div className="mb-4">
                <FormControlLabel
                    control={
                        <Switch
                            name="override_all"
                            checked={formik.values.override_all}
                            onChange={formik.handleChange}
                        />
                    }
                    label="Force global limit on all OMR tests (ignore per-test settings)"
                />
            </div>

            {!formik.values.override_all && (
                <Alert severity="info" className="mb-6!">
                    Per-test attempt limits take precedence. The global limit applies only when a test has no limit configured.
                </Alert>
            )}

            {formik.values.override_all && (
                <Alert severity="warning" className="mb-6!">
                    All per-test attempt limits are ignored. Every OMR test uses the global limit above.
                </Alert>
            )}

            <Divider className="mt-2! mb-6!" />
            <div className="text-right">
                <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save OMR Settings"}
                </Button>
            </div>
        </form>
    );
}
