<template>
  <div>
    <transition name="mask-fade">
      <div v-if="neededIsShow" class="mask" @click="cancel" />
    </transition>

    <transition name="dialog-fade">
      <div v-if="neededIsShow" class="dialog">
        <h2>填写联系方式</h2>
        <h4>
          购买热线：400-9613-900，或<a href="//q.url.cn/CDzAE8?_type=wpa&qidian=true" target="_blank">在线咨询</a><br>
          留下真实信息，以便上架后尽快完成授权
        </h4>
        <input
          v-model="name"
          type="text"
          placeholder="公司或者个人称呼"
        >

        <input
          v-model="phone"
          type="text"
          placeholder="手机号"
        >

        <input
          v-model="qq"
          type="text"
          placeholder="QQ号"
        >

        <button @click="commit">确定</button>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import apiFactory from '~/api/factory/apiFactory.js'

export default {
  data() {
    return {
      name: '',
      phone: '',
      qq: '',
      commitCheak: false
    }
  },
  methods: {
    cancel() {
      this.$store.commit('neededData', {
        isShow: false,
        mediaId: ''
      })
    },
    async commit() {
      if (this.name == '' || this.phone == '') {
        this.$toast.warn('公司或者个人称呼、手机号为必填项')
        return
      }

      const rqBody = {
        media_id: this.neededMediaId,
        name: this.name,
        phone: this.phone,
        qq: this.qq
      }

      const res = await apiFactory.getMediaApi().needed(rqBody)

      if (res.data.out == '1') {
        let neededUserList = []
        const storage = localStorage.getItem('neededUserList')
        if (storage != null) {
          neededUserList = JSON.parse(storage)
        }
        neededUserList.push({
          userId: this.loginUser.id,
          name: rqBody.name,
          phone: rqBody.phone,
          qq: rqBody.qq
        })
        localStorage.setItem('neededUserList', JSON.stringify(neededUserList))
        this.$toast.notice('已经收到您的购买意向，我们将尽快联系作者')
        this.$store.commit('neededData', {
          isShow: false,
          mediaId: ''
        })
      } else {
        this.$toast.warn(res.data.msg)
      }
    }
  },
  computed: {
    ...mapGetters([
      'loginUser',
      'neededIsShow',
      'neededMediaId'
    ])
  }
}
</script>

<style scoped>
.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: all .4s;
}

.mask-fade-enter,
.mask-fade-leave-active {
  opacity: 0;
}

.mask {
  position: fixed;
  z-index: 20;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, .4);
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all .4s;
}

.dialog-fade-enter,
.dialog-fade-leave-active {
  opacity: 0;
  transform: translateY(-30px);
}

.dialog {
  box-sizing: border-box;
  position: fixed;
  z-index: 30;
  width: 460px;
  height: 496px;
  padding: 0 30px;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  align-items: center;
  top: 50%;
  margin-top: -248px;
  left: 50%;
  margin-left: -230px;
}

h2 {
  font-size: 22px;
  margin: 30px 0 0 0;
}

h4 {
  font-size: 14px;
  font-weight: 400;
  margin: 8px 0 20px 0;
  text-align: center;
  line-height: 1.6;
}

h4 a {
  color: #56cb8f;
}

input {
  box-sizing: border-box;
  width: 400px;
  height: 48px;
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px #e4e4e4;
  outline: none;
  font-size: 16px;
  padding: 0 18px;
  transition: border .5s;
  margin-bottom: 24px;
}

input:hover {
  border: solid 1px #555;
  transition: border .5s;
}

::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: rgba(0, 0, 0, 0.5);
}

::-moz-placeholder {
  /* Firefox 19+ */
  color: rgba(0, 0, 0, 0.5);
}

:-moz-placeholder {
  /* Firefox 18- */
  color: rgba(0, 0, 0, 0.5);
}

button {
  width: 400px;
  height: 45px;
  margin-top: 56px;
  border: none;
  color: #fff;
  font-size: 16px;
  border-radius: 6px;
  background-color: #56cb8f;
  cursor: pointer;
  position: absolute;
  bottom: 40px;
  outline: none;
}
</style>

