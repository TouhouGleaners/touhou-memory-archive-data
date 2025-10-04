<template>
  <header>
    <div class="header-top">
      <h1>Touhou Memory Archive</h1>
      <div class="filter-box">
        <select 
          class="filter-select" 
          :value="statusFilter"
          @change="handleStatusChange"
        >
          <option value="all">所有状态</option>
          <option value="0">未检查</option>
          <option value="1">自动检测为东方</option>
          <option value="2">自动检测为非东方</option>
          <option value="3">人工检测为东方</option>
          <option value="4">人工检测为非东方</option>
          <option value="5">自动+人工检测为东方</option>
        </select>

        <select 
          class="filter-select"
          :value="uploaderFilter"
          @change="handleUploaderChange"
        >
          <option
            v-for="uploader in uploaderList"
            :key="uploader"
            :value="uploader"
          >
            {{ uploader }}
          </option>
        </select>
      </div>
    </div>

    <div class="search-container">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchInput"
          @input="handleSearchInput"
          @keypress="handleKeyPress"
          placeholder="搜索视频、UP主或标签..."
        >
      </div>
    </div>
    
    <div class="counter">找到 {{ videoCount }} 个视频</div>
  </header>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'AppHeader',
  props: {
    videoCount: {
      type: Number,
      default: 0
    },
    uploaderList: {
      type: Array,
      default: () => []
    }
  },
  emits: ['search', 'filter', 'filter-uploader'],
  setup(props, { emit }) {
    const searchInput = ref('')
    const statusFilter = ref('all')
    const uploaderFilter = ref('所有UP主')
    let debounceTimer = null

    // 处理搜索输入（防抖）
    const handleSearchInput = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        emit('search', searchInput.value)
      }, 500)
    }

    // 处理回车键搜索
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        clearTimeout(debounceTimer)
        emit('search', searchInput.value)
      }
    }

    // 处理状态筛选变化
    const handleStatusChange = (e) => {
      statusFilter.value = e.target.value
      emit('filter', statusFilter.value)
    }

    // 处理UP主筛选变化
    const handleUploaderChange = (e) => {
      uploaderFilter.value = e.target.value
      const emitValue = uploaderFilter.value === '所有UP主' ? 'all' : uploaderFilter.value
      emit('filter-uploader', emitValue)
    }


    return {
      searchInput,
      statusFilter,
      uploaderFilter,
      handleSearchInput,
      handleKeyPress,
      handleStatusChange,
      handleUploaderChange,
    }
  }
}
</script>

<style scoped>
/* 筛选和搜索工具栏 */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.search-box {
  position: relative;
  width: 500px;
}

.search-box input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.search-box::before {
  content: "🔍";
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #7f8c8d;
}

.filter-box {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #3498db;
}

.counter {
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
  color: #7f8c8d;
}

h1 {
  margin-bottom: 1rem;
  color: #2c3e50;
}
</style>