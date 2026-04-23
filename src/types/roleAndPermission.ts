import type { GlobalResponse } from "./user";

export interface PermissionProps {
    id?: string;
    module: string;
    add: boolean;
    view: boolean;
    edit: boolean;
    download: boolean;
    delete: boolean;
}

export interface PermissionList extends GlobalResponse {
    data: PermissionProps[]
}

export interface RoleProps {
    id?: number;
    name: string;
    permissions: PermissionProps[] | null;
    members?: string;
    created_at?: string;
}

export interface Pagination {
    total: number,
    per_page: number,
    current_page: number,
    total_pages: number
}
export interface RoleList extends GlobalResponse {
    data: {
        data: RoleProps[],
        pagination: Pagination
    }
}