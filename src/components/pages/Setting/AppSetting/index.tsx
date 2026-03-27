import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
    Button,
    Divider,
    IconButton,
    InputLabel,
    OutlinedInput,
    Typography
} from "@mui/material";
import { useFormik } from "formik";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    useGetAppSettingsQuery,
    useUpdateAppSettingMutation,
} from "../../../../services/settingApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { EmailFormItem, PhoneFormItem, SocialFormItem } from "../../../../types/setting";
import { OutlinedTextarea } from "../../../atoms/OutlinedTextArea";

const emptyPhone = (): PhoneFormItem => ({ label: "", value: "", icon: null, icon_url: "" });
const emptyEmail = (): EmailFormItem => ({ label: "", value: "", icon: null, icon_url: "" });
const emptySocial = (): SocialFormItem => ({ icon: null, icon_url: "", label: "", value: "", link: "" });

interface IconUploadProps {
    icon_url?: string;
    icon: File | null;
    onChange: (file: File | null) => void;
}

function IconUpload({ icon_url, icon, onChange }: IconUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const preview = icon ? URL.createObjectURL(icon) : icon_url || null;

    return (
        <div>
            <InputLabel>Icon</InputLabel>
            <div className="flex items-center gap-2 mt-1">
                {preview ? (
                    <img
                        src={preview}
                        alt="icon"
                        className="w-9 h-9 rounded object-cover border border-gray-300"
                    />
                ) : (
                    <div className="w-9 h-9 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                        ?
                    </div>
                )}
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => inputRef.current?.click()}
                >
                    {preview ? "Change" : "Upload"}
                </Button>
                {preview && (
                    <IconButton size="small" color="error" onClick={() => onChange(null)}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        onChange(file);
                        e.target.value = "";
                    }}
                />
            </div>
        </div>
    );
}

// ------- Repeater Section -------
interface RepeaterSectionProps<T extends { label: string; value: string; icon: File | null; icon_url?: string }> {
    title: string;
    addLabel: string;
    items: T[];
    extraFields?: (item: T, index: number) => React.ReactNode;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onFieldChange: (index: number, field: keyof T, value: string) => void;
    onIconChange: (index: number, file: File | null) => void;
    valuePlaceholder?: string;
}

function RepeaterSection<T extends { label: string; value: string; icon: File | null; icon_url?: string }>({
    title,
    addLabel,
    items,
    extraFields,
    onAdd,
    onRemove,
    onFieldChange,
    onIconChange,
    valuePlaceholder,
}: RepeaterSectionProps<T>) {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <Typography variant="subtitle1" fontWeight={600}>
                    {title}
                </Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={onAdd} variant="outlined">
                    {addLabel}
                </Button>
            </div>

            <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end p-3 border border-gray-200 rounded-md"
                    >
                        <div>
                            <InputLabel>Label</InputLabel>
                            <OutlinedInput
                                fullWidth
                                value={item.label}
                                onChange={(e) => onFieldChange(index, "label" as keyof T, e.target.value)}
                                placeholder="e.g. Main, Support"
                            />
                        </div>
                        <div>
                            <InputLabel>Value</InputLabel>
                            <OutlinedInput
                                fullWidth
                                value={item.value}
                                onChange={(e) => onFieldChange(index, "value" as keyof T, e.target.value)}
                                placeholder={valuePlaceholder}
                            />
                        </div>
                        {extraFields?.(item, index)}
                        <IconUpload
                            icon_url={item.icon_url}
                            icon={item.icon}
                            onChange={(file) => onIconChange(index, file)}
                        />
                        <div className="flex items-end pb-0.5">
                            <IconButton
                                onClick={() => onRemove(index)}
                                disabled={items.length === 1}
                                color="error"
                                size="small"
                            >
                                <DeleteOutlineIcon />
                            </IconButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ------- Main Page -------
export default function AppSettingRoot() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const { data } = useGetAppSettingsQuery();
    const [updateAppSetting, { isLoading }] = useUpdateAppSettingMutation();

    const formik = useFormik({
        initialValues: {
            phones: (data?.data?.phones?.length
                ? data.data.phones.map((p) => ({ ...p, icon: null }))
                : [emptyPhone()]) as PhoneFormItem[],
            emails: (data?.data?.emails?.length
                ? data.data.emails.map((e) => ({ ...e, icon: null }))
                : [emptyEmail()]) as EmailFormItem[],
            socials: (data?.data?.socials?.length
                ? data.data.socials.map((s) => ({ ...s, icon: null }))
                : [emptySocial()]) as SocialFormItem[],
            map: data?.data?.map || "",
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            const fd = new FormData();

            values.phones.forEach((item, i) => {
                fd.append(`phone[${i}][label]`, item.label);
                fd.append(`phone[${i}][value]`, item.value);
                if (item.icon) fd.append(`phone[${i}][icon]`, item.icon);
                if (item.icon_url) fd.append(`phone[${i}][icon_url]`, item.icon_url);
            });

            values.emails.forEach((item, i) => {
                fd.append(`email[${i}][label]`, item.label);
                fd.append(`email[${i}][value]`, item.value);
                if (item.icon) fd.append(`email[${i}][icon]`, item.icon);
                if (item.icon_url) fd.append(`email[${i}][icon_url]`, item.icon_url);
            });

            values.socials.forEach((item, i) => {
                fd.append(`social[${i}][label]`, item.label);
                fd.append(`social[${i}][value]`, item.value);
                fd.append(`social[${i}][link]`, item.link);
                if (item.icon) fd.append(`social[${i}][icon]`, item.icon);
                if (item.icon_url) fd.append(`social[${i}][icon_url]`, item.icon_url);
            });

            fd.append("map", values.map);

            try {
                const response = await updateAppSetting(fd).unwrap();
                dispatch(
                    showToast({
                        message: response?.message || "Settings updated successfully",
                        severity: "success",
                    })
                );
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to update app settings",
                        severity: "error",
                    })
                );
            }
        },
    });

    const makeFieldHandler =
        <T extends object>(key: "phones" | "emails" | "socials") =>
            (index: number, field: keyof T, value: string) => {
                const updated = [...(formik.values[key] as T[])];
                updated[index] = { ...updated[index], [field]: value };
                formik.setFieldValue(key, updated);
            };

    const makeIconHandler =
        (key: "phones" | "emails" | "socials") =>
            (index: number, file: File | null) => {
                const updated = [...formik.values[key]];
                updated[index] = { ...updated[index], icon: file, ...(file === null ? { icon_url: "" } : {}) };
                formik.setFieldValue(key, updated);
            };

    return (
        <form onSubmit={formik.handleSubmit} className="app__settings__page__root pb-4 lg:pb-6">
            <Typography variant="h5">{t("messages.app_settings")}</Typography>
            <Divider className="mt-4! mb-6!" />

            {/* Phone Repeater */}
            <RepeaterSection
                title="Phone Numbers"
                addLabel="Add Phone"
                items={formik.values.phones}
                valuePlaceholder="e.g. +1 234 567 890"
                onAdd={() => formik.setFieldValue("phones", [...formik.values.phones, emptyPhone()])}
                onRemove={(i) => formik.setFieldValue("phones", formik.values.phones.filter((_, idx) => idx !== i))}
                onFieldChange={makeFieldHandler<PhoneFormItem>("phones")}
                onIconChange={makeIconHandler("phones")}
            />

            <Divider className="mt-2! mb-6!" />

            {/* Email Repeater */}
            <RepeaterSection
                title="Email Addresses"
                addLabel="Add Email"
                items={formik.values.emails}
                valuePlaceholder="e.g. info@company.com"
                onAdd={() => formik.setFieldValue("emails", [...formik.values.emails, emptyEmail()])}
                onRemove={(i) => formik.setFieldValue("emails", formik.values.emails.filter((_, idx) => idx !== i))}
                onFieldChange={makeFieldHandler<EmailFormItem>("emails")}
                onIconChange={makeIconHandler("emails")}
            />

            <Divider className="mt-2! mb-6!" />

            {/* Socials Repeater */}
            <RepeaterSection
                title="Social Links"
                addLabel="Add Social"
                items={formik.values.socials}
                valuePlaceholder="e.g. @company"
                onAdd={() => formik.setFieldValue("socials", [...formik.values.socials, emptySocial()])}
                onRemove={(i) => formik.setFieldValue("socials", formik.values.socials.filter((_, idx) => idx !== i))}
                onFieldChange={makeFieldHandler<SocialFormItem>("socials")}
                onIconChange={makeIconHandler("socials")}
                extraFields={(item, index) => (
                    <div>
                        <InputLabel>Link</InputLabel>
                        <OutlinedInput
                            fullWidth
                            value={(item as SocialFormItem).link}
                            onChange={(e) =>
                                makeFieldHandler<SocialFormItem>("socials")(index, "link", e.target.value)
                            }
                            placeholder="https://..."
                        />
                    </div>
                )}
            />

            <Divider className="mt-2! mb-6!" />

            {/* Map Iframe */}
            <div className="mb-6">
                <InputLabel>Map (Iframe)</InputLabel>
                <OutlinedTextarea
                    name="map"
                    value={formik.values.map}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Paste Google Map embed code or URL"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500"
                />
            </div>

            <Divider className="mt-4! mb-6!" />
            <div className="text-right">
                <Button
                    type="submit"
                    variant="contained"
                    className="mt-6"
                    disabled={isLoading && !formik.dirty}
                >
                    {data?.data ? isLoading ? "Updating Setting" : "Update Setting" : "Save Setting"}
                </Button>
            </div>
        </form>
    );
}
