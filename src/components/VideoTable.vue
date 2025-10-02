<template>
  <div class="table-container">
    <table class="video-table">
      <thead>
        <tr>
          <th style="width: 38%" class="sortable" @click="handleSort('title')">
            视频信息
            <span class="sort-indicator" :class="getSortClass('title')">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 14l5-5 5 5z" class="sort-up"/>
                <path d="M7 10l5 5 5-5z" class="sort-down"/>
              </svg>
            </span>
          </th>
          <th style="width: 12%" class="sortable" @click="handleSort('uploader_name')">
            UP主
            <span class="sort-indicator" :class="getSortClass('uploader_name')">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 14l5-5 5 5z" class="sort-up"/>
                <path d="M7 10l5 5 5-5z" class="sort-down"/>
              </svg>
            </span>
          </th>
          <th style="width: 12%" class="sortable" @click="handleSort('created')">
            发布时间
            <span class="sort-indicator" :class="getSortClass('created')">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 14l5-5 5 5z" class="sort-up"/>
                <path d="M7 10l5 5 5-5z" class="sort-down"/>
              </svg>
            </span>
          </th>
          <th style="width: 15%" class="sortable" @click="handleSort('touhou_status')">
            状态
            <span class="sort-indicator" :class="getSortClass('touhou_status')">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 14l5-5 5 5z" class="sort-up"/>
                <path d="M7 10l5 5 5-5z" class="sort-down"/>
              </svg>
            </span>
          </th>
          <th style="width: 23%" class="sortable" @click="handleSort('parts_count')">
            分P信息
            <span class="sort-indicator" :class="getSortClass('parts_count')">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 14l5-5 5 5z" class="sort-up"/>
                <path d="M7 10l5 5 5-5z" class="sort-down"/>
              </svg>
            </span>
          </th>
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
          显示全部 {{ totalCount }} 条
        </span>
        <span v-else>
          第 {{ startIndex }}-{{ endIndex }} 条，共 {{ totalCount }} 条
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import VideoRow from './VideoRow.vue';
import { useSorting } from '../composables/useSorting.js';
import { usePagination } from '../composables/usePagination.js';

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
    // 将 props.videos 包装成一个 computed ref 传给 composable
    const videosRef = computed(() => props.videos);
    // 获取排序逻辑和排序后的数据
    const { sortedVideos, handleSort, getSortClass } = useSorting(videosRef);
    // 将排序后的数据交给分页逻辑处理
    const { 
      pagedVideos, 
      currentPage, 
      pageSize, 
      totalPages, 
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
    } = usePagination(sortedVideos);
    const totalCount = computed(() => videosRef.value.length);

    return {
      handleSort,
      getSortClass,
      pagedVideos,
      currentPage,
      pageSize,
      totalPages,
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
      showRightEllipsis,
      totalCount
    };
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
  position: relative;
}

th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

th.sortable:hover {
  background-color: #2980b9;
}

.sort-indicator {
  display: inline-block;
  margin-left: 5px;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

th.sortable:hover .sort-indicator {
  opacity: 0.8;
}

.sort-indicator.sort-asc,
.sort-indicator.sort-desc {
  opacity: 1;
}

.sort-indicator svg {
  vertical-align: middle;
  fill: currentColor;
}

.sort-indicator .sort-up,
.sort-indicator .sort-down {
  opacity: 0.3;
}

.sort-indicator.sort-asc .sort-up {
  opacity: 1;
}

.sort-indicator.sort-desc .sort-down {
  opacity: 1;
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