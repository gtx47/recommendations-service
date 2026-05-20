import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Recommendation, RecommendationCreateInput, RecommendationFilter } from '../../domain/entities/recommendation.entity';
import { RecommendationRepositoryPort } from '../../domain/ports/recommendation-repository.port';
import {
  RECOMMENDATION_MODEL_NAME,
  RecommendationDocument,
} from './recommendation.schema';

@Injectable()
export class MongoRecommendationRepository implements RecommendationRepositoryPort {
  constructor(
    @InjectModel(RECOMMENDATION_MODEL_NAME)
    private readonly model: Model<RecommendationDocument>,
  ) {}

  async create(input: RecommendationCreateInput): Promise<Recommendation> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const doc = await this.model.create({
      ...input,
      expiresAt,
    });

    return this.toDomain(doc);
  }

  async findByUserId(filter: RecommendationFilter): Promise<Recommendation[]> {
    const docs = await this.model
      .find({ userId: filter.userId, expiresAt: { $gt: new Date() } })
      .sort({ score: -1 })
      .limit(filter.limit || 10)
      .skip(filter.skip || 0)
      .lean();

    return docs.map(doc => this.toDomain(doc));
  }

  async findById(id: string): Promise<Recommendation | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? this.toDomain(doc) : null;
  }

  async deleteExpired(): Promise<number> {
    const result = await this.model.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    return result.deletedCount;
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }

  private toDomain(doc: any): Recommendation {
    return {
      id: doc._id,
      userId: doc.userId,
      productId: doc.productId,
      basedOnProduct: doc.basedOnProduct,
      score: doc.score,
      reason: doc.reason,
      createdAt: doc.createdAt,
      expiresAt: doc.expiresAt,
    };
  }
}
