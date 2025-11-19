import type { Pagination } from "./roleAndPermission";
import type { GlobalResponse } from "./user";

export interface SelectionType {
    mega_category: number[];
    category: { [megaCategoryId: number]: number[] };
    sub_category: { [categoryId: number]: number[] };
    position_ids: number[];
}

export type CourseTypeProps = "free" | "expiry" | "subscription"
export type DiscountTypeProps = "percentage" | "amount"
export type BillingCycle = "days" | "months" | "years"
export interface DurationProps {
    hours: number;
    minutes: number;
}
export interface CourseExpiry {
    start_date: string;
    end_date: string;
    price: string;
    discount: number
    discount_type: DiscountTypeProps;
}

export interface CourseSubscription {
    subscription_id: number;
    price: string;
    billing_cycle: BillingCycle
    number: number;
}
export interface CourseProps {
    id?: number;
    name: string;
    slug: string;
    duration: DurationProps;
    description: string;
    thumbnail: File | null;
    thumbnail_url?: string;
    selections: SelectionType;
    about_this_course_np: string;
    teacher: number[];
    course_type: CourseTypeProps
    course_expiry: CourseExpiry;
    free_type_description?: string;
    subjects?: number;
    created_at?: string;
    course_subscription?: CourseSubscription[] | null;
}

export const initialCourseState: CourseProps = {
    name: "",
    slug: "",
    duration: {
        hours: 0,
        minutes: 0,
    },
    description: "",
    thumbnail: null,
    thumbnail_url: "",
    selections: {
        mega_category: [],
        category: {},
        sub_category: {},
        position_ids: [],
    },
    about_this_course_np: "",
    teacher: [],
    course_type: "free",
    course_expiry: {
        start_date: "",
        end_date: "",
        price: "",
        discount: 0,
        discount_type: "percentage",
    },
    free_type_description: "",
    course_subscription: [],
};

export interface CourseList extends GlobalResponse {
    data: {
        data: CourseProps[];
        pagination: Pagination;
    }
}


export type courseTabType = "overview" | "curriculum" | "notes" | "test" | "audios" | "videos"

export const CourseTabs: { label: string; value: courseTabType }[] = [
    {
        label: "Overview",
        value: "overview"
    },
    {
        label: "Curriculum",
        value: "curriculum"
    },
    {
        label: "Notes",
        value: "notes"
    },
    {
        label: "Test",
        value: "test"
    },
    {
        label: "Audios",
        value: "audios"
    },
    {
        label: "Videos",
        value: "videos"
    }
]


export type CurriculumCommonProps = {
    id?: number;
    name: string;
    description: string;
}
export type CurriculumCommonMediaProps = {
    video_url: string;
    note_id: number[];
    audio_id: number[];
}

export interface ChildLessonProps
    extends CurriculumCommonProps, CurriculumCommonMediaProps { }

export interface LessonProps
    extends CurriculumCommonProps, CurriculumCommonMediaProps {
    child_lessons: ChildLessonProps[];
}

export interface UnitProps
    extends CurriculumCommonProps, CurriculumCommonMediaProps {
    lessons: LessonProps[];
}

export interface ChapterProps
    extends CurriculumCommonProps, CurriculumCommonMediaProps {
    units: UnitProps[];
}

export interface SubjectProps
    extends CurriculumCommonProps, CurriculumCommonMediaProps {
    chapters: ChapterProps[];
}


export interface CurriculumProps extends SubjectProps {
}

export interface CurriculumList extends GlobalResponse {
    data: {
        data: CurriculumProps[],
        pagination: Pagination
    }
}
export const initialCurriculumInitialState: CurriculumProps = {
    id: undefined,
    name: "",
    description: "",
    video_url: "",
    note_id: [],
    audio_id: [],
    chapters: []
};
