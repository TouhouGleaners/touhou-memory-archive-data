<template>
  <div class="container">
    <!-- 页面头部 -->
    <AppHeader 
      :videoCount="filteredVideos.length"
      @search="handleSearch"
      @filter="handleStatusFilter" 
    />
    
    <!-- 视频表格 -->
    <VideoTable 
      :videos="filteredVideos"
      :searchTerm="currentFilterState.searchTerm"
      :loading="loading"
      :error="error"
      @retry="loadVideoData"
    />
    
    <!-- 页脚 -->
    <AppFooter :dataUpdateTime="dataUpdateTime" />
    
    <!-- 滚动按钮 -->
    <ScrollButtons />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import VideoTable from './components/VideoTable.vue'
import AppFooter from './components/AppFooter.vue'
import ScrollButtons from './components/ScrollButtons.vue'
import { useFiltering } from './composables/useFiltering.js'

export default {
  name: 'App',
  components: {
    AppHeader,
    VideoTable,
    AppFooter,
    ScrollButtons
  },
  setup() {
    // 原始数据
    const allVideos = ref([])
    const loading = ref(true)
    const error = ref('')
    const dataUpdateTime = ref('')
    
    // 筛选状态中心
    const currentFilterState = reactive({
      searchTerm: '',
      statusFilter: 'all'
      // 预留
    })

    // 过滤逻辑
    const { filteredVideos } = useFiltering(allVideos, currentFilterState)

    // 处理搜索
    const handleSearch = (searchTerm) => {
      currentFilterState.searchTerm = searchTerm
    }

    // 处理状态筛选
    const handleStatusFilter = (statusFilter) => {
      currentFilterState.statusFilter = statusFilter
    }

    // 预留

    // 加载视频数据，并获取 Last-Modified 作为更新时间
    const loadVideoData = async () => {
      try {
        loading.value = true
        error.value = ''
        
        const response = await fetch('videos.json')
        
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态: ${response.status}`)
        }
        
        allVideos.value = await response.json()
        // 获取 Last-Modified 头
        const lastModified = response.headers.get('Last-Modified')
        if (lastModified) {
          const date = new Date(lastModified)
          dataUpdateTime.value = date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })
        }
      } catch (err) {
        console.error('加载视频失败:', err)
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    // 组件挂载时加载数据
    onMounted(() => {
      loadVideoData()
    })

    return {
      filteredVideos,
      currentFilterState,
      loading,
      error,
      dataUpdateTime,
      handleSearch,
      handleStatusFilter,
      loadVideoData,
      // 预留
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>