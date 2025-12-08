import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
    open: boolean;
    url: string;
}

const initialState: SessionState = {
    open: false,
    url: "",
};
export const attachmentSlice = createSlice({
    name: "attachment",
    initialState,
    reducers: {
        showAttachment: (state, action: PayloadAction<string>) => {
            state.open = true;
            state.url = action.payload;
        },
        hideAttachment: (state) => {
            state.open = false;
            state.url = "";
        }
    }
})

export const { showAttachment, hideAttachment } = attachmentSlice.actions;
export default attachmentSlice.reducer;