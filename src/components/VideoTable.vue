<template>
  <div class="table-container">
    <table class="video-table">
      <thead>
        <tr>
          <th style="width: 40%">视频信息</th>
          <th style="width: 12%">UP主</th>
          <th style="width: 8%">发布时间</th>
          <th style="width: 15%">状态</th>
          <th style="width: 25%">分P信息</th>
        </tr>
      </thead>
      <tbody>
        <!-- 加载状态 -->
        <tr v-if="loading">
          <td colspan="5" class="loading">
            <div>加载视频数据中...</div>
          </td>
        </tr>
        
        <!-- 错误状态 -->
        <tr v-else-if="error">
          <td colspan="5" class="error-message">
            <div>视频数据加载失败: {{ error }}</div>
            <div style="margin-top: 10px; font-size: 0.9rem;">
              请确保videos.json文件位于data文件夹下
            </div>
            <button class="reload-btn" @click="$emit('retry')">重新加载</button>
          </td>
        </tr>
        
        <!-- 无结果 -->
        <tr v-else-if="videos.length === 0">
          <td colspan="5" class="no-results">
            <div>没有找到匹配的视频</div>
            <div class="suggestion">尝试使用不同的搜索词或重置筛选</div>
          </td>
        </tr>
        
        <!-- 视频列表 -->
        <VideoRow 
          v-else
          v-for="video in videos" 
          :key="video.aid || video.bvid"
          :video="video"
          :searchTerm="searchTerm"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import VideoRow from './VideoRow.vue'

export default {
  name: 'VideoTable',
  components: {
    VideoRow
  },
  props: {
    videos: {
      type: Array,
      default: () => []
    },
    searchTerm: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['retry']
}
</script>

<style scoped>
/* 表格样式 */
.table-container {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #3498db;
  color: white;
  padding: 12px;
  font-weight: 600;
  text-align: left;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 30px;
  color: #7f8c8d;
}

.error-message {
  text-align: center;
  padding: 30px;
  color: #c0392b;
}

.reload-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reload-btn:hover {
  background-color: #2980b9;
}

.no-results {
  text-align: center;
  padding: 30px;
  color: #7f8c8d;
}

.suggestion {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #95a5a6;
}
</style>