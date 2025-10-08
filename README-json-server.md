# JSON-Server 配置说明

## 概述

本项目已将原有的 Express mock server 替换为 json-server，提供更简单、更标准化的 API 模拟服务。

## 启动方式

### 同时启动前端和 json-server（推荐）
```bash
npm run dev
```

### 单独启动 json-server
```bash
npm run mock
```

### 单独启动前端
```bash
npm run dev:frontend
```

## API 端点

json-server 会自动为 db.json 中的每个顶级键创建 RESTful API：

- `GET /users` - 获取用户列表
- `GET /cases` - 获取病例列表
- `GET /doctors` - 获取医生列表
- `GET /dictTypes` - 获取字典类型
- `GET /dictData` - 获取字典数据

## 数据文件

- `mock/db.json` - 主要数据文件
- `mock/routes.json` - 路由重写配置（暂未使用）
- `mock/middleware.cjs` - 自定义中间件（暂未使用）

## 注意事项

1. **端口**: json-server 默认运行在端口 3001
2. **认证**: 当前版本使用简单的 token 验证
3. **数据持久化**: 所有对数据的修改都会实时保存到 db.json 文件中
4. **API 兼容性**: 大部分 API 端点与之前的 mock server 保持兼容

## 测试 API

可以使用以下命令测试 API：

```bash
# 获取病例列表
curl http://localhost:3001/cases

# 获取用户信息（需要认证）
curl -H "Authorization: Bearer mock-jwt-token-123" http://localhost:3001/users/1

# 登录
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

## 自定义配置

如果需要更复杂的路由或中间件，可以修改以下文件：

- `mock/json-server-start.cjs` - 自定义启动脚本
- `mock/middleware.cjs` - 自定义中间件
- `mock/routes.json` - 路由重写规则
