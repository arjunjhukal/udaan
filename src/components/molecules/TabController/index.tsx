import { List, ListItem, Typography, useTheme } from '@mui/material';
import { CourseTabs, type courseTabType } from '../../../types/course';

export default function TabController({ setActiveTab, currentActive }: { setActiveTab: (value: courseTabType) => void; currentActive: courseTabType }) {
    const theme = useTheme();

    return (
        <List sx={{
            background: theme.palette.tab.background
        }} className='p-1! rounded-md max-w-fit flex items-center mb-6!'>
            {
                CourseTabs.map((tab) => (
                    <ListItem className={currentActive === tab.value ? 'active__tab__controller' : ""} key={tab.value} onClick={
                        () => setActiveTab(tab.value)
                    }>
                        <Typography variant='subtitle2' color='text.middle' className='px-6 py-2.5 rounded-md cursor-pointer'>{tab.label}</Typography>
                    </ListItem>
                ))
            }
        </List>
    )
}
