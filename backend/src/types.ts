export interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: number;
  product_id: number;
  quantity: number;
  type: 'IN' | 'OUT';
  note: string;
  created_at: string;
}