import { Box, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    const theme = useTheme();
    return (
        <Box className="auth__root px-4 xl:px-0" sx={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: theme.palette.primary.light,

        }}>
            <Box sx={{
                background: theme.palette.background.default,
                padding: "56px",
                borderRadius: "24px",
                width: {
                    xs: "100%",
                    xl: "62%"
                }
            }} className='lg:grid lg:grid-cols-2 lg:gap-10 2xl:gap-20'>
                <div className="auth__image__wrapper col-span-1 hidden lg:block">
                    <img src="/logo.svg" alt="" width={132} height={70} className='mb-[104px]' />
                    <img src="/auth-image.png" alt="" width={430} height={302} className='pl-14 pr-[26px]' />
                </div>
                <div className="auth__form__wrapper col-span-1">
                    <Outlet />
                </div>
            </Box>
        </Box>
    )
}
