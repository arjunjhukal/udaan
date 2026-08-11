import type { EnrollmentType } from "../types/transaction";

const MODULE_LABELS: Record<EnrollmentType, string> = {
    course: "Course",
    test: "Test",
    bundle: "Bundle",
    ebook: "eBook",
};

export const getModuleLabel = (type?: EnrollmentType) => (type ? MODULE_LABELS[type] ?? "Course" : "Course");

export const getModuleNameLabel = (type?: EnrollmentType) => `${getModuleLabel(type)} Name`;
