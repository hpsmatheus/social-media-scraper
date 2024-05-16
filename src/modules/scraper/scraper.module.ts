import { Module, OnModuleInit } from '@nestjs/common'
import { CronExpression } from '@nestjs/schedule'
import { CronJob } from 'cron'
import TwitterScraper from './twitter.scraper'

@Module({
	imports: [],
	controllers: [],
	providers: [],
})
export class ScraperModule implements OnModuleInit {
	async onModuleInit(): Promise<void> {
		if (!process.env.ENVIRONMENT.toString().toLowerCase().includes('prod')) {
			const job = new CronJob(CronExpression.EVERY_10_SECONDS, () => TwitterScraper.getTweets())
			job.start()
		}
	}
}
