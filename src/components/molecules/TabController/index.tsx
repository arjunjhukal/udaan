import { List, ListItem, Typography, useTheme } from '@mui/material';
import { CourseTabs } from '../../../types/course';

interface TabOption<T> {
    label: string;
    value: T;
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

    const tabOptions = options || (CourseTabs as TabOption<T>[]);

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
                    onClick={() => setActiveTab(tab.value)}
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