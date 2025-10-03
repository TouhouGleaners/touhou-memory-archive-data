# Touhou Memory Archive - Data
此仓库用来保存Touhou Memory Archive仓库获取到的数据，用于生成Github Pages以展示视频数据。
**在线浏览地址: [Touhou Memory Archive Data](https://touhougleaners.github.io/touhou-memory-archive-data/)**

---

## 📖 项目简介 (Project Overview)

本仓库 (`touhou-memory-archive-data`) 是 **Touhou Memory Archive** 项目的官方数据展示前端。它是一个使用 **Vue 3** 构建的静态网站，旨在为我们归档的东方Project视频数据提供一个清晰、高效的在线浏览、搜索和筛选界面。
本项目**使用**由我们的核心数据仓库导出的 `JSON` 文件，并通过 GitHub Pages 将其可视化，让社区成员可以方便地访问和查阅这些宝贵的视频资料。


## 🔗 数据来源与项目关系

**Touhou Memory Archive** 由两个独立但紧密协作的仓库组成：
1. **数据生产/核心仓库: [touhou-memory-archive](https://github.com/TouhouGleaners/touhou-memory-archive)**
    - **角色**: 数据生产者与管理者。
    - **功能**: 一个强大的 Python 爬虫，负责从 Bilibili 抓取指定的东方相关视频信息，并将其存储在 SQLite 数据库中。
2.  **本仓库/数据展示仓库: [touhou-memory-archive-data](https://github.com/TouhouGleaners/touhou-memory-archive-data/)**
    - **角色**: 数据消费者与展示前端。
    - **功能**: 读取核心仓库导出的 `JSON` 数据，渲染成一个交互式的静态网页，提供公开的在线浏览功能。

这两个仓库共同构成了从**数据采集**到**在线展示**的完整流程。


## ✨ 主要功能 (Features)
- **即时搜索**: 按视频标题、UP主、标签或AV/BV号进行实时模糊搜索。
- **状态筛选**: 根据视频的“东方相关性”审核状态进行精确过滤。
- **动态排序**: 点击表头即可对视频信息、UP主、发布时间等进行升序或降序排序。
- **灵活分页**: 自由选择每页显示的条目数量，或一次性加载所有数据。
- **信息速览**: 通过悬浮提示卡片（Tooltip）快速查看视频封面、简介等详细信息。
- **便捷导航**: 提供“回到顶部”和“滚动到底部”的平滑滚动按钮，优化长列表浏览体验。


## 🚀 本地开发 (Local Development)
如果你希望在本地运行或贡献此前端项目，请遵循以下步骤。
1. **克隆本仓库**
    ```bash
    git clone https://github.com/TouhouGleaners/touhou-memory-archive-data.git
    cd touhou-memory-archive-data
    ```
2. **安装依赖**
    ```bash
    npm install
    ```
3. **准备数据**
    确保项目根目录下的 `/public` 文件夹内有 `videos.json` 数据文件。你可以从本仓库的 `main` 分支下载，或从核心仓库自行导出。
4. **运行开发服务器**
    ```bash
    npm run dev
    ```
    项目将在 `http://localhost:3000` 启动。


## 📦 构建与部署 (Build & Deploy)
本项目配置为自动部署到 GitHub Pages。当你向 `main` 分支推送更新时，网站会自动构建和部署。
如需手动构建，请运行：
```bash
npm run build
```
构建产物会生成在 `docs` 目录中。


## 📄 许可证 (License)
本项目采用 MIT 许可证。有关更多详细信息，请参阅 LICENSE 文件。


## 视频数据结构 (videos.json)
```json
{
  "aid": "视频AV号",
  "bvid": "视频BV号",
  "title": "视频标题",
  "description": "视频简介",
  "pic": "封面图片URL",
  "created": "发布时间 (Unix时间戳)",
  "tags": ["标签1", "标签2"],
  "touhou_status": "东方相关度(0未检查 1自动检测为东方 2自动检测为非东方 3人工检测为东方 4人工检测为非东方)",
  "uploader_name": "UP主名称",
  "parts": [
    {
      "cid": "分P CID",
      "page": "分P序号",
      "part": "分P标题",
      "duration": "分P时长 (秒)",
      "ctime": "分P创建时间 (Unix时间戳)"
    }
  ]
}
```


## 联系方式
如果您有任何问题或建议，可以通过 GitHub Issues 与我们联系。

---

**感谢你对 Touhou Memory Archive 的关注！**