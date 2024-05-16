import { Injectable, NotImplementedException } from '@nestjs/common'
import * as needle from 'needle'

@Injectable()
export default class TwitterScraper {
	static getTweets(): void {
		const streamURL = process.env.TWITTER_STREAM_URL

		const stream = needle.get(streamURL, {
			headers: {
				'User-Agent': 'v2FilterStreamJS',
				'Authorization': `Bearer ${process.env.TWITTER_API_TOKEN}`,
			},
			timeout: 20000,
		})

		stream
			.on('data', (data) => {
				try {
					console.log('DATA', JSON.parse(data))
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
}
