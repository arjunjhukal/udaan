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
}

export default function TabController<T extends string>({
    setActiveTab,
    currentActive,
    options
}: TabControllerProps<T>) {
    const theme = useTheme();
    const navigate = useNavigate();
    const tabOptions = options || [];

    return (
        <List
            sx={{
                background: theme.palette.tab.background
            }}
            className='p-1! rounded-md max-w-fit flex items-center mb-6!'
        >
            {tabOptions.map((tab) => (
                <ListItem
                    className={currentActive === tab.value ? 'active__tab__controller' : ""}
                    key={tab.value}
                    onClick={() => tab.redirect_url ? navigate(tab.redirect_url) : setActiveTab(tab.value)}
                >
                    <Typography
                        variant='subtitle2'
                        color='text.middle'
                        className='px-6 py-2.5 rounded-md cursor-pointer text-nowrap'
                    >
                        {tab.label}
                    </Typography>
                </ListItem>
            ))}
        </List>
    );
}