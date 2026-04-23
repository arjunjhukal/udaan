import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Stack, Toolbar, useTheme } from "@mui/material";
import { Moon, Sun1 } from "iconsax-reactjs";
import { setMode, ThemeMode } from "../../../../slice/themeSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import LanguageModal from "./LanguageModal";
import NotificationBell from "./NotificationBell";
import Profile from "./Profile";
const DRAWER_EXPANDED = 356;
const DRAWER_COLLAPSED = 72;


export default function CustomAppbar({
    handleDrawerToggle,
    collapsed,
}: {
    handleDrawerToggle: () => void;
    collapsed: boolean;
}) {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const mode = useAppSelector((state) => state.theme.mode);
    const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_EXPANDED;
    const handleThemeToggle = () => {
        dispatch(setMode(mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK));
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { lg: `calc(100% - ${drawerWidth}px)` },
                ml: { lg: `${drawerWidth}px` },
                borderBottom: `1px solid ${theme.palette.divider}`,
                borderRadius: 0,
                maxHeight: 64,
                backgroundColor: theme.palette.primary.contrastText,
            }}
            color="default"
            elevation={0}
        >
            <Toolbar sx={{ minHeight: "64px !important", px: { xs: 2, md: 3 } }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { lg: "none" } }}
                >
                    <MenuIcon />
                </IconButton>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    gap={1}
                    sx={{ width: "100%" }}
                >
                    {/* Language */}
                    <LanguageModal />

                    {/* Theme toggle */}
                    <Box
                        onClick={handleThemeToggle}
                        sx={{
                            background: theme.palette.separator?.dark,
                            minWidth: "40px",
                            minHeight: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            borderRadius: "50%",
                            "&:hover": { backgroundColor: theme.palette.action.hover },
                        }}
                    >
                        {mode === ThemeMode.DARK
                            ? <Sun1 size={16} variant="Bold" color={theme.palette.separator.darkest} />
                            : <Moon size={16} variant="Bold" color={theme.palette.separator.darkest} />
                        }
                    </Box>

                    <NotificationBell />

                    <Profile />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
