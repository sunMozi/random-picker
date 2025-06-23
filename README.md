# 课堂随机点名系统

## 项目简介

这是一个为课堂教学设计的随机点名系统，帮助教师快速随机选择学生回答问题或参与课堂活动。系统具备友好的用户界面和多种实用功能，适用于各类教学场景。

## 功能列表

- 随机点名功能：从学生名单中随机选择学生。
- 点名记录：记录每次点名结果，便于后续查阅。
- 可视化展示：通过图表展示学生被点名频率。

## 技术栈

- 前端框架：React + TypeScript
- 样式工具：Tailwind CSS
- 构建工具：Vite
- 状态管理：React 内置状态管理
- 图表支持：Chart.js 或类似库

## 安装步骤

1. 确保已安装 Node.js 和 npm。
2. 克隆项目到本地：
   ```bash
   git clone https://github.com/sunMozi/random-picker
   ```
3. 进入项目目录并安装依赖：
   ```bash
   cd classroom-random-caller
   npm install
   ```
4. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 使用说明

1. 打开浏览器访问 `http://localhost:3000`（默认地址）。
2. 系统会自动加载 `public/names.txt` 中的学生名单。
3. 点击“随机点名”按钮开始选择学生。
4. 点名结果会显示在页面上，并自动记录历史数据。
5. 可通过“导出记录”功能保存点名历史。

## 项目结构

```
├── public/                  # 静态资源文件
│   ├── names.txt              # 学生名单文件
│   └── tick-sound.mp3       # 点名提示音
├── src/                     # 源代码目录
│   ├── components/            # UI 组件
│   ├── shared/                # 公共组件或工具
│   ├── App.tsx                # 主应用组件
│   └── main.tsx               # 入口文件
├── README.md                # 项目说明文档
└── package.json             # 项目依赖与脚本配置
```

## 依赖管理

- 主要依赖项：
  - React & ReactDOM
  - TypeScript
  - Tailwind CSS
  - Vite
- 开发依赖项：
  - Eslint & Prettier（代码规范）
  - Vitest（测试框架，如适用）

## 贡献指南

1. Fork 本仓库。
2. 创建新分支 (`git checkout -b feature/new-feature`)。
3. 提交更改 (`git commit -m 'Add new feature'`)。
4. 推送分支 (`git push origin feature/new-feature`)。
5. 提交 Pull Request 并等待审核。

## 许可证

本项目采用 MIT License，请查看根目录下的 `LICENSE` 文件获取详细信息。
