import { NestFactory } from '@nestjs/core'
import AppModule from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import ApiValidationPipe from './core/api-validation-pipe'
import RequestInterceptor from './core/request-interceptor/request.interceptor'

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule)
	app.useGlobalInterceptors(new RequestInterceptor())
	app.useGlobalPipes(new ApiValidationPipe())

	const options = new DocumentBuilder()
		.setTitle('Social Media Scraper')
		.setDescription('Backend API built with Nest.js')
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-docs', app, document)
	await app.listen(3000)
}
bootstrap()
