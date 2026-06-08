# 光屿摄影工作室预约系统

Flask + React 实现的摄影工作室预约系统，包含套餐展示、摄影师档期预约、客片交付和在线选片功能。项目按前后端模块拆分，避免把业务全部堆在一个页面或一个接口文件中。

## 功能

- 套餐展示：从 Flask API 获取套餐、价格、时长和服务内容。
- 摄影师档期预约：选择摄影师、日期、时间并提交预约，后端校验档期是否可用。
- 客片交付：通过交付码查看交付相册、状态、过期时间和照片数量。
- 在线选片：选择精修照片并保存，交付摘要会同步更新。

## 项目结构

```text
.
├── backend
│   ├── app
│   │   ├── routes
│   │   │   ├── bookings.py
│   │   │   ├── deliveries.py
│   │   │   ├── packages.py
│   │   │   ├── photographers.py
│   │   │   └── selections.py
│   │   ├── __init__.py
│   │   └── data.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── run.py
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── features
│   │   ├── layout
│   │   └── styles
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
└── docker-compose.yml
```

## 本地启动

后端：

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

前端：

```bash
cd frontend
npm install
npm run dev
```

访问 `http://127.0.0.1:5174`，后端健康检查为 `http://127.0.0.1:5050/api/health`。

## Docker Compose 启动

```bash
docker compose up --build
```

前端：`http://127.0.0.1:5174`

后端：`http://127.0.0.1:5050`

## 示例数据

在线选片模块默认交付码为：

```text
STUDIO-2026-0618
```
