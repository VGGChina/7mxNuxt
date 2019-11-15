<template>
  <div class="become-contributor">
    <div class="title">
      成为拍信商业供稿人
    </div>

    <div class="progress">
      <div v-for="(item, index) in progressList" :key="index" style="display: inline-block">
        <span
          :style="{ color: index == currentIndex ? '#fff' : 'rgba(255, 255, 255, 0.6)' }"
          @click="checkoutProgress(index)"
        >
          {{ item }}
        </span>
        <div v-if="index != (progressList.length - 1)" class="dividing" />
      </div>
    </div>

    <transition name="tab-fade">
      <apply-notes
        v-show="currentIndex == 0"
        @updateProgress="handle"
      />
    </transition>

    <transition name="tab-fade">
      <identity-info
        v-show="currentIndex == 1"
        :progress-index="currentIndex"
        @updateProgress="handle"
      />
    </transition>

    <transition name="tab-fade">
      <good-at
        v-show="currentIndex == 2"
        :form-toal="form"
        @updateProgress="handle"
      />
    </transition>

    <transition name="tab-fade">
      <wait-examine
        v-show="currentIndex == 3"
        :form-toal="form"
        @updateProgress="handle"
      />
    </transition>
  </div>
</template>

<script>
import IdentityInfo from './children/IdentityInfo'
import ApplyNotes from './children/ApplyNotes'
import GoodAt from './children/good-at/GoodAt'
import WaitExamine from './children/wait-examine/WaitExamine'

export default {
  components: {
    IdentityInfo,
    ApplyNotes,
    GoodAt,
    WaitExamine
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
  computed: {
    loginUser() {
      return this.$store.state.login.loginUser
    }
  },
  watch: {
    'loginUser': function() {
      // card_status 和 company_status： 0（未提交），1（已提交，待审核或审核中），2（被驳回），3（已审核）
      this.initProgress()
    }
  },
  beforeCreate() {
    document.title = '签约 - 7MX 中国领先的视觉创作社区'
  },
  created() {
    this.initProgress()
  },
  methods: {
    handle(data) {
      this.progressIndex = data.nextIndex
      this.currentIndex = data.nextIndex
      for (const p in data.form) {
        this.form[p] = data.form[p]
      }
    },
    checkoutProgress(index) {
      if (index > this.progressIndex || this.progressIndex == 3) {
        return
      }

      this.currentIndex = index
    },
    initProgress() {
      try {
        const cardStatus = this.loginUser.user_data.card_status
        if (cardStatus && cardStatus != '0') {
          this.progressIndex = 3
          this.currentIndex = 3
        }
      } catch (e) {
        console.log(e)
      }

      try {
        const companyStatus = this.loginUser.user_data.company_status
        if (companyStatus && companyStatus != '0') {
          this.progressIndex = 3
          this.currentIndex = 3
        }
      } catch (e) {
        console.log(e)
      }
    }
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
