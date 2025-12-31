import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MediaFileDragDrop from '../../../molecules/MediaFileDragDrop';
import EmptyRoute from '../../../organism/EmptyRoute';
import PageHeader from '../../../organism/PageHeader';

export default function AllMediaRoot() {
    const { t } = useTranslation();
    return (
        <div className='pb-4 lg:pb-6'>
            <PageHeader
                breadcrumb={[
                    {
                        title: t("messages.medias")
                    }
                ]}
            />
            <MediaFileDragDrop maxSize={30} type='notes' />
            <Divider className='my-4!' />
            <div className="flex items-start gap-4">
                <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 flex-10">
                    {Array.from({ length: 20 }).map((_, index) => (
                        <div className="col-span-1 cursor-pointer" key={index}>
                            <img src={"/fallback.png"} alt="" className='max-w-full h-auto' />
                        </div>
                    ))}
                </div>
                <Divider orientation='vertical' className='h-100' />
                {/* <aside className="media__aside flex-2">
                    <Typography variant='h6' className='mb-2!'>Media Details</Typography>
                    <div className="flex flex-col gap-3">
                        <div className="input__field">
                            <InputLabel>Title</InputLabel>
                            <OutlinedInput fullWidth className='py-1!' />
                        </div>
                        <div className="input__field">
                            <InputLabel>Alternate Text</InputLabel>
                            <OutlinedInput fullWidth className='py-1!' />
                        </div>
                        <div className="input__field">
                            <InputLabel>Courses</InputLabel>
                            <OutlinedInput fullWidth className='py-1!' />
                        </div>
                    </div>
                </aside> */}
            </div>
            <EmptyRoute
                title={t("messages.empty_states.media_management.action")}
                message={t("messages.empty_states.media_management.description")}
            />

        </div>
    )
}
