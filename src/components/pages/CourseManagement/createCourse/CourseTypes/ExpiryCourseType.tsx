import { Divider, InputLabel, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React from 'react';
import MakuraDatePicker from '../../../../atoms/MakuraDatePicker';

export default function ExpiryCourseType() {
    const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
    return (
        <div className="course__type__record expire__course__record">
            <Typography variant='h5' className='pb-2! '>Expiry</Typography>
            <Divider className='mb-8!' />

            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div className="col-span-2 lg:col-span-1">
                    <div className="input_field">
                        <InputLabel className="required">Start Date</InputLabel>
                        <MakuraDatePicker
                            required
                            value={startDate}
                            onChange={setStartDate}
                        />
                    </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <div className="input_field">
                        <InputLabel className="required">End Date</InputLabel>
                        <MakuraDatePicker
                            required
                            value={startDate}
                            onChange={setStartDate}
                        />
                    </div>
                </div>
                <div className="col-span-2 ">
                    <div className="input_field">
                        <InputLabel className="required">Price</InputLabel>
                        <OutlinedInput fullWidth />
                    </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <div className="input_field">
                        <InputLabel className="required">Discount</InputLabel>
                        <OutlinedInput fullWidth />
                    </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <div className="input_field">
                        <InputLabel className="required">Discount Type</InputLabel>
                        <Select fullWidth >
                            <MenuItem value="percent"><Typography variant='body1'>Percentage</Typography></MenuItem>
                            <MenuItem value="amount"><Typography variant='body1'>Amount</Typography></MenuItem>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}
