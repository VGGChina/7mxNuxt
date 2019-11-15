<template>
  <div class="become-contributor">
    <div class="title">
      成为拍信商业供稿人
    </div>

    <div class="progress">
      <div style="display: inline-block" v-for="(item, index) in progressList" :key="index">
        <span
          @click="checkoutProgress(index)"
          :style="{ color: index == currentIndex ? '#fff' : 'rgba(255, 255, 255, 0.6)' }">
          {{ item }}
        </span>
        <div class="dividing" v-if="index != (progressList.length - 1)"></div>
      </div>
    </div>

    <transition name="tab-fade">
      <apply-notes
        @updateProgress="handle"
        v-show="currentIndex == 0">
      </apply-notes>
    </transition>

    <transition name="tab-fade">
      <identity-info
        @updateProgress="handle"
        :progressIndex="currentIndex"
        v-show="currentIndex == 1">
      </identity-info>
    </transition>

    <transition name="tab-fade">
      <good-at
        :formToal="form"
        @updateProgress="handle"
        v-show="currentIndex == 2">
      </good-at>
    </transition>

    <transition name="tab-fade">
      <wait-examine
        @updateProgress="handle"
        :formToal="form"
        v-show="currentIndex == 3">
      </wait-examine>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IdentityInfo from './children/IdentityInfo'
import ApplyNotes from './children/ApplyNotes'
import GoodAt from './children/good-at/GoodAt'
import WaitExamine from './children/wait-examine/WaitExamine'

export default {
  beforeCreate() {
    document.title = '签约 - 7MX 中国领先的视觉创作社区'
  },
  data: () => ({
    progressList: [
      '申请须知',
      '完善身份信息',
      '选择擅长类型',
      '等待审核'
    ],
    progressIndex: 0,
    currentIndex: 0,
    form: {}
  }),
  created() {
    this.initProgress();
  },
  methods: {
    handle(data) {
      this.progressIndex = data.nextIndex;
      this.currentIndex = data.nextIndex;
      for (let p in data.form) {
        this.form[p] = data.form[p];
      }
    },
    checkoutProgress(index) {
      if (index > this.progressIndex || this.progressIndex == 3) {
        return;
      }

      this.currentIndex = index;
    },
    initProgress() {
      try {
        let cardStatus = this.loginUser.user_data.card_status;
        if (cardStatus && cardStatus != '0') {
          this.progressIndex = 3;
          this.currentIndex = 3;
        }
      } catch (e) {
        console.log(e)
      }

      try {
        let companyStatus = this.loginUser.user_data.company_status;
        if (companyStatus && companyStatus != '0') {
          this.progressIndex = 3;
          this.currentIndex = 3;
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  computed: {
    ...mapGetters([
      'loginUser'
    ])
  },
  watch: {
    'loginUser': function () {
      // card_status 和 company_status： 0（未提交），1（已提交，待审核或审核中），2（被驳回），3（已审核）
      this.initProgress();
    }
  },
  components: {
    IdentityInfo,
    ApplyNotes,
    GoodAt,
    WaitExamine
  }
}
</script>

<style scoped>
.become-contributor {
  position: absolute;
  top: 0px;
  width: 100%;
  min-width: 1200px;
  height: 100%;
  min-height: 1300px;
  background-image: url('/assets/img/bg.jpg');
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  -webkit-background-position: center;
  -moz-background-position: center;
  -o-background-position: center;
  background-position: center;
}

.title {
  margin-top: 100px;
  color: #fff;
  font-size: 24px;
  text-align: center;
}

.progress {
  display: inline-block;
  margin-top: 50px;
  margin-left: calc(50% - 318px);
  margin-left: -moz-calc(50% - 318px);
  margin-left: -webkit-calc(50% - 318px);
}

.progress span {
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  cursor: pointer;
}

.dividing {
  display: inline-block;
  width: 62px;
  height: 1px;
  transform: translateY(-6px);
  margin: 0 12px;
  background: rgba(255, 255, 255, 0.3);
}

.tab-fade-enter-active {
   transition: all 1s;
}

.tab-fade-enter,
.tab-fade-leave-to {
  opacity: 0;
}
</style>
