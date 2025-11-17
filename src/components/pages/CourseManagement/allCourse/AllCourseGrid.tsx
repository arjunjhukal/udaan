import CourseCard from "../../../organism/Cards/CourseCard";

export default function AllCourseGrid() {

    return (
        <div className="course__grid__wrapper">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                    <CourseCard key={index} />
                ))}
            </div>
        </div>
    )
}
