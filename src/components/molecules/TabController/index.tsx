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
                background: theme.palette.tab.background
            }}
            className={`p-1! rounded-md max-w-fit flex items-center ${size === "sm" ? "mb-3!" : "mb-6!"}`}
        >
            {tabOptions.map((tab) => (
                <ListItem
                    className={` cursor-pointer ${currentActive === tab.value ? 'active__tab__controller' : ""}`}
                    key={tab.value}
                    onClick={() => tab.redirect_url ? navigate(tab.redirect_url) : setActiveTab(tab.value)}
                >
                    <Typography
                        variant='subtitle2'
                        color='text.middle'
                        className={`rounded-sm text-nowrap ${size === "sm" ? "px-2.5 py-1" : "px-3 py-2"}`}
                    >
                        {tab.label}
                    </Typography>
                </ListItem>
            ))}
        </List>
    );
}