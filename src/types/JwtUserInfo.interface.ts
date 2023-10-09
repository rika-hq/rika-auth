import { JWTPayload } from 'jose';

export interface JwtUserInfo extends JWTPayload {
	userId: string;
	email: string;
}
