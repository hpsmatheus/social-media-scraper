import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreatePostInput } from 'src/typings/post/post.dto'
import { Post } from 'src/typings/schemas/post.schema'

@Injectable()
export default class PostService {
	constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {}

	async saveMany(incomingPosts: CreatePostInput[]): Promise<void> {
		for (const postInput of incomingPosts) {
			const existingPost = await this.postModel.findOne({ externalId: postInput.id })
			if (!existingPost) {
				const post = new this.postModel({
					externalId: postInput.id,
					text: postInput.text,
					timestamp: postInput.timestamp,
				})

				const result = await post.save()
				Logger.log('saved post', result)
			}
		}
	}

	async archiveOldPosts(): Promise<void> {
		const maxPostsAllowed = Number(process.env.MAX_STORED_POSTS)
		const existingPosts = await this.postModel.countDocuments()
		const postsToDeleteCount = existingPosts - maxPostsAllowed

		if (postsToDeleteCount > 0) {
			const oldestTweets = await this.postModel
				.find()
				.sort({ createdAt: 1 })
				.limit(postsToDeleteCount)
				.select('id')

			const ids = oldestTweets.map((tweet) => tweet._id)
			await this.postModel.deleteMany({ _id: { $in: ids } })
			Logger.warn(`archived ${postsToDeleteCount} posts`)
		}
	}

	async findNewest(): Promise<Post | null> {
		const posts = await this.postModel.find().sort({ timestamp: -1 }).limit(1)
		if (posts.length > 0) return posts[0]
		return null
	}

	async countByInterval(startDate: number, endDate: number): Promise<number> {
		return this.postModel.countDocuments({
			timestamp: {
				$gte: startDate,
				$lte: endDate,
			},
		})
	}
}
