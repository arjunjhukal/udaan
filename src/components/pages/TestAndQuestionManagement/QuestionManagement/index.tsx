import { useState } from "react";
import AllQuestionListing from "./allQuestions";

export default function QuestionManagementRoot() {
    const [open, setOpen] = useState(false);
    return (
        <AllQuestionListing open={open} setOpen={setOpen} />
    )
}


