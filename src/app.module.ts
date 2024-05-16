import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import ExampleModule from './modules/example/example.module'
import TwitterMockModule from './modules/twitter-mock/twitter-mock.module'
import { ScraperModule } from './modules/scraper/scraper.module'

@Module({
	imports: [ConfigModule.forRoot(), ExampleModule, TwitterMockModule, ScraperModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
