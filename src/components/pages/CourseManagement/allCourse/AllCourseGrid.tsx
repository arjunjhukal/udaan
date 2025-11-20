import type { CourseProps } from "../../../../types/course";
import CourseCard from "../../../organism/Cards/CourseCard";

export default function AllCourseGrid({ data }: { data: CourseProps[] }) {

    return (
        <div className="course__grid__wrapper">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {data.map((course, index) => (
                    <CourseCard key={index} course={course} />
                ))}
            </div>
        </div>
    )
}
