import { Controller, Get, HttpStatus, Res, UnauthorizedException, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import TwitterPostDto from 'src/typings/twitter-post.dto'

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
		const post = JSON.parse(jsonData) as TwitterPostDto

		if (this.isPostRelevant(post)) return res.status(HttpStatus.OK).send(JSON.stringify(post))
		return
	}

	private isPostRelevant(post: TwitterPostDto): boolean {
		const monitoredHashtags = process.env.MONITORED_HASHTAGS.split(',')
		return monitoredHashtags.some((hashtag) => post.data.text.includes(hashtag))
	}
}
