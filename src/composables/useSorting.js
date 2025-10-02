import { ref, computed } from 'vue';

export function useSorting(videos) {
  const sortField = ref('');
  const sortOrder = ref('');  // 'asc' 或 'desc'

  // 排序后的视频数据
  const sortedVideos = computed(() => {
    if (!sortField.value || !sortOrder.value) {
      return videos.value;
    }

    return [...videos.value].sort((a, b) => {
      let valueA, valueB

      switch (sortField.value) {
        case 'title':
          valueA = (a.title || '').toLowerCase()
          valueB = (b.title || '').toLowerCase()
          break
        case 'uploader_name':
          valueA = (a.uploader_name || '').toLowerCase()
          valueB = (b.uploader_name || '').toLowerCase()
          break
        case 'created':
          valueA = a.created || 0
          valueB = b.created || 0
          break
        case 'touhou_status':
          valueA = a.touhou_status || 0
          valueB = b.touhou_status || 0
          break
        case 'parts_count':
          valueA = (a.parts && a.parts.length) || 0
          valueB = (b.parts && b.parts.length) || 0
          break
        default:
          return 0
      }

      // 字符串比较
      if (typeof valueA === 'string') {
        const result = valueA.localeCompare(valueB, 'zh-CN')
        return sortOrder.value === 'asc' ? result : -result
      }

      // 数字比较
      if (sortOrder.value === 'asc') {
        return valueA - valueB
      } else {
        return valueB - valueA
      }
  });
});
  
  // 处理排序
  const handleSort = (field) => {
    if (sortField.value === field) {
      // 同一字段：无排序 -> 升序 -> 降序 -> 无排序
      if (!sortOrder.value) {
        sortOrder.value = 'asc'
      } else if (sortOrder.value === 'asc') {
        sortOrder.value = 'desc'
      } else {
        sortField.value = ''
        sortOrder.value = ''
      }
    } else {
      // 不同字段：直接设为升序
      sortField.value = field
      sortOrder.value = 'asc'
    }
  }

  // 获取排序指示器的样式类
  const getSortClass = (field) => {
    if (sortField.value !== field) return ''
    return sortOrder.value === 'asc' ? 'sort-asc' : sortOrder.value === 'desc' ? 'sort-desc' : ''
  }

  return {
    sortField,
    sortOrder,
    sortedVideos,
    handleSort,
    getSortClass
  }
}