import ExampleResponse from 'src/typings/example/example.response.dto'

export default class ExampleService {
	public example(name: string): ExampleResponse {
		return { message: `Hello, ${name} !` }
	}
}
