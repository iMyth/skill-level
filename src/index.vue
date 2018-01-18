<template>
  <div class="wrapper" @click="update">
    <progress-with-milestone></progress-with-milestone>
  </div>
</template>

<style>
  .wrapper { align-items: center; margin-top: 120px; }
</style>

<script>
  import ProgressWithMilestone from './ProgressWithMilestone.vue'
  export default {
    components: { ProgressWithMilestone }
  }
</script>