import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type PostDocument = HydratedDocument<Post>

@Schema({
	timestamps: true,
	virtuals: true,
})
export class Post {
	@Prop({ required: true, unique: true, index: true })
	externalId: string

	@Prop({ required: true })
	text: string
}

export const PostSchema = SchemaFactory.createForClass(Post)
