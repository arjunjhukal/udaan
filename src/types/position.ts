import type { Pagination } from "./roleAndPermission";

export interface positionProps {
    id?: string | number;
    name: string;
    slug: string;
}

export interface positionList {
    data: {
        data: positionProps[];
        pagination: Pagination
    }

}