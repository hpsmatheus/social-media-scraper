import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreatePostInput } from 'src/typings/post/post.dto'
import { Post } from 'src/typings/schemas/post.schema'

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
