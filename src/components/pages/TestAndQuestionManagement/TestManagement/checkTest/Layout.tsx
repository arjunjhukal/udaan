import { useParams } from "react-router-dom";
import CheckTestPaperRoot from ".";
import { useGetSingleStudentResultQuery, useGetTestByIdQuery } from "../../../../../services/questionApi";
import FeedbackForm from "./FeedbackForm";

export default function QuestionAnswerLisitingLayout() {
    const { id, resultId } = useParams();
    const { data } = useGetSingleStudentResultQuery({ id: Number(id), resultId: Number(resultId) }, { skip: !id || !resultId });
    const { data: test } = useGetTestByIdQuery({ id: Number(id) }, { skip: !id });
    return (
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 lg:gap-6">
            <div className="cols-span-7 lg:col-span-8">
                <CheckTestPaperRoot type={data?.data?.test_type} />
            </div>
            <div className="col-span-5 lg:col-span-4 sticky top-0 self-start">
                <aside className="feedback__form">
                    <FeedbackForm data={data?.data || null} test={test?.data || null} testId={id} resultId={resultId}/>
                </aside>
            </div>
        </div>
    )
}
