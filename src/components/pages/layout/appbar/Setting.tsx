import ContrastIcon from "@mui/icons-material/Contrast";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import SettingsIcon from "@mui/icons-material/Settings";
import TranslateIcon from "@mui/icons-material/Translate";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import {
    Box,
    ClickAwayListener,
    Grow,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Typography,
    useTheme
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import { setMode, ThemeMode } from "../../../../slice/themeSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";

export default function SettingMenu() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const mode = useAppSelector((state) => state.theme.mode);

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement | null>(null);

    const handleToggle = () => setOpen((prev) => !prev);
    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) return;
        setOpen(false);
    };

    const handleMenuClick = (action: () => void) => {
        action();
        setOpen(false);
    };

    const handleThemeSwitch = () => {
        dispatch(setMode(mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK));
    };

    const handleLanguageSwitch = () => {
        const newLang = i18n.language === "en" ? "np" : "en";
        i18n.changeLanguage(newLang);
    };

    const handleSettingsRedirect = () => navigate(PATH.SETTINGS.APP_SETTINGS.ROOT);

    return (
        <>
            {/* Settings Button */}
            <Box
                ref={anchorRef}
                onClick={() => handleToggle()}
                sx={{
                    background: theme.palette.separator.dark,
                    minWidth: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "50%",
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
            >
                <SettingsIcon />
            </Box>

            {/* Popper */}
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                placement="bottom-end"
                disablePortal
                sx={{ zIndex: 10 }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                        <Paper elevation={3}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <List className="min-w-[180px] p-2!">
                                    {/* Theme Toggle */}
                                    <ListItem className="menu__item action__item">
                                        <ListItemButton
                                            sx={{ m: 0, border: "none" }}
                                            onClick={() => handleMenuClick(handleThemeSwitch)}
                                        >
                                            <ListItemIcon>
                                                {mode === ThemeMode.DARK ? (
                                                    <WbSunnyIcon />
                                                ) : (
                                                    <ContrastIcon />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle2">
                                                        {mode === ThemeMode.DARK
                                                            ? "Light Mode"
                                                            : "Dark Mode"}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>

                                    {/* Language Switch */}
                                    <ListItem className="menu__item action__item">
                                        <ListItemButton
                                            sx={{ m: 0, border: "none" }}
                                            onClick={() => handleMenuClick(handleLanguageSwitch)}
                                        >
                                            <ListItemIcon>
                                                <TranslateIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle2">
                                                        {i18n.language === "en"
                                                            ? "नेपाली (Nepali)"
                                                            : "English"}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>

                                    {/* Settings Redirect */}
                                    <ListItem className="menu__item action__item">
                                        <ListItemButton
                                            sx={{ m: 0, border: "none" }}
                                            onClick={() => handleMenuClick(handleSettingsRedirect)}
                                        >
                                            <ListItemIcon>
                                                <MenuOpenIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle2">
                                                        Settings
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}
