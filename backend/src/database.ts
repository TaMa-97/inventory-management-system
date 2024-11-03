import Database from 'better-sqlite3';
import { Product, Category, StockMovement } from './types.js';

const db = new Database('inventory.db');

export function setupDatabase() {
  // 商品テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      price INTEGER NOT NULL,
      category TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // カテゴリテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 在庫移動履歴テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS stock_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('IN', 'OUT')),
      note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  // トリガーの作成（updated_at の自動更新用）
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_products_timestamp 
    AFTER UPDATE ON products
    BEGIN
      UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_categories_timestamp 
    AFTER UPDATE ON categories
    BEGIN
      UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);
}

// 商品関連の関数
export function getAllProducts(): Product[] {
  return db.prepare('SELECT * FROM products').all() as Product[];
}

export function getProductById(id: number): Product | undefined {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined;
}

export function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
  const { lastInsertRowid } = db.prepare(`
    INSERT INTO products (name, sku, quantity, price, category)
    VALUES (@name, @sku, @quantity, @price, @category)
  `).run(product);
  
  return getProductById(Number(lastInsertRowid))!;
}

export function updateProduct(id: number, product: Partial<Product>): Product | undefined {
  const sets = Object.keys(product)
    .map(key => `${key} = @${key}`)
    .join(', ');

  db.prepare(`
    UPDATE products
    SET ${sets}
    WHERE id = @id
  `).run({ ...product, id });

  return getProductById(id);
}

export function deleteProduct(id: number): void {
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
}

// 在庫関連の関数
export function updateStock(id: number, quantity: number, note: string = ''): Product | undefined {
  try {
    db.exec('BEGIN TRANSACTION');

    // 在庫数の更新
    db.prepare(`
      UPDATE products
      SET quantity = quantity + ?
      WHERE id = ?
    `).run(quantity, id);

    // 在庫移動履歴の記録
    db.prepare(`
      INSERT INTO stock_movements (product_id, quantity, type, note)
      VALUES (?, ?, ?, ?)
    `).run(id, quantity, quantity > 0 ? 'IN' : 'OUT', note);

    db.exec('COMMIT');

    return getProductById(id);
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function getStockMovements(productId: number): StockMovement[] {
  return db.prepare(`
    SELECT * FROM stock_movements
    WHERE product_id = ?
    ORDER BY created_at DESC
  `).all(productId) as StockMovement[];
}

// カテゴリ関連の関数
export function getAllCategories(): Category[] {
  return db.prepare(`
    SELECT 
      c.*,
      (SELECT COUNT(*) FROM products WHERE category = c.name) as productCount
    FROM categories c
  `).all() as Category[];
}

export function getCategoryById(id: number): Category | undefined {
  return db.prepare(`
    SELECT 
      c.*,
      (SELECT COUNT(*) FROM products WHERE category = c.name) as productCount
    FROM categories c
    WHERE c.id = ?
  `).get(id) as Category | undefined;
}

export function createCategory(category: Omit<Category, 'id' | 'productCount' | 'created_at' | 'updated_at'>): Category {
  const { lastInsertRowid } = db.prepare(`
    INSERT INTO categories (name, description)
    VALUES (@name, @description)
  `).run(category);
  
  return getCategoryById(Number(lastInsertRowid))!;
}

export function updateCategory(id: number, category: Partial<Category>): Category | undefined {
  const sets = Object.keys(category)
    .filter(key => key !== 'productCount')
    .map(key => `${key} = @${key}`)
    .join(', ');

  db.prepare(`
    UPDATE categories
    SET ${sets}
    WHERE id = @id
  `).run({ ...category, id });

  return getCategoryById(id);
}

export function deleteCategory(id: number): void {
  const category = getCategoryById(id);
  if (!category) return;

  if (category.productCount > 0) {
    throw new Error('このカテゴリには商品が登録されているため削除できません');
  }

  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
}