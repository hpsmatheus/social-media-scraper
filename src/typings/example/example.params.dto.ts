import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class ExampleParams {
	@IsString()
	@ApiProperty({ example: 'Jhon' })
	name: string
}
