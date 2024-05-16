import { Controller, Get, HttpStatus, Res, UnauthorizedException, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'

const twitterMockToken = 'twitter-mock-token'
@Controller('twitter-mock')
@ApiTags('Twitter Mock')
export default class TwitterMockController {
	@Get()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async getTweets(@Headers() headers: any, @Res() res: Response): Promise<any> {
		if (headers.authorization !== `Bearer ${twitterMockToken}`)
			throw new UnauthorizedException('Invalid token')

		const filePath = path.resolve(__dirname, '../../../tweets.json')
		const jsonData = fs.readFileSync(filePath, 'utf8')

		res.status(HttpStatus.OK).json(jsonData)
	}
}
