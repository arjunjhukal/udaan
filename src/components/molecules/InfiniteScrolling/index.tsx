import { Box, Checkbox, CircularProgress, FormControlLabel, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { v4 as uuidv4 } from "uuid";

interface InfiniteScrollingProps {
    data: any[];
    hasMore: boolean;
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

    // --- Map stable UUIDs to each itemId so they don't regenerate every render ---
    const [uuidMap, setUuidMap] = useState<Record<number, string>>({});

    useEffect(() => {
        const newMap = { ...uuidMap };

        data.forEach((item) => {
            const itemId = item[itemIdKey];
            if (!newMap[itemId]) {
                newMap[itemId] = uuidv4();
            }
        });

        setUuidMap(newMap);
    }, [data]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => onSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleToggle = (id: number) => {
        if (selectedItems.includes(id)) {
            onSelectionChange(selectedItems.filter(i => i !== id));
        } else if (selectedItems.length < maxSelection) {
            onSelectionChange([...selectedItems, id]);
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
            {/* Search + Select All */}
            <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 1 }}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={allSelected}
                            indeterminate={selectedItems.length > 0 && !allSelected}
                            onChange={handleSelectAll}
                        />
                    }
                    label={<Typography variant="body2" fontWeight={600}>Select All</Typography>}
                />

                <Typography variant="caption" color="text.secondary">
                    {selectedItems.length} / {maxSelection} selected
                </Typography>
            </Box>

            {/* Scrollable List */}
            <Box id="scrollableDiv" sx={{ height: 300, overflow: "auto" }}>
                {loading && data.length === 0 ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <InfiniteScroll
                        dataLength={data.length}
                        next={fetchMore}
                        hasMore={hasMore}
                        scrollableTarget="scrollableDiv"
                        loader={
                            <Box sx={{ textAlign: "center", p: 2 }}>
                                <CircularProgress size={22} />
                            </Box>
                        }
                        endMessage={
                            data.length > 0 && (
                                <Typography variant="caption" sx={{ display: "block", textAlign: "center", p: 2 }}>
                                    No more items
                                </Typography>
                            )
                        }
                    >
                        {data.length === 0 ? (
                            <Box sx={{ p: 3, textAlign: "center" }}>
                                <Typography variant="body2" color="text.secondary">
                                    {searchTerm ? "No items found" : "No items available"}
                                </Typography>
                            </Box>
                        ) : (
                            data.map((item) => {
                                const itemId = item[itemIdKey];
                                const stableKey = uuidMap[itemId];
                                const isSelected = selectedItems.includes(itemId);

                                return (
                                    <Box
                                        key={stableKey}
                                        sx={{
                                            borderBottom: "1px solid",
                                            borderColor: "divider",
                                            bgcolor: isSelected ? "action.selected" : "transparent",
                                            "&:hover": { bgcolor: "action.hover" }
                                        }}
                                    >
                                        <FormControlLabel
                                            sx={{ m: 0, p: 1.5, width: "100%" }}
                                            control={
                                                <Checkbox
                                                    checked={isSelected}
                                                    disabled={!isSelected && isMaxReached}
                                                    onChange={() => handleToggle(itemId)}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body2">{item[itemLabelKey]}</Typography>
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

            {isMaxReached && (
                <Box sx={{ p: 1, bgcolor: "warning.light", borderTop: "1px solid", borderColor: "divider" }}>
                    <Typography variant="caption" color="warning.dark">
                        Maximum selection limit reached ({maxSelection})
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
