<template>
  <div class="tag-list">
    <div class="tags_wrap">
      <div v-for="(item, i) in tags" :key="i" class="tag-recommentTag">
        <div class="tag-hover_area">
          <div class="tag-pics_wrap">
            <a v-if="item.medias[0]" :href="'/photo/' + item.medias[0].id" target="blank">
              <div
                v-lazy:background-image.container="$utilHelper.getCompressionUrl(item.medias[0].image)"
                class="tag-left"
              />
            </a>
            <div v-else class="tag-left" />
            <div class="tag-right">
              <a v-if="item.medias[1]" :href="'/photo/' + item.medias[1].id" target="blank">
                <div
                  v-lazy:background-image.container="$utilHelper.getCompressionUrl(item.medias[1].image)"
                  class="tag-top"
                />
              </a>
              <div v-else class="tag-top" />
              <a v-if="item.medias[2]" :href="'/photo/' + item.medias[2].id" target="blank">
                <div
                  v-lazy:background-image.container="$utilHelper.getCompressionUrl(item.medias[2].image)"
                  class="tag-bottom"
                />
              </a>
              <div v-else class="tag-bottom" />
            </div>
          </div>
          <div class="tag-info">
            <div class="tag-left">
              <div class="tag-title">
                <span @click="toTagPage(item.id)"> {{ item.name }} </span>
              </div>
              <div class="tag-bottom">
                <span class="tag-pic_num">{{ item.media_num }} 张图片</span>
                  &nbsp;
                <!-- 应该用fan_num,但现在数据太少,用user_num代替 -->
                <span class="tag-people_num">{{ item.user_num }} 人关注</span>
              </div>
            </div>
            <div class="tag-right">
              <div v-if="item.is_follow==1" class="tag-button button-grey" @click="unfollow(item)">已关注</div>
              <div v-else class="tag-button button-green" @click="follow(item)">关注</div>
            </div>
          </div>
        </div>
      </div>
      <div class="clear" />
    </div>
    <div v-if="end!='end'">
      <loading style="padding-top: 100px;" :is-loading="true" :loading-color="'#000'" />
    </div>
    <div v-if="end=='end'&&tags.length < 1" style="position:relative;">
      <noContent :is-no-content-show="true" />
    </div>
  </div>
</template>

<script>
import noContent from '~/components/no-content/NoContent'
import apiFactory from '~/api/factory/apiFactory.js'

export default {
  name: 'TagList',
  components: {
    noContent
  },
  props: [
    'tags',
    'end'
  ],
  data: () => ({
  }),
  computed: {
    isLogin() {
      return this.$store.state.login.isLogin
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    toTagPage(id) {
      window.open('/tag-photos/' + id, '_blank')
    },
    async follow(item) {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }
      const res = await apiFactory.getTagApi().followTag({ 'tag_id': item.id })
      if (res.data.out > 0) {
        item.is_follow = 1
        this.tags.splice(this.tags.length)
      }
    },
    async unfollow(item) {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }
      const res = await apiFactory.getTagApi().unfollowTag({ 'tag_id': item.id })
      if (res.data.out > 0) {
        item.is_follow = 0
        this.tags.splice(this.tags.length)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.tags_wrap {
  width: 1100px;
  padding-top: 20px;
  margin: 0 auto;
  .tag-recommentTag {
    border-radius: 14px;
    transition: all 0.3s;
    &:hover {
      background: rgba(0, 0, 0, 0.03);
    }
    margin-bottom: 14px;
    width: 33.33%;
    height: 340px;
    float: left;
    .tag-hover_area {
      padding-top: 10px;
      width: 94%;
      margin: 0 auto;
      height: 100%;
      .tag-pics_wrap {
        height: 240px;
        position: relative;
        border-radius: 14px;
        overflow: hidden;
        transform: rotate(0);
        .tag-left {
          position: absolute;
          left: 0;
          width: calc(60% - 1px);
          height: 100%;
          background: rgba(0, 0, 0, 0.05);
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          transition: all 0.3s;
          &:hover {
            opacity: 0.8;
          }
        }
        .tag-right {
          width: calc(40% - 1px);
          height: 100%;
          right: 0;
          position: absolute;
          .tag-top {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: calc(50% - 1px);
            background: rgba(0, 0, 0, 0.05);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            transition: all 0.3s;
            &:hover {
              opacity: 0.8;
            }
          }
          .tag-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: calc(50% - 1px);
            background: rgba(0, 0, 0, 0.05);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            transition: all 0.3s;
            &:hover {
              opacity: 0.9;
            }
          }
        }
      }
      .tag-info {
        height: 70px;
        margin-top: 15px;
        position: relative;
        .tag-left {
          .tag-title {
            font-size: 20px;
            font-weight: 600;
            line-height: 1.8;
            width: 70%;
            span {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              display: block;
              width: 100%;
              cursor: pointer;
            }
          }
          .tag-bottom {
            font-size: 0.9rem;
            color: rgba(0, 0, 0, 0.7);
            width: 60%;
          }
        }
        .tag-right {
          position: absolute;
          right: 0;
          top: 12px;
          .tag-button {
            width: 90px;
            height: 40px;
            line-height: 40px;
          }
        }
      }
    }
  }
}
</style>
