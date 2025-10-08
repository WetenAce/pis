# Vue PIS 系统

一个基于 Vue 3 + Element Plus 的标准管理系统，包含登录认证、Token验证、侧边菜单等功能。

## 功能特性

- ✅ **用户认证系统**
  - 登录/登出功能
  - Token验证机制
  - 路由守卫保护

- ✅ **Axios HTTP客户端**
  - 请求/响应拦截器
  - Token自动添加
  - 错误统一处理

- ✅ **侧边菜单栏**
  - 可折叠/展开
  - JSON配置菜单
  - 动态路由导航

- ✅ **Mock数据**
  - 模拟登录API
  - 模拟用户信息
  - 模拟菜单数据

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **UI组件库**: Element Plus
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **HTTP客户端**: Axios
- **构建工具**: Vite

## 项目结构

```
vue_pis/
├── src/
│   ├── components/          # 公共组件
│   ├── views/              # 页面组件
│   │   ├── Login.vue       # 登录页面
│   │   ├── Home.vue        # 主页布局
│   │   ├── Dashboard.vue   # 仪表盘
│   │   └── Profile.vue     # 个人资料
│   ├── router/             # 路由配置
│   │   └── index.js
│   ├── stores/             # 状态管理
│   │   └── auth.js         # 认证状态
│   ├── utils/              # 工具函数
│   │   └── axios.js        # Axios配置
│   ├── data/               # 数据文件
│   │   └── menu.json       # 菜单配置
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── package.json
├── vite.config.js
└── index.html
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 使用说明

### 登录信息
- **用户名**: `admin`
- **密码**: `123456`

### 主要功能

1. **登录认证**
   - 输入用户名密码登录
   - Token自动保存到localStorage
   - 登录状态持久化

2. **主页布局**
   - 左侧可折叠菜单栏
   - 顶部用户信息栏
   - 右侧内容展示区

3. **菜单管理**
   - 菜单数据通过JSON配置
   - 支持多级嵌套菜单
   - 图标动态渲染

4. **Token验证**
   - 路由守卫验证Token
   - Token过期自动跳转登录
   - 请求头自动添加Token

### 菜单配置

菜单通过 `src/data/menu.json` 文件配置：

```json
{
  "id": 1,
  "name": "仪表盘",
  "path": "/dashboard",
  "icon": "Odometer",
  "children": []
}
```

字段说明：
- `id`: 菜单唯一标识
- `name`: 菜单显示名称
- `path`: 路由路径
- `icon`: Element Plus图标名称
- `children`: 子菜单数组

## API Mock

项目使用Mock数据模拟后端API：

- `mockApi.login()` - 模拟登录
- `mockApi.getUserInfo()` - 获取用户信息
- `mockApi.getMenuData()` - 获取菜单数据

## 开发说明

### 添加新页面
1. 在 `src/views/` 创建Vue组件
2. 在 `src/router/index.js` 添加路由
3. 在 `src/data/menu.json` 添加菜单项

### 自定义样式
- 使用Element Plus主题变量
- 组件样式使用scoped CSS
- 全局样式在 `src/App.vue` 中定义

## 注意事项

- 项目使用Vue 3 Composition API
- 图标需要从Element Plus Icons导入
- Token存储在localStorage中
- 所有API调用都有Mock实现

## 许可证

MIT License
