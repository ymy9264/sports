# 游梦体育 YouMeng Sports

一个基于 Vue3 + ThinkPHP 的体育赛事后台管理系统，支持足球比赛数据的管理与自动抓取。

## 技术栈

**前端**
- Vue 3 + TypeScript
- Vue Router
- Pinia
- Axios
- ECharts
- Element Plus
- Vite

**后端**
- ThinkPHP 6.1
- MySQL
- JWT 身份验证
- PHP cURL 爬虫

## 主要功能

- **登录鉴权**：JWT Token 认证，axios 拦截器自动携带 Token，后端中间件统一验证
- **权限控制**：admin 可管理所有模块，normal 用户仅可访问被授权的模块，路由守卫拦截未授权访问
- **用户管理**：新增/编辑/删除普通用户，支持启用/禁用
- **比赛管理**：增删改查，支持从 titan007 一键抓取当日足球比赛数据
- **球队管理**：增删改查，支持按联赛抓取球队数据
- **球员管理**：增删改查，支持按球队抓取球员数据
- **数据看板**：统计卡片 + ECharts 图表

## 本地运行

### 前端

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 跨域配置

开发环境通过 Vite proxy 解决跨域，配置见 `vite.config.ts`。

生产环境需在后端开启 CORS 中间件。



## License

MIT
