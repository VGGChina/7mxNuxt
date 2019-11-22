<template>
  <div class="category-list">
    <div class="type_wrap">
      <div v-for="(item, index) in optionsCopy" :key="index" class="type">
        <span
          v-if="!item.url"
          class="category-list-router"
          :class="{ selected : $route.params.tableIndex || defaultIndex == index }"
          @click="onOptionClicked(index)"
        >
          {{ item.name }}
        </span>

        <nuxt-link
          v-if="item.url"
          class="category-list-router"
          :class="{ selected : $route.params.tableIndex == index }"
          :to="item.url ? item.url : ''"
        >
          {{ item.name }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: Array,
    defaultIndex: {
      default: 0
    },
    isLoading: Boolean
  },
  data() {
    return {
      // currentIndex: 0
    }
  },
  computed: {
    optionsCopy() {
      return this.options
    }
  },

  created() {
    this.getDefault()
  },
  methods: {
    onOptionClicked(index) {
      if (this.currentIndex == index || this.isLoading) {
        return
      }

      this.currentIndex = index
      this.$emit('updateTableIndex', index)
    },
    getDefault() {
      this.currentIndex = this.defaultIndex
    }
  }
}
</script>

<style scoped>

.category-list {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  background: rgb(26, 26, 26);
  font-size: 1.3rem;
}

.type_wrap {
  display: -webkit-flex;
  display: flex;
}

.type_wrap .type {
  position: relative;
  /* height: 20px; */
  margin: 6px 16px;
  margin-bottom: 24px;
}

.category-list-router {
  letter-spacing: 1px;
  cursor: pointer;
  font-size: 20px;
  color: rgba(255, 255, 255, .6);
  transition: color .2s;
}

.category-list-router:hover {
  color: rgba(255, 255, 255, 1);
  transition: color .2s;
}

.selected {
  color: rgba(255, 255, 255, 1);
}
</style>

