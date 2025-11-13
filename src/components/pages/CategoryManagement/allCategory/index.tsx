import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { PATH } from "../../../../routes/PATH";
import { useDeleteCategoryMutation, useGetAllCategoryQuery } from "../../../../services/categoryApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { CategoryProps } from "../../../../types/category";
import CustomCollapseIcon from "../../../atoms/CustomCollapseIcon";
import ActionIconVisible from "../../../molecules/Action/ActionIconVisible";
import TablePagination from "../../../molecules/Table/Pagination";
import ConfirmationDialog from "../../../organism/ConfirmationDialog";
import EmptyRoute from "../../../organism/EmptyRoute";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";
import CategoryManagementForm from "../CategoryManagementForm";

export default function AllCategories() {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const [category, setCategory] = React.useState<CategoryProps>({
        name: "",
        slug: "",
        parent_id: null,
    });
    const [search, setSearch] = React.useState<string>("");

    const [qp, setQp] = React.useState({
        pageIndex: 1,
        pageSize: 5,
    });
    const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);


    const [openCategories, setOpenCategories] = React.useState<Record<number | string, boolean>>({});
    const [selectedRows, setSelectedRows] = React.useState<Set<number | string>>(new Set());
    const [categoriesToDelete, setCategoriesToDelete] = React.useState<string[]>([]);

    const { data, isLoading } = useGetAllCategoryQuery({ pageIndex: qp.pageIndex, pageSize: qp.pageSize, search: search });
    const [deleteCategory] = useDeleteCategoryMutation();


    const toggleCategory = (id: number | string) => {
        setOpenCategories((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // ✅ Handle checkbox toggle
    const handleCheckboxToggle = (id: number | string) => {
        setSelectedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleCategoryEdit = (categoryData: CategoryProps) => {
        setCategory({
            id: categoryData.id,
            name: categoryData.name,
            slug: categoryData.slug,
            parent_id: categoryData.parent_id,
        });
    };

    const handleCategoryDelete = async () => {
        try {
            const response = await deleteCategory({ body: categoriesToDelete }).unwrap();

            dispatch(
                showToast({
                    severity: "success",
                    message: response.message || "Category deleted successfully",
                })
            );

            // Clear selection and close confirmation dialog
            setSelectedRows(new Set());
            setOpenConfirmDelete(false);
        } catch (e: any) {
            dispatch(
                showToast({
                    severity: "error",
                    message: e?.data?.message || "Failed to delete category",
                })
            );
        }
    };

    const openDeleteConfirmation = (ids: string[]) => {
        setCategoriesToDelete(ids);
        setOpenConfirmDelete(true);
    };


    // ✅ Recursive renderer
    const renderCategory = (cat: CategoryProps, level: number = 0) => {
        const isOpen = !!openCategories[cat.id ?? ""];
        const hasChildren = cat.sub_category && cat.sub_category.length > 0;
        const isChecked = selectedRows.has(cat.id ?? "");

        return (
            <Box
                key={`${cat.id}-${level}`}
                className={`category__${level === 0 ? "items" : "content__wrapper"} rounded-2xl overflow-hidden`}
                sx={{
                    ...(level === 0 && { border: `1px solid ${theme.palette.gray.gray2}`, marginBottom: 2 }),
                    ...(level === 1 && { border: `1px solid ${theme.palette.gray.gray2}` }),
                }}
            >
                <Box
                    className="category__header py-3.5 px-4 flex justify-between items-center overflow-hidden cursor-pointer"
                    sx={{
                        background:
                            level === 0
                                ? theme.palette.primary.light
                                : level === 1
                                    ? theme.palette.success.light
                                    : "transparent",
                        borderBottom: level === 2 ? `1px solid ${theme.palette.seperator.dark}` : undefined,
                    }}
                    onClick={() => hasChildren && toggleCategory(cat.id ?? "")}
                >
                    <div className="header__left flex gap-3 items-center">
                        {/* Expand / Collapse Icon */}
                        {hasChildren ?
                            <CustomCollapseIcon isOpen={isOpen} /> : <div className="w-4 h-4"></div>
                        }

                        {/* Checkbox */}
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCheckboxToggle(cat.id ?? "");
                            }}
                            size="small"
                        >
                            {isChecked ? (
                                <CheckBox color="primary" />
                            ) : (
                                <CheckBoxOutlineBlank color="action" />
                            )}
                        </IconButton>

                        <div className="text">
                            <Typography variant="subtitle1">{cat.name}</Typography>
                            {cat?.sub_category && cat?.sub_category?.length > 0 && (
                                <Typography variant="caption" className="block">
                                    {cat.sub_category.length} child
                                </Typography>
                            )}
                        </div>
                    </div>

                    <ActionIconVisible
                        onDelete={() => openDeleteConfirmation([cat.id?.toString() ?? ""])}
                        onEdit={() => handleCategoryEdit(cat)}
                    />
                </Box>

                {/* CHILDREN */}
                {hasChildren && isOpen && (
                    <Box className={level === 0 ? "px-1 py-4" : ""}>
                        {cat?.sub_category &&
                            cat.sub_category.map((subCat) => renderCategory(subCat, level + 1))}
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <div className="all__category__root">
            <PageHeader
                breadcrumb={[
                    {
                        title: "Category & Level / Position ",
                        url: PATH.CATEGORY_LEVEL_MANAGEMENT.ROOT,
                    },
                    { title: "Category" },
                ]}
            />

            <div className="category__wrapper flex flex-col gap-8.5 md:grid md:grid-cols-12">
                <div className="md:col-span-3 lg:col-span-4">
                    <CategoryManagementForm
                        category={category}
                        data={data?.data?.data || []}
                        setCategory={setCategory}
                    />
                </div>

                <div className="md:col-span-9 lg:col-span-8">
                    <TableFilter
                        search={search}
                        setSearch={(value) => setSearch(value)}
                        selectedRows={selectedRows}
                        handleRoleDelete={() => setOpenConfirmDelete(true)}
                        categoryLayout={true}
                        title={t("menus.category_level_management.category.root")}
                    />

                    {!isLoading && !data?.data?.data?.length ? (
                        <EmptyRoute
                            title="Category not found"
                            message="Start defining category to manage system. Use the button below to create one."
                        />
                    ) : (
                        <div className="category__listing">
                            {data?.data?.data?.map((cat) => renderCategory(cat))}
                        </div>
                    )}

                    <TablePagination
                        qp={qp}
                        setQp={setQp}
                        totalPages={data?.data?.pagination?.total_pages || 0}
                    />
                    <ConfirmationDialog
                        open={openConfirmDelete}
                        title="Delete Category"
                        description="Are you sure you want to delete this category? Deleting a parent will delete all its sub-categories."
                        setOpen={setOpenConfirmDelete}
                        onSave={handleCategoryDelete}
                    />

                </div>
            </div>
        </div>
    );
}
