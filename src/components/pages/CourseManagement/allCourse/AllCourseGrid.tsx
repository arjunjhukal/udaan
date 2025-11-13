import { IconButton, Typography } from "@mui/material";

export default function AllCourseGrid() {
    return (
        <div className="course__grid__wrapper">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                    <div className="course__card" key={index}>
                        <div className="course_card_image aspect-347/128 relative">
                            <img src="/logo.svg" alt="Course" className="img-fluid" />
                            <IconButton className="absolute! top-2.5 right-2.5">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 3.75C10.5 2.925 9.825 2.25 9 2.25C8.175 2.25 7.5 2.925 7.5 3.75C7.5 4.575 8.175 5.25 9 5.25C9.825 5.25 10.5 4.575 10.5 3.75Z" stroke="#9CA3B0" />
                                    <path d="M10.5 14.25C10.5 13.425 9.825 12.75 9 12.75C8.175 12.75 7.5 13.425 7.5 14.25C7.5 15.075 8.175 15.75 9 15.75C9.825 15.75 10.5 15.075 10.5 14.25Z" stroke="#9CA3B0" />
                                    <path d="M10.5 9C10.5 8.175 9.825 7.5 9 7.5C8.175 7.5 7.5 8.175 7.5 9C7.5 9.825 8.175 10.5 9 10.5C9.825 10.5 10.5 9.825 10.5 9Z" stroke="#9CA3B0" />
                                </svg>
                            </IconButton>
                        </div>
                        <div className="course_card_content p-3 flex flex-col gap-3">
                            <Typography variant="caption" className="px-2.5 py-1 rounded-md bg-red-500 text-white " >Loksewa</Typography>
                            <Typography variant="h6" className="">Loksewa Preparation</Typography>
                            <div className="flex">
                                <Typography variant="subtitle2">8 hours and 5 Mins</Typography>
                                <Typography variant="subtitle2" >24 lessons</Typography>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <div className="flex gap-4 items-center">
                                        <Typography variant="body2">Rs.1,500</Typography>
                                        <Typography variant="body2">Rs.500</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>))}
            </div>
        </div>
    )
}
