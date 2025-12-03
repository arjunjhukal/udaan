// store/slices/sessionSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
    showSessionExpiredPopup: boolean;
    message: string;
}

const initialState: SessionState = {
    showSessionExpiredPopup: false,
    message: "",
};

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        showSessionExpired: (state, action: PayloadAction<string>) => {
            state.showSessionExpiredPopup = true;
            state.message = action.payload;
        },
        hideSessionExpired: (state) => {
            state.showSessionExpiredPopup = false;
            state.message = "";
        },
    },
});

export const { showSessionExpired, hideSessionExpired } = sessionSlice.actions;
export default sessionSlice.reducer;