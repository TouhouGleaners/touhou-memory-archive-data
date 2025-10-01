// 状态描述映射
export const statusMap = {
  0: "未检查",
  1: "自动检测为东方",
  2: "自动检测为非东方",
  3: "人工检测为东方",
  4: "人工检测为非东方",
  5: "自动+人工检测为东方"
};

// 格式化日期
export const formatDate = (timestamp, locale = "zh-CN") => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 格式化时间
export const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(hours.toString().padStart(2, '0'));
  }
  parts.push(minutes.toString().padStart(2, '0'));
  parts.push(seconds.toString().padStart(2, '0'));

  return parts.join(':');
};

// 获取状态文本
export const getStatusText = (status) => {
  return statusMap[status] || '未知状态';
};

// 生成视频URL
export const getVideoUrl = (aid, bvid) => {
  // 优先使用BV号，如果没有则使用AV号
  if (bvid) {
    return `https://www.bilibili.com/video/${bvid}`;
  } else if (aid) {
    return `https://www.bilibili.com/video/av${aid}`;
  }
  return '#'; // 如果都没有，返回占位符
};