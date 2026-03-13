import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PreviewPdfState {
    open: boolean;
    mediaUrl: string | null;
    mediaName: string | null;
    mediaId: number | null;
}

const initialState: PreviewPdfState = {
    open: false,
    mediaUrl: null,
    mediaName: null,
    mediaId: null
};

const previewPdfSlice = createSlice({
    name: "previewPdf",
    initialState,
    reducers: {
        openPreviewPdf: (
            state,
            action: PayloadAction<{ mediaUrl: string; mediaName?: string; mediaId: number | null; }>
        ) => {
            state.open = true;
            state.mediaUrl = action.payload.mediaUrl;
            state.mediaName = action.payload.mediaName || null;
            state.mediaId = action.payload.mediaId || null;
        },

        closePreviewPdf: (state) => {
            state.open = false;
            state.mediaUrl = null;
            state.mediaName = null;
            state.mediaId = null;
        },
    },
});

export const { openPreviewPdf, closePreviewPdf } = previewPdfSlice.actions;

export default previewPdfSlice.reducer;