<template>
  <div class="withdrow-container">
    <div class="card">
      <div class="title">账户信息</div>
      <table>
        <tr>
          <td width="25%" class="td-title">累计收益</td>
          <td width="25%" class="td-title">累计提现</td>
          <td width="25%" class="td-title">可提现</td>
          <td width="25%" class="td-title">收款操作</td>
        </tr>
        <tr>
          <td width="25%" class="td-text">￥{{ gain }}</td>
          <td width="25%" class="td-text">￥{{ totalGain }}</td>
          <td width="25%" class="td-text" style="position: relative">
            ￥{{ ins }}
            <span class="note">(提现须不少于￥100)</span>
          </td>
          <td width="25%">
            <span class="add" @click="show">提现</span>
          </td>
        </tr>
      </table>
    </div>
    <transition name="withdraw-dialog-fade">
      <div class="withdraw-dialog-mask" v-if="isShowDialog" @click.stop="isShowDialog = false">
        <div class="withdraw-dialog" @click.stop>
          <div
            class="cancel"
            :style="{background: `url(${require('../img/delete_dark.svg')})`}"
            @click.stop="isShowDialog = false"
          ></div>
          <div class="feed-info">提交提现申请</div>
          <div class="tips">说明：当您的可提现金额超过100元时，我们会在每月20日向您打款</div>
          <div class="info-item">
            <span>收款方式：</span>银行转账
          </div>
          <div class="info-item">
            <span>收款人姓名：</span>
            <input type="text" v-model="name" :placeholder="placeHolders.name">
          </div>
          <div class="info-item">
            <span>银行卡号：</span>
            <input type="text" v-model="card" :placeholder="placeHolders.card">
          </div>
          <div class="info-item">
            <span>开户行：</span>
            <input type="text" v-model="bankAddr" :placeholder="placeHolders.bankAddr">
          </div>
          <div class="attention">请填写至支行，如工商银行北京支行</div>
          <div class="info-item">
            <span>7MX登录密码：</span>
            <input
              type="password"
              autocomplete="new-password"
              v-model="password"
              :placeholder="placeHolders.password"
            >
          </div>
          <button class="button-green" @click="commit">提交</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    incomeData: {
      gain: 0,
      totalGain: 0,
      ins: 0,
      totalIn: 0
    },
    isShowDialog: false,
    name: '',
    card: '',
    bankAddr: '',
    password: '',
    placeHolders: {
      name: '',
      card: '',
      cardOrgin: '',
      bankAddr: '',
      password: ''
    }
  }),
  methods: {
    async getUserDetail() {
      let res = await this.$axios.userService.getSellNum()

      if (res.data.out == '1') {
        let user = res.data.data

        this.incomeData.gain = user.gain || 0

        this.incomeData.totalGain = user.total_gain || 0

        this.incomeData.ins = user.ins || 0

        this.incomeData.totalIn = user.total_in || 0
        if (user.bank_card.length > 0) {
          this.placeHolders.card = `${user.bank_card.slice(
            0,
            4
          )}****${user.bank_card.slice(
            user.bank_card.length - 4,
            user.bank_card.length
          )}`
          this.placeHolders.cardOrgin = user.bank_card
        }

        this.placeHolders.name = user.bank_payee || ''

        this.placeHolders.bankAddr = user.bank_addr || ''
      }
    },
    async commit() {
      if (this.incomeData.ins / 100 < 100) {
        this.$toast.warn('对不起，可提现金额大于100才能提现')

        return
      }

      if (Object.keys(this.user).length < 1) {
        return
      }

      if (this.placeHolders.name == '' && this.name == '') {
        this.$toast.warn('请填写收款人姓名')

        return
      }

      if (!/^[0-9]{12,20}$/.test(this.card) && this.placeHolders.card == '') {
        this.$toast.warn('请填写正确的银行卡号')

        return
      }

      if (this.bankAddr == '' && this.placeHolders.bankAddr == '') {
        this.$toast.warn('请填写开户行')

        return
      }

      if (this.password == '') {
        this.$toast.warn('请填写7mx的密码')

        return
      }

      let data = {
        eput_id: this.user.id,
        paixin_id: this.user.gaga_id,
        password: this.password,
        bank_payee: this.name || this.placeHolders.name,
        bank_card: this.card || this.placeHolders.cardOrgin,
        bank_addr: this.bankAddr || this.placeHolders.bankAddr
      }

      let res = await this.$apiFactory.getPaixinApi().cashNeed(data)

      if (res.data.out == '1') {
        this.$toast.notice('提交成功')

        this.isShowDialog = false
      } else {
        this.$toast.warn('提交失败，请检查密码是否正确或联系')
      }
    },
    show() {
      this.isShowDialog = true
    }
  },
  created() {
    if (Object.keys(this.user).length > 0) {
      this.getUserDetail()
    }
  },
  mounted() {},
  watch: {
    user: function(v) {
      if (Object.keys(v).length > 0) {
        this.getUserDetail()
      }
    }
  },
  computed: {
    gain() {
      return (this.incomeData.gain / 100).toFixed(2)
    },
    totalGain() {
      return (this.incomeData.totalGain / 100).toFixed(2)
    },
    ins() {
      return (this.incomeData.ins / 100).toFixed(2)
    },
    totalIn() {
      return (this.incomeData.totalIn / 100).toFixed(2)
    }
  },
  components: {}
}
</script>

<style lang='scss' scoped>
.withdrow-container {
  width: calc(100% - 340px);
  height: calc(100% - 60px);
  box-sizing: border-box;
  margin-top: 60px;
  position: absolute;
  left: 340px;
  top: 0;
  padding: 40px 60px;

  .card {
    display: flex;
    flex-direction: column;
    vertical-align: bottom;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    overflow: hidden;
    position: absolute;
    max-width: 1200px;
    width: calc(100% - 120px);
    left: 50%;
    top: 160px;
    transform: translateX(-50%);

    .title {
      background: rgba(0, 0, 0, 0.05);
      height: 52px;
      line-height: 52px;
      padding: 0 20px;
      font-size: 16px;
    }

    table {
      width: 100%;
      padding: 40px 0;

      td {
        text-align: center;

        .add {
          color: #57cb8f;
          cursor: pointer;
        }

        .note {
          display: block;
          width: 200px;
          color: rgba(0, 0, 0, 0.5);
          font-size: 0.8rem;
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
}

.td-title {
  padding-bottom: 20px;
  color: rgba(0, 0, 0, 0.5);
}

.td-text {
  font-size: 1.5rem;
}

.withdraw-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.5);
  display: flex;
  align-items: center;
  justify-content: center;

  .withdraw-dialog {
    z-index: 60;
    background: #fff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 60px;

    .cancel {
      width: 14px;
      height: 14px;
      position: absolute;
      right: 10px;
      top: 10px;
      background-repeat: no-repeat !important;
      background-size: contain !important;
      background-position: center !important;
      cursor: pointer;
    }

    .feed-info {
      font-size: 1.2rem;
      color: #000;
      padding-bottom: 30px;
    }

    .tips {
      width: 350px;
      font-size: 0.875rem;
      color: rgba(0, 0, 0, 0.5);
      margin-bottom: 20px;
    }

    .attention {
      font-size: 0.875rem;
      color: rgba(0, 0, 0, 0.5);
      transform: translateX(18px);
    }

    .info-item {
      width: 400px;
      margin: 10px 0;
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      color: rgba(0, 0, 0, 0.85);

      span {
        display: inline-block;
        width: 105px;
        text-align: end;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.85);
      }

      input {
        flex: 1;
        height: 26px;
        line-height: 26px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        padding-left: 10px;
        border-radius: 4px;
        outline: none;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.85);
      }
    }

    button {
      outline: none;
      height: 40px !important;
      line-height: 40px !important;
      width: 240px;
      margin-top: 40px;
      border: none;
      font-size: 0.9rem;
    }
  }
}

.withdraw-dialog-fade-enter-active,
.withdraw-dialog-fade-leave-active {
  transition: all 0.2s;
}

.withdraw-dialog-fade-enter,
.withdraw-dialog-fade-leave-active {
  opacity: 0;
}
</style>