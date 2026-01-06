import { Divider } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllMediaIrrespectiveOfTypeQuery } from '../../../../services/mediaApi';
import type { MediaProps } from '../../../../types/media';
import MediaFileDragDrop from '../../../molecules/MediaFileDragDrop';
import TablePagination from '../../../molecules/Table/Pagination';
import MediaCard from '../../../organism/Cards/MediaCard';
import EmptyRoute from '../../../organism/EmptyRoute';
import PageHeader from '../../../organism/PageHeader';
import TableFilter from '../../../organism/TableFilter';

export default function AllMediaRoot() {
    const [search, setSearch] = useState("");
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 20
    });
    const { t } = useTranslation();
    const { data } = useGetAllMediaIrrespectiveOfTypeQuery({ ...qp, search });

    return (
        <div className='pb-4 lg:pb-6'>
            <PageHeader
                breadcrumb={[
                    {
                        title: t("messages.medias")
                    }
                ]}
            />
            <MediaFileDragDrop maxSize={30} type='audios' />
            <Divider className='my-4!' />
            {data?.data?.data.length ?
                <div className="flex flex-col gap-4">
                    <TableFilter
                        search={search}
                        setSearch={setSearch}
                        handleRoleDelete={() => { }}
                        selectedRows={new Set<number | string>([])}
                    />
                    <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 flex-10">
                        {data?.data?.data?.map((item) => (
                            <div className="col-span-1 cursor-pointer" key={item.id}>
                                <MediaCard media={item as MediaProps} />
                            </div>
                        ))}
                    </div>
                    <TablePagination qp={qp} setQp={setQp} totalPages={data?.data?.pagination?.total_pages || 0} />

                </div> :
                <EmptyRoute
                    title={t("messages.empty_states.media_management.action")}
                    message={t("messages.empty_states.media_management.description")}
                />}

        </div>
    )
}
