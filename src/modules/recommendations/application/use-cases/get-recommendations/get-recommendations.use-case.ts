import { Inject, Injectable } from '@nestjs/common';
import { Recommendation, RecommendationFilter } from '../../../domain/entities/recommendation.entity';
import { RecommendationRepositoryPort } from '../../../domain/ports/recommendation-repository.port';
import { RECOMMENDATION_REPOSITORY } from '../../../recommendations.tokens';

@Injectable()
export class GetRecommendationsUseCase {
  constructor(
    @Inject(RECOMMENDATION_REPOSITORY)
    private readonly repository: RecommendationRepositoryPort,
  ) {}

  async execute(userId: string, limit = 10, skip = 0): Promise<Recommendation[]> {
    const filter: RecommendationFilter = {
      userId,
      limit,
      skip,
    };

    return this.repository.findByUserId(filter);
  }
}
