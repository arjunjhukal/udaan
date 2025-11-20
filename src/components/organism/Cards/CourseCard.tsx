import { Box, Button, Divider, Typography, useTheme } from '@mui/material';
import type { CourseProps } from '../../../types/course';
import Actions from '../../molecules/Action';
export default function CourseCard({ course }: { course: CourseProps }) {
    const theme = useTheme();
    return (
        <Box className="course__card rounded-md"
            sx={{
                border: `1px solid ${theme.palette.seperator.dark}`
            }}
        >
            <div className="course_card_image aspect-347/128 relative">
                <img src={course.thumbnail_url || "/logo.svg"} alt="Course" className="w-full h-full object-contain" />
                <div className="absolute! top-2.5 right-2.5">
                    <Actions
                        onEdit={() => { }}
                        onDelete={() => { }}
                        onView={() => { }}
                    />
                </div>

            </div>
            <Box className="course_card_content p-3 flex flex-col gap-3" sx={{
                background: theme.palette.text.lightest
            }}>
                <Typography variant="caption" className="px-2.5 py-1 rounded-md max-w-fit" sx={{
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.main
                }}>{course.course_type}</Typography>
                <Typography variant="h6" className="">{course.name}</Typography>
                <div className="flex gap-3">
                    <Typography variant="subtitle2" className='items-center flex gap-1!'><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8333 6.99984C12.8333 10.2198 10.22 12.8332 6.99996 12.8332C3.77996 12.8332 1.16663 10.2198 1.16663 6.99984C1.16663 3.77984 3.77996 1.1665 6.99996 1.1665C10.22 1.1665 12.8333 3.77984 12.8333 6.99984Z" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9.16418 8.85503L7.35585 7.77586C7.04085 7.58919 6.78418 7.14003 6.78418 6.77253V4.38086" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                        {course?.duration?.hours} hours and {course?.duration?.minutes} Mins</Typography>

                    {course?.subjects ?
                        <>
                            <Divider orientation="vertical" flexItem />
                            <Typography variant="subtitle2" className='items-center flex gap-1!'><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.8333 9.76515V2.72432C12.8333 2.02432 12.2616 1.50515 11.5675 1.56348H11.5325C10.3075 1.66848 8.44663 2.29265 7.40829 2.94598L7.30913 3.01015C7.13996 3.11515 6.85996 3.11515 6.69079 3.01015L6.54496 2.92265C5.50663 2.27515 3.65163 1.65682 2.42663 1.55765C1.73246 1.49932 1.16663 2.02432 1.16663 2.71848L1.16663 9.76515C1.16663 10.3252 1.62163 10.8502 2.18163 10.9202L2.35079 10.9435C3.61663 11.1127 5.57079 11.7543 6.69079 12.3668L6.71413 12.3785C6.87163 12.466 7.12246 12.466 7.27413 12.3785C8.39413 11.7602 10.3541 11.1127 11.6258 10.9435L11.8183 10.9202C12.3783 10.8502 12.8333 10.3252 12.8333 9.76515Z" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M7 3.20264L7 11.9526" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M4.52087 4.95264H3.20837" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M4.95837 6.70264H3.20837" stroke="#111827" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                                {course?.subjects} Subjects</Typography>
                        </>
                        : ""}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <div className="flex gap-1 items-center">
                            <Typography variant="subtitle1" ><del>Rs.{course?.marked_price}</del></Typography>
                            <Typography variant="h4">Rs.{course?.sale_price}</Typography>
                        </div>
                    </div>
                    <div className="col-span-1 text-right">
                        <Button variant="contained" className="py-1.5! px-3!">View More</Button>
                    </div>
                </div>
            </Box>
        </Box>
    )
}
