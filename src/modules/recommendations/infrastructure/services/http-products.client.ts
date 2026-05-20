import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ProductsClientPort } from '../../domain/ports/products-client.port';

@Injectable()
export class HttpProductsClient implements ProductsClientPort {
  private readonly client: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    const baseURL = this.config.getOrThrow<string>('PRODUCTS_URL');
    this.client = axios.create({
      baseURL,
      timeout: 5000,
    });
  }

  async getProduct(id: string): Promise<any> {
    try {
      const response = await this.client.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  }

  async getProductsByCategory(category: string, limit = 5): Promise<any[]> {
    try {
      const response = await this.client.get('/products', {
        params: { category, limit },
      });
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      return [];
    }
  }
}
