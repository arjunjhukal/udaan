export interface GlobalDiscount {
	enabled: boolean;
	percentage: number;
	label: string;
}

export interface AppControls {
	screen_protection: boolean;
	auto_enable_screen_protection: boolean;
	auto_enable_after_minutes: number;
	maintenance_mode: boolean;
	global_discount: GlobalDiscount;
	otp_limit: number;
}

export interface AppControlsResponse {
	data: AppControls;
	message: string;
	status: string;
}
