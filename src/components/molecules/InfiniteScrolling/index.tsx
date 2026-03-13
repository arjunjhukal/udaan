import { Box, Checkbox, CircularProgress, Divider, FormControlLabel, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { v4 as uuidv4 } from "uuid";
import { renderHtml } from "../../../utils/renderHtml";

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
    scrollableId?: string;
}

export default function InfiniteScrolling({
    data,
    hasMore,
    selectedItems,
    onSelectionChange,
    fetchMore,
    loading = false,
    maxSelection = 100,
    itemLabelKey = "name",
    itemIdKey = "id",
    scrollableId = "scrollableDiv",
}: InfiniteScrollingProps) {

    const theme = useTheme();

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

    const handleToggle = (id: number) => {
        if (selectedItems.includes(id)) {
            onSelectionChange(selectedItems.filter(i => i !== id));
        } else if (selectedItems.length < maxSelection) {
            onSelectionChange([...selectedItems, id]);
        }
    };

    const isMaxReached = selectedItems.length >= maxSelection;

    // --- Group items by created_at date ---
    const groupedData = data.reduce((acc: Record<string, any[]>, item) => {
        const date = new Date(item.created_at).toDateString();

        if (!acc[date]) acc[date] = [];
        acc[date].push(item);

        return acc;
    }, {});

    return (
        <Box
            sx={{
                border: `1px solid ${theme.palette.separator.dark}`,
                borderRadius: 1,
                overflow: 'hidden',
                padding: "8px",
                marginTop: "8px"
            }}
        >
            {/* Scrollable List */}
            <Box id={scrollableId} sx={{ height: 200, overflow: "auto" }}>
                {loading && data.length === 0 ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <InfiniteScroll
                        dataLength={data.length}
                        next={fetchMore}
                        hasMore={hasMore}
                        scrollableTarget={scrollableId}
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
                                    {"No items available"}
                                </Typography>
                            </Box>
                        ) : (
                            Object.entries(groupedData).map(([date, items]) => (
                                <Box key={date}>
                                    {/* Group Label */}
                                    <Box className="flex items-center gap-2 py-1 px-1">
                                        <Typography variant="subtitle2" fontWeight={600} color="text.dark" className="text-nowrap">
                                            {date}
                                        </Typography>
                                        <Divider sx={{
                                            color: (theme) => theme.palette.separator.dark,
                                            width: "100%",
                                            my: "4px"
                                        }} />
                                    </Box>

                                    {items.map((item) => {
                                        const itemId = item[itemIdKey];
                                        const stableKey = uuidMap[itemId];
                                        const isSelected = selectedItems.includes(itemId);

                                        return (
                                            <Box
                                                key={stableKey}
                                                className="item__wrapper flex flex-col "
                                            >
                                                <FormControlLabel
                                                    sx={{ m: 0, p: .5, width: "100%" }}
                                                    control={
                                                        <Checkbox
                                                            checked={isSelected}
                                                            disabled={!isSelected && isMaxReached}
                                                            onChange={() => handleToggle(itemId)}
                                                        />
                                                    }
                                                    label={
                                                        <Box>
                                                            <Typography variant="subtitle1">
                                                                {renderHtml(item[itemLabelKey])}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Box>
                                        );
                                    })}
                                </Box>
                            ))
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