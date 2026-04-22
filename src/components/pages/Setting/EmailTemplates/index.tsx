import {
    Button,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import {
    useGetEmailTemplateQuery,
    useUpdateEmailTemplateMutation,
} from "../../../../services/settingApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type {
    EmailTemplateActor,
    EmailTemplateMethod,
} from "../../../../types/setting";
import {
    ADMIN_EMAIL_TEMPLATES,
    ADMIN_SMS_TEMPLATES,
    USER_EMAIL_TEMPLATES,
    USER_SMS_TEMPLATES,
} from "../../../../types/setting";

function toLabel(key: string) {
    return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const TEMPLATE_MAP: Record<EmailTemplateActor, Record<EmailTemplateMethod, readonly string[]>> = {
    user: {
        email: USER_EMAIL_TEMPLATES,
        sms: USER_SMS_TEMPLATES,
    },
    admin: {
        email: ADMIN_EMAIL_TEMPLATES,
        sms: ADMIN_SMS_TEMPLATES,
    },
};

export default function EmailTemplatesRoot() {
    const dispatch = useAppDispatch();

    const [actor, setActor] = useState<EmailTemplateActor>("user");
    const [method, setMethod] = useState<EmailTemplateMethod>("email");
    const [templateKey, setTemplateKey] = useState<string>(TEMPLATE_MAP.user.email[0]);

    const templateOptions = TEMPLATE_MAP[actor][method];

    const { data, isFetching } = useGetEmailTemplateQuery(
        { actor, method, template_key: templateKey },
        { skip: !templateKey }
    );

    const [updateTemplate, { isLoading }] = useUpdateEmailTemplateMutation();

    const formik = useFormik({
        initialValues: {
            subject: data?.data?.subject || "",
            body: data?.data?.body || "",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const res = await updateTemplate({
                    actor,
                    method,
                    template_key: templateKey,
                    subject: method === "email" ? values.subject : undefined,
                    body: values.body,
                }).unwrap();
                dispatch(showToast({ message: res?.message || "Template updated", severity: "success" }));
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Unable to update template", severity: "error" }));
            }
        },
    });

    const handleActorChange = (newActor: EmailTemplateActor) => {
        setActor(newActor);
        const firstKey = TEMPLATE_MAP[newActor][method][0];
        setTemplateKey(firstKey || "");
    };

    const handleMethodChange = (newMethod: EmailTemplateMethod) => {
        setMethod(newMethod);
        const firstKey = TEMPLATE_MAP[actor][newMethod][0];
        setTemplateKey(firstKey || "");
    };

    return (
        <div className="app__settings__page__root pb-4 lg:pb-6">
            <Typography variant="h5">Email Templates</Typography>
            <Divider className="mt-4! mb-6!" />

            {/* Step 1: Select Actor */}
            <div className="mb-6">
                <Typography variant="subtitle2" fontWeight={600} className="mb-2!">Recipient</Typography>
                <ToggleButtonGroup
                    value={actor}
                    exclusive
                    onChange={(_, val) => val && handleActorChange(val)}
                    size="small"
                >
                    <ToggleButton value="user">User</ToggleButton>
                    <ToggleButton value="admin">Admin</ToggleButton>
                </ToggleButtonGroup>
            </div>

            {/* Step 2: Select Method */}
            <div className="mb-6">
                <Typography variant="subtitle2" fontWeight={600} className="mb-2!">Channel</Typography>
                <ToggleButtonGroup
                    value={method}
                    exclusive
                    onChange={(_, val) => val && handleMethodChange(val)}
                    size="small"
                >
                    <ToggleButton value="email">Email</ToggleButton>
                    <ToggleButton value="sms">SMS</ToggleButton>
                </ToggleButtonGroup>
            </div>

            {/* Step 3: Select Template */}
            <div className="mb-6">
                <FormControl fullWidth>
                    <InputLabel>Template</InputLabel>
                    <Select
                        value={templateKey}
                        label="Template"
                        onChange={(e) => setTemplateKey(e.target.value)}
                    >
                        {templateOptions.map((key) => (
                            <MenuItem key={key} value={key}>
                                {toLabel(key)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <Divider className="mt-2! mb-6!" />

            {/* Template Editor */}
            <form onSubmit={formik.handleSubmit}>
                {isFetching ? (
                    <Typography variant="body2" color="text.secondary">Loading template...</Typography>
                ) : (
                    <div className="flex flex-col gap-5">
                        {/* Variable hints */}
                        {data?.data?.variables && data.data.variables.length > 0 && (
                            <div>
                                <Typography variant="caption" color="text.secondary" className="mb-2! block">
                                    Available variables — click to copy:
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {data.data.variables.map((v) => (
                                        <Chip
                                            key={v}
                                            label={`{{${v}}}`}
                                            size="small"
                                            onClick={() => navigator.clipboard.writeText(`{{${v}}}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Subject — email only */}
                        {method === "email" && (
                            <div>
                                <InputLabel>Subject</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    name="subject"
                                    value={formik.values.subject}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Email subject line"
                                />
                            </div>
                        )}

                        {/* Body */}
                        <div>
                            <InputLabel>
                                {method === "email" ? "Email Body (HTML supported)" : "SMS Body"}
                            </InputLabel>
                            <OutlinedInput
                                fullWidth
                                multiline
                                minRows={method === "email" ? 10 : 4}
                                name="body"
                                value={formik.values.body}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={
                                    method === "email"
                                        ? "Write your email body here. HTML tags are supported."
                                        : "Write your SMS message. Keep it concise."
                                }
                                sx={{ fontFamily: method === "email" ? "monospace" : "inherit" }}
                            />
                        </div>

                        <div className="text-right">
                            <Button type="submit" variant="contained" disabled={isLoading || isFetching}>
                                {isLoading ? "Saving..." : "Save Template"}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
