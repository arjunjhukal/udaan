import { Box, Divider, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { Calendar, Eye } from 'iconsax-reactjs';
import { Link } from 'react-router-dom';
import { PATH } from '../../../routes/PATH';
import type { GorkhapatraProps, GorkhapatraTypes } from '../../../types/gorkhapatra';
import { formatDateForDisplay } from '../../../utils/dateFormat';
import { getGorkhapatraStatus } from '../../../utils/statusMap';
import StatusPill from '../../atoms/StatusPill';
import Actions from '../../molecules/Action';

export default function GorkhapatraCard({ data, viewUrl, editUrl, onDelete }: { data: GorkhapatraProps; viewUrl?: string; editUrl?: string; onDelete?: () => void }) {
    const variant = getGorkhapatraStatus(data.type || "descriptive" as GorkhapatraTypes);
    const date = formatDateForDisplay(data?.created_at);
    return (
        <Box className="px-1.5 pt-1.5 pb-3 rounded-md h-full flex flex-col justify-between" sx={{
            border: (theme) => `1px solid ${theme.palette.textField.border}`
        }}>
            <div className="top__wrapper">
                <Box className="image__wrapper aspect-316/132 rounded-md overflow-hidden relative flex flex-col justify-center items-center" sx={{
                    background: (theme) => theme.palette.primary.dark
                }}>
                    {data?.thumbnail_url ? <img src={data?.thumbnail_url} alt={data?.title} className='w-full h-full object-cover' /> : <>

                        <Typography variant='h3' color='primary.contrastText' fontWeight={600}>{t("messages.gorkhapatra")}</Typography>
                        <Typography variant='body2' color='info.main'>{data?.title}</Typography>
                    </>}
                    {data.type ? <div className="absolute top-2 left-2">
                        <StatusPill variant={variant} status={data?.type} />
                    </div> : ""}
                    <div className="absolute top-0 right-2">
                        <Actions
                            editUrl={editUrl}
                            viewUrl={viewUrl}
                            onDelete={onDelete}
                        />
                    </div>
                </Box>
                <div className="content__box pt-2 px-2">
                    <Link to={PATH.GORKHAPATRA.EDIT_GORKHAPATRA.ROOT(Number(data.id))}>
                        <Typography variant='body2' className='mb-2!' fontWeight={600} sx={{
                            "&:hover": {
                                color: (theme) => theme.palette.primary.dark
                            }
                        }}>{data.title}</Typography>
                    </Link>
                    <Typography variant='subtitle2' >{data.title}</Typography>
                </div>
            </div>
            <div className="bottom px-2">
                <Divider className='my-4!' />
                <Stack className='justify-between'>
                    <Stack className='items-center! gap-1!'>
                        <Calendar />
                        <Typography variant='caption' color='text.middle'>{date}</Typography>
                    </Stack>
                    <Stack className='items-center! gap-1!'>
                        <Eye />
                        <Typography variant='caption' color='text.middle'>{data?.views} {t("messages.views")}</Typography>
                    </Stack>
                </Stack>
            </div>
        </Box>
    )
}
