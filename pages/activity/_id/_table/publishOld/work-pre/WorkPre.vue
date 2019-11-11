<template>
  <div class="work-pre">
    <div
      class="work-item"
      v-for="(item, index) in mediaListNext"
      :style="{
        border: item.isSelected ? 'solid 6px #56cb8f' : 'solid 6px #fff',
        background: 'url(' + $utilHelper.getCompressionUrl(item.image) + ')'
      }"
      @click="selected(item)"
      :key="index">
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'mediaList',
    'isSelectFirst'
  ],
  methods: {
    selected(item) {
      item.isSelected = !item.isSelected;
      this.$emit('selected', this.mediaListNext);
    },
    async fetchData() {

    }
  },
  computed: {
    mediaListNext() {
      if (this.mediaList.length < 1) {
        return []
      }

      return JSON.parse(JSON.stringify(this.mediaList))
    }
  }
}
</script>

<style scoped>
.work-pre {
  margin: 0 20px;
  padding: 30px 0;
}

.work-item {
  width: 120px;
  height: 120px;
  margin: 3px 4px;
  background-size: cover !important;
  background-position: center !important;
  display: inline-block;
  cursor: pointer;
}
</style>

