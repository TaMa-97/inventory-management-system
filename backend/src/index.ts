import express from 'express';
import cors from 'cors';
import { productRouter } from './routes/products.js';
import { categoryRouter } from './routes/categories.js';
import { setupDatabase } from './database.js';

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.netlify.app']  // フロントエンドのURLに更新
    : true
}));

app.use(express.json());

// データベースのセットアップ
setupDatabase();

// ルート設定
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});