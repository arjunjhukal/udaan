import { Divider, Typography } from '@mui/material';
import TextEditor from '../../../../atoms/TextEditor';
interface Props {
    error?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: (value: string) => void;
}
export default function FreeCourseType({ value, error, onChange, onBlur }: Props) {
    return (
        <div className="free__course__record">
            <Typography variant='h5' className='pb-2! '>Free</Typography>
            <Divider className='mb-8!' />
            <TextEditor
                error={error}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            />
        </div>
    )
}
