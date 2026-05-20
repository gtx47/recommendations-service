import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { GetRecommendationsUseCase } from './application/use-cases/get-recommendations/get-recommendations.use-case';
import { CreateRecommendationUseCase } from './application/use-cases/create-recommendation/create-recommendation.use-case';
import { CleanupExpiredUseCase } from './application/use-cases/cleanup-expired/cleanup-expired.use-case';

import { MongoRecommendationRepository } from './infrastructure/persistence/mongo-recommendation.repository';
import {
  RECOMMENDATION_MODEL_NAME,
  RecommendationSchema,
} from './infrastructure/persistence/recommendation.schema';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { HttpProductsClient } from './infrastructure/services/http-products.client';

import { RecommendationsController } from './interfaces/http/recommendations.controller';
import { AdminController } from './interfaces/http/admin.controller';
import { HealthController } from './interfaces/http/health.controller';
import { JwtAuthGuard } from './interfaces/http/guards/jwt-auth.guard';

import {
  RECOMMENDATION_REPOSITORY,
  TOKEN_SERVICE,
  PRODUCTS_CLIENT,
} from './recommendations.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RECOMMENDATION_MODEL_NAME, schema: RecommendationSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [RecommendationsController, AdminController, HealthController],
  providers: [
    GetRecommendationsUseCase,
    CreateRecommendationUseCase,
    CleanupExpiredUseCase,

    JwtAuthGuard,

    { provide: RECOMMENDATION_REPOSITORY, useClass: MongoRecommendationRepository },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    { provide: PRODUCTS_CLIENT, useClass: HttpProductsClient },
  ],
  exports: [RECOMMENDATION_REPOSITORY, TOKEN_SERVICE],
})
export class RecommendationsModule {}
