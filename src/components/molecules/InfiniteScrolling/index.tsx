import { Box, Checkbox, CircularProgress, FormControlLabel, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface InfiniteScrollingProps {
    data: any[];
    hasMore: number;
    selectedItems: number[];
    onSelectionChange: (selectedIds: number[]) => void;
    fetchMore: () => void;
    onSearch: (searchTerm: string) => void;
    loading?: boolean;
    maxSelection?: number;
    itemLabelKey?: string;
    itemIdKey?: string;
    placeholder?: string;
}

export default function InfiniteScrolling({
    data,
    hasMore,
    selectedItems,
    onSelectionChange,
    fetchMore,
    onSearch,
    loading = false,
    maxSelection = 100,
    itemLabelKey = "name",
    itemIdKey = "id",
    placeholder = "Search..."
}: InfiniteScrollingProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Debounce search to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    const handleToggle = (itemId: number) => {
        const isSelected = selectedItems.includes(itemId);

        if (isSelected) {
            onSelectionChange(selectedItems.filter(id => id !== itemId));
        } else {
            if (selectedItems.length < maxSelection) {
                onSelectionChange([...selectedItems, itemId]);
            }
        }
    };

    const handleSelectAll = () => {
        if (selectedItems.length === data.length) {
            onSelectionChange([]);
        } else {
            const allIds = data.slice(0, maxSelection).map(item => item[itemIdKey]);
            onSelectionChange(allIds);
        }
    };

    const isMaxReached = selectedItems.length >= maxSelection;
    const allSelected = data.length > 0 && selectedItems.length === data.length;

    return (
        <Box
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
            }}
        >
            {/* Search and Select All Header */}
            <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={allSelected}
                                indeterminate={selectedItems.length > 0 && !allSelected}
                                onChange={handleSelectAll}
                                disabled={data.length === 0}
                            />
                        }
                        label={
                            <Typography variant="body2" fontWeight={600}>
                                Select All
                            </Typography>
                        }
                    />
                    <Typography variant="caption" color="text.secondary">
                        {selectedItems.length} / {maxSelection} selected
                    </Typography>
                </Box>
            </Box>

            {/* Scrollable List */}
            <Box
                id="scrollableDiv"
                sx={{
                    height: 300,
                    overflow: 'auto',
                    bgcolor: 'background.default'
                }}
            >
                {loading && data.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <InfiniteScroll
                        dataLength={data.length}
                        next={fetchMore}
                        hasMore={data.length < hasMore}
                        loader={
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress size={24} />
                            </Box>
                        }
                        scrollableTarget="scrollableDiv"
                        endMessage={
                            data.length > 0 ? (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', textAlign: 'center', p: 2 }}
                                >
                                    No more items to load
                                </Typography>
                            ) : null
                        }
                    >
                        {data.length === 0 ? (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    {searchTerm ? 'No items found' : 'No items available'}
                                </Typography>
                            </Box>
                        ) : (
                            data.map((item) => {
                                const itemId = item[itemIdKey];
                                const isSelected = selectedItems.includes(itemId);
                                const isDisabled = !isSelected && isMaxReached;

                                return (
                                    <Box
                                        key={itemId}
                                        sx={{
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            '&:last-child': {
                                                borderBottom: 'none'
                                            },
                                            '&:hover': {
                                                bgcolor: 'action.hover'
                                            },
                                            bgcolor: isSelected ? 'action.selected' : 'transparent'
                                        }}
                                    >
                                        <FormControlLabel
                                            sx={{
                                                m: 0,
                                                p: 1.5,
                                                width: '100%',
                                                '& .MuiFormControlLabel-label': {
                                                    flex: 1
                                                }
                                            }}
                                            control={
                                                <Checkbox
                                                    checked={isSelected}
                                                    onChange={() => handleToggle(itemId)}
                                                    disabled={isDisabled}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body2">
                                                        {item[itemLabelKey]}
                                                    </Typography>
                                                    {item.description && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {item.description}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </Box>
                                );
                            })
                        )}
                    </InfiniteScroll>
                )}
            </Box>

            {/* Warning Message */}
            {isMaxReached && (
                <Box sx={{ p: 1, bgcolor: 'warning.light', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="warning.dark">
                        Maximum selection limit reached ({maxSelection} items)
                    </Typography>
                </Box>
            )}
        </Box>
    );
}