import { List, ListItem, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface TabOption<T> {
    label: string;
    value: T;
    redirect_url?: string;
}

interface TabControllerProps<T> {
    options?: TabOption<T>[];
    setActiveTab: (value: T) => void;
    currentActive: T;
    size?: "sm" | "md";
}

export default function TabController<T extends string>({
    setActiveTab,
    currentActive,
    options,
    size = "md"
}: TabControllerProps<T>) {
    const theme = useTheme();
    const navigate = useNavigate();
    const tabOptions = options || [];

    return (
        <List
            sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                overflowX: "auto",
            }}
            className={`p-0! flex-none flex items-end gap-0 ${size === "sm" ? "mb-3!" : "mb-6!"}`}
        >
            {tabOptions.map((tab) => (
                <ListItem
                    className={`cursor-pointer shrink-0 ${currentActive === tab.value ? 'active__tab__controller' : ""}`}
                    key={tab.value}
                    sx={{ width: "auto", px: 0, pb: "1px" }}
                    onClick={() => tab.redirect_url ? navigate(tab.redirect_url) : setActiveTab(tab.value)}
                >
                    <Typography
                        variant='subtitle2'
                        color='text.secondary'
                        className={`text-nowrap ${size === "sm" ? "px-2.5 py-1" : "px-3 py-2"}`}
                        fontWeight={"400"}
                    >
                        {tab.label}
                    </Typography>
                </ListItem>
            ))}
        </List>
    );
}
