

# 课堂随机点名系统

## 项目简介
这是一个课堂随机点名系统，旨在帮助教师随机选择学生回答问题，使教学互动更加公平和有趣。

## 功能列表
- 随机选取学生
- 展示点名历史记录
- 支持学生权重设置
- 提供学生喜欢度排行榜
- 包含导航布局与页面结构组件

## 技术栈
- 前端: React + TypeScript
- 样式: Tailwind CSS
- 构建工具: Vite
- 状态管理: 内置 React Hooks
- 数据存储: 本地存储（localStorage）

## 安装步骤
1. 克隆仓库
2. 运行 `npm install` 安装依赖
3. 运行 `npm run dev` 启动开发服务器

## 使用说明
1. 将学生姓名列表放入 `public/names.txt` 文件中，每行一个名字
2. 访问应用主页，点击“开始点名”按钮
3. 系统将随机选择一个学生，并播放声音提示
4. 查看点名历史记录，或查看学生喜欢度排行榜

## 项目结构
```
├── public/
│   ├── names.txt
│   └── tick-sound.mp3
├── src/
│   ├── components/
│   │   ├── AttendanceBarChart.tsx
│   │   ├── Layout.tsx
│   │   ├── NineGrid.tsx
│   │   └── sections/
│   │       ├── HomeWork.tsx
│   │       └── LikeRanking.tsx
│   ├── shared/
│   │   ├── BtnLink.tsx
│   │   ├── Button.tsx
│   │   ├── Container.tsx
│   │   ├── NavItem.tsx
│   │   ├── Paragraph.tsx
│   │   ├── TextTitle.tsx
│   │   ├── Title.tsx
│   │   └── WebsiteLink.tsx
│   ├── App.tsx
│   └── main.tsx
├── README.md
├── package.json
└── vite.config.ts
```

## 依赖管理
依赖项管理使用 npm，具体依赖信息请查看 `package.json` 文件。

## 贡献指南
欢迎为本项目做出贡献。请遵循以下步骤：
1. Fork 本项目
2. 创建新分支
3. 提交 Pull Request

## 许可证
本项目基于 MIT 许可证。详情请查看 `LICENSE` 文件。
