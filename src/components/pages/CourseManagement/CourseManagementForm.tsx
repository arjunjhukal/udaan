import { Box, Divider, InputLabel, OutlinedInput, Typography } from "@mui/material";
import TextEditor from "../../atoms/TextEditor";
import FileDragDrop from "../../molecules/FileDragDrop";
import CategoryFilter from "../../organism/CategoryFilter";
import CourseType from "./createCourse/CourseType";

export default function CourseManagementForm() {
    return (
        <div className="course__management__form__root">
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6 mb-6">
                <FileDragDrop onFileChange={() => { }} label="Image" />
                <div className="col-span-1">
                    <div className="input__field mb-6">
                        <InputLabel className="required">Course Name</InputLabel>
                        <OutlinedInput
                            fullWidth
                        />
                    </div>
                    <div className="input__field">
                        <InputLabel className="required">Duration</InputLabel>
                        <div className="flex items-center gap-5">
                            <div className="hours__wrapper flex items-center gap-2">
                                <OutlinedInput
                                    fullWidth
                                />
                                <Typography variant="body2" color="text.middle">Hrs</Typography>
                            </div>
                            <Box color={"gray.gray3"}>:</Box>

                            <div className="minutes__wrapper flex items-center gap-2">
                                <OutlinedInput
                                    fullWidth
                                />
                                <Typography variant="body2" color="text.middle">Mins</Typography>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                <TextEditor />
                <CategoryFilter />
            </div>
            <Divider sx={{ marginTop: "36px", marginBottom: "36px" }} />
            <CourseType />
        </div >
    )
}
