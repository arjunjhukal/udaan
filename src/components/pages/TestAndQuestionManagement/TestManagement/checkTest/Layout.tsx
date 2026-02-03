import { Download } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import CheckTestPaperRoot from ".";
import { useDownloadResultMutation, useGetSingleStudentResultQuery, useGetTestByIdQuery } from "../../../../../services/questionApi";
import { showToast } from "../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../store/hook";
import FeedbackForm from "./FeedbackForm";

export default function QuestionAnswerLisitingLayout() {
    const dispatch = useAppDispatch();
    const { id, resultId } = useParams();
    const { data } = useGetSingleStudentResultQuery({ id: Number(id), resultId: Number(resultId) }, { skip: !id || !resultId });
    const { data: test } = useGetTestByIdQuery({ id: Number(id) }, { skip: !id });

    const [downloadAnswersheet, { isLoading }] = useDownloadResultMutation();
    const handleDownload = async () => {
        try {
            const blob = await downloadAnswersheet({ testId: Number(id), resultId: Number(resultId) }).unwrap();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = `${data?.data?.student?.name}-${test?.data?.name}-result.pdf`;
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
        }
        catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || "Unable to download test result.",
                    severity: "error"
                })
            )
        }
    }
    return (
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-7 lg:col-span-8">
                <CheckTestPaperRoot type={data?.data?.test_type} />
            </div>
            <div className="col-span-5 lg:col-span-4 sticky top-0 self-start">
                <aside className="feedback__form flex flex-col gap-4">
                    <Button
                        disabled={isLoading}
                        onClick={handleDownload}
                        startIcon={<Download />}
                        color="primary"
                        fullWidth
                        variant="contained">{isLoading ? "Downloading" : "Download"}</Button>
                    <FeedbackForm data={data?.data || null} test={test?.data || null} testId={id} resultId={resultId} />
                </aside>
            </div>
        </div>
    )
}
