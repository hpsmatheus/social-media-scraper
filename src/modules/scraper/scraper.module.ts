import { Module, OnModuleInit } from '@nestjs/common'
import { CronExpression } from '@nestjs/schedule'
import { CronJob } from 'cron'
import TwitterScraper from './twitter.scraper'
import CoreModule from '../core/core.module'
import { CacheService } from '../core/cache.service'

@Module({
	imports: [CoreModule],
	controllers: [],
	providers: [],
})
export default class ScraperModule implements OnModuleInit {
	constructor(private readonly cacheService: CacheService) {}

	async onModuleInit(): Promise<void> {
		await this.initTwitterScraper()
	}

	private async initTwitterScraper(): Promise<void> {
		const twitterScraper = new TwitterScraper(this.cacheService)

		if (process.env.TWITTER_MODE.toString().toLowerCase() === 'mock') {
			const job = new CronJob(CronExpression.EVERY_5_SECONDS, () => twitterScraper.getTweets())
			job.start()
		} else {
			await twitterScraper.setMonitoringRules()
		}
	}
}
