// hooks/useCourseFilter.ts
import { useCallback, useEffect, useState } from 'react';
import { useGetAllCategoryRelatedToMegaCategoryQuery, useGetAllMegaCategoryQuery, useGetAllSubCategoryRelatedToCategoryQuery } from '../services/categoryApi';
import { useGetAllPositionQuery } from '../services/positionApi';
import { useGetAllRolesQuery } from '../services/roleAndPermissionApi';
import { useGetAllUserQuery } from '../services/userApi';
import type { CategoryFilterParams } from '../types';
import type { SelectionType } from '../types/course';

const STORAGE_KEY = 'course_filter_selections';

const getInitialSelections = (): SelectionType => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                mega_category: Array.isArray(parsed.mega_category) ? parsed.mega_category : [],
                category: typeof parsed.category === 'object' && parsed.category !== null ? parsed.category : {},
                sub_category: typeof parsed.sub_category === 'object' && parsed.sub_category !== null ? parsed.sub_category : {},
                position_ids: Array.isArray(parsed.position_ids) ? parsed.position_ids : [],
                teacher_ids: Array.isArray(parsed.teacher_ids) ? parsed.teacher_ids : [],
                role_ids: Array.isArray(parsed.role_ids) ? parsed.role_ids : []
            };
        }
    } catch (error) {
        console.error('Error loading filter selections:', error);
    }

    return {
        mega_category: [],
        category: {},
        sub_category: {},
        position_ids: [],
        teacher_ids: [],
        role_ids: []
    };
};

export const useCourseFilter = () => {
    // Draft state (changes as user selects in dialog)
    const [selections, setSelections] = useState<SelectionType>(getInitialSelections);

    const [appliedSelections, setAppliedSelections] = useState<SelectionType>(getInitialSelections);

    const [searchTeacher, setSearchTeacher] = useState("");
    const [courseTypes, setCourseTypes] = useState<string[]>([]);
    const [appliedCourseTypes, setAppliedCourseTypes] = useState<string[]>([]);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);

    const { data: megaCategories, isLoading: loadingMegaCategory } = useGetAllMegaCategoryQuery();
    const { data: roles } = useGetAllRolesQuery({ pageIndex: 1, pageSize: 10, });

    const { data: teachers } = useGetAllUserQuery({
        pageIndex: 1,
        pageSize: 20,
        search: searchTeacher,
        role: 4
    });

    const { data: categories } = useGetAllCategoryRelatedToMegaCategoryQuery(
        {
            currentCategory: selections.mega_category.join(","),
        },
        {
            skip: selections.mega_category.length === 0,
        }
    );

    const flattenedCategories = Object.keys(selections.category).length > 0
        ? Object.values(selections.category).flat().join(",")
        : "";

    const { data: subCategories } = useGetAllSubCategoryRelatedToCategoryQuery(
        {
            currentCategory: flattenedCategories,
        },
        {
            skip: flattenedCategories.length === 0,
        }
    );

    const { data: positions } = useGetAllPositionQuery({
        pageIndex: 1,
        pageSize: 20,
        search: ""
    });

    const handleCategoryChange = useCallback((
        type: "mega" | "category" | "sub" | "position" | "teacher" | "role",
        ids: number[],
        parentId?: number
    ) => {
        setSelections(prev => {
            const newSelections = { ...prev };

            switch (type) {
                case "mega":
                    newSelections.mega_category = ids;
                    newSelections.category = {};
                    newSelections.sub_category = {};
                    break;

                case "category":
                    if (parentId !== undefined) {
                        newSelections.category = {
                            ...prev.category,
                            [parentId]: ids
                        };
                        newSelections.sub_category = {};
                    }
                    break;

                case "sub":
                    if (parentId !== undefined) {
                        newSelections.sub_category = {
                            ...prev.sub_category,
                            [parentId]: ids
                        };
                    }
                    break;

                case "position":
                    newSelections.position_ids = ids;
                    break;

                case "teacher":
                    newSelections.teacher_ids = ids;
                    break;

                case "role":
                    newSelections.role_ids = ids;
                    break;
            }

            return newSelections;
        });
    }, []);

    const handleApplyFilter = useCallback((selectedCourseTypes: string[]) => {
        // Apply the draft selections to the actual applied state
        setAppliedSelections(selections);
        setAppliedCourseTypes(selectedCourseTypes);
        setCourseTypes(selectedCourseTypes);

        // Save to localStorage
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
        } catch (error) {
            console.error('Error saving filter selections:', error);
        }
    }, [selections]);

    const resetFilters = useCallback(() => {
        const emptySelections: SelectionType = {
            mega_category: [],
            category: {},
            sub_category: {},
            position_ids: [],
            teacher_ids: [],
            role_ids: []
        };
        setSelections(emptySelections);
        setAppliedSelections(emptySelections);
        setCourseTypes([]);
        setAppliedCourseTypes([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    useEffect(() => {
        resetFilters()
    }, [])

    const hasActiveFilters = useCallback(() => {
        return (
            appliedSelections.mega_category.length > 0 ||
            Object.keys(appliedSelections.category).length > 0 ||
            Object.keys(appliedSelections.sub_category).length > 0 ||
            appliedSelections.position_ids.length > 0 ||
            appliedSelections?.teacher_ids && appliedSelections.teacher_ids.length > 0 ||
            appliedSelections?.role_ids && appliedSelections.role_ids.length > 0 ||
            appliedCourseTypes.length > 0
        );
    }, [appliedSelections, appliedCourseTypes]);

    // Build category filter params for API - NOW READS FROM APPLIED SELECTIONS
    const getCategoryFilterParams = useCallback((): CategoryFilterParams => {
        const params: any = {};

        // mega category
        if (appliedSelections.mega_category?.length > 0) {
            params.mega_category = appliedSelections.mega_category;
        }

        // category (flat)
        const flatCategories = Object.values(appliedSelections.category || {}).flat();
        if (flatCategories.length > 0) {
            params.category = flatCategories;
        }

        // sub category (flat)
        const flatSubCategories = Object.values(appliedSelections.sub_category || {}).flat();
        if (flatSubCategories.length > 0) {
            params.sub_category = flatSubCategories;
        }

        // positions (flat)
        const flatPositions = Object.values(appliedSelections.position_ids || {}).flat();
        if (flatPositions.length > 0) {
            params.positions = flatPositions;
        }

        // teachers (array flat)
        if (appliedSelections?.teacher_ids && appliedSelections?.teacher_ids?.length > 0) {
            params.teachers = appliedSelections.teacher_ids;
        }

        if (appliedSelections.role_ids && appliedSelections.role_ids.length > 0) {
            params.roles = appliedSelections.role_ids;
        }

        // course types (array flat)
        if (appliedCourseTypes?.length > 0) {
            params.payment = appliedCourseTypes;
        }

        return params;
    }, [appliedSelections, appliedCourseTypes]);

    const getSelectedCategoryFilterParams = useCallback((): CategoryFilterParams => {
        const params: any = {};

        // mega category
        if (selections.mega_category?.length > 0) {
            params.mega_category = selections.mega_category;
        }

        // category (flat)
        const flatCategories = Object.values(selections.category || {}).flat();
        if (flatCategories.length > 0) {
            params.category = flatCategories;
        }

        // sub category (flat)
        const flatSubCategories = Object.values(selections.sub_category || {}).flat();
        if (flatSubCategories.length > 0) {
            params.sub_category = flatSubCategories;
        }

        // positions (flat)
        const flatPositions = Object.values(selections.position_ids || {}).flat();
        if (flatPositions.length > 0) {
            params.positions = flatPositions;
        }

        // teachers (array flat)
        if (selections?.teacher_ids && selections?.teacher_ids?.length > 0) {
            params.teachers = selections.teacher_ids;
        }

        if (selections.role_ids && selections.role_ids.length > 0) {
            params.roles = selections.role_ids;
        }

        // course types (array flat)
        if (courseTypes?.length > 0) {
            params.payment = courseTypes;
        }

        return params;
    }, [selections, courseTypes]);




    return {
        // State (draft - for dialog)
        selections,
        searchTeacher,
        setSearchTeacher,
        filterDialogOpen,
        setFilterDialogOpen,
        courseTypes,

        // Data
        megaCategories: megaCategories?.data || [],
        categories: categories?.data || [],
        subCategories: subCategories?.data || [],
        positions: positions?.data?.data || [],
        teachers: teachers?.data?.data || [],
        roles: roles?.data?.data || [],
        loadingMegaCategory,

        // Methods
        handleCategoryChange,
        handleApplyFilter,
        resetFilters,
        hasActiveFilters: hasActiveFilters(),
        getCategoryFilterParams,
        getSelectedCategoryFilterParams
    };
};