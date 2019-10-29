<template>
  <div class="category-list">
    <div class="type_wrap">
      <div class="type" v-for="(item, index) in optionsCopy" :key="index">
        <span
          class="category-list-router"
          v-if="!item.url"
          :class="{ selected : currentIndex == index }"
          @click="onOptionClicked(index)">
          {{ item.name }}
        </span>

        <router-link
          v-if="item.url"
          class="category-list-router"
          :class="{ selected : currentIndex == index }"
          :to="item.url ? item.url : ''">
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0
    }
  },
  props: {
    options: Array,
    defaultIndex: {
      default: 0
    },
    isLoading: Boolean
  },
  methods: {
    onOptionClicked(index) {
      if (this.currentIndex == index || this.isLoading) {
        return
      }

      this.currentIndex = index;
      this.$emit('updateTableIndex', index);
    },
    getDefault() {
      this.currentIndex = this.defaultIndex
    }
  },
  created () {
    this.getDefault()
  },
  computed: {
    optionsCopy() {
      return this.options
    }
  },
  watch: {
    '$route.params.tableIndex': function (val) {
      this.currentIndex = parseInt(val)
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


