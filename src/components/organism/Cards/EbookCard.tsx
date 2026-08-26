import { Box, Divider, Stack, Typography } from "@mui/material";
import { Calendar, DocumentDownload, People } from "iconsax-reactjs";
import { Link } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import type { EbookProps } from "../../../types/ebook";
import { formatDateForDisplay } from "../../../utils/dateFormat";
import { formatNpr, getEbookPricing } from "../../../utils/ebookPricing";
import { getPublishedStatus } from "../../../utils/statusMap";
import StatusPill from "../../atoms/StatusPill";
import Actions from "../../molecules/Action";

interface Props {
    data: EbookProps;
    viewUrl?: string;
    editUrl?: string;
    onDelete?: () => void;
    onStatus?: () => void;
}

export default function EbookCard({ data, viewUrl, editUrl, onDelete, onStatus }: Props) {
    const pricing = getEbookPricing(data);
    const date = formatDateForDisplay(data?.created_at);

    return (
        <Box
            className="px-1.5 pt-1.5 pb-3 rounded-md h-full flex flex-col justify-between"
            sx={{ border: (theme) => `1px solid ${theme.palette.textField.border}` }}
        >
            <div className="top__wrapper">
                <Box
                    className="image__wrapper aspect-316/132 rounded-md overflow-hidden relative flex flex-col justify-center items-center"
                    sx={{ background: (theme) => theme.palette.primary.dark }}
                >
                    {data?.thumbnail_url ? (
                        <img src={data.thumbnail_url} alt={data.title} className="w-full h-full object-cover" />
                    ) : (
                        <Typography variant="h3" color="primary.contrastText" fontWeight={600}>
                            eBook
                        </Typography>
                    )}
                    <div className="absolute top-2 left-2 flex gap-2">
                        <StatusPill
                            variant={data.is_downloadable ? "success" : "warning"}
                            status={data.is_downloadable ? "Downloadable" : "Read only"}
                        />
                        <StatusPill variant={getPublishedStatus(data.status)} status={data.status} />
                    </div>
                    <div className="absolute top-0 right-2">
                        <Actions
                            editUrl={editUrl}
                            viewUrl={viewUrl}
                            onDelete={onDelete}
                            onStatus={onStatus}
                            courseStatus={data.status}
                        />
                    </div>
                </Box>
                <div className="content__box pt-2 px-2">
                    <Link to={PATH.EBOOK.EDIT_EBOOK.ROOT(Number(data.id))}>
                        <Typography
                            variant="body2"
                            className="mb-2! line-clamp-1"
                            fontWeight={600}
                            sx={{ "&:hover": { color: (theme) => theme.palette.primary.dark } }}
                        >
                            {data.title}
                        </Typography>
                    </Link>
                    {pricing.isFree ? (
                        <Typography variant="subtitle2" color="success.main">Free</Typography>
                    ) : (
                        <Stack className="items-center! gap-2!">
                            <Typography variant="subtitle1" fontWeight={600}>{formatNpr(pricing.salePrice)}</Typography>
                            {pricing.hasDiscount && (
                                <Typography variant="subtitle2" color="text.middle" sx={{ textDecoration: "line-through" }}>
                                    {formatNpr(pricing.markedPrice)}
                                </Typography>
                            )}
                        </Stack>
                    )}
                </div>
            </div>
            <div className="bottom px-2">
                <Divider className="my-4!" />
                <Stack className="justify-between">
                    <Stack className="items-center! gap-1!">
                        <Calendar size={16} />
                        <Typography variant="caption" color="text.middle">{date}</Typography>
                    </Stack>
                    <Stack className="items-center! gap-1!">
                        <People size={16} />
                        <Typography variant="caption" color="text.middle">{data?.purchased_count ?? 0}</Typography>
                    </Stack>
                    <Stack className="items-center! gap-1!">
                        <DocumentDownload size={16} />
                        <Typography variant="caption" color="text.middle">{data?.downloads ?? 0}</Typography>
                    </Stack>
                </Stack>
            </div>
        </Box>
    );
}
