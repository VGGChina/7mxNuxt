<template>
    <div class="recomment">
        <div class="title">定制您的个性化推荐 ?</div>
        <div class="recomment_wrap">
            <transition name="fade_tags_recommend" mode="out-in">
                <TagList v-if="pageIndex == 0" :tags="tags[0]" key="0"></TagList>
                <TagList v-if="pageIndex == 1" :tags="tags[1]" key="1"></TagList>
            </transition>
        </div>
        <div v-if="tags.length > 0" class="tip_points">
            <div
                v-for="(point, i) in new Array(2)"
                :key="i"
                class="point"
                :style=" { 'background': i==pageIndex ? 'rgba(0,0,0,.2)' : '' } "
            ></div>
        </div>
        <div @click="next" class="next button-green">{{ operation }}</div>
    </div>
</template>
<script>
import TagList from '~/components/tag-list/TagList'

export default {
  name: 'recomment',
  head() {
    return {
      title: '定制推荐 - 7MX 中国领先的视觉创作社区'
    }
  },
  data: () => ({
    pageIndex: 0,
    operation: '下一步',
    tags: []
  }),
  methods: {
    next() {
      if (this.operation == '完 成') {
        return this.$router.push({ name: 'index' })
      }
      this.pageIndex++
      if (this.pageIndex == 1) {
        this.operation = '完 成'
      }
    },
    async getRecommentTags() {
      let res = await this.$axios.tagService.getRecommentTags()
      if (res.data.out > 0) {
        for (let i = 0; i < 3; i++) {
          this.tags.push([])
          for (let j = 0; j < 6; j++) {
            if (!res.data.data[j + 6 * i]) continue
            this.tags[i].push(res.data.data[j + 6 * i])
          }
        }
      }
    }
  },
  created() {
    this.getRecommentTags()
  },
  mounted() {},
  watch: {},
  computed: {},
  components: {
    TagList
  }
}
</script>

<style lang='scss' scoped>
.fade_tags_recommend-enter-active,
.fade_tags_recommend-leave-active {
  transition: all 0.4s 0.1s ease;
}
.fade_tags_recommend-enter {
  transform: translateX(30px);
  opacity: 0;
}
.fade_tags_recommend-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
.recomment_wrap {
  height: 720px;
  width: 1100px;
  margin: 0 auto;
  position: relative;
}
.recomment {
  .title {
    text-align: center;
    font-size: 30px;
    line-height: 2;
    margin-top: 40px;
  }
  .next {
    width: 330px;
    height: 50px;
    line-height: 50px;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 50px;
  }
}
.tag-list {
  position: absolute;
  top: 0;
}
.tip_points {
  width: 100px;
  margin: 30px auto;
  display: flex;
  justify-content: center;
  .point {
    width: 10px;
    height: 10px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 100px;
    margin: 10px 8px;
  }
}
</style>