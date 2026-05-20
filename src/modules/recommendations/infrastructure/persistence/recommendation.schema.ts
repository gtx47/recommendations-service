import { Schema, Document } from 'mongoose';

export const RECOMMENDATION_MODEL_NAME = 'Recommendation';

export interface RecommendationDocument extends Document {
  userId: string;
  productId: string;
  basedOnProduct?: string;
  score: number;
  reason: 'viewed' | 'purchased' | 'similar_category' | 'trending';
  createdAt: Date;
  expiresAt: Date;
}

export const RecommendationSchema = new Schema<RecommendationDocument>(
  {
    userId: { type: String, required: true, index: true },
    productId: { type: String, required: true },
    basedOnProduct: { type: String },
    score: { type: Number, required: true, min: 0, max: 100 },
    reason: {
      type: String,
      enum: ['viewed', 'purchased', 'similar_category', 'trending'],
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, index: true },
  },
  {
    timestamps: false,
  },
);

// Auto-delete expired documents
RecommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
