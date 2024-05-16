import { Module } from '@nestjs/common'
import TwitterMockController from './twitter-mock.controller'

@Module({
	controllers: [TwitterMockController],
	providers: [],
})
export default class TwitterMockModule {}
