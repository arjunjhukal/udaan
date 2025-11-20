import {
    Autocomplete,
    Checkbox,
    Divider,
    FormControlLabel,
    InputLabel,
    OutlinedInput,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import MakuraDatePicker from "../../../atoms/MakuraDatePicker";
import TextEditor from "../../../atoms/TextEditor";
import FooterAction from "../../../molecules/FooterAction";

export default function LiveClassManagementForm() {

    // State
    const [recurring, setRecurring] = useState(false);
    const [interval, setInterval] = useState("");
    const [recording, setRecording] = useState("");
    const [zoomAccount, setZoomAccount] = useState("");
    const [registrationType, setRegistrationType] = useState("");
    const [linkedCourse, setLinkedCourse] = useState("");

    // Dummy Options
    const zoomOptions = ["Zoom Account 1", "Zoom Account 2", "Zoom Account 3"];
    const intervalOptions = ["Daily", "Weekly", "Monthly"];
    const registrationOptions = ["Free", "Paid", "Pre-Approval"];
    const coursesOptions = ["React Course", "Node Course", "Python Course"];
    const weekOptions = ["1st Week", "2nd Week", "3rd Week", "4th Week"];
    const daysOptions = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const recordingOptions = ["Local", "Cloud", "None"];

    return (
        <form>
            <Typography variant="body1" className="mb-4! font-medium!">
                Basic Information
            </Typography>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
                {/* CLASS NAME */}
                <div className="col-span-1">
                    <InputLabel>Name of the class</InputLabel>
                    <OutlinedInput fullWidth name="name" placeholder="Enter the name of the class" />
                </div>

                {/* ZOOM ACCOUNT */}
                <div className="col-span-1">
                    <InputLabel>Zoom Account</InputLabel>
                    <Autocomplete
                        options={zoomOptions}
                        value={zoomAccount}
                        onChange={(e, v) => setZoomAccount(v || "")}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Select Zoom Account" />
                        )}
                    />
                </div>

                {/* AGENDA */}
                <div className="col-span-1">
                    <TextEditor label="Agenda" />
                </div>

                {/* DESCRIPTION */}
                <div className="col-span-1">
                    <TextEditor label="Description" />
                </div>
            </div>

            <Divider className="my-6!" />

            {/* SCHEDULE & DURATION */}
            <Typography variant="body1" className="mb-4! font-medium!">
                Schedule & Duration
            </Typography>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
                {/* Start Day & Time */}
                <div className="col-span-1">
                    <InputLabel>Start Day & Time</InputLabel>
                    <MakuraDatePicker />
                </div>

                {/* Duration */}
                <div className="col-span-1">
                    <InputLabel>Duration</InputLabel>
                    <OutlinedInput fullWidth name="duration" placeholder="Select Duration" />
                </div>

                {/* RECURRING SWITCH */}
                <div className="col-span-2">
                    <div className="flex items-center gap-4">
                        <Typography variant="subtitle1" color="text.middle">
                            Do you want to make this live class recurring?
                        </Typography>
                        <Switch checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
                    </div>
                </div>

                {/* Show only if recurring = true */}
                {recurring && (
                    <>
                        {/* Time Interval */}
                        <div className="col-span-1">
                            <InputLabel>Time Interval</InputLabel>
                            <Autocomplete
                                options={intervalOptions}
                                value={interval}
                                onChange={(e, v) => setInterval(v || "")}
                                renderInput={(p) => <TextField {...p} placeholder="Select Interval" />}
                            />
                        </div>

                        {/* Conditional Fields Based on Interval */}
                        <div className="col-span-1">
                            <div className="flex gap-6">

                                {/* DAILY → only End Date */}
                                {interval === "Daily" && (
                                    <div className="input_field w-full">
                                        <InputLabel>End Date</InputLabel>
                                        <MakuraDatePicker />
                                    </div>
                                )}

                                {/* WEEKLY → Day + End Date */}
                                {interval === "Weekly" && (
                                    <>
                                        <div className="input_field w-full">
                                            <InputLabel>Day</InputLabel>
                                            <Autocomplete
                                                options={daysOptions}
                                                renderInput={(p) => <TextField {...p} placeholder="Select Day" fullWidth />}
                                            />
                                        </div>

                                        <div className="input_field w-full">
                                            <InputLabel>End Date</InputLabel>
                                            <MakuraDatePicker />
                                        </div>
                                    </>
                                )}

                                {/* MONTHLY → Week + Day + End Date */}
                                {interval === "Monthly" && (
                                    <>
                                        <div className="input_field w-full">
                                            <InputLabel>Week</InputLabel>
                                            <Autocomplete
                                                options={weekOptions}
                                                renderInput={(p) => <TextField {...p} placeholder="Week" fullWidth />}
                                            />
                                        </div>

                                        <div className="input_field">
                                            <InputLabel>Day</InputLabel>
                                            <Autocomplete
                                                options={daysOptions}
                                                renderInput={(p) => <TextField {...p} placeholder="Day" fullWidth />}
                                            />
                                        </div>

                                        <div className="input_field">
                                            <InputLabel>End Date</InputLabel>
                                            <MakuraDatePicker />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Registration Type */}
                        <div className="col-span-1">
                            <InputLabel>Registration Type</InputLabel>
                            <Autocomplete
                                options={registrationOptions}
                                value={registrationType}
                                onChange={(e, v) => setRegistrationType(v || "")}
                                renderInput={(p) => <TextField {...p} placeholder="Select Registration Type" fullWidth />}
                            />
                        </div>
                    </>
                )}
            </div>

            <Divider className="my-6!" />

            {/* Assignments */}
            <Typography variant="body1" className="mb-4! font-medium!">
                Assignments
            </Typography>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
                <div className="col-span-1">{/* Category Filter If Needed */}</div>

                <div className="col-span-1">
                    <InputLabel>Link Courses</InputLabel>
                    <Autocomplete
                        options={coursesOptions}
                        value={linkedCourse}
                        onChange={(e, v) => setLinkedCourse(v || "")}
                        renderInput={(p) => <TextField {...p} placeholder="Select Course" />}
                    />
                </div>
            </div>

            <Divider className="my-6!" />

            {/* Settings */}
            <Typography variant="body1" className="mb-4! font-medium!">
                Live Class Setting
            </Typography>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
                {/* Max Attendee */}
                <div className="col-span-1">
                    <InputLabel>Max Attendee</InputLabel>
                    <OutlinedInput fullWidth placeholder="Enter max attendees" />
                </div>

                {/* Auto Recording */}
                <div className="col-span-1">
                    <InputLabel>Auto Recording</InputLabel>
                    <Autocomplete
                        options={recordingOptions}
                        value={recording}
                        onChange={(e, v) => setRecording(v || "")}
                        renderInput={(p) => <TextField {...p} placeholder="Select Recording Option" />}
                    />
                </div>

                {/* Interactive Features */}
                <div className="col-span-2">
                    <InputLabel>Interactive Features</InputLabel>

                    <div className="flex justify-start items-center gap-6 lg:gap-12">
                        <FormControlLabel control={<Checkbox color="primary" />} label="Enable Q/A" />
                        <FormControlLabel control={<Checkbox color="primary" />} label="Enable Chat" />
                        <FormControlLabel control={<Checkbox color="primary" />} label="Registration Required" />
                    </div>
                </div>
            </div>
            <FooterAction
                handleComfirmationChange={() => { }}
                buttonLabel="Live Class"
            />
        </form>
    );
}
