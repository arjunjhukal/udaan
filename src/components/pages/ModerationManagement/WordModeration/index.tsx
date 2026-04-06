import { Add, Search } from "@mui/icons-material";
import {
    Box,
    Chip,
    CircularProgress,
    InputAdornment,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import PageHeader from "../../../organism/PageHeader";
import { useCreateModerationWordMutation, useDeleteModerationWordMutation, useGetModerationWordsQuery, useUpdateModerationWordMutation } from "../../../../services/moderationApi";
import type { ModerationProps } from "../../../../types/moderation";

const PAGE_SIZE = 20;

export default function WordModeration() {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const [inputValue, setInputValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [allWords, setAllWords] = useState<ModerationProps[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(inputValue.trim()), 300);
        return () => clearTimeout(timer);
    }, [inputValue]);

    useEffect(() => {
        setPage(1);
        setAllWords([]);
        setHasMore(true);
    }, [debouncedSearch]);

    const { data, isFetching, isLoading } = useGetModerationWordsQuery({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
    });

    useEffect(() => {
        if (!data?.data?.data) return;
        const incoming = data.data.data;
        const pagination = data.data.pagination;

        if (pagination.current_page === 1) {
            setAllWords(incoming);
        } else {
            setAllWords((prev) => {
                const existingIds = new Set(prev.map((w) => w.id));
                const fresh = incoming.filter((w) => !existingIds.has(w.id));
                return [...prev, ...fresh];
            });
        }
        setHasMore(pagination.current_page < pagination.total_pages);
    }, [data]);

    // Infinite scroll sentinel
    const observerRef = useRef<IntersectionObserver | null>(null);
    const setSentinel = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) observerRef.current.disconnect();
            if (!node) return;
            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching) {
                    setPage((prev) => prev + 1);
                }
            });
            observerRef.current.observe(node);
        },
        [hasMore, isFetching]
    );

    const [createWord, { isLoading: isCreating }] = useCreateModerationWordMutation();
    const [updateWord, { isLoading: isUpdating }] = useUpdateModerationWordMutation();
    const [deleteWord] = useDeleteModerationWordMutation();

    const trimmedInput = inputValue.trim();
    const exactMatch = allWords.some(
        (w) => w.name.toLowerCase() === trimmedInput.toLowerCase()
    );
    const showCreateOption = trimmedInput.length > 0 && !exactMatch;

    const handleCreate = async () => {
        if (!trimmedInput || isCreating) return;
        try {
            await createWord({ name: trimmedInput }).unwrap();
            dispatch(showToast({ message: "Word added successfully", severity: "success" }));
            setInputValue("");
            setDebouncedSearch("");
            setPage(1);
            setAllWords([]);
        } catch {
            dispatch(showToast({ message: "Failed to add word", severity: "error" }));
        }
    };

    const handleUpdate = async (id: number) => {
        const name = editingName.trim();
        if (!name) {
            setEditingId(null);
            return;
        }
        try {
            await updateWord({ id, name }).unwrap();
            dispatch(showToast({ message: "Word updated successfully", severity: "success" }));
            setAllWords((prev) =>
                prev.map((w) => (w.id === id ? { ...w, name } : w))
            );
        } catch {
            dispatch(showToast({ message: "Failed to update word", severity: "error" }));
        } finally {
            setEditingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteWord({ ids: [id] }).unwrap();
            dispatch(showToast({ message: "Word removed", severity: "success" }));
            setAllWords((prev) => prev.filter((w) => w.id !== id));
        } catch {
            dispatch(showToast({ message: "Failed to remove word", severity: "error" }));
        }
    };

    const isFirstLoad = isLoading && page === 1 && allWords.length === 0;

    return (
        <Box p={3}>
            <PageHeader
                breadcrumb={[
                    { title: "Dashboard", url: "/" },
                    { title: "Word Moderation" },
                ]}
                description="Manage blocked Nepali words used for content moderation"
            />

            {/* Input */}
            <Box mt={3} maxWidth={600}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search or type a new word to add…"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && showCreateOption) handleCreate();
                        if (e.key === "Escape") setInputValue("");
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: showCreateOption ? (
                            <InputAdornment position="end">
                                <Chip
                                    icon={<Add fontSize="small" />}
                                    label={`Add "${trimmedInput}"`}
                                    onClick={handleCreate}
                                    disabled={isCreating}
                                    color="primary"
                                    size="small"
                                    clickable
                                />
                            </InputAdornment>
                        ) : undefined,
                    }}
                />
                <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                    Press Enter or click the chip to add a new word. Click a word pill to edit it.
                </Typography>
            </Box>

            {/* Word list */}
            <Box mt={3}>
                {isFirstLoad ? (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress size={32} />
                    </Box>
                ) : allWords.length === 0 && !isFetching ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        py={8}
                        gap={0.5}
                        sx={{
                            borderRadius: 2,
                            border: `1px dashed ${theme.palette.divider}`,
                            color: theme.palette.text.secondary,
                        }}
                    >
                        <Typography variant="body2">
                            {debouncedSearch
                                ? `No words matching "${debouncedSearch}"`
                                : "No blocked words yet"}
                        </Typography>
                        {debouncedSearch && (
                            <Typography variant="caption">
                                Press Enter to add it as a new word
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {allWords.map((word) =>
                            editingId === word.id ? (
                                <TextField
                                    key={word.id}
                                    size="small"
                                    autoFocus
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleUpdate(word.id);
                                        if (e.key === "Escape") setEditingId(null);
                                    }}
                                    onBlur={() => handleUpdate(word.id)}
                                    disabled={isUpdating}
                                    sx={{ width: 160 }}
                                    inputProps={{ style: { padding: "4px 8px" } }}
                                />
                            ) : (
                                <Chip
                                    key={word.id}
                                    label={word.name}
                                    onClick={() => {
                                        setEditingId(word.id);
                                        setEditingName(word.name);
                                    }}
                                    onDelete={() => handleDelete(word.id)}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                        "&:hover": {
                                            backgroundColor: theme.palette.action.hover,
                                            borderColor: theme.palette.primary.main,
                                        },
                                    }}
                                />
                            )
                        )}
                    </Box>
                )}

                {/* Infinite scroll sentinel */}
                <Box
                    ref={setSentinel}
                    display="flex"
                    justifyContent="center"
                    py={2}
                    mt={1}
                >
                    {isFetching && page > 1 && <CircularProgress size={22} />}
                </Box>
                {/* 
                {!hasMore && allWords.length > 0 && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        textAlign="center"
                        pb={2}
                    >
                        All {allWords.length} words loaded
                    </Typography>
                )} */}
            </Box>
        </Box>
    );
}
