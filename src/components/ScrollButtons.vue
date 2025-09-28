<template>
  <div class="scroll-buttons">
    <!-- 回到顶部按钮 -->
    <button 
      class="scroll-btn scroll-to-top"
      @click="scrollToTop"
      :class="{ visible: showScrollToTop }"
      title="回到顶部"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
      </svg>
    </button>
    
    <!-- 滚动到底部按钮 -->
    <button 
      class="scroll-btn scroll-to-bottom"
      @click="scrollToBottom"
      :class="{ visible: showScrollToBottom }"
      title="滚动到底部"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
      </svg>
    </button>
  </div>
</template>

<script>
import { useScroll } from '../composables/useScroll.js';

export default {
  name: 'ScrollButtons',
  setup() {
    const { showScrollToTop, showScrollToBottom } = useScroll();
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth'});
    };
    const scrollToBottom = () => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth'});
    };
    return {
      showScrollToTop,
      showScrollToBottom,
      scrollToTop,
      scrollToBottom,
    };
  },
};
</script>

<style scoped>
.scroll-buttons {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.scroll-btn {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(100px);
  pointer-events: none;
}

.scroll-btn.visible {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

.scroll-btn:hover {
  background-color: #2980b9;
  transform: translateX(0) scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.scroll-btn:active {
  transform: translateX(0) scale(0.95);
}

/* 不同按钮的延迟动画 */
.scroll-to-top.visible {
  transition-delay: 0s;
}

.scroll-to-bottom.visible {
  transition-delay: 0.1s;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .scroll-buttons {
    right: 15px;
    bottom: 15px;
  }
  
  .scroll-btn {
    width: 45px;
    height: 45px;
  }
  
  .scroll-btn svg {
    width: 18px;
    height: 18px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .scroll-btn {
    background-color: #2c3e50;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  }
  
  .scroll-btn:hover {
    background-color: #34495e;
  }
}
</style>
