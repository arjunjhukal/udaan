import { Box, InputLabel, Typography, useTheme } from "@mui/material";

export default function CategoryFilter() {
    const theme = useTheme();
    return (
        <div className="input__field flex flex-col">
            <InputLabel className="required">Category</InputLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 2xl:grid-cols-4 gap-3 h-full">
                <Box sx={{
                    border: `1px solid ${theme.palette.seperator.dark}`,
                    borderRadius: "8px",
                    padding: "8px",
                }}>
                    <Typography variant="caption" color="primary.main" className="w-full text-center block mb-2.5!" sx={{
                        padding: "8px 24px",
                        background: theme.palette.primary.light,
                        borderRadius: "8px",

                    }}>
                        Mega-Cateories
                    </Typography>
                </Box>

                <Box sx={{
                    border: `1px solid ${theme.palette.seperator.dark}`,
                    borderRadius: "8px",
                    padding: "8px",
                }}>
                    <Typography variant="caption" color="success.main" className="w-full text-center block mb-2.5!" sx={{
                        padding: "8px 24px",
                        background: theme.palette.success.light,
                        borderRadius: "8px",

                    }}>
                        Categories
                    </Typography>
                    <div className="item__listing">
                        <Typography variant="caption">Please Select Megacategories to get Categories</Typography>
                    </div>
                </Box>
                <Box sx={{
                    border: `1px solid ${theme.palette.seperator.dark}`,
                    borderRadius: "8px",
                    padding: "8px",
                }}>
                    <Typography variant="caption" color="warning.main" className="w-full text-center block mb-2.5!" sx={{
                        padding: "8px 24px",
                        background: theme.palette.warning.light,
                        borderRadius: "8px",

                    }}>
                        Sub- Categories
                    </Typography>
                    <div className="item__listing">
                        <Typography variant="caption">Please Select Category to get Sub Categories</Typography>
                    </div>
                </Box>
                <Box sx={{
                    border: `1px solid ${theme.palette.seperator.dark}`,
                    borderRadius: "8px",
                    padding: "8px",
                }}>
                    <Typography variant="caption" color="error.main" className="w-full text-center block mb-2.5!" sx={{
                        padding: "8px 24px",
                        background: theme.palette.error.light,
                        borderRadius: "8px",

                    }}>
                        Level
                    </Typography>
                    <div className="item__listing">
                    </div>
                </Box>
            </div>
        </div>
    )
}
