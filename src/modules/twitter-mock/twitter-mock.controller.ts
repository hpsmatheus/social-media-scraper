import { Controller, Get, HttpStatus, Res, UnauthorizedException, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'

type TwitterPostDto = {
	id: string
	text: string
}

const twitterMockToken = 'twitter-mock-token'
@Controller('search')
@ApiTags('Twitter Search  Mock')
export default class TwitterMockController {
	@Get('stream')
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async getTweets(@Headers() headers: any, @Res() res: Response): Promise<any> {
		if (headers.authorization !== `Bearer ${twitterMockToken}`)
			throw new UnauthorizedException('Invalid token')

		const filePath = path.resolve(__dirname, '../../../tweets.json')
		const jsonData = fs.readFileSync(filePath, 'utf8')

		const posts = JSON.parse(jsonData) as TwitterPostDto[]
		const filteredPosts = this.filterRelevantPosts(posts)
		res.status(HttpStatus.OK).send(JSON.stringify(filteredPosts))
	}

	private filterRelevantPosts(posts: TwitterPostDto[]): TwitterPostDto[] {
		const monitoredHashtags = process.env.MONITORED_HASHTAGS.split(',')
		return posts.filter((post) => monitoredHashtags.some((hashtag) => post.text.includes(hashtag)))
	}
}
