import { Recommendation, RecommendationCreateInput, RecommendationFilter } from '../entities/recommendation.entity';

export interface RecommendationRepositoryPort {
  create(input: RecommendationCreateInput): Promise<Recommendation>;
  findByUserId(filter: RecommendationFilter): Promise<Recommendation[]>;
  findById(id: string): Promise<Recommendation | null>;
  deleteExpired(): Promise<number>;
  delete(id: string): Promise<void>;
}
