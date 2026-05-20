export interface ProductsClientPort {
  getProduct(id: string): Promise<any>;
  getProductsByCategory(category: string, limit?: number): Promise<any[]>;
}
