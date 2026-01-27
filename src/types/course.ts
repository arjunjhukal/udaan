import type { DeviceType, Status } from ".";
import type { MediaProps } from "./media";
import type { Pagination } from "./roleAndPermission";
import type { GlobalResponse } from "./user";

export interface SelectionType {
    mega_category: number[];
    category: { [megaCategoryId: number]: number[] };
    sub_category: { [categoryId: number]: number[] };
    position_ids: number[];
    teacher_ids?: number[];
    role_ids?: number[];
    course_type?: CourseTypeProps[];
    device?: DeviceType[];
    status?: Status[];
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
    status?: "published" | "draft"
    slug: string | null;
    duration: DurationProps;
    description: string;
    thumbnail: File | null;
    thumbnail_url?: string;
    selections: SelectionType;
    about_this_course: string;
    teachers: number[];
    course_type: CourseTypeProps
    course_expiry: CourseExpiry;
    free_type_description?: string;
    subjects?: number;
    created_at?: string;
    course_subscription?: CourseSubscription[] | null;
    marked_price?: string,
    sale_price?: string,
    enrolled_students?: string;
}

export const initialCourseState: CourseProps = {
    name: "",
    slug: null,
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
    about_this_course: "",
    teachers: [],
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
    note_id: number | null;
    audio_id: number | null;
    parent_id: number | null;
    note?: MediaProps
    audio?: MediaProps
    video?: MediaProps
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
    chapters: ChapterProps[] | null;
}


export type CurriculumProps = SubjectProps;

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
    note_id: null,
    audio_id: null,
    chapters: null,
    parent_id: null,
};
