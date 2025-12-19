import { Box, Skeleton } from '@mui/material';
import type { TestProps } from '../../../../../types/question';
import TestCard from '../../../../organism/Cards/TestCard';
interface Props {
    data: TestProps[];
    loading: boolean;
}
export default function TestGridLayout({ data, loading }: Props) {
    return (
        <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 2xl:gap-6">
            {loading ? (
                [...Array(6)].map((_, idx) => (
                    <div key={idx} className="col-span-1">
                        <div className="flex gap-3 items-center">
                            <Box className="w-full">
                                <Skeleton variant="rectangular" height={120} className="rounded-xl" />
                            </Box>
                        </div>
                    </div>
                ))
            ) :
                (data.map((test) => (
                    <TestCard test={test} key={test.id} />
                )))}
        </div>
    )
}
