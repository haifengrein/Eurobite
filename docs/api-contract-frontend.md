# EuroBite 前端 API 契约（C 端 Web 客户端）

> 目标：统一 EuroBite 后端与 `frontend-task.md` 所使用的 API 设计，使前后端协作有一套清晰、一致、可演进的契约。  
> 范围：仅覆盖 **C 端用户 Web 客户端** 使用的接口（登录、菜单、购物车、地址、订单），后台管理端 API 另行设计。

约定：
- 所有接口路径前缀：`/api`（如果未来引入版本号，可统一调整为 `/api/v1/...`）。  
- 所有响应统一使用 `R<T>` 包装（见 `task_v2.md` Phase 1）。  
- 需要认证的接口，使用 `Authorization: Bearer <JWT>` 头部。

---

## 1. 用户认证 & 会话

### 1.1 用户登录

- 方法：`POST /api/auth/user/login`
- 描述：用户通过手机号（或邮箱）登录，成功后返回 JWT。
- 请求体示例：

```json
{
  "phone": "+49123456789",
  "code": "123456"
}
```

- 响应体（成功）：

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "token": "jwt-token-string",
    "user": {
      "id": 1,
      "name": "Alice",
      "phone": "+49123456789"
    }
  }
}
```

前端约定：
- 成功后将 `token` 持久化到 `localStorage` 或 `sessionStorage`，并更新全局 `useUserStore`。  
- 失败（`code != 0` 或 HTTP 401）时展示 toast，并保留在登录页。

### 1.2 获取当前用户信息

- 方法：`GET /api/user/me`
- 描述：获取当前登录用户的基础信息。
- 响应体（成功）：

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": 1,
    "name": "Alice",
    "phone": "+49123456789",
    "defaultAddressId": 10
  }
}
```

前端用途：
- App 初始化时获取用户信息，用于展示头像/昵称、默认地址等。

---

## 2. 菜单 & 菜品（首页点餐）

### 2.1 获取分类列表

- 方法：`GET /api/menu/categories`
- 描述：获取前台展示用的菜品/套餐分类列表。
- 查询参数（可选）：
  - `type`：`dish` / `setmeal`，不传则返回所有。
- 响应体：

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "name": "Burgers",
      "type": "dish",
      "sort": 1
    }
  ]
}
```

### 2.2 获取菜品列表

- 方法：`GET /api/menu/dishes`
- 描述：按分类获取可售卖菜品列表。
- 查询参数：
  - `categoryId`：分类 ID（必填）。  
- 响应体：

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": 101,
      "name": "Cheeseburger",
      "price": 9.99,
      "image": "https://cdn.../cheeseburger.png",
      "description": "Beef burger with cheese",
      "status": 1
    }
  ]
}
```

> 说明：如果后续前端需要套餐数据，可扩展 `GET /api/menu/setmeals`，风格类似。

---

## 3. 购物车（Shopping Cart）

### 3.1 获取当前购物车

- 方法：`GET /api/cart`
- 描述：获取当前登录用户的购物车内容。
- 响应体：

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": 1001,
      "dishId": 101,
      "setmealId": null,
      "name": "Cheeseburger",
      "image": "https://cdn.../cheeseburger.png",
      "number": 2,
      "amount": 19.98
    }
  ]
}
```

### 3.2 添加或增加购物车项

- 方法：`POST /api/cart/items`
- 描述：向购物车添加一个项目（菜品或套餐）。如果已存在则数量 +1。
- 请求体示例：

```json
{
  "dishId": 101,
  "setmealId": null
}
```

- 响应体：返回更新后的该购物车项。

前端约定：
- 使用乐观更新：先在本地 `useCartStore` 中增加，再根据接口结果校正。

### 3.3 减少购物车项数量 / 删除

- 方法：`PATCH /api/cart/items/{itemId}/decrease`
- 描述：将指定购物车项数量 -1；如减到 0，后端可直接删除。

- 方法：`DELETE /api/cart/items/{itemId}`
- 描述：直接删除某个购物车项。

### 3.4 清空购物车

- 方法：`DELETE /api/cart`
- 描述：删除当前用户购物车中的所有项目。

---

## 4. 地址管理（Address Book）

### 4.1 获取地址列表

- 方法：`GET /api/address-book`
- 描述：获取当前用户的收货地址列表。

### 4.2 创建新地址

- 方法：`POST /api/address-book`
- 请求体示例：

```json
{
  "consignee": "Alice",
  "phone": "+49123456789",
  "detail": "Street 1, Berlin",
  "label": "Home",
  "isDefault": true
}
```

### 4.3 更新地址

- 方法：`PUT /api/address-book/{id}`
- 描述：更新已有地址信息。

### 4.4 删除地址

- 方法：`DELETE /api/address-book/{id}`

前端用途：
- Phase 5 中的地址管理页面与下单页地址选择依赖这些接口。

---

## 5. 订单（订单提交与历史）

### 5.1 提交订单

- 方法：`POST /api/orders`
- 描述：从当前购物车生成订单。
- 请求体示例：

```json
{
  "addressId": 10,
  "remark": "No onions, please"
}
```

- 响应体（成功）：

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "orderId": 5001,
    "amount": 29.97,
    "status": "PENDING"
  }
}
```

前端约定：
- 成功后展示成功页或 toast，并跳转到订单列表。

### 5.2 获取当前用户订单列表

- 方法：`GET /api/orders/me`
- 描述：分页返回当前用户的订单列表。
- 查询参数：
  - `page`：页码，从 1 开始。  
  - `size`：每页条数（默认 10）。  
  - `status`（可选）：`PENDING`/`DELIVERING`/`COMPLETED` 等。  

### 5.3 获取订单详情

- 方法：`GET /api/orders/{orderId}`
- 描述：获取单个订单的详细信息（商品列表、金额、状态流转）。

---

## 6. 前后端对照 & 对 `frontend-task.md` 的影响

为避免歧义，前端任务中旧的 API 路径与新契约的映射如下（建议全面替换为新路径）：

- 原：`POST /api/user/login` → 新：`POST /api/auth/user/login`
- 原：`GET /api/category/list` → 新：`GET /api/menu/categories`
- 原：`GET /api/dish/list` → 新：`GET /api/menu/dishes?categoryId=...`
- 原：`POST /api/shoppingCart/add` → 新：`POST /api/cart/items`
- 原：`GET /api/addressBook` → 新：`GET /api/address-book`
- 原：`POST /api/addressBook` → 新：`POST /api/address-book`
- 原：`POST /api/order/submit` → 新：`POST /api/orders`
- 原：`GET /api/order/userPage` → 新：`GET /api/orders/me`

前端开发时应以本文件为准，后端在实现各模块 Controller 时，也应确保路径与此契约保持一致。  

