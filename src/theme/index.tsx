import type { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

// Extend the Palette and PaletteOptions interfaces
declare module '@mui/material/styles' {
    interface Palette {
        button: Palette['primary'];
        textField: {
            border: string;
            placeholder: string;
            focusBorder: string;
            label: string;
        };
    }
    interface PaletteOptions {
        button?: PaletteOptions['primary'];
        textField?: {
            border?: string;
            placeholder?: string;
            focusBorder?: string;
            label?: string;
        };
    }
}

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
        border: "#9CA3B0",
        placeholder: "#9CA3B0",
        focusBorder: "#3B82F6",
        label: "#1F2937",
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
            'Noto Sans',
            'sans-serif',
        ].join(','),
        // Headings - Noto Sans
        h1: {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '64px',
            fontWeight: 700, // Bold
            lineHeight: '89.67px',
        },
        h2: {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '48px',
            fontWeight: 600, // SemiBold
            lineHeight: '67.25px',
        },
        h3: {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '32px',
            fontWeight: 600, // SemiBold
            lineHeight: '44.80px',
        },
        h4: {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '24px',
            fontWeight: 600, // SemiBold
            lineHeight: '33.60px',
        },
        h5: {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '20px',
            fontWeight: 600, // SemiBold
            lineHeight: '28.00px',
        },
        h6: {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '18px',
            fontWeight: 500, // Medium
            lineHeight: '25.20px',
        },
        // Body/Display - Noto Sans and Satoshi
        body1: {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '20px',
            fontWeight: 500, // Medium
            lineHeight: '28.00px',
        },
        body2: {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '18px',
            fontWeight: 500,
            lineHeight: '25.20px',
        },
        subtitle1: {
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '22.40px',
        },
        subtitle2: {
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '14px',
            fontWeight: 400, // Regular
            lineHeight: '19.60px',
        },
        caption: {
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '12px',
            fontWeight: 400, // Regular
            lineHeight: '16.80px',
        },
        overline: {
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '8px',
            fontWeight: 400, // Regular
            lineHeight: '11.20px',
        },
        button: {
            fontFamily: 'Noto Sans, sans-serif',
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiStack: {
            styleOverrides: {
                root: {
                    flexDirection: "row"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 16px',
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
        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    fontSize: "18px",
                    color: theme.palette.textField.label,
                    marginBottom: "8px",
                    [theme.breakpoints.down('lg')]: {
                        fontSize: "12px",
                    },
                })
            }
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
                    borderColor: '#C1C1C1',
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    padding: "0",
                    flexDirection: "column",
                    justifyContent: "stretch",
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
