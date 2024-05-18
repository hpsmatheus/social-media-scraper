import { HttpStatus, Injectable, NotImplementedException } from '@nestjs/common'
import * as needle from 'needle'
import PostService from '../post/post.service'

@Injectable()
export default class TwitterScraper {
	private twitterSearchUrl = `${process.env.TWITTER_API_URL}/search`

	private apiToken = { Authorization: `Bearer ${process.env.TWITTER_API_TOKEN}` }

	constructor(private readonly postService: PostService) {}

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
			.on('data', (data) => {
				try {
					this.postService.create(JSON.parse(data))
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
				throw new NotImplementedException(error)
			})
	}

	public async setMonitoringRules(): Promise<void> {
		const rulesURL = `${this.twitterSearchUrl}/stream/rules`
		const hashTagFilter = `${process.env.MONITORED_HASHTAGS}`.replaceAll(',', ' OR ')

		const data = {
			add: [{ value: hashTagFilter }],
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
