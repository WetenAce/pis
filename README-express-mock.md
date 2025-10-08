# Express Mock Server 配置说明

## 概述

本项目已成功将mock server改回使用Express框架，所有数据从JSON文件中获取，提供完整的API模拟服务。

## 启动方式

### 同时启动前端和Express mock server（推荐）
```bash
npm run dev
```

### 单独启动Express mock server
```bash
npm run mock
```

### 单独启动前端
```bash
npm run dev:frontend
```

## API 端点

### 认证相关
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/user` - 获取用户信息

### 菜单管理
- `GET /api/menu` - 获取菜单数据

### 病例管理
- `GET /api/cases` - 获取病例列表（支持分页、搜索、筛选）
- `GET /api/cases/:id` - 获取单个病例详情
- `POST /api/cases` - 登记新病例
- `PUT /api/cases/:id` - 更新病例信息

### 医生管理
- `GET /api/doctors` - 获取医生列表（支持分页、搜索）
- `POST /api/doctors` - 添加医生
- `PUT /api/doctors/:id` - 更新医生信息

### 字典管理
- `GET /api/dict/types` - 获取字典类型列表
- `GET /api/dict/data/:typeId` - 根据类型获取字典数据

## 数据文件

- `mock/db.json` - 主要数据文件，包含所有模拟数据
- `mock/server.js` - Express mock server主文件

## 响应格式

所有API响应都遵循标准格式：
```json
{
  "success": true,
  "data": {...},
  "message": "操作成功"
}
```

## 认证机制

- 使用Bearer Token认证
- 登录后返回token，需要在后续请求的Header中添加：`Authorization: Bearer {token}`
- 默认用户：`admin` / `123456`

## 数据持久化

所有对数据的修改都会实时保存到`mock/db.json`文件中，确保数据在服务器重启后仍然存在。

## 测试 API

可以使用以下命令测试 API：

```bash
# 登录
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'

# 获取病例列表（使用返回的token）
curl -H "Authorization: Bearer mock-jwt-token-xxx" \
  "http://localhost:3002/api/cases?page=1&size=10"

# 获取字典类型
curl -H "Authorization: Bearer mock-jwt-token-xxx" \
  "http://localhost:3002/api/dict/types"
```

## 主要特性

1. **数据持久化**：所有数据修改实时保存到JSON文件
2. **标准响应格式**：统一的API响应格式
3. **完整认证**：基于Token的认证机制
4. **分页支持**：所有列表接口支持分页
5. **搜索筛选**：支持关键词搜索和条件筛选
6. **数据一致性**：所有数据从单一JSON文件管理
