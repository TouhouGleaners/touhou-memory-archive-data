import { ref, onMounted, onUnmounted } from 'vue';

// 节流函数
function throttle(fn, delay) {
  let timer = null;
  return function(...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

export function useScroll() {
  const showScrollToTop = ref(false);
  const showScrollToBottom = ref(false);
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    showScrollToTop.value = scrollTop > 200;
    showScrollToBottom.value = scrollTop < scrollHeight - clientHeight - 200;
  };
  const throttledHandleScroll = throttle(handleScroll, 100);
  onMounted(() => {
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Initial check
  });
  onUnmounted(() => {
    window.removeEventListener('scroll', throttledHandleScroll);
  });
  return { showScrollToTop, showScrollToBottom };
}