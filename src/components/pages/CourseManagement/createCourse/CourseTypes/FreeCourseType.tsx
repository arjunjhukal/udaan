import { Divider, Typography } from '@mui/material'
import TextEditor from '../../../../atoms/TextEditor'

export default function FreeCourseType() {
    return (
        <div className="free__course__record">
            <Typography variant='h5' className='pb-2! '>Free</Typography>
            <Divider className='mb-8!' />
            <TextEditor />
        </div>
    )
}
 