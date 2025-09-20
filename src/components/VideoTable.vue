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

    const totalPages = computed(() =>
      Math.max(1, Math.ceil(props.videos.length / pageSize.value))
    )

    const pagedVideos = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return props.videos.slice(start, start + pageSize.value)
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

    // 分页数字逻辑
    const pageNumbers = computed(() => {
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
    const showFirst = computed(() => totalPages.value > 1)
    const showLast = computed(() => totalPages.value > 1)
    const showLeftEllipsis = computed(() => currentPage.value > 4 && totalPages.value > 6)
    const showRightEllipsis = computed(() => currentPage.value < totalPages.value - 3 && totalPages.value > 6)

    // 当每页数量变化时，重置到第一页
    watch(pageSize, () => {
      currentPage.value = 1
    })

    return {
      currentPage,
      pageSize,
      totalPages,
      pagedVideos,
      prevPage,
      nextPage,
      goToPage,
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
</style>