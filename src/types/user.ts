export type PermissionProps = string[];
export type Token = {
	access_token: string;
} | null;

export interface RegisterUserProps {
	name: string;
	email: string;
	phone_number: string;
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
	id: number;
	permissions: PermissionProps;
	role: string[];
}

export interface UserResponse extends GlobalResponse {
	data: {
		user: User;
		token: Token;
	};
}
