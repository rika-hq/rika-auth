import { IsString } from 'class-validator';

export class CheckTokenRequestDTO {
	@IsString()
	token: string;
}
