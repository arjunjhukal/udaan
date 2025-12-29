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

export interface AppSettingProps {
    contact_no: string;
    support_contact_no: string;
    email: string;
    support_email: string;
    address: string;
    map: string;
}