import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class CacheService {
	private readonly redisClient: Redis

	constructor() {
		this.redisClient = new Redis({
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT),
		})
	}

	async addToList(listKey: string, elements: unknown): Promise<void> {
		await this.redisClient.lpush(listKey, JSON.stringify(elements))
	}

	async getListRecords(listKey: string, count: number): Promise<unknown[]> {
		const records = await this.redisClient.lrange(listKey, 0, count - 1)
		return records.map((item) => JSON.parse(item))
	}

	async removeFromList(listKey: string, count: number): Promise<void> {
		await this.redisClient.ltrim(listKey, count, -1)
	}
}
