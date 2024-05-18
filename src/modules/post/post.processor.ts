import { Injectable, Logger } from '@nestjs/common'
import { CacheService } from '../core/cache.service'
import PostService from './post.service'
import TwitterPostDto from 'src/typings/twitter-post.dto'
import CahcedObject from 'src/typings/cache/cached-object'
import { CreatePostInput } from 'src/typings/post/post.dto'

const cacheList = process.env.TWEETS_CACHE_KEY

class NotificationService {
	static notify(): void {
		Logger.warn('anomaly detected...')
	}
}

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
		)) as CahcedObject<TwitterPostDto>[]

		if (tweets.length > 0) {
			const posts: CreatePostInput[] = tweets.map((tweet) => {
				return {
					id: tweet.object.data.id,
					text: tweet.object.data.text,
					timestamp: tweet.timestamp,
				}
			})

			await this.postService.saveMany(posts)
			await this.cacheService.removeFromList(cacheList, batchSize)
			await this.postService.archiveOldPosts()
		}
	}

	async detectAnomaly(): Promise<void> {
		const averagePosts = Number(process.env.AVERAGE_POSTS_PER_MINUTE)
		const maxVariationPercent = Number(process.env.ANOMALY_VARIATION_PERCENT)

		const anomalyLimit = averagePosts + (maxVariationPercent / 100) * averagePosts

		const newestPost = await this.postService.findNewest()
		if (newestPost) {
			const startDate = newestPost.timestamp - 60000
			const endDate = newestPost.timestamp
			const currentAverage = await this.postService.countByInterval(startDate, endDate)
			if (currentAverage > anomalyLimit) NotificationService.notify()
		}
	}
}
