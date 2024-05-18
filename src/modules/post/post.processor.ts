import { Injectable, Logger } from '@nestjs/common'
import { CacheService } from '../core/cache.service'
import PostService from './post.service'
import TwitterPostDto from 'src/typings/twitter-post.dto'

const cacheList = process.env.TWEETS_CACHE_KEY

@Injectable()
export default class PostProcessor {
	constructor(
		private readonly postService: PostService,
		private readonly cacheService: CacheService
	) {}

	async process(): Promise<void> {
		Logger.log('getting new tweets...')
		const batchSize = Number(process.env.POST_PROCESSING_BATCH_SIZE)

		const tweets = (await this.cacheService.getListRecords(
			cacheList,
			batchSize
		)) as TwitterPostDto[]

		if (tweets.length > 0) {
			const posts = tweets.map((tweet) => {
				return { id: tweet.data.id, text: tweet.data.text }
			})
			await this.postService.create(posts)
			await this.cacheService.removeFromList(cacheList, batchSize)
		}
	}
}
