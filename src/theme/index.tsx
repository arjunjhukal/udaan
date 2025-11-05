import type { ThemeOptions } from '@mui/material/styles';
import { createTheme, } from '@mui/material/styles';

// Define color palettes
const lightPalette = {
    primary: {
        main: "#1D4ED8",      // Default
        dark: "#3730A3",      // Hover
        light: "#BFDBFE",     // Light
        contrastText: "#FFFFFF",
    },
    button: {
        main: "#4F46E5",
        dark: "#4338CA",
        light: "#C7D2FE",
        contrastText: "#FFFFFF",
    },
    error: {
        main: "#EF4444",      // Default
        dark: "#B91C1C",      // Hover
        light: "#FCA5A5",     // Light
        contrastText: "#FFFFFF",
    },
    info: {
        main: "#F59E0B",      // Default
        dark: "#EA580C",      // Hover
        light: "#FEF3C7",     // Light
        contrastText: "#FFFFFF",
    },
    success: {
        main: "#10B981",      // Default
        dark: "#047857",      // Hover
        light: "#A7F3D0",     // Light
        contrastText: "#FFFFFF",
    },
    warning: {
        main: "#FB923C",      // Default
        dark: "#F97316",      // Hover
        light: "#FED7AA",     // Light
        contrastText: "#FFFFFF",
    },
    text: {
        primary: "#111827",   // Dark
        secondary: "#9CA3AF", // Light
        disabled: "#6B7280",  // Medium
    },
    textField: {
        border: "#D1D5DB",
        placeholder: "#F43F5E",
        focusBorder: "#3B82F6",
        label: "#71717A",
    },
    background: {
        default: "#FFFFFF",
        paper: "#F9FAFB",
    },
    divider: "#E5E7EB",
};


const darkPalette = {
    primary: {
        main: "#93C5FD",
        dark: "#60A5FA",
        light: "#1E3A8A",
        contrastText: "#000000",
    },
    button: {
        main: "#818CF8",
        dark: "#6366F1",
        light: "#E0E7FF",
        contrastText: "#000000",
    },
    error: {
        main: "#F87171",
        dark: "#DC2626",
        light: "#FEE2E2",
        contrastText: "#000000",
    },
    info: {
        main: "#FBBF24",
        dark: "#D97706",
        light: "#FEF3C7",
        contrastText: "#000000",
    },
    success: {
        main: "#6EE7B7",
        dark: "#10B981",
        light: "#ECFDF5",
        contrastText: "#000000",
    },
    warning: {
        main: "#FDBA74",
        dark: "#EA580C",
        light: "#FFF7ED",
        contrastText: "#000000",
    },
    text: {
        primary: "#F9FAFB",   // Bright white
        secondary: "#D1D5DB", // Light gray
        disabled: "#9CA3AF",  // Muted gray
    },
    textField: {
        border: "#374151",
        placeholder: "#FB7185",
        focusBorder: "#60A5FA",
        label: "#A1A1AA",
    },
    background: {
        default: "#111827",
        paper: "#1F2937",
    },
    divider: "#374151",
};


// Common theme options
const commonThemeOptions: ThemeOptions = {
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
        body2: {
            // color: '#000',
            fontFamily: 'Satoshi',
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
        }
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    padding: "10px 12px",
                    borderRadius: "8px",
                },
                input: {
                    padding: "0"
                },
                notchedOutline: {
                    borderColor: '#C1C1C1',
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    padding: "0",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "stretch"
                }
            }
        },
        MuiList: {
            styleOverrides: {
                root: {
                    padding: "0",
                    "& .MuiList-root": {
                        paddingLeft: "20px",
                    },
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    padding: "16px",
                    borderRadius: "14px",
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: "24px",
                    gap: "8px",
                    transition: "all 0.2s ease-in-out",
                    // Active state for top-level items
                    "&.active": {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,

                        "& .MuiListItemIcon-root": {
                            color: theme.palette.primary.contrastText,
                        },

                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                        }
                    },

                    // Active state for nested items
                    "&.active-nested": {
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.main,

                        "& .MuiListItemIcon-root": {
                            color: theme.palette.primary.main,
                        },

                        "&:hover": {
                            backgroundColor: theme.palette.primary.light,
                            opacity: 0.9,
                        }
                    }
                })
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: "unset"
                }
            }
        }
    },
};

// Create theme function
export const createAppTheme = (mode: 'light' | 'dark') => {
    return createTheme({
        ...commonThemeOptions,
        palette: {
            mode,
            ...(mode === 'light' ? lightPalette : darkPalette),
        },
    });
};

// Export palettes for reference
export { darkPalette, lightPalette };
