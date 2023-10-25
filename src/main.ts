import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as envConfig } from 'dotenv';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
	envConfig();
	const app = await NestFactory.createMicroservice(AppModule, {
		transport: Transport.GRPC,
		options: {
			url: `0.0.0.0:${process.env.PORT || 5000}`,
			package: 'auth',
			protoPath: join(__dirname, '../../proto/auth.proto'),
		},
	});
	await app.listen();
}
bootstrap();
