# API 仕様書

## ベース URL

```
開発環境: http://localhost:3000/api
```

## エンドポイント一覧

### 商品管理 API

#### 商品一覧の取得

```
GET /products

レスポンス:
{
  "products": [
    {
      "id": 1,
      "name": "商品A",
      "sku": "PROD-001",
      "quantity": 100,
      "price": 1000,
      "category": "電化製品"
    }
  ]
}
```

#### 商品の取得

```
GET /products/:id

レスポンス:
{
  "id": 1,
  "name": "商品A",
  "sku": "PROD-001",
  "quantity": 100,
  "price": 1000,
  "category": "電化製品"
}
```

#### 商品の登録

```
POST /products
Content-Type: application/json

リクエストボディ:
{
  "name": "商品A",
  "sku": "PROD-001",
  "quantity": 100,
  "price": 1000,
  "category": "電化製品"
}

レスポンス:
{
  "id": 1,
  "name": "商品A",
  "sku": "PROD-001",
  "quantity": 100,
  "price": 1000,
  "category": "電化製品"
}
```

#### 商品の更新

```
PATCH /products/:id
Content-Type: application/json

リクエストボディ:
{
  "name": "商品A（更新）",
  "price": 1200
}

レスポンス:
{
  "id": 1,
  "name": "商品A（更新）",
  "sku": "PROD-001",
  "quantity": 100,
  "price": 1200,
  "category": "電化製品"
}
```

#### 商品の削除

```
DELETE /products/:id

レスポンス:
204 No Content
```

#### 在庫数の調整

```
POST /products/:id/stock
Content-Type: application/json

リクエストボディ:
{
  "quantity": 10  // 正数: 入庫、負数: 出庫
}

レスポンス:
{
  "id": 1,
  "name": "商品A",
  "sku": "PROD-001",
  "quantity": 110,
  "price": 1000,
  "category": "電化製品"
}
```

## エラーレスポンス

```json
{
  "error": "エラーメッセージ"
}
```

## ステータスコード

- 200: 成功
- 201: 作成成功
- 204: 削除成功
- 400: リクエスト不正
- 404: リソースが見つからない
- 500: サーバーエラー
