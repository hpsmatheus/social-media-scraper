import { HttpStatus, Injectable, Logger, NotImplementedException } from '@nestjs/common'
import * as needle from 'needle'
import { CacheService } from '../core/cache.service'

const cacheList = process.env.TWEETS_CACHE_KEY

@Injectable()
export default class TwitterScraper {
	private twitterSearchUrl = `${process.env.TWITTER_API_URL}/search`

	private apiToken = { Authorization: `Bearer ${process.env.TWITTER_API_TOKEN}` }

	constructor(private readonly cacheService: CacheService) {
		this.cacheService = new CacheService()
	}

	getTweets(): void {
		const streamURL = `${this.twitterSearchUrl}/stream`

		const stream = needle.get(streamURL, {
			headers: {
				'User-Agent': 'v2FilterStreamJS',
				...this.apiToken,
			},
			timeout: 20000,
		})

		stream
			.on('data', async (data) => {
				try {
					Logger.log('adding new tweet to cache...')
					await this.cacheService.addToList(cacheList, JSON.parse(data))
				} catch (e) {
					if (data.detail === 'This stream is currently at the maximum allowed connection limit.') {
						console.log(data.detail)
						process.exit(1)
					} else {
						// Keep alive signal received. Do nothing.
					}
				}
			})
			.on('err', (error) => {
				//TODO: implement reconnect strategy
				Logger.error('stream disconnected')
				throw new NotImplementedException(error)
			})
	}

	public async setMonitoringRules(): Promise<void> {
		const rulesURL = `${this.twitterSearchUrl}/stream/rules`
		const hashTagFilter = `${process.env.MONITORED_HASHTAGS}`.replaceAll(',', ' OR ')

		const data = {
			add: [{ value: hashTagFilter, tag: 'monitored_hashtags' }],
		}

		const headers = {
			'content-type': 'application/json',
			...this.apiToken,
		}

		const response = await needle('post', rulesURL, data, { headers })

		if (response.status !== HttpStatus.CREATED) {
			throw new Error('unable to set monitoring rules')
		}
	}
}
