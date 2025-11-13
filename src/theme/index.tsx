import type { ThemeOptions } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

// Extend the Palette and PaletteOptions interfaces
// Extend the Palette and PaletteOptions interfaces
// Extend the Palette and PaletteOptions interfaces
declare module "@mui/material/styles" {
    interface Palette {
        button: {
            main: string;
            gray: string;
            hover: string;
            light: string;
            lightest: string;
            contrastText: string;
        };
        gray: {
            main: string;
            gray1: string;
            gray2: string;
            gray3: string;
        };
        icon: {
            main: string;
            black: string;
            dark: string;
            light: string;
        };
        seperator: {
            main: string;
            dark: string;
            darker: string;
            darkest: string;
        };
        tab: {
            main: string;
            background: string;
            backgroundHover: string;
            border: string;
            text: string;
            textHover: string;
        };
        textField: {
            main: string;
            border: string;
            error: string;
            placeholder: string;
            name: string;
        };
    }
    interface PaletteOptions {
        button?: {
            main?: string;
            gray?: string;
            hover?: string;
            light?: string;
            lightest?: string;
            contrastText?: string;
        };
        gray?: {
            main?: string;
            gray1?: string;
            gray2?: string;
            gray3?: string;
        };
        icon?: {
            main?: string;
            black?: string;
            dark?: string;
            light?: string;
        };
        seperator?: {
            main?: string;
            dark?: string;
            darker?: string;
            darkest?: string;
        };
        tab?: {
            main?: string;
            background?: string;
            backgroundHover?: string;
            border?: string;
            text?: string;
            textHover?: string;
        };
        textField?: {
            main?: string;
            border?: string;
            error?: string;
            placeholder?: string;
            name?: string;
        };
    }

    interface TypeBackground {
        sidebar: string;
    }
    interface PaletteColor {
        hover?: string;
        black?: string;
        white?: string;
    }
    interface SimplePaletteColorOptions {
        hover?: string;
        light?: string;
        black?: string;
        white?: string;
    }
    // Extend the existing TypeText interface
    interface TypeText {
        main: string;
        dark: string;
        light: string;
        lightest: string;
        middle: string;
    }
}

const lightPalette = {
    primary: {
        main: "#1D82F5",
        hover: "#1755B6",
        light: "#D9F0FF",
        black: "#111827",
        white: "#FFFFFF",
    },
    button: {
        main: "#1D82F5",
        gray: "#6B7280",
        hover: "#1755B6",
        light: "#D9F0FF",
        lightest: "#D9F0FF",
        contrastText: "#FFFFFF",
    },
    error: {
        main: "#E21D48", // Changed from 'default' to 'main'
        hover: "#A1123A",
        light: "#FFF0F1",
        contrastText: "#FFFFFF",
    },
    gray: {
        main: "#3B9AFF",
        gray1: "#E5E7EB",
        gray2: "#FFF0F1 ",
        gray3: "#9CA3B0",
    },
    icon: {
        main: "#3B9AFF",
        black: "#111827",
        dark: "#1D82F5",
        light: "#9CA3B0",
    },
    info: {
        main: "#F59E0B", // Changed from 'default' to 'main'
        hover: "#DB7706",
        light: "#FEF3C8",
        contrastText: "#FFFFFF",
    },
    seperator: {
        main: "#3B9AFF",
        dark: "#E5E7EB",
        darker: "#9CA3B0",
        darkest: "#6B7280",
    },
    success: {
        main: "#059467", // Changed from 'default' to 'main'
        hover: "#066046",
        light: "#EDFDF5",
        contrastText: "#FFFFFF",
    },
    warning: {
        main: "#F97415", // Changed from 'default' to 'main'
        hover: "#E9590C",
        light: "#FFF6EB",
        contrastText: "#FFFFFF",
    },
    tab: {
        main: "#3B9AFF",
        background: "#E5E7EB",
        backgroundHover: "#D9F0FF",
        border: "#D1D5DB",
        text: "#6B7280",
        textHover: "#1D82F5",
    },
    text: {
        main: "#3B9AFF",
        dark: "#111827",
        light: "#9CA3B0",
        lightest: "#9CA3B0",
        middle: "#6B7280",
    },
    textField: {
        main: "#3B9AFF",
        border: "#E5E7EB",
        error: "#E21D48",
        placeholder: "#9CA3B0",
        name: "#111827",
    },
    background: {
        default: "#E5E7EB",
        paper: "#F9FAFB",
        sidebar: "#171F29",
    },
    divider: "#E5E7EB",
};

const darkPalette = {
    primary: {
        main: "#3B9AFF", // Changed from 'default' to 'main'
        hover: "#5AAEFF",
        light: "#1A3A52",
        black: "#FFFFFF",
        white: "#0F1419",
    },
    button: {
        main: "#3B9AFF", // Changed from 'default' to 'main'
        gray: "#9CA3AF",
        hover: "#5AAEFF",
        light: "#1A3A52",
        lightest: "#1A3A52",
        contrastText: "#FFFFFF",
    },
    error: {
        main: "#F43F5E", // Changed from 'default' to 'main'
        hover: "#FB7185",
        light: "#2D1215",
        contrastText: "#FFFFFF",
    },
    gray: {
        main: "#3B9AFF",
        gray1: "#374151",
        gray2: "#2D1215",
        gray3: "#6B7280",
    },
    icon: {
        main: "#3B9AFF",
        black: "#F9FAFB",
        dark: "#3B9AFF",
        light: "#9CA3AF",
    },
    info: {
        main: "#FBBF24", // Changed from 'default' to 'main'
        hover: "#FCD34D",
        light: "#2D2410",
        contrastText: "#111827",
    },
    seperator: {
        main: "#3B9AFF",
        dark: "#374151",
        darker: "#4B5563",
        darkest: "#6B7280",
    },
    success: {
        main: "#10B981", // Changed from 'default' to 'main'
        hover: "#34D399",
        light: "#0C2D24",
        contrastText: "#FFFFFF",
    },
    warning: {
        main: "#FB923C", // Changed from 'default' to 'main'
        hover: "#FDBA74",
        light: "#2D1A0F",
        contrastText: "#111827",
    },
    tab: {
        main: "#3B9AFF",
        background: "#1F2937",
        backgroundHover: "#1A3A52",
        border: "#374151",
        text: "#9CA3AF",
        textHover: "#3B9AFF",
    },
    text: {
        main: "#3B9AFF",
        dark: "#F9FAFB",
        light: "#9CA3AF",
        lightest: "#6B7280",
        middle: "#D1D5DB",
    },
    textField: {
        main: "#3B9AFF",
        border: "#374151",
        error: "#F43F5E",
        placeholder: "#6B7280",
        name: "#F9FAFB",
    },
    background: {
        default: "#0F1419",
        paper: "#1A1F26",
        sidebar: "#171F29",
    },
};

// Common theme options
const commonThemeOptions: ThemeOptions = {
    typography: {
        fontFamily: '"Helvetica Neue", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: "64px",
            lineHeight: "89.67px",
        },
        h2: {
            fontWeight: 500,
            fontSize: "48px",
            lineHeight: "67.25px",
        },
        h3: {
            fontWeight: 500,
            fontSize: "32px",
            lineHeight: "44.8px",
        },
        h4: {
            fontWeight: 500,
            fontSize: "24px",
            lineHeight: "33.6px",
        },
        h5: {
            fontWeight: 500,
            fontSize: "20px",
            lineHeight: "28px",
        },
        h6: {
            fontWeight: 500,
            fontSize: "18px",
            lineHeight: "25.2px",
        },
        body1: {
            fontWeight: 500,
            fontSize: "20px",
            lineHeight: "28px",
        },
        body2: {
            fontWeight: 400,
            fontSize: "18px",
            lineHeight: "26px",
        },
        subtitle1: {
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "22.4px",
        },
        subtitle2: {
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "19.6px",
        },
        caption: {
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "16.8px",
        },
        overline: {
            fontWeight: 400,
            fontSize: "8px",
            lineHeight: "11.2px",
        },
        button: {
            fontWeight: 400,
            textTransform: "none",
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiStack: {
            styleOverrides: {
                root: {
                    flexDirection: "row",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "10px 16px",
                    boxShadow: "none"
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    "&.activate:hover svg path": {
                        fill: theme.palette.success.dark,
                    },
                }),
            },
        },

        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    fontSize: "18px",
                    color: theme.palette.textField.name,
                    marginBottom: "8px",
                    [theme.breakpoints.down("lg")]: {
                        fontSize: "12px",
                    },
                    "&.required::after": {
                        content: '"*"',
                        display: "inline-block",
                        color: theme.palette.error.main,
                        marginLeft: "4px",
                    },
                }),
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    padding: "16px",
                    borderRadius: "8px",
                    fontWeight: "500",
                },
                input: {
                    padding: "0",
                    fontSize: "16px",
                },
                notchedOutline: {
                    borderColor: "#C1C1C1",
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    ".MuiSelect-select": {
                        maxHeight: "24px"
                    }
                }
            }
        },
        MuiList: {
            styleOverrides: {
                root: {
                    padding: 0,
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    flexDirection: "column",
                    alignItems: "stretch",
                    justifyContent: "stretch",
                    padding: 0,

                    "&.menu__item:not(.action__item) *": {
                        color: theme.palette.text.light,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    },

                    "&.menu__item.action__item": {
                        "& .MuiListItemButton-root": {
                            transition: "all 0.2s ease-in-out",
                            padding: "8px 12px",
                            borderRadius: "4px"
                        },

                        ".MuiListItemText, .MuiListItemText ": {
                            color: theme.palette.text.light,
                        },

                        "&:hover": {
                            ".MuiListItemButton-root": {
                                color: theme.palette.primary.main,
                                backgroundColor: theme.palette.primary.light,

                                "svg path": {
                                    stroke: theme.palette.primary.main,
                                },
                                ".MuiListItemText, .MuiListItemText *": {
                                    color: theme.palette.primary.main,
                                    fill: theme.palette.primary.main,
                                },
                            },
                        }
                    },
                }),
            },
        },

        MuiListItemButton: {
            styleOverrides: {
                root: () => ({
                    padding: "16px",
                    marginBottom: "4px",
                    borderBottom: `1px solid #4B4B4B`,
                    gap: "16px",
                    "&.active *": {
                        color: "#fff !important",

                        "svg path": {
                            stroke: "#fff"
                        }
                    }
                }),
            },
        },
        MuiListItemText: {
            styleOverrides: {
                root: () => ({
                    margin: 0
                }),
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: ({ theme }) => ({
                    "&.MuiTypography-body1": {
                        ...theme.typography.subtitle1,
                    },
                }),
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: "unset",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderColor: `${theme.palette.seperator.dark}`,
                }),
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: ({ theme }) => ({
                    padding: 0,
                    color: theme.palette.seperator.dark,
                    '& .MuiSvgIcon-root': {
                        width: 24,
                        height: 24,
                    },
                    '& .MuiSvgIcon-root path': {
                        strokeWidth: '1px',
                    },
                    '& svg': {
                        borderRadius: '8px',
                        overflow: 'visible',
                    },
                }),
            },
        },
        MuiPaginationItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    border: `1px solid ${theme.palette.seperator.dark}`,
                    borderRadius: '4px',
                    background: 'white',
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&.Mui-selected": {
                        background: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText
                    }
                })
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: ({ theme }) => ({
                    backgroundColor: theme.palette.primary.black,
                    color: theme.palette.primary.contrastText,
                    fontSize: "16px",
                    padding: "8px 14px",
                    borderRadius: "4px",
                }),
                arrow: ({ theme }) => ({
                    color: theme.palette.common.black,
                }),
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                // popper: {
                //     "& .MuiAutocomplete-paper": {
                //         padding: "8px 12px",
                //         borderRadius: "8px",
                //     },
                // },
                option: ({ theme }) => ({
                    ...theme.typography.body1,
                    padding: "8px 12px",
                    color: theme.palette.text.primary,
                    '&[aria-selected="true"]': {
                        backgroundColor: theme.palette.action.selected,
                    },
                    '&[data-focus="true"]': {
                        backgroundColor: theme.palette.action.hover,
                    },
                }),
            },
        },
    },
};

// Create theme function
export const createAppTheme = (mode: "light" | "dark") => {
    return createTheme({
        ...commonThemeOptions,
        palette: {
            mode,
            ...(mode === "light" ? lightPalette : darkPalette),
        },
    });
};

// Export palettes for reference
export { darkPalette, lightPalette };
