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
    useTheme,
} from "@mui/material";
import { Global } from "iconsax-reactjs";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "np", label: "Nepali" },
];

export default function LanguageModal() {
    const theme = useTheme();
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement | null>(null);

    const handleToggle = () => setOpen((prev) => !prev);

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current?.contains(event.target as HTMLElement)) return;
        setOpen(false);
    };

    const handleSelect = (code: string) => {
        i18n.changeLanguage(code);
        setOpen(false);
    };

    return (
        <>
            <Box
                ref={anchorRef}
                onClick={handleToggle}
                sx={{
                    background: theme.palette.separator.dark,
                    minWidth: { xs: 34, lg: 40 },
                    height: { xs: 34, lg: 40 },
                    aspectRatio: "1/1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "50%",
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
            >
                <Global size={18} variant="Bold" color={theme.palette.separator.darkest} />
            </Box>

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
                                    {LANGUAGES.map((lang) => {
                                        const isActive = i18n.language === lang.code;
                                        return (
                                            <ListItem key={lang.code} className="menu__item action__item">
                                                <ListItemButton
                                                    sx={{ m: 0, border: "none" }}
                                                    onClick={() => handleSelect(lang.code)}
                                                >
                                                    <ListItemIcon>
                                                        <Global
                                                            size={20}
                                                            color={isActive ? theme.palette.primary.main : "#9CA3B0"}
                                                            variant={isActive ? "Bold" : "Linear"}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText primary={lang.label} />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}
