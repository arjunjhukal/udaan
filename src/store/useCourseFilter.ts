// hooks/useCourseFilter.ts
import { useCallback, useEffect, useState } from 'react';
import { useGetAllCategoryRelatedToMegaCategoryQuery, useGetAllMegaCategoryQuery, useGetAllSubCategoryRelatedToCategoryQuery } from '../services/categoryApi';
import { useGetAllPositionQuery } from '../services/positionApi';
import { useGetAllUserQuery } from '../services/userApi';
import type { CategoryFilterParams } from '../types';
import type { SelectionType } from '../types/course';

const STORAGE_KEY = 'course_filter_selections';

const getInitialSelections = (): SelectionType => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Ensure all required fields exist with proper defaults
            return {
                mega_category: Array.isArray(parsed.mega_category) ? parsed.mega_category : [],
                category: typeof parsed.category === 'object' && parsed.category !== null ? parsed.category : {},
                sub_category: typeof parsed.sub_category === 'object' && parsed.sub_category !== null ? parsed.sub_category : {},
                position_ids: Array.isArray(parsed.position_ids) ? parsed.position_ids : [],
                teacher_ids: Array.isArray(parsed.teacher_ids) ? parsed.teacher_ids : []
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
        teacher_ids: []
    };
};

export const useCourseFilter = () => {
    const [selections, setSelections] = useState<SelectionType>(getInitialSelections);
    const [searchTeacher, setSearchTeacher] = useState("");
    const [courseTypes, setCourseTypes] = useState<string[]>([]);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);

    const { data: megaCategories, isLoading: loadingMegaCategory } = useGetAllMegaCategoryQuery();

    const { data: teachers } = useGetAllUserQuery({
        pageIndex: 1,
        pageSize: 20,
        search: searchTeacher,
        role: "teacher"
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
        type: "mega" | "category" | "sub" | "position" | "teacher",
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
                        // Reset subcategories when category changes
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
            }

            // Save to localStorage
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newSelections));
            } catch (error) {
                console.error('Error saving filter selections:', error);
            }

            return newSelections;
        });
    }, []);

    const handleApplyFilter = useCallback((selectedCourseTypes: string[]) => {
        setCourseTypes(selectedCourseTypes);
    }, []);

    const resetFilters = useCallback(() => {
        const emptySelections: SelectionType = {
            mega_category: [],
            category: {},
            sub_category: {},
            position_ids: [],
            teacher_ids: []
        };
        setSelections(emptySelections);
        setCourseTypes([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    useEffect(() => {
        resetFilters()
    }, [])

    const hasActiveFilters = useCallback(() => {
        return (
            selections.mega_category.length > 0 ||
            Object.keys(selections.category).length > 0 ||
            Object.keys(selections.sub_category).length > 0 ||
            selections.position_ids.length > 0 ||
            selections?.teacher_ids && selections.teacher_ids.length > 0 ||
            courseTypes.length > 0
        );
    }, [selections, courseTypes]);

    // Build category filter params for API
    const getCategoryFilterParams = useCallback((): CategoryFilterParams => {
        // Start with an empty object (NOT null)
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

        // course types (array flat)
        if (courseTypes?.length > 0) {
            params.payment = courseTypes;
        }

        return params;
    }, [selections, courseTypes]);


    return {
        // State
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
        loadingMegaCategory,

        // Methods
        handleCategoryChange,
        handleApplyFilter,
        resetFilters,
        hasActiveFilters: hasActiveFilters(),
        getCategoryFilterParams
    };
};