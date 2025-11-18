import { Box, Divider, Typography, useTheme } from '@mui/material';
import ActionIconVisible from '../../molecules/Action/ActionIconVisible';

export default function SubscriptionCard({ item }: { item: any }) {
    const theme = useTheme();

    return (
        <Box className="subscription__card py-5 px-6 rounded-md" sx={{
            background: theme.palette.primary.contrastText
        }}>
            <div className="title__wrapper flex items-center justify-between">
                <div className="title">
                    <Typography variant="body2">{item.name}</Typography>
                    <div className="flex items-center gap-0.5">
                        <Typography variant="body2">NRs. {item.price}</Typography>
                        <Typography variant="subtitle2" color="text.middle">/{item.number} {item.billing_cycle}</Typography>
                    </div>
                </div>
                <ActionIconVisible onDelete={() => { }} onEdit={() => { }} />
            </div>
            <Divider className="my-1.5!" />
            <Box className="subscription__description">
                <p>This is the subsciption which is based on the monthly basis wfor the student to study freely with no pressure and mindful education and which helps student to gain knowledge.</p>
                <ul>
                    <li>Contains Free Course</li>
                    <li>Contains Free Video</li>
                </ul>
            </Box>
        </Box>
    )
}
