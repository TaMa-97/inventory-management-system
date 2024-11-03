import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../database.js';

export const categoryRouter = Router();

const CategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable()
});

// カテゴリ一覧の取得
categoryRouter.get('/', (_: Request, res: Response) => {
  const categories = getAllCategories();
  res.json(categories);
});

// カテゴリの取得
categoryRouter.get('/:id', (req: Request, res: Response) => {
  const category = getCategoryById(Number(req.params.id));
  if (!category) {
    return res.status(404).json({ error: 'カテゴリが見つかりません' });
  }
  res.json(category);
});

// カテゴリの作成
categoryRouter.post('/', (req: Request, res: Response) => {
  try {
    const categoryData = CategorySchema.parse(req.body);
    const category = createCategory({
      name: categoryData.name,
      description: categoryData.description || ''
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: '無効なデータです' });
  }
});

// カテゴリの更新
categoryRouter.patch('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updates = CategorySchema.partial().parse(req.body);
    const category = updateCategory(id, {
      ...updates,
      description: updates.description || undefined
    });
    
    if (!category) {
      return res.status(404).json({ error: 'カテゴリが見つかりません' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: '無効なデータです' });
  }
});

// カテゴリの削除
categoryRouter.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'カテゴリの削除に失敗しました' });
  }
});