import type { Pagination } from "./roleAndPermission";

export interface ChangePasswordProps {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export interface LinkedDeviceProps {
    id: number,
    os: string | null,
    browser: string | null,
    location: string | null,
    ip: string | null;
    created_at: string,
    updated_at: string
}

export interface LinkedDeviceList {
    data: {
        data: LinkedDeviceProps[],
        pagination: Pagination
    }
}

export interface ThemeSettingProps {
    company_name: string;
    tagline: string;
    meta_description: string;
    logo_url?: string;
    logo_dark_url?: string;
    favicon_url?: string;
}

export interface ThemeSettingFormProps extends ThemeSettingProps {
    logo: File | null;
    logo_dark: File | null;
    favicon: File | null;
}

export interface PhoneItem {
    label: string;
    value: string;
    icon_url?: string;
}

export interface EmailItem {
    label: string;
    value: string;
    icon_url?: string;
}

export interface SocialItem {
    label: string;
    value: string;
    link: string;
    icon_url?: string;
}

export interface AppSettingProps {
    phones: PhoneItem[];
    emails: EmailItem[];
    socials: SocialItem[];
    map: string;
}

export interface PhoneFormItem extends PhoneItem {
    icon: File | null;
}

export interface EmailFormItem extends EmailItem {
    icon: File | null;
}

export interface SocialFormItem extends SocialItem {
    icon: File | null;
}

export interface SmtpSettingProps {
    host: string;
    port: number | string;
    encryption: "tls" | "ssl" | "none";
    username: string;
    password: string;
    from_name: string;
    from_email: string;
}

export interface CourseSettingProps {
    free_trial_days: number | string;
    free_trial_items: number | string;
    global_discount_enabled: boolean;
    global_discount_value: number | string;
}


export type LoginType = "otp" | "password" | "both";
export interface LoginTypeSettingProps {
    login_type: LoginType;
}

export type EmailTemplateMethod = "email" | "sms";
export type EmailTemplateActor = "user" | "admin";

export const USER_EMAIL_TEMPLATES = [
    "transaction",
    "password_reset",
    "otp",
    "welcome_email",
    "device_reset_status",
    "inactive_state",
] as const;

export const ADMIN_EMAIL_TEMPLATES = [
    "transaction",
    "new_registration",
    "device_reset_request",
] as const;

export const USER_SMS_TEMPLATES = [
    "otp",
    "device_reset",
    "transaction",
] as const;

export const ADMIN_SMS_TEMPLATES = [
    "new_registration",
    "device_reset_request",
] as const;

export type UserEmailTemplateKey = typeof USER_EMAIL_TEMPLATES[number];
export type AdminEmailTemplateKey = typeof ADMIN_EMAIL_TEMPLATES[number];
export type UserSmsTemplateKey = typeof USER_SMS_TEMPLATES[number];
export type AdminSmsTemplateKey = typeof ADMIN_SMS_TEMPLATES[number];

export interface EmailTemplateProps {
    actor: EmailTemplateActor;
    method: EmailTemplateMethod;
    template_key: string;
    subject?: string;
    body: string;
    variables?: string[];
}

export interface ZoomAccount {
    id: number;
    name: string;
    is_active: boolean;
    email: string;
    account_id: string;
    client_id: string;
    client_secret: string;
    sdk_key: string;
    sdk_secret: string;
}

export interface ZoomAccountCreateProps {
    name: string;
    email: string;
    account_id: string;
    client_id: string;
    client_secret: string;
    sdk_key: string;
    sdk_secret: string;
}

export interface ZoomAccountUpdateProps {
    id: number;
    name?: string;
    email?: string;
    account_id?: string;
    client_id?: string;
    client_secret?: string;
    sdk_key?: string;
    sdk_secret?: string;
}

export interface EsewaSettingProps {
    merchant_id: string;
    secret_key: string;
    test_mode: boolean;
    is_active: boolean;
}

export interface KhaltiSettingProps {
    public_key: string;
    secret_key: string;
    test_mode: boolean;
    is_active: boolean;
}

export type SmsGatewayProvider = "sparrow" | "aakash" | "custom";

export interface SmsGatewaySettingProps {
    provider: SmsGatewayProvider;
    api_key: string;
    sender_id: string;
}