import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { GetRecommendationsUseCase } from '../../application/use-cases/get-recommendations/get-recommendations.use-case';
import { CreateRecommendationUseCase } from '../../application/use-cases/create-recommendation/create-recommendation.use-case';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateRecommendationDto } from './dtos/create-recommendation.dto';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly getRecommendationsUseCase: GetRecommendationsUseCase,
    private readonly createRecommendationUseCase: CreateRecommendationUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getRecommendations(
    @Request() req: any,
    @Query('limit') limit = 10,
    @Query('skip') skip = 0,
  ) {
    const recommendations = await this.getRecommendationsUseCase.execute(
      req.user.userId,
      Number(limit),
      Number(skip),
    );

    return {
      success: true,
      data: recommendations,
      count: recommendations.length,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRecommendation(
    @Request() req: any,
    @Body() body: CreateRecommendationDto,
  ) {
    const recommendation = await this.createRecommendationUseCase.execute({
      userId: req.user.userId,
      productId: body.productId,
      basedOnProduct: body.basedOnProduct,
      score: body.score,
      reason: body.reason,
    });

    return {
      success: true,
      data: recommendation,
    };
  }
}
