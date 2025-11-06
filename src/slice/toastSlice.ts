import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	open: false,
	message: "",
	severity: "",
};

const toastSlice = createSlice({
	name: "toast",
	initialState,
	reducers: {
		showToast: (state, action) => {
			const { message, severity } = action.payload;
			state.open = true;
			state.message = message;
			state.severity = severity;
		},
		hideToast: (state) => {
			state.open = false;
			state.message = "";
		},
	},
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
