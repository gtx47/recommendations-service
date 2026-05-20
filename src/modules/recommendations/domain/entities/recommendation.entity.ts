// Domain Models

export interface Recommendation {
  id: string;
  userId: string;
  productId: string;
  basedOnProduct?: string; // productId del producto que lo originó
  score: number;
  reason: 'viewed' | 'purchased' | 'similar_category' | 'trending';
  createdAt: Date;
  expiresAt: Date;
}

export interface RecommendationCreateInput {
  userId: string;
  productId: string;
  basedOnProduct?: string;
  score: number;
  reason: 'viewed' | 'purchased' | 'similar_category' | 'trending';
}

export interface RecommendationFilter {
  userId: string;
  limit?: number;
  skip?: number;
}
