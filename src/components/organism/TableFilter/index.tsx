import { Box, Button, IconButton, OutlinedInput, Stack, Typography, useTheme } from "@mui/material";
import { Send } from "iconsax-reactjs";
import type { Dispatch, SetStateAction } from "react";
import FilterIcon from "../../../icons/FilterIcon";
import SearchIcon from "../../../icons/SearchIcon";

export type LayoutProps = "table" | "grid"
interface TableFilterProps {
    search: string;
    setSearch: (newValue: string) => void;
    selectedRows: Set<string | number>;
    handleRoleDelete: (selectedRoleIds: string[]) => void;
    onFilter?: () => void;
    layout?: LayoutProps
    setLayout?: Dispatch<SetStateAction<LayoutProps>>;
    categoryLayout?: boolean;
    title?: string;
    onPublish?: () => void;
}
export default function TableFilter({ search, setSearch, selectedRows, handleRoleDelete, onFilter, layout, categoryLayout, title, setLayout, onPublish }: TableFilterProps) {
    const theme = useTheme();

    const handleDeleteClick = () => {
        if (selectedRows.size > 0) {
            handleRoleDelete(Array.from(selectedRows).map((id) => id.toString()));
        }
    };
    return (
        <Box className={`md:grid md:grid-cols-12  items-center mb-8 ${categoryLayout ? "pb-2 mb-6" : ""}`}
            sx={{
                borderBottom: categoryLayout ? `1px solid ${theme.palette.separator.dark}` : ""
            }}
        >
            <div className="col-span-6">
                {!categoryLayout ? <OutlinedInput
                    placeholder="Search"
                    name="search"
                    id="search"
                    startAdornment={<SearchIcon />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        gap: "8px"
                    }}
                /> : <Typography variant="h5" color="text.dark">{title}</Typography>}

            </div>
            <div className="col-span-6">
                <div className="flex justify-end items-center gap-3 filter__right">
                    {selectedRows.size > 0 ? <IconButton
                        sx={{
                            border: `1px solid ${theme.palette.separator.dark}`
                        }} className={`rounded-md! ${categoryLayout ? "" : "py-2.5! px-3.5! "}`}
                        onClick={handleDeleteClick}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.0702 5.23C19.4602 5.07 17.8502 4.95 16.2302 4.86V4.85L16.0102 3.55C15.8602 2.63 15.6402 1.25 13.3002 1.25H10.6802C8.35016 1.25 8.13016 2.57 7.97016 3.54L7.76016 4.82C6.83016 4.88 5.90016 4.94 4.97016 5.03L2.93016 5.23C2.51016 5.27 2.21016 5.64 2.25016 6.05C2.29016 6.46 2.65016 6.76 3.07016 6.72L5.11016 6.52C10.3502 6 15.6302 6.2 20.9302 6.73C20.9602 6.73 20.9802 6.73 21.0102 6.73C21.3902 6.73 21.7202 6.44 21.7602 6.05C21.7902 5.64 21.4902 5.27 21.0702 5.23Z" fill="#111827" />
                            <path d="M19.2302 8.14C18.9902 7.89 18.6602 7.75 18.3202 7.75H5.68024C5.34024 7.75 5.00024 7.89 4.77024 8.14C4.54024 8.39 4.41024 8.73 4.43024 9.08L5.05024 19.34C5.16024 20.86 5.30024 22.76 8.79024 22.76H15.2102C18.7002 22.76 18.8402 20.87 18.9502 19.34L19.5702 9.09C19.5902 8.73 19.4602 8.39 19.2302 8.14ZM13.6602 17.75H10.3302C9.92024 17.75 9.58024 17.41 9.58024 17C9.58024 16.59 9.92024 16.25 10.3302 16.25H13.6602C14.0702 16.25 14.4102 16.59 14.4102 17C14.4102 17.41 14.0702 17.75 13.6602 17.75ZM14.5002 13.75H9.50024C9.09024 13.75 8.75024 13.41 8.75024 13C8.75024 12.59 9.09024 12.25 9.50024 12.25H14.5002C14.9102 12.25 15.2502 12.59 15.2502 13C15.2502 13.41 14.9102 13.75 14.5002 13.75Z" fill="#111827" />
                        </svg>
                    </IconButton> : ""}

                    {categoryLayout ? <OutlinedInput
                        placeholder="Search"
                        name="search"
                        id="search"
                        startAdornment={<SearchIcon />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            gap: "8px",
                            padding: "8px 16px"
                        }}
                    /> : ""}
                    {onFilter ? <Button onClick={onFilter} startIcon={<FilterIcon />} sx={{
                        border: `1px solid ${theme.palette.separator.dark}`
                    }} className="py-2.5! px-3.5! rounded-md!">
                        <Typography variant="subtitle1" color="text.dark">Filter</Typography>
                    </Button> : ""}
                    {layout ? <Stack >
                        <IconButton sx={{
                            border: `1px solid ${theme.palette.separator.dark}`,
                            borderRadius: "8px 0 0 8px",
                        }} className={`py-2.5! px-3.5! ${layout === "table" ? "active__layout" : ""}`}
                            onClick={() => setLayout && setLayout("table")}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 7.74995H9.75V1.94995H16.19C19.83 1.94995 22 4.11995 22 7.74995Z" fill="#9CA3B0" />
                                <path d="M22 16.25C21.95 19.82 19.79 21.95 16.19 21.95H9.75V16.25H22Z" fill="#9CA3B0" />
                                <path d="M8.25 1.94995V21.95H7.81C4.17 21.95 2 19.78 2 16.14V7.75995C2 4.11995 4.17 1.94995 7.81 1.94995H8.25Z" fill="#9CA3B0" />
                                <path d="M22 9.25H9.75V14.75H22V9.25Z" fill="#9CA3B0" />
                            </svg>
                        </IconButton>
                        <IconButton sx={{
                            border: `1px solid ${theme.palette.separator.dark}`,
                            borderRadius: "0 8px 8px 0",
                        }} className={`py-2.5! px-3.5! ${layout === "grid" ? "active__layout" : ""}`}
                            onClick={() => setLayout && setLayout("grid")}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 8.52V3.98C22 2.57 21.36 2 19.77 2H15.73C14.14 2 13.5 2.57 13.5 3.98V8.51C13.5 9.93 14.14 10.49 15.73 10.49H19.77C21.36 10.5 22 9.93 22 8.52Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M22 19.77V15.73C22 14.14 21.36 13.5 19.77 13.5H15.73C14.14 13.5 13.5 14.14 13.5 15.73V19.77C13.5 21.36 14.14 22 15.73 22H19.77C21.36 22 22 21.36 22 19.77Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98V8.51C2 9.93 2.64 10.49 4.23 10.49H8.27C9.86 10.5 10.5 9.93 10.5 8.52Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M10.5 19.77V15.73C10.5 14.14 9.86 13.5 8.27 13.5H4.23C2.64 13.5 2 14.14 2 15.73V19.77C2 21.36 2.64 22 4.23 22H8.27C9.86 22 10.5 21.36 10.5 19.77Z" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </IconButton>
                    </Stack> : ""}
                    {onPublish && (
                        <Button
                            fullWidth
                            startIcon={<Send variant="Bold" color={theme.palette.text.dark} />}
                            sx={{
                                border: `1px solid ${theme.palette.separator.dark}`,
                                "& .MuiButton-startIcon": {
                                    mr: {
                                        xs: 0
                                    }
                                }
                            }}
                            className="py-2.5! px-3.5! rounded-md! text-center justify-center! gap-2! items-center!"
                            onClick={() => onPublish()}
                        >
                            <Typography variant="subtitle2" color="text.dark" className="hidden! md:flex!">
                                Publish
                            </Typography>
                        </Button>
                    )}
                </div>
            </div>
        </Box>
    )
}
