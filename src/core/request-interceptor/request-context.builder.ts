import { ExecutionContext } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import RequestContext from 'src/typings/request-context'

export default class RequestContextBuilder {
	constructor(private readonly context: ExecutionContext) {}

	public build(): RequestContext {
		const requestContext = new RequestContext()
		requestContext.startTime = Date.now()

		requestContext.trackId = this.getTrackIdFromRESTContext()
		requestContext.stringfiedBody = this.getBodyFromRESTContext()
		requestContext.metadata = this.getMetaDataFromRESTContext()

		return requestContext
	}

	private getTrackIdFromRESTContext(): string {
		const { headers } = this.context.switchToHttp().getRequest()
		return this.getTrackIdFrom(headers)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private getTrackIdFrom(headers: any): string {
		if (!headers.trackId) {
			headers.trackId = uuid()
		}
		return headers.trackId
	}

	private getBodyFromRESTContext(): string {
		return JSON.stringify(this.context.switchToHttp().getRequest().body)
	}

	private getMetaDataFromRESTContext(): string {
		const { url, method, params, query } = this.context.switchToHttp().getRequest()

		return JSON.stringify({
			url,
			method,
			params,
			query,
		})
	}
}
