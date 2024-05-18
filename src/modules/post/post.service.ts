import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Post } from 'src/schemas/post.schema'

type CreatePostInput = { id: string; text: string }

@Injectable()
export default class PostService {
	constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {}

	async create(incomingPosts: CreatePostInput[]): Promise<void> {
		for (const postInput of incomingPosts) {
			const existingPost = await this.postModel.findOne({ externalId: postInput.id })
			if (!existingPost) {
				const post = new this.postModel({ externalId: postInput.id, text: postInput.text })
				const result = await post.save()
				Logger.log('saved post', result)
			}
		}
	}
}
