import { IsString, IsNumber, IsOptional } from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  MONGO_URI: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  PRODUCTS_URL: string;

  @IsOptional()
  @IsString()
  RABBITMQ_URL?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const env = new EnvironmentVariables();

  Object.assign(env, {
    PORT: parseInt(config.PORT as string, 10) || 3006,
    MONGO_URI: config.MONGO_URI,
    JWT_SECRET: config.JWT_SECRET,
    PRODUCTS_URL: config.PRODUCTS_URL,
    RABBITMQ_URL: config.RABBITMQ_URL,
  });

  return env;
}
