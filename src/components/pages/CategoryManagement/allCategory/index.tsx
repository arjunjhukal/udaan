import { CheckBox, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { PATH } from "../../../../routes/PATH";
import { useGetAllCategoryQuery } from "../../../../services/categoryApi";
import type { CategoryProps } from "../../../../types/category";
import TablePagination from "../../../molecules/Table/Pagination";
import EmptyRoute from "../../../organism/EmptyRoute";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";
import CategoryManagementForm from "../CategoryManagementForm";

export default function AllCategories() {
    const { t } = useTranslation();
    const theme = useTheme();
    const [category, setCategory] = React.useState<CategoryProps>({
        name: "",
        slug: "",
        parent_id: null
    });
    const [qp, setQp] = React.useState({
        pageIndex: 1,
        pageSize: 5,
    });
    const { data, isLoading } = useGetAllCategoryQuery(qp);

    // Handle edit - populate form with selected category
    const handleCategoryEdit = (categoryData: CategoryProps) => {
        setCategory({
            id: categoryData.id,
            name: categoryData.name,
            slug: categoryData.slug,
            parent_id: categoryData.parent_id
        });
    };

    // Reset form to create new category
    const handleResetForm = () => {
        setCategory({
            name: "",
            slug: "",
            parent_id: null
        });
    };

    // Recursive function to render categories and subcategories
    const renderCategory = (cat: CategoryProps, level: number = 0) => {
        const isParent = level === 0;
        const isSubCategory = level === 1;
        const isNestedSubCategory = level === 2;

        return (
            <Box
                key={`${cat.id}-${level}`}
                className={`category__${level === 0 ? 'items' : 'content__wrapper'} ${level === 0 ? 'rounded-2xl' : ''}`}
                sx={{
                    ...(level === 0 && { border: `1px solid ${theme.palette.gray.gray2}`, marginBottom: 2 }),
                    ...(level === 1 && { border: `1px solid ${theme.palette.gray.gray2}`, padding: '16px 4px' }),
                }}
            >
                <Box
                    className="category__header py-3.5 px-4 flex justify-between"
                    sx={{
                        background: isParent
                            ? theme.palette.primary.light
                            : isSubCategory
                                ? theme.palette.success.light
                                : 'transparent'
                    }}
                >
                    <div className="header__left flex gap-3 items-center">
                        {cat.sub_category && cat.sub_category.length > 0 && (
                            <>
                                <ExpandMore />
                                <ExpandLess />
                            </>
                        )}
                        <CheckBox />
                        <Typography>{cat.name}</Typography>
                        {cat.sub_category && cat.sub_category.length > 0 && (
                            <Typography variant="caption">({cat.sub_category.length})</Typography>
                        )}
                    </div>
                    <div className="action__group flex justify-end gap-3">
                        <IconButton onClick={() => handleCategoryEdit(cat)}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.05 3.00002L4.20829 10.2417C3.94996 10.5167 3.69996 11.0584 3.64996 11.4334L3.34162 14.1333C3.23329 15.1083 3.93329 15.775 4.89996 15.6084L7.58329 15.15C7.95829 15.0834 8.48329 14.8084 8.74162 14.525L15.5833 7.28335C16.7666 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2333 1.75002 11.05 3.00002Z" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.9082 4.20837C10.2665 6.50837 12.1332 8.26671 14.4499 8.50004" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.5 18.3334H17.5" stroke="#9CA3B0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </IconButton>
                        <IconButton>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.0835 4.14163L7.26683 3.04996C7.40016 2.25829 7.50016 1.66663 8.9085 1.66663H11.0918C12.5002 1.66663 12.6085 2.29163 12.7335 3.05829L12.9168 4.14163" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15.7082 7.6167L15.1665 16.0084C15.0748 17.3167 14.9998 18.3334 12.6748 18.3334H7.32484C4.99984 18.3334 4.92484 17.3167 4.83317 16.0084L4.2915 7.6167" stroke="#9CA3B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.6084 13.75H11.3834" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.9165 10.4166H12.0832" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </IconButton>
                    </div>
                </Box>

                {/* Render subcategories recursively */}
                {cat.sub_category && cat.sub_category.length > 0 && (
                    <Box className={level === 0 ? "px-1 py-4" : ""}>
                        {cat.sub_category.map((subCat) => renderCategory(subCat, level + 1))}
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
                        icon: (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.67 2H16.77C14.59 2 13.44 3.15 13.44 5.33V7.23C13.44 9.41 14.59 10.56 16.77 10.56H18.67C20.85 10.56 22 9.41 22 7.23V5.33C22 3.15 20.85 2 18.67 2Z" fill="#6B7280" />
                                <path d="M7.24 13.4302H5.34C3.15 13.4302 2 14.5802 2 16.7602V18.6602C2 20.8502 3.15 22.0002 5.33 22.0002H7.23C9.41 22.0002 10.56 20.8502 10.56 18.6702V16.7702C10.57 14.5802 9.42 13.4302 7.24 13.4302Z" fill="#6B7280" />
                                <path d="M6.29 10.58C8.6593 10.58 10.58 8.6593 10.58 6.29C10.58 3.9207 8.6593 2 6.29 2C3.9207 2 2 3.9207 2 6.29C2 8.6593 3.9207 10.58 6.29 10.58Z" fill="#848484" />
                                <path d="M17.71 21.9999C20.0793 21.9999 22 20.0792 22 17.7099C22 15.3406 20.0793 13.4199 17.71 13.4199C15.3407 13.4199 13.42 15.3406 13.42 17.7099C13.42 20.0792 15.3407 21.9999 17.71 21.9999Z" fill="#848484" />
                            </svg>
                        ),
                        url: PATH.CATEGORY_LEVEL_MANAGEMENT.ROOT
                    },
                    {
                        title: "Category",
                    },
                ]}
            />

            <div className="category__wrapper flex flex-col gap-8.5 md:grid md:grid-cols-12">
                <div className="md:col-span-3 lg:col-span-4">
                    <CategoryManagementForm
                        category={category}
                        data={data?.data?.data || []}
                        onReset={handleResetForm}
                    />
                </div>
                <div className="md:col-span-9 lg:col-span-8">
                    <TableFilter
                        search=""
                        setSearch={(value) => console.log("Set search to:", value)}
                        selectedRows={new Set<string | number>()}
                        handleRoleDelete={(ids) => console.log("Deleting rows:", ids)}
                        categoryLayout={true}
                        title={t("menus.category_level_management.category.root")}
                    />
                    {!isLoading && !data?.data?.data.length ? (
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
                </div>
            </div>
        </div>
    );
}