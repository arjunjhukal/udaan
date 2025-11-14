import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Button, Divider, Typography, useTheme } from '@mui/material';
import Actions from '../../molecules/Action';
export default function CourseCard() {
    const theme = useTheme();
    return (
        <Box className="course__card rounded-md"
            sx={{
                border: `1px solid ${theme.palette.seperator.dark}`
            }}
        >
            <div className="course_card_image aspect-347/128 relative">
                <img src="/logo.svg" alt="Course" className="w-full h-full object-contain" />
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
                }}>Loksewa</Typography>
                <Typography variant="h6" className="">Loksewa Preparation</Typography>
                <div className="flex gap-3">
                    <Typography variant="subtitle2"><AccessTimeIcon />8 hours and 5 Mins</Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="subtitle2" >24 lessons</Typography>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <div className="flex gap-1 items-center">
                            <Typography variant="h4">Rs.500</Typography>
                            <Typography variant="subtitle1" color='error'><del>Rs.1,500</del></Typography>
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
