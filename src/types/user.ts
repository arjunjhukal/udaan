import type { Pagination } from "./roleAndPermission";

export type PermissionProps = string[];
export type Token = {
	access_token: string;
} | null;

export interface RegisterUserProps {
	id?: string;
	name: string;
	email: string;
	phone: string;
	role: { name: string } | null;
	password: string;
	password_confirmation: string;
	profile: File | null;
	profile_url: string;
	designation: string;
}

export const RegisterUserInitialData = {
	name: "",
	email: "",
	phone: "",
	user_role: "",
	password: "",
	password_confirmation: "",
	profile: null,
	profile_url: "",
	designation: "",
}

export interface LoginUserProps {
	email: string;
	password?: string;
	otp?: string;
}

export interface GlobalResponse {
	message: string;
	status: string;
}

export interface User extends RegisterUserProps {
	permissions: PermissionProps;
	// role: string[];
}

export interface UserResponse extends GlobalResponse {
	data: {
		user: User;
		token: Token;
	};
}


export interface UserList extends GlobalResponse {
	data: {
		data: RegisterUserProps[];
		pagination: Pagination;
	}
}