<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue';
</script>

<template>
  <body class="h-screen bg-gradient-to-b from-green-200 to-green-500 overflow-hidden">
    <Sidebar class="absolute"></Sidebar>
    <div class="h-full overflow-hidden">
      <RouterView></RouterView>
    </div>
  </body>
</template>

<style scoped>

</style>
