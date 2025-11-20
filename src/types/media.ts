import type { Pagination } from "./roleAndPermission"

export interface MediaProps {
    id: number,
    file_name: string,
    url: string,
    size: number
}

export interface MediaList{
    data:{
        data:MediaProps[],
        pagination:Pagination
    }
}