import { DatabaseService } from '@/database/database.service';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
	private logger = new Logger('UserService');
	constructor(private readonly databaseService: DatabaseService) {}

	async getUser(email: string): Promise<User> {
		const user = await this.prisma.user.findFirst({
			where: {
				email,
			},
		});

		if (!user) {
			const msg = `The user has email (${email}) couldn't find`;
			this.logger.error(msg);
			throw new Error(msg);
		}

		return user;
	}

	private get prisma() {
		return this.databaseService.prisma;
	}
}
