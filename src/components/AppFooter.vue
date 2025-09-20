<template>
  <footer>
    <p>数据更新于 {{ dataUpdateTime || '加载中...' }}</p>
    <p>
      <strong>Touhou Memory Archive</strong>&copy; 2025 
      <a href="https://space.bilibili.com/442719202">Mikuoso</a>. All rights reserved.<br>
      Associated with the <a href="https://thrd.sthcraft.com">Teahouse of Recollected Dreams</a> fan group.<br>
      This is a non-commercial, fan-made website. Touhou Project(東方Project) is copyright &copy; Team Shanghai Alice / ZUN.
    </p>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  props: {
    dataUpdateTime: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
/* 页脚样式 */
footer {
  text-align: center;
  margin-top: 40px;
}

footer p {
  font-size: 12px;
  margin-bottom: 10px;
}

a {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #2980b9;
  text-decoration: underline;
}
</style>