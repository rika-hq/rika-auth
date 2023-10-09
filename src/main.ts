import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as envConfig } from 'dotenv';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	envConfig();
	const app = await NestFactory.createMicroservice(AppModule, {
		transport: Transport.GRPC,
		options: {
			url: '0.0.0.0:5000',
			package: 'auth',
			protoPath: join(__dirname, '../../proto/auth.proto'),
		},
	});
	await app.listen();
}
bootstrap();
