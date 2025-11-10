import {
    ChevronLeft,
    ChevronRight,
    FirstPage,
    LastPage
} from '@mui/icons-material';
import { Box, MenuItem, Pagination, Select, Typography } from '@mui/material';

interface TablePaginationProps {
    qp: {
        pageIndex: number;
        pageSize: number;
    };
    setQp: (qp: { pageIndex: number; pageSize: number }) => void;
    totalPages: number;
    totalRecords?: number;
}

export default function TablePagination({
    qp,
    setQp,
    totalPages,
    totalRecords
}: TablePaginationProps) {
    const pageSizeOptions = [8, 10, 20, 50, 100];

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setQp({ ...qp, pageIndex: page });
    };

    const handlePageSizeChange = (event: any) => {
        setQp({
            pageIndex: 1, // Reset to first page when changing page size
            pageSize: Number(event.target.value)
        });
    };

    const goToFirstPage = () => {
        setQp({ ...qp, pageIndex: 1 });
    };

    const goToLastPage = () => {
        setQp({ ...qp, pageIndex: totalPages });
    };

    const goToPreviousPage = () => {
        if (qp.pageIndex > 1) {
            setQp({ ...qp, pageIndex: qp.pageIndex - 1 });
        }
    };

    const goToNextPage = () => {
        if (qp.pageIndex < totalPages) {
            setQp({ ...qp, pageIndex: qp.pageIndex + 1 });
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                flexWrap: 'wrap',
                gap: 2
            }}
        >
            {/* Page Size Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color='text.dark'>Show</Typography>
                <Select
                    value={qp.pageSize}
                    onChange={handlePageSizeChange}
                    size="small"
                    sx={{ minWidth: 50, padding: "4px 12px" }}
                >
                    {pageSizeOptions.map((size) => (
                        <MenuItem key={size} value={size}>
                            {size}
                        </MenuItem>
                    ))}
                </Select>
                <Typography variant="caption" color='text.dark'>
                    per page {totalRecords ? `of ${totalRecords}` : ''}
                </Typography>
            </Box>

            {/* Pagination Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                    component="button"
                    onClick={goToFirstPage}
                    disabled={qp.pageIndex === 1}
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: 'white',
                        cursor: qp.pageIndex === 1 ? 'not-allowed' : 'pointer',
                        opacity: qp.pageIndex === 1 ? 0.5 : 1,

                        '&:hover': {
                            backgroundColor: qp.pageIndex === 1 ? 'white' : '#f5f5f5',
                        }
                    }}
                >
                    <FirstPage fontSize="small" />
                </Box>

                {/* Previous Page Button */}
                <Box
                    component="button"
                    onClick={goToPreviousPage}
                    disabled={qp.pageIndex === 1}
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: 'white',
                        cursor: qp.pageIndex === 1 ? 'not-allowed' : 'pointer',
                        opacity: qp.pageIndex === 1 ? 0.5 : 1,

                        '&:hover': {
                            backgroundColor: qp.pageIndex === 1 ? 'white' : '#f5f5f5',
                        }
                    }}
                >
                    <ChevronLeft fontSize="small" />
                </Box>

                <Pagination
                    count={totalPages}
                    page={qp.pageIndex}
                    onChange={handlePageChange}
                    siblingCount={1}
                    boundaryCount={1}
                    shape="rounded"
                    showFirstButton={false}
                    showLastButton={false}
                    hidePrevButton
                    hideNextButton
                />

                {/* Next Page Button */}
                <Box
                    component="button"
                    onClick={goToNextPage}
                    disabled={qp.pageIndex === totalPages}
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: 'white',
                        cursor: qp.pageIndex === totalPages ? 'not-allowed' : 'pointer',
                        opacity: qp.pageIndex === totalPages ? 0.5 : 1,

                        '&:hover': {
                            backgroundColor: qp.pageIndex === totalPages ? 'white' : '#f5f5f5',
                        }
                    }}
                >
                    <ChevronRight fontSize="small" />
                </Box>

                {/* Last Page Button */}
                <Box
                    component="button"
                    onClick={goToLastPage}
                    disabled={qp.pageIndex === totalPages}
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: 'white',
                        cursor: qp.pageIndex === totalPages ? 'not-allowed' : 'pointer',
                        opacity: qp.pageIndex === totalPages ? 0.5 : 1,

                        '&:hover': {
                            backgroundColor: qp.pageIndex === totalPages ? 'white' : '#f5f5f5',
                        }
                    }}
                >
                    <LastPage fontSize="small" />
                </Box>
            </Box>
        </Box>
    );
}