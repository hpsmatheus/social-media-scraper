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
		if (!process.env.ENVIRONMENT.toString().toLowerCase().includes('prod')) {
			const job = new CronJob(CronExpression.EVERY_10_SECONDS, () =>
				new TwitterScraper(this.postService).getTweets()
			)
			job.start()
		}
	}
}
