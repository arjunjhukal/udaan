import { Divider, Typography } from '@mui/material'

export default function FreeCourseType() {
    return (
        <div className="free__course__record">
            <Typography variant='h5' className='pb-2! '>Free</Typography>
            <Divider className='mb-8!' />
            <ul className='styled__list flex flex-col gap-2'>
                <li>
                    <Typography variant='subtitle2'>
                        Allow students to access quality learning materials without cost.
                    </Typography>
                </li>
                <li>
                    <Typography variant='subtitle2'>
                        Encourage new users to explore the platform before subscribing.
                    </Typography>
                </li>
                <li>
                    <Typography variant='subtitle2'>
                        Promote lifelong learning with easily accessible educational content.
                    </Typography>
                </li>
                <li>
                    <Typography variant='subtitle2'>
                        Support community learning and inclusivity by removing financial barriers.
                    </Typography>
                </li>

            </ul>
        </div>
    )
}
