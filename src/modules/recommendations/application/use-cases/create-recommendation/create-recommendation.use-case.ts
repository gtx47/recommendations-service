import { Inject, Injectable } from '@nestjs/common';
import { Recommendation, RecommendationCreateInput } from '../../../domain/entities/recommendation.entity';
import { RecommendationRepositoryPort } from '../../../domain/ports/recommendation-repository.port';
import { RECOMMENDATION_REPOSITORY } from '../../../recommendations.tokens';

@Injectable()
export class CreateRecommendationUseCase {
  constructor(
    @Inject(RECOMMENDATION_REPOSITORY)
    private readonly repository: RecommendationRepositoryPort,
  ) {}

  async execute(input: RecommendationCreateInput): Promise<Recommendation> {
    // Set expiration date to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return this.repository.create({
      ...input,
    });
  }
}
