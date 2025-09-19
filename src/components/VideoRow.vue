<template>
  <tr>
    <td>
      <div class="video-title">
        <VideoTooltip :video="video">
          <a 
            :href="getVideoUrl(video.aid, video.bvid)" 
            target="_blank" 
            rel="noopener noreferrer"
            class="video-link"
            v-html="highlightedTitle"
          ></a>
        </VideoTooltip>
      </div>
      <div class="video-meta">
        av{{ video.aid || '' }} | {{ video.bvid || '' }} | 时长: {{ formatTime(totalDuration) }}
      </div>
      <div class="tags" v-if="video.tags && video.tags.length > 0">
        <span class="tag" v-for="tag in video.tags" :key="tag">{{ tag }}</span>
      </div>
    </td>
    <td>
      <span v-html="highlightedUploader"></span>
    </td>
    <td>{{ video.created ? formatDate(video.created) : '未知日期' }}</td>
    <td>
      <div :class="['status', `status-${video.touhou_status}`]">
        {{ getStatusText(video.touhou_status) }}
      </div>
    </td>
    <td>
      <div class="parts-container">
        <div v-if="!video.parts || video.parts.length === 0" class="part-item">
          无分P信息
        </div>
        <div v-else-if="video.parts.length === 1" class="part-item">
          <div class="part-title">P1: {{ video.parts[0].part }}</div>
          <div class="part-meta">
            <span>时长: {{ formatTime(video.parts[0].duration) }}</span>
            <span>创建: {{ formatDate(video.parts[0].ctime) }}</span>
          </div>
        </div>
        <div v-else class="parts-multi">
          <div class="parts-summary" @click="togglePartsExpanded">
            <div class="parts-header">
              <span class="parts-count">{{ video.parts.length }} 个分P</span>
              <span class="toggle-icon" :class="{ expanded: partsExpanded }">
                {{ partsExpanded ? '▼' : '▶' }}
              </span>
            </div>
            <div class="parts-preview" v-if="!partsExpanded">
              总时长: {{ formatTime(totalDuration) }}
            </div>
          </div>
          <div class="parts-list fade-in" v-show="partsExpanded">
            <div 
              class="part-item" 
              v-for="part in video.parts" 
              :key="part.page"
            >
              <div class="part-title">P{{ part.page }}: {{ part.part }}</div>
              <div class="part-meta">
                <span>时长: {{ formatTime(part.duration) }}</span>
                <span>创建: {{ formatDate(part.ctime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import { computed, ref } from 'vue'
import VideoTooltip from './VideoTooltip.vue'

export default {
  name: 'VideoRow',
  components: {
    VideoTooltip
  },
  props: {
    video: {
      type: Object,
      required: true
    },
    searchTerm: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // 分P展开状态
    const partsExpanded = ref(false)

    // 切换分P展开状态
    const togglePartsExpanded = () => {
      partsExpanded.value = !partsExpanded.value
    }
    // 状态描述映射
    const statusMap = {
      0: "未检查",
      1: "自动检测为东方",
      2: "自动检测为非东方",
      3: "人工检测为东方",
      4: "人工检测为非东方",
      5: "自动+人工检测为东方"
    }

    // 格式化日期
    const formatDate = (timestamp, locale = "zh-CN") => {
      const date = new Date(timestamp * 1000)
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }

    // 格式化时间
    const formatTime = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      const parts = []
      if (hours > 0) {
        parts.push(hours.toString().padStart(2, '0'))
      }
      parts.push(minutes.toString().padStart(2, '0'))
      parts.push(seconds.toString().padStart(2, '0'))

      return parts.join(':')
    }

    // 获取状态文本
    const getStatusText = (status) => {
      return statusMap[status] || '未知状态'
    }

    // 生成视频URL
    const getVideoUrl = (aid, bvid) => {
      // 优先使用BV号，如果没有则使用AV号
      if (bvid) {
        return `https://www.bilibili.com/video/${bvid}`
      } else if (aid) {
        return `https://www.bilibili.com/video/av${aid}`
      }
      return '#' // 如果都没有，返回占位符
    }

    // 高亮搜索词
    const highlightSearchTerm = (text) => {
      if (!props.searchTerm || !text) return text
      
      const term = props.searchTerm.toLowerCase()
      const lowerText = text.toLowerCase()
      const startIndex = lowerText.indexOf(term)
      
      if (startIndex === -1) return text
      
      const endIndex = startIndex + term.length
      return `${text.substring(0, startIndex)}<span class="highlight">${text.substring(startIndex, endIndex)}</span>${text.substring(endIndex)}`
    }

    // 计算总时长
    const totalDuration = computed(() => {
      let total = 0
      if (props.video.parts && props.video.parts.length > 0) {
        props.video.parts.forEach(part => {
          total += part.duration
        })
      }
      return total
    })

    // 高亮标题
    const highlightedTitle = computed(() => {
      return highlightSearchTerm(props.video.title || '无标题')
    })

    // 高亮UP主
    const highlightedUploader = computed(() => {
      return highlightSearchTerm(props.video.uploader_name || '未知UP主')
    })

    return {
      formatDate,
      formatTime,
      getStatusText,
      getVideoUrl,
      totalDuration,
      highlightedTitle,
      highlightedUploader,
      partsExpanded,
      togglePartsExpanded
    }
  }
}
</script>

<style scoped>
td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

tr:hover {
  background-color: #f1f8ff;
}

/* 标题样式 */
.video-title {
  font-weight: bold;
  font-size: 16px;
  margin-top: 5px;
  color: #2c3e50;
}

.video-link {
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s ease;
}

.video-link:hover {
  color: #3498db;
  text-decoration: underline;
}

.video-link:visited {
  color: #7f8c8d;
}

/* 视频元数据 */
.video-meta {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

/* 标签样式 */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.tag {
  background: #e1f0fa;
  color: #3498db;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 状态标签 */
.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.status-0 { background: #ecf0f1; color: #7f8c8d; } /* 未检查 */
.status-1 { background: #d4efdf; color: #27ae60; } /* 自动检测为东方 */
.status-2 { background: #fdebd0; color: #d35400; } /* 自动检测为非东方 */
.status-3 { background: #d5f5e3; color: #1d8348; } /* 人工检测为东方 */
.status-4 { background: #fadbd8; color: #c0392b; } /* 人工检测为非东方 */

/* 分P信息 */
.parts-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.part-item {
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid #3498db;
}

.part-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.part-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #7f8c8d;
}

/* 多分P样式 */
.parts-multi {
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #3498db;
  overflow: hidden;
}

.parts-summary {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;
}

.parts-summary:hover {
  background-color: #ecf0f1;
}

.parts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.parts-count {
  color: #2c3e50;
}

.toggle-icon {
  font-size: 12px;
  color: #7f8c8d;
  transition: transform 0.2s ease;
}

.toggle-icon.expanded {
  transform: rotate(0deg);
}

.parts-preview {
  font-size: 13px;
  color: #7f8c8d;
  margin-top: 4px;
}

.parts-list {
  border-top: 1px solid #e9ecef;
  background: #ffffff;
}

.parts-list .part-item {
  margin: 0;
  border-radius: 0;
  border-left: none;
  border-bottom: 1px solid #f8f9fa;
  background: transparent;
}

.parts-list .part-item:last-child {
  border-bottom: none;
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 搜索高亮 */
:deep(.highlight) {
  background-color: #ffeb3b;
  color: #333;
  font-weight: bold;
  padding: 1px 3px;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
</style>