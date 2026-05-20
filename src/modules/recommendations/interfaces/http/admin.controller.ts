import { Controller, Post } from '@nestjs/common';
import { CleanupExpiredUseCase } from '../../application/use-cases/cleanup-expired/cleanup-expired.use-case';

@Controller('admin/recommendations')
export class AdminController {
  constructor(
    private readonly cleanupExpiredUseCase: CleanupExpiredUseCase,
  ) {}

  @Post('cleanup')
  async cleanup() {
    const deleted = await this.cleanupExpiredUseCase.execute();
    return {
      success: true,
      message: `Cleaned up ${deleted} expired recommendations`,
      deleted,
    };
  }
}
