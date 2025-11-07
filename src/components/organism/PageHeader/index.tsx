import { Add } from "@mui/icons-material";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";

export default function PageHeader() {
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <Box className="page__header lg:grid lg:grid-cols-12  pb-4 mb-8" sx={{
            borderBottom: `1px solid ${theme.palette.seperator.dark}`
        }}>
            <div className="header__content lg:col-span-9">
                <Stack sx={{ gap: "8px" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.19C2 19 3.29 20.93 5.56 21.66C6.22 21.89 6.98 22 7.81 22H16.19C17.02 22 17.78 21.89 18.44 21.66C20.71 20.93 22 19 22 16.19V7.81C22 4.17 19.83 2 16.19 2ZM20.5 16.19C20.5 18.33 19.66 19.68 17.97 20.24C17 18.33 14.7 16.97 12 16.97C9.3 16.97 7.01 18.32 6.03 20.24H6.02C4.35 19.7 3.5 18.34 3.5 16.2V7.81C3.5 4.99 4.99 3.5 7.81 3.5H16.19C19.01 3.5 20.5 4.99 20.5 7.81V16.19Z" fill="#1D82F5" />
                        <path d="M11.9999 8C10.0199 8 8.41992 9.6 8.41992 11.58C8.41992 13.56 10.0199 15.17 11.9999 15.17C13.9799 15.17 15.5799 13.56 15.5799 11.58C15.5799 9.6 13.9799 8 11.9999 8Z" fill="#1D82F5" />
                    </svg>
                    <Typography variant="h4">
                        Role & Permission Management</Typography>
                </Stack>
                <Typography variant="subtitle1">Create Role and manage them with just one click with creation, update, read and delete with the role you wants to create.</Typography>
            </div>
            <div className="text-end lg:col-span-3">
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => {
                    navigate(PATH.ROLES.CREATE_ROLE.ROOT)
                }}>Create Role & Management</Button>
            </div>
        </Box>
    )
}
