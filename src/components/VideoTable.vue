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
              请确保videos.json文件位于public文件夹下
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
          v-for="video in pagedVideos" 
          :key="video.aid || video.bvid"
          :video="video"
          :searchTerm="searchTerm"
        />
      </tbody>
    </table>
    <!-- 分页控件 -->
    <div class="pagination">
      <!-- 分页按钮和数字 (仅在非全部显示时显示) -->
      <template v-if="pageSize !== Infinity">
        <button
          class="pagination-btn"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          &lt; 上一页
        </button>
        <span class="pagination-numbers">
          <button
            v-if="showFirst"
            class="pagination-number"
            :class="{ active: currentPage === 1 }"
            @click="goToPage(1)"
          >1</button>
          <span v-if="showLeftEllipsis" class="ellipsis">...</span>
          <button
            v-for="page in pageNumbers"
            :key="page"
            class="pagination-number"
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
          >{{ page }}</button>
          <span v-if="showRightEllipsis" class="ellipsis">...</span>
          <button
            v-if="showLast"
            class="pagination-number"
            :class="{ active: currentPage === totalPages }"
            @click="goToPage(totalPages)"
          >{{ totalPages }}</button>
        </span>
        <button
          class="pagination-btn"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          下一页 &gt;
        </button>
      </template>
      
      <!-- 每页条数选择器 -->
      <div class="page-size-selector">
        <label for="page-size-select">每页显示:</label>
        <select
          id="page-size-select"
          v-model="pageSize"
          class="page-size-select"
          @change="handlePageSizeChange"
        >
          <option :value="10">10 条</option>
          <option :value="20">20 条</option>
          <option :value="50">50 条</option>
          <option :value="100">100 条</option>
          <option :value="200">200 条</option>
          <option :value="500">500 条</option>
          <option :value="1000">1000 条</option>
          <option :value="Infinity">全部</option>
        </select>
      </div>
      
      <!-- 数据统计 -->
      <div class="pagination-info">
        <span v-if="pageSize === Infinity">
          显示全部 {{ videos.length }} 条
        </span>
        <span v-else>
          第 {{ startIndex }}-{{ endIndex }} 条，共 {{ videos.length }} 条
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import VideoRow from './VideoRow.vue'
import { ref, computed, watch } from 'vue'

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
  emits: ['retry'],
  setup(props) {
    const currentPage = ref(1)
    const pageSize = ref(50)

    const totalPages = computed(() => {
      if (pageSize.value === Infinity) return 1
      return Math.max(1, Math.ceil(props.videos.length / pageSize.value))
    })

    const pagedVideos = computed(() => {
      if (pageSize.value === Infinity) return props.videos
      const start = (currentPage.value - 1) * pageSize.value
      return props.videos.slice(start, start + pageSize.value)
    })

    // 数据统计计算属性
    const startIndex = computed(() => {
      if (pageSize.value === Infinity || props.videos.length === 0) return 0
      return (currentPage.value - 1) * pageSize.value + 1
    })

    const endIndex = computed(() => {
      if (pageSize.value === Infinity) return props.videos.length
      const end = currentPage.value * pageSize.value
      return Math.min(end, props.videos.length)
    })

    function prevPage() {
      if (currentPage.value > 1) currentPage.value--
    }
    
    function nextPage() {
      if (currentPage.value < totalPages.value) currentPage.value++
    }
    
    function goToPage(page) {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    // 处理每页条数变化
    function handlePageSizeChange() {
      currentPage.value = 1 // 重置到第一页
    }

    // 分页数字逻辑
    const pageNumbers = computed(() => {
      if (pageSize.value === Infinity) return []
      
      const pages = []
      const total = totalPages.value
      const cur = currentPage.value
      let start = Math.max(2, cur - 2)
      let end = Math.min(total - 1, cur + 2)
      if (cur <= 4) {
        start = 2
        end = Math.min(5, total - 1)
      }
      if (cur >= total - 3) {
        start = Math.max(2, total - 4)
        end = total - 1
      }
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })
    
    const showFirst = computed(() => totalPages.value > 1 && pageSize.value !== Infinity)
    const showLast = computed(() => totalPages.value > 1 && pageSize.value !== Infinity)
    const showLeftEllipsis = computed(() => 
      currentPage.value > 4 && totalPages.value > 6 && pageSize.value !== Infinity
    )
    const showRightEllipsis = computed(() => 
      currentPage.value < totalPages.value - 3 && totalPages.value > 6 && pageSize.value !== Infinity
    )

    // 当每页数量变化时，重置到第一页
    watch(pageSize, () => {
      currentPage.value = 1
    })
    
    // 当搜索词变化时，重置到第一页，避免在其他页筛选后看不到结果的情况
    watch(() => props.searchTerm, () => {
      currentPage.value = 1
    })

    // 当视频列表长度变化（例如应用筛选）时，确保 currentPage 在可用范围内
    watch(() => props.videos.length, (newLen) => {
      // 计算可能的页数并把 currentPage 夹在 1..totalPages 之间
      if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value)
      }
    })

    return {
      currentPage,
      pageSize,
      totalPages,
      pagedVideos,
      startIndex,
      endIndex,
      prevPage,
      nextPage,
      goToPage,
      handlePageSizeChange,
      pageNumbers,
      showFirst,
      showLast,
      showLeftEllipsis,
      showRightEllipsis
    }
  }
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

/* 分页样式 */
.pagination {
  margin-top: 1em;
  display: flex;
  align-items: center;
  gap: 1em;
  justify-content: center;
  font-size: 1rem;
  flex-wrap: wrap;
}

.pagination-btn {
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 16px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.pagination-btn:disabled {
  background-color: #bdc3c7;
  color: #fff;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  background-color: #2980b9;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: 0.2em;
}

.pagination-number {
  background: none;
  border: none;
  color: #3498db;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.pagination-number.active,
.pagination-number:hover {
  background: #3498db;
  color: #fff;
}

.ellipsis {
  color: #95a5a6;
  padding: 0 4px;
  user-select: none;
}

/* 每页条数选择器样式 */
.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-selector label {
  font-size: 14px;
  color: #7f8c8d;
  white-space: nowrap;
}

.page-size-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s ease;
  min-width: 80px;
}

.page-size-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

/* 数据统计样式 */
.pagination-info {
  font-size: 14px;
  color: #7f8c8d;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    gap: 0.5em;
  }
  
  .page-size-selector {
    justify-content: center;
  }
  
  .pagination-info {
    text-align: center;
  }
}
</style>