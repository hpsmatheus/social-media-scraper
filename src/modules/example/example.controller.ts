import { Controller, Get, Query } from '@nestjs/common'
import ExampleService from './example.service'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import ExampleResponse from 'src/typings/example/example.response.dto'
import ExampleParams from 'src/typings/example/example.params.dto'

@Controller('example')
@ApiTags('Example')
export default class ExampleController {
	constructor(private readonly exampleService: ExampleService) {}

	@Get()
	@ApiOkResponse({ type: [ExampleResponse] })
	public example(@Query() params: ExampleParams): ExampleResponse {
		if (params.name === 'Maria') throw new Error('Invalid name!')
		return this.exampleService.example(params.name)
	}
}
