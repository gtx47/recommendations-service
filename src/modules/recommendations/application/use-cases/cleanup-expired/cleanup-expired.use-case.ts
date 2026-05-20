import { Inject, Injectable } from '@nestjs/common';
import { RecommendationRepositoryPort } from '../../../domain/ports/recommendation-repository.port';
import { RECOMMENDATION_REPOSITORY } from '../../../recommendations.tokens';

@Injectable()
export class CleanupExpiredUseCase {
  constructor(
    @Inject(RECOMMENDATION_REPOSITORY)
    private readonly repository: RecommendationRepositoryPort,
  ) {}

  async execute(): Promise<number> {
    return this.repository.deleteExpired();
  }
}
