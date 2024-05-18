import { Module, OnModuleInit } from '@nestjs/common'
import { CronExpression } from '@nestjs/schedule'
import { CronJob } from 'cron'
import TwitterScraper from './twitter.scraper'
import PostModule from '../post/post.module'
import PostService from '../post/post.service'

@Module({
	imports: [PostModule],
	controllers: [],
	providers: [],
})
export default class ScraperModule implements OnModuleInit {
	constructor(private readonly postService: PostService) {}

	async onModuleInit(): Promise<void> {
		const twitterScraper = new TwitterScraper(this.postService)

		if (process.env.TWITTER_MODE.toString().toLowerCase() === 'mock') {
			const job = new CronJob(CronExpression.EVERY_10_SECONDS, () => twitterScraper.getTweets())
			job.start()
		} else {
			await twitterScraper.setMonitoringRules()
		}
	}
}
