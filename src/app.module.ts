import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import TwitterMockModule from './modules/twitter-mock/twitter-mock.module'
import ScraperModule from './modules/scraper/scraper.module'
import { MongooseModule } from '@nestjs/mongoose'
import PostModule from './modules/post/post.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		TwitterMockModule,
		ScraperModule,
		PostModule,
	],
	controllers: [],
	providers: [],
})
export default class AppModule {}
