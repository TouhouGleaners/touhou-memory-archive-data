<template>
  <div 
    class="tooltip-container"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <!-- 触发元素 -->
    <slot></slot>
    
    <!-- 提示框 -->
    <div 
      v-if="visible && hasTooltipContent"
      class="tooltip"
      :class="{ 'tooltip-left': showOnLeft }"
      :style="tooltipStyle"
    >
      <div class="tooltip-content">
        <!-- 视频封面 -->
        <div class="video-cover" v-if="video.pic && !imageError">
          <img 
            :src="video.pic" 
            :alt="video.title || '视频封面'"
            @error="handleImageError"
            referrerpolicy="no-referrer"
          />
        </div>
        
        <!-- 视频信息 -->
        <div class="video-info">
          <div class="video-title-tooltip">{{ video.title || '无标题' }}</div>
          <div class="video-description" v-if="video.description">
            {{ truncateDescription(video.description) }}
          </div>
          <div class="video-meta-tooltip">
            <span v-if="video.aid">av{{ video.aid }}</span>
            <span v-if="video.bvid">{{ video.bvid }}</span>
            <span v-if="video.uploader_name">UP: {{ video.uploader_name }}</span>
          </div>
        </div>
      </div>
      
      <!-- 箭头 -->
      <div class="tooltip-arrow" :class="{ 'arrow-right': showOnLeft }"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'VideoTooltip',
  props: {
    video: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const visible = ref(false)
    const imageError = ref(false)
    const showDelay = ref(null)
    const hideDelay = ref(null)
    const showOnLeft = ref(false)

    // 检查是否有tooltip内容
    const hasTooltipContent = computed(() => {
      return props.video.pic || props.video.description
    })

    // 检测应该显示在左侧还是右侧
    const checkPosition = (event) => {
      const screenWidth = window.innerWidth
      const elementRect = event.target.getBoundingClientRect()
      const tooltipWidth = 400 // 预估的tooltip宽度
      
      // 如果右侧空间不够，就显示在左侧
      showOnLeft.value = (elementRect.right + tooltipWidth) > screenWidth
    }

    // 显示提示框
    const showTooltip = (event) => {
      if (!hasTooltipContent.value) return
      
      checkPosition(event)
      
      clearTimeout(hideDelay.value)
      showDelay.value = setTimeout(() => {
        visible.value = true
      }, 300) // 300ms延迟显示
    }

    // 隐藏提示框
    const hideTooltip = () => {
      clearTimeout(showDelay.value)
      hideDelay.value = setTimeout(() => {
        visible.value = false
      }, 100) // 100ms延迟隐藏
    }

    // 截断描述文本
    const truncateDescription = (text) => {
      if (!text) return ''
      const maxLength = 200
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    // 处理图片加载错误
    const handleImageError = (event) => {
      imageError.value = true
      event.target.style.display = 'none'
    }

    // 动态计算提示框位置
    const tooltipStyle = computed(() => {
      if (showOnLeft.value) {
        return {
          position: 'absolute',
          top: '0',
          right: '100%',
          marginRight: '12px',
          zIndex: 1000
        }
      } else {
        return {
          position: 'absolute',
          top: '0',
          left: '100%',
          marginLeft: '12px',
          zIndex: 1000
        }
      }
    })

    return {
      visible,
      imageError,
      showOnLeft,
      hasTooltipContent,
      showTooltip,
      hideTooltip,
      truncateDescription,
      handleImageError,
      tooltipStyle
    }
  }
}
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0;
  min-width: 320px;
  max-width: 400px;
  margin-top: 8px;
  animation: fadeInUp 0.2s ease-out;
}

.tooltip-content {
  display: flex;
  gap: 12px;
  padding: 12px;
}

.video-cover {
  flex-shrink: 0;
  width: 120px;
  height: 68px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdc3c7;
  font-size: 12px;
}

.video-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-info {
  flex: 1;
  min-width: 0;
}

.video-title-tooltip {
  font-weight: 600;
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.4;
  word-wrap: break-word;
}

.video-description {
  font-size: 13px;
  color: #7f8c8d;
  line-height: 1.4;
  margin-bottom: 8px;
  word-wrap: break-word;
}

.video-meta-tooltip {
  font-size: 12px;
  color: #95a5a6;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.video-meta-tooltip span {
  background: #ecf0f1;
  padding: 2px 6px;
  border-radius: 3px;
}

.tooltip-arrow {
  position: absolute;
  top: 20px;
  left: -6px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid white;
}

.tooltip-arrow::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 1px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid #ddd;
}

/* 左侧显示时的箭头 */
.tooltip-arrow.arrow-right {
  left: auto;
  right: -6px;
  border-right: none;
  border-left: 6px solid white;
}

.tooltip-arrow.arrow-right::before {
  left: -1px;
  border-right: none;
  border-left: 6px solid #ddd;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tooltip {
    min-width: 280px;
    max-width: 320px;
  }
  
  .video-cover {
    width: 100px;
    height: 56px;
  }
}
</style>