import { ref, onMounted, onUnmounted } from 'vue';

// 节流函数
function throttle(fn, delay) {
  let timerId = null;
  const throttledFn = function (...args) {
    if (timerId) return;
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delay);
  };
  throttledFn.cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
    }
  };
  return throttledFn;
}

export function useScroll(options = {}) {
  const { threshold = 200, throttleDelay = 100 } = options; // 从配置中解构参数，并提供默认值
  const showScrollToTop = ref(false);
  const showScrollToBottom = ref(false);
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const { scrollHeight, clientHeight } = document.documentElement;
    showScrollToTop.value = scrollTop > threshold;
    showScrollToBottom.value = scrollTop < scrollHeight - clientHeight - threshold;
  };
  const throttledHandleScroll = throttle(handleScroll, throttleDelay);
  onMounted(() => {
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // 组件挂载后立即执行一次，以初始化状态
  });
  onUnmounted(() => {
    window.removeEventListener('scroll', throttledHandleScroll);
    throttledHandleScroll.cancel(); // 在组件卸载时清除任何待处理的计时器，防止内存泄漏和潜在的错误
  });
  return { showScrollToTop, showScrollToBottom };
}