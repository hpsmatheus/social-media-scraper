import { Module } from '@nestjs/common'
import PostService from './post.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Post, PostSchema } from 'src/schemas/post.schema'

@Module({
	imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
	controllers: [],
	providers: [PostService],
	exports: [PostService],
})
export default class PostModule {}
