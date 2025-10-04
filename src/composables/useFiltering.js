import { computed } from "vue";

export function useFiltering(allVideos, filters) {
  const filteredVideos = computed(() => {
    const { searchTerm, statusFilter, uploaderFilter } = filters;
    let videos = [...allVideos.value]

    // 应用筛选状态
    if (statusFilter !== 'all') {
      if (statusFilter === '5') {
        videos = videos.filter(v => v.touhou_status === 1 || v.touhou_status === 3)
      } else {
        const statusNum = parseInt(statusFilter, 10)
        videos = videos.filter(v => v.touhou_status === statusNum)
      }
    }

    // 应用搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim()
      
      videos = videos.filter(v => {
        const titleMatch = v.title && 
          v.title.toLowerCase().includes(term)
        
        const uploaderMatch = v.uploader_name && 
          v.uploader_name.toLowerCase().includes(term)
        
        const tagsMatch = v.tags && 
          v.tags.some(tag => tag.toLowerCase().includes(term))
        
        const aidMatch = v.aid && 
          v.aid.toString().includes(term)

        const bvidMatch = v.bvid && 
          v.bvid.toLowerCase().includes(term)
        
        return titleMatch || uploaderMatch || tagsMatch || bvidMatch || aidMatch
      })
    }

    // 应用UP筛选
    if (uploaderFilter && uploaderFilter !== 'all') {
      videos = videos.filter(v => v.uploader_name === uploaderFilter)
    }

    // 新功能预留位
    // TODO: 应用日期范围筛选
    // TODO: 应用标签筛选

    return videos
  })
  return { filteredVideos }   
}