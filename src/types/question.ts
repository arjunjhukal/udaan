import dayjs from "dayjs";
import * as Yup from "yup";
import type { Pagination } from "./roleAndPermission";
import type { GlobalResponse, User } from "./user";
export type QuestionTypeProps = "mcq" | "subjective"
export interface OptionProps {
    id: number | null,
    option: string,
    is_correct: boolean
}

export interface QuestionProps {
    id: number | null;
    points: number;
    question: string;
    options: OptionProps[],
    megacategory_id: number | null;
    question_type: QuestionTypeProps
    has_image_in_option: boolean;
    your_answer_id?: number;
    type?: "correct" | "incorrect" | "skipped",
    media_files?: {
        id: number;
        url: string;
    }[];
    mark_obtained?: string,
    checked_by?: string,
    checked_at?: string,
    submitted_at?: string,
    feedback?: string
}

export const QuestionInitialState: QuestionProps = {
    id: null,
    points: 0,
    question: "",
    options: [{ id: null, option: "", is_correct: false }, { id: null, option: "", is_correct: false }],
    megacategory_id: null,
    question_type: "mcq",
    has_image_in_option: false,
};

export interface QuestionList extends GlobalResponse {
    data: {
        data: QuestionProps[];
        pagination: Pagination;
        overview: {
            test_type: TestTypeProps;
        }
    }
}
export type TestTypeProps = "subjective" | "mcq"

export interface TestProps {
    test_type: TestTypeProps;
    id?: number;
    name: string;
    duration: {
        hours: number;
        minutes: number;
    };
    full_mark: number;
    pass_mark: number;
    start_datetime: string | null;
    end_datetime: string | null;
    course_ids: number[];
    question_ids: number[];
    category?: string[];
    questions?: number;
    status?: null;
    no_of_students?: number;
    is_scheduled: boolean;
    total_questions: number | null;
    marks_per_question: number | null;
    created_at?: string;
    has_published?: boolean;
}



export const TestInitialState: TestProps = {
    test_type: "mcq",
    name: "",
    duration: {
        hours: 0,
        minutes: 0
    },
    full_mark: 0,
    pass_mark: 0,
    start_datetime: null,
    end_datetime: null,
    course_ids: [],
    question_ids: [],
    is_scheduled: true,
    total_questions: null,
    marks_per_question: 1,
};
export interface TestList {
    data: {
        data: TestProps[]
        pagination: Pagination
    }
}

export const testValidationSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Name is required"),

    test_type: Yup.string()
        .oneOf(["mcq", "subjective"], "Invalid test type")
        .required("Test type is required"),

    total_questions: Yup.number()
        .min(1, "Total questions must be at least 1")
        .required("Total questions is required"),

    duration: Yup.object()
        .shape({
            hours: Yup.number().min(0).max(999).nullable(),
            minutes: Yup.number().min(0).max(59).nullable()
        })
        .test(
            "duration-required",
            "Either hours or minutes is required",
            function (value) {
                const hours = value?.hours ?? 0;
                const minutes = value?.minutes ?? 0;
                return hours > 0 || minutes > 0;
            }
        )
        .test(
            "duration-minimum",
            "Duration must be at least 1 minute",
            function (value) {
                const hours = value?.hours ?? 0;
                const minutes = value?.minutes ?? 0;
                return hours * 60 + minutes >= 1;
            }
        ),

    full_mark: Yup.number().when("test_type", {
        is: "subjective",
        then: (schema) => schema
            .min(1, "Full marks must be at least 1")
            .required("Full marks is required"),
        otherwise: (schema) => schema.notRequired()
    }),

    marks_per_question: Yup.number().when("test_type", {
        is: "mcq",
        then: (schema) => schema
            .min(1, "Marks per question must be at least 1")
            .required("Marks per question is required"),
        otherwise: (schema) => schema.notRequired()
    }),

    pass_mark: Yup.number()
        .min(0, "Pass marks must be at least 0")
        .required("Pass marks is required"),

    is_scheduled: Yup.boolean().default(false).required(),
    start_datetime: Yup.string().when("is_scheduled", { is: true, then: (schema) => schema.required("Start date & time is required"), otherwise: (schema) => schema.notRequired() }),
    end_datetime: Yup.string().when("is_scheduled", {
        is: true, then: (schema) => schema.required("End date & time is required").test("end-after-start", "End date must be after start date", function (value) {
            const { start_datetime } = this.parent;
            if (!start_datetime || !value) return true;
            return dayjs(value).isAfter(dayjs(start_datetime));
        }), otherwise: (schema) => schema.notRequired()
    }),

    question_ids: Yup.array()
        .of(Yup.number())
        .min(1, "At least one question must be selected")
        .required("Question selection is required")
        .test(
            "question-count",
            "Number of selected questions must equal total questions",
            function (value) {
                const { total_questions } = this.parent;
                if (!value || !total_questions) return true;
                return value.length === total_questions;
            }
        ),
});


export interface TestOverviewProps {
    total_students_enrolled: number;
    total_student_submitted: number;
    total_student_passed: number;
    average_score: number;
    high_score: number;

}
export interface TestOverviewResponse extends GlobalResponse {
    data: {
        total_students_enrolled: number;
        total_student_submitted: number;
        total_student_passed: number;
        average_score: number;
        high_score: number;
    }
}

export type ResultProps = "failed" | "passed";
export type TestStatus = "progress" | "completed";


export interface StudentSubmitTestProps {
    id: number,
    student: User,
    total_attempted: number,
    total_questions: number,
    total_correct: number,
    checked_answers: number,
    started_at: string,
    finished_at: string,
    timer: number,
    status: TestStatus,
    result: ResultProps,
    total_marks: number,
    score: number,
    test_type: TestTypeProps
}

export interface StudentSubmitTestList {
    data: {
        data: StudentSubmitTestProps[];
        pagination: Pagination;
    }
}