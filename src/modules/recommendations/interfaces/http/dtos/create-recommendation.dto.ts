import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';

export class CreateRecommendationDto {
  @IsString()
  productId: string;

  @IsString()
  @IsOptional()
  basedOnProduct?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsEnum(['viewed', 'purchased', 'similar_category', 'trending'])
  reason: 'viewed' | 'purchased' | 'similar_category' | 'trending';
}
