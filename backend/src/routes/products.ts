import { Router } from 'express';
import { z } from 'zod';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getStockMovements
} from '../database.js';

export const productRouter = Router();

const ProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  quantity: z.number().int().min(0),
  price: z.number().int().min(0),
  category: z.string().min(1)
});

// 商品一覧の取得
productRouter.get('/', (_, res) => {
  const products = getAllProducts();
  res.json(products);
});

// 商品の取得
productRouter.get('/:id', (req, res) => {
  const product = getProductById(Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: '商品が見つかりません' });
  }
  res.json(product);
});

// 商品の作成
productRouter.post('/', (req, res) => {
  try {
    const productData = ProductSchema.parse(req.body);
    const product = createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: '無効なデータです' });
  }
});

// 商品の更新
productRouter.patch('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const updates = ProductSchema.partial().parse(req.body);
    const product = updateProduct(id, updates);
    
    if (!product) {
      return res.status(404).json({ error: '商品が見つかりません' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: '無効なデータです' });
  }
});

// 商品の削除
productRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  deleteProduct(id);
  res.status(204).send();
});

// 在庫数の調整
productRouter.post('/:id/stock', (req, res) => {
  try {
    const id = Number(req.params.id);
    const { quantity, note } = z.object({
      quantity: z.number().int(),
      note: z.string().optional()
    }).parse(req.body);
    
    const product = updateStock(id, quantity, note);
    if (!product) {
      return res.status(404).json({ error: '商品が見つかりません' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: '無効なデータです' });
  }
});

// 在庫移動履歴の取得
productRouter.get('/:id/stock-movements', (req, res) => {
  const id = Number(req.params.id);
  const movements = getStockMovements(id);
  res.json(movements);
});