import * as jose from 'jose';
import { sha256 } from '@/crypto/sha256';
import { UserService } from '@/user/user.service';
import { Controller, Logger } from '@nestjs/common';
import {
	AuthServiceController,
	AuthServiceControllerMethods,
	SigninResponse,
	User,
} from 'proto/auth';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { SigninRequestDTO } from '@/auth/dto/SigninRequest.dto';
import { CheckTokenRequestDTO } from '@/auth/dto/CheckTokenRequest.dto';
import { JwtUserInfo } from '@/types/JwtUserInfo.interface';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
	private logger = new Logger('Auth');
	private secret: Uint8Array;

	constructor(private readonly userService: UserService) {
		this.secret = new TextEncoder().encode(process.env.AUTH_SECRET);
	}

	async checkToken(request: CheckTokenRequestDTO): Promise<User> {
		try {
			const { payload } = await jose.jwtVerify(
				request.token,
				this.secret
			);
			const userInfo: JwtUserInfo = payload as JwtUserInfo;
			const user = await this.userService.getUser(userInfo.email);

			return {
				email: user.email,
				fullName: `${user.name} ${user.surname}`,
				profilePhoto: user.profilePhoto,
			};
		} catch (err) {}

		throw new RpcException({
			message: 'Invalid token',
			code: status.CANCELLED,
		});
	}

	async signin(request: SigninRequestDTO): Promise<SigninResponse> {
		try {
			const user = await this.userService.getUser(request.email);
			if (user.password == sha256(request.password)) {
				const jwt = await new jose.SignJWT({
					userId: user.id.toString(),
					email: user.email,
					iat: Date.now(),
				})
					.setProtectedHeader({ alg: 'HS256' })
					.sign(this.secret);

				return {
					token: jwt,
					user: {
						email: user.email,
						fullName: `${user.name} ${user.surname}`,
						profilePhoto: user.profilePhoto,
					},
				};
			}
			this.logger.error(`The User's (${user.email}) password is wrong`);
		} catch (err) {
			this.logger.log(`${err.message}`);
		}

		throw new RpcException({
			code: status.UNAUTHENTICATED,
			message: 'Bad credentials',
		});
	}
}
