<template>
  <div class="test">{{ msg }}</div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello Vue!'
    }
  }
}
</script>

<style scoped>
  .test {
    color: red;
  }
</style>
