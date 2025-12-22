import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetSingleQuestionInTestQuery } from '../../../../../services/questionApi';
import DrawingCanvas from './DrawingCanvas';

export default function SingleStudentSingleQuestion() {
    const { id, resultId, questionId } = useParams();
    const { data } = useGetSingleQuestionInTestQuery({ id: Number(id), resultId: Number(resultId), questionId: Number(questionId) }, { skip: !id || !resultId || !questionId });

    return (
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 lg:gap-6">
            <div className="cols-span-7 lg:col-span-8">
                <Typography variant='subtitle1' color='text.dark' className='mb-5!'>{data?.data?.question}</Typography>
                <DrawingCanvas images={data?.data?.media_files} />
            </div>
            <div className="col-span-5 lg:col-span-4 sticky top-0 self-start">
                <aside className="feedback__form">

                </aside>
            </div>
        </div>
    )
}
