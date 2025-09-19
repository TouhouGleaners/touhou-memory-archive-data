# Touhou Memory Archive Data - 东方记忆档案馆 数据字典
此仓库用来保存Touhou Memory Archive仓库获取到的数据，用于生成Github Pages以展示视频数据。

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