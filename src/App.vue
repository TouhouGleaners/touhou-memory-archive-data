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
      :video="videoList"
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

export default {
  name: 'App',
  components: {
    AppHeader,
    VideoTable,
    AppFooter,
    ScrollButtons
  },
  setup() {
    // 响应式数据
    const allVideos = ref([])
    const loading = ref(true)
    const error = ref('')
    const dataUpdateTime = ref('')
    
    // 筛选状态
    const currentFilterState = reactive({
      searchTerm: '',
      statusFilter: 'all'
    })

    // 计算属性：过滤后的视频
    const filteredVideos = computed(() => {
      let filtered = [...allVideos.value]
      
      // 应用状态筛选
      if (currentFilterState.statusFilter !== 'all') {
        if (currentFilterState.statusFilter === '5') {
          filtered = filtered.filter(video => 
            video.touhou_status === 1 || video.touhou_status === 3
          )
        } else {
          const statusNum = parseInt(currentFilterState.statusFilter, 10)
          filtered = filtered.filter(video => 
            video.touhou_status === statusNum
          )
        }
      }
      
      // 应用搜索筛选
      if (currentFilterState.searchTerm) {
        const term = currentFilterState.searchTerm.toLowerCase().trim()
        
        filtered = filtered.filter(video => {
          const titleMatch = video.title && 
            video.title.toLowerCase().includes(term)
          
          const uploaderMatch = video.uploader_name && 
            video.uploader_name.toLowerCase().includes(term)
          
          const tagsMatch = video.tags && 
            video.tags.some(tag => tag.toLowerCase().includes(term))
          
          const aidMatch = video.aid && 
            video.aid.toString().includes(term)

          const bvidMatch = video.bvid && 
            video.bvid.toLowerCase().includes(term)
          
          return titleMatch || uploaderMatch || tagsMatch || bvidMatch || aidMatch
        })
      }
      
      return filtered
    })

    // 处理搜索
    const handleSearch = (searchTerm) => {
      currentFilterState.searchTerm = searchTerm
    }

    // 处理状态筛选
    const handleStatusFilter = (statusFilter) => {
      currentFilterState.statusFilter = statusFilter
    }

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
      loadVideoData
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