import { Module, OnModuleInit } from '@nestjs/common'
import PostService from './post.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Post, PostSchema } from 'src/typings/schemas/post.schema'
import { CronJob } from 'cron'
import { CronExpression } from '@nestjs/schedule'
import PostProcessor from './post.processor'
import CoreModule from '../core/core.module'

@Module({
	imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), CoreModule],
	controllers: [],
	providers: [PostService, PostProcessor],
})
export default class PostModule implements OnModuleInit {
	constructor(private readonly postProcessor: PostProcessor) {}

	async onModuleInit(): Promise<void> {
		await this.initPostsProcessor()
		await this.initAnomalyDetection()
	}

	private async initPostsProcessor(): Promise<void> {
		const job = new CronJob(CronExpression.EVERY_5_SECONDS, () => this.postProcessor.process())
		job.start()
	}

	private async initAnomalyDetection(): Promise<void> {
		const job = new CronJob(CronExpression.EVERY_10_SECONDS, () =>
			this.postProcessor.detectAnomaly()
		)
		job.start()
	}
}
