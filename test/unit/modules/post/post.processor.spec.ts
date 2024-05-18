import { mock } from 'jest-mock-extended'
import { CacheService } from 'src/modules/core/cache.service'
import PostProcessor, { NotificationService } from 'src/modules/post/post.processor'
import PostService from 'src/modules/post/post.service'

describe('Post Processor Tests', () => {
	const cacheService = mock<CacheService>()
	const postService = mock<PostService>()
	const postProcessor = new PostProcessor(postService, cacheService)

	const averagePostsPerMinute = 1000
	const anomalyVariationPercent = 50

	process.env = {
		AVERAGE_POSTS_PER_MINUTE: `${averagePostsPerMinute}`,
		ANOMALY_VARIATION_PERCENT: `${anomalyVariationPercent}`,
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('Anomaly detection tests', () => {
		beforeEach(() => {
			postService.findNewest.mockResolvedValueOnce(Object())
		})
		it('should notify when anomaly is found', async () => {
			const postsOverTheAverage =
				averagePostsPerMinute + averagePostsPerMinute * (anomalyVariationPercent / 100) + 1
			postService.countByInterval.mockResolvedValueOnce(postsOverTheAverage)
			const notificationService = jest.spyOn(NotificationService, 'notify')

			await postProcessor.detectAnomaly()
			expect(notificationService).toHaveBeenCalledTimes(1)
		})

		it('should not detect anomaly if posts count is under limit', async () => {
			postService.countByInterval.mockResolvedValueOnce(averagePostsPerMinute)
			const notificationService = jest.spyOn(NotificationService, 'notify')

			await postProcessor.detectAnomaly()
			expect(notificationService).not.toHaveBeenCalled()
		})
	})
})
