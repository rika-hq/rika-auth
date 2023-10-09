import { IsString } from 'class-validator';

export class SigninRequestDTO {
	@IsString()
	email: string;

	@IsString()
	password: string;
}
