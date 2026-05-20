import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { CreateRecommendationUseCase } from '../../application/use-cases/create-recommendation/create-recommendation.use-case';

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQConsumerService.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private connection: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private channel: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly createRecommendationUseCase: CreateRecommendationUseCase,
  ) {}

  async onModuleInit() {
    const url = this.configService.get<string>('RABBITMQ_URL');
    if (!url) {
      this.logger.warn('RABBITMQ_URL not set — consumer disabled');
      return;
    }

    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      await this.setupOrderCompletedConsumer();
      await this.setupProductViewedConsumer();

      this.logger.log('RabbitMQ consumer connected and listening');
    } catch (err) {
      this.logger.error('Failed to connect to RabbitMQ', err);
    }
  }

  private async setupOrderCompletedConsumer() {
    const exchange = 'domain-events';
    const queue = 'recommendations.order.completed';
    const routingKey = 'order.confirmed';

    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, exchange, routingKey);

    this.channel.consume(queue, async (msg: any) => {
      if (!msg) return;
      try {
        const event = JSON.parse(msg.content.toString());
        // payload: { orderId, userId, items: [{ productId, quantity }] }
        const userId: string = event.userId ?? event.payload?.userId ?? '';
        const items: Array<{ productId: string }> =
          event.items ?? event.payload?.items ?? [];

        if (!userId || items.length === 0) {
          this.logger.warn('order.confirmed sin userId o items');
          this.channel.ack(msg);
          return;
        }

        for (const item of items) {
          if (!item.productId) continue;
          await this.createRecommendationUseCase.execute({
            userId,
            productId: item.productId,
            score: 90,
            reason: 'purchased',
          });
        }

        this.channel.ack(msg);
      } catch (err) {
        this.logger.error('Error procesando order.confirmed', err);
        this.channel.nack(msg, false, false);
      }
    });
  }

  private async setupProductViewedConsumer() {
    const exchange = 'domain-events';
    const queue = 'recommendations.product.viewed';
    const routingKey = 'product.viewed';

    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, exchange, routingKey);

    this.channel.consume(queue, async (msg: any) => {
      if (!msg) return;
      try {
        const event = JSON.parse(msg.content.toString());
        const userId: string = event.userId ?? event.payload?.userId ?? '';
        const productId: string = event.productId ?? event.payload?.productId ?? '';

        if (!userId || !productId) {
          this.logger.warn('product.viewed sin userId o productId');
          this.channel.ack(msg);
          return;
        }

        await this.createRecommendationUseCase.execute({
          userId,
          productId,
          score: 60,
          reason: 'viewed',
        });
        this.channel.ack(msg);
      } catch (err) {
        this.logger.error('Error procesando product.viewed', err);
        this.channel.nack(msg, false, false);
      }
    });
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (_) {}
  }
}
