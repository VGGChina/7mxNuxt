<template>
  <div class="keywords">
    <div class="words-container">
      <a
        v-for="item in tagList"
        :key="item.id"
        :href="'/tag-photos/' + item.id"
        target="_blank">
        {{ item.name }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'mediaDetail'
  ],
  computed: {
    tagList: function () {
      try {
        return this.mediaDetail.tag_list;
      } catch (e) {
        return [];
      }
    }
  },
  components: {}
};
</script>

<style scoped>
.keywords {
  width: 1200px;
  margin: 20px 20px;
}

.title {
  color: #000;
  font-size: 18px;
  font-weight: bold;
}

.words-container {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
}

.words-container a {
  font-size: 16px;
  color: #000;
  opacity: .5;
  margin: 20px 16px 0 0;
  border-radius: 14px;
  border: 1px solid #dfdfdf;
  padding: 5px 12px;
  cursor: pointer;
  text-decoration: none;
  transition: opacity .3s;
}

.words-container a:hover {
  opacity: 1;
  transition: opacity .3s;
}
</style>
