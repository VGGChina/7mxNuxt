<template>
  <div class="choose-works">
    <div class="left">
      <div class="title">选择作品</div>
      <work-list
        :step="0"
        :workList="worksList">
      </work-list>

      <no-content
        :isNoContentShow="!isFetching && worksList.length < 1"
        :content="'Sorry，没有可以上架的图片'">
      </no-content>

      <div
        class="more-comments"
        v-if="worksList.length > 0"
        @click="fetchData">
        {{ line == 'end' ? '没有更多' : '加载更多' }}
      </div>
    </div>

    <div class="right">
      <div class="should-know">
        上架须知：<br>
        1、作品无任何水印或标志<br>
        2、作品必须是原创，且您拥有独立版权，不会侵犯任何版权、商标或其他知识产权<br>
        3、图片的最长边必须大于4000像素、最短边必须大于3000像素才能上架<br>
      </div>

      <div class="portrait" style="margin-top: 20px;">
        若作品中可辨认面孔的人物必须拥有正确的人物肖像权协议<br>
        <a
          href="/static/pdf/portrait.pdf"
          target="view_window">
          下载《肖像授权书模板》
        </a>
      </div>

      <div class="portrait">
        若作品中如涉及物产的图片，必须拥有正确的物产权协议<br>
        <a
          href="/static/pdf/realRight.pdf"
          target="view_window">
          下载《物产权协议模板》
        </a>
      </div>

      <div class="next-button" @click="nextStep">下一步</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import WorkList from './work-list/WorkList'
import NoContent from '~/components/no-content/NoContent'

export default {
  data() {
    return {
      worksList: [],
      line: '',
      isFetching: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      if (this.isFetching || this.line == 'end') {
        return;
      }

      this.isFetching = true;

      let reBody = {};
      try {
        reBody = {
          type: '6',
          user_id: this.$store.state.login.loginUser.id,
          check: '0'
        }
      } catch (e) {
        return;
      }

      let query = {
        line: this.line
      }

      let res = await this.$apiFactory.getMediaApi().originList(reBody, query);
      if (res.data.out == '1') {
        this.worksList.push(...res.data.data);
        this.worksList.map(item => {
          this.$set(item, 'isSelected', false)
        })
      }

      this.line = res.data.line;
      setTimeout(() => {
        this.isFetching = false
      }, 500)
    },
    handle(list) {
      this.worksList = list;
    },
    nextStep() {
      let list = [],
        l = this.worksList.length;
      for (let i = 0; i < l; i++) {
        if (this.worksList[i].isSelected) {
          this.worksList[i].isSelected = false;
          list.push(this.worksList[i])
        }
      }

      if (list.length < 1) {
        this.$toast.warn('您还没有选中任何作品');
        return;
      }

      this.$emit('nextStep', { choosedList: list, isChoosed: true });
    }
  },
  computed: {
    ...mapGetters([
      'loginUser'
    ])
  },
  components: {
    WorkList,
    NoContent
  }
}
</script>

<style scoped>
.choose-works {
  width: 100%;
  height: 100%;
  display: flex;
  display: -webkit-flex;
}

.left {
  flex: 1;
  -webkit-flex: 1;
  height: 100%;
  overflow: auto !important;
  padding: 30px 0 0 0;
  box-sizing: border-box;
  position: relative;
}

.title {
  font-size: 20px;
  text-align: center;
}

.right {
  flex: none;
  -webkit-flex: none;
  box-sizing: border-box;
  width: 420px;
  height: 100%;
  background: #f5f5f5;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  padding: 40px 20px;
  font-size: 14px;
  line-height: 2.5;
}

a {
  color: #1d9a5a;
  cursor: pointer;
  text-decoration: none;
}

.next-button {
  width: 100%;
  height: 45px;
  border-radius: 6px;
  background-color: #56cb8f;
  color: #fff;
  text-align: center;
  line-height: 45px;
  margin-top: 30px;
  cursor: pointer;
}

.more-comments {
  width: 140px;
  height: 34px;
  margin-bottom: 30px;
  margin-left: calc(50% - 79px);
  margin-left: -moz-calc(50% - 70px);
  margin-left: -webkit-calc(50% - 70px);
  text-align: center;
  line-height: 34px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  background-color: #f7f7f7;
}
</style>

