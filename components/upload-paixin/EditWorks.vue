<template>
  <div class="choose-works">
    <div class="left">
      <work-list
        :work-list="choosedList"
        :step="1"
        :is-releas-clicked="isReleasClicked"
      />
    </div>

    <div class="right">
      <h3 class="">选择供稿种类</h3>

      <div class="choose-exclusive">
        <div
          v-for="(item, index) in exclusiveList"
          :key="index"
          :style="{
            color: currentForm.exclusive.id == index ? '#fff' : '#000',
            background: currentForm.exclusive.id == index ? '#595959' : '#fff'
          }"
          @click="selecteExclusive(item)"
        >
          {{ item.name }}
        </div>
      </div>

      <ul>
        <li
          v-for="(item, index) in currentTips"
          :key="index"
          @click="onItemClick(index)"
        >
          {{ item }}
        </li>
      </ul>

      <h3>选择图片类型</h3>

      <div
        v-for="(item, index) in imgTypes"
        :key="index"
        class="selecte-img-type"
      >
        <div class="check-box" @click="selecteImgType(item)">
          <div v-if="currentForm.editorial.id == index" />
        </div>

        <div class="img-type-description">
          <span>{{ item.name }}</span><span>{{ item.description }}</span>
        </div>
      </div>

      <div class="what-is">
        <a href="/media-notes" target="_blank">什么是传媒图片？</a>
      </div>

      <div class="release-button" @click="release">{{ isReleasing ? '发布中...' : '发布' }}</div>
    </div>

    <Protocol :is-show="isShowProtocolDialog" @cancelProtocolDialog="cancelProtocolDialog" />
  </div>
</template>

<script>
import Protocol from './protocol/Protocol'
import WorkList from './work-list/WorkList'
import apiFactory from '~/api/factory/apiFactory.js'

const catchHandler = error => ({
  payload: error,
  data: { out: '0' }
})

export default {
  components: {
    WorkList,
    Protocol
  },
  props: [
    'choosedList'
  ],
  data() {
    return {
      exclusiveList: [{
        id: 0,
        name: '独家供稿'
      }, {
        id: 1,
        name: '非独家供稿'
      }],
      exclusiveTips: [
        '标准协议799元/张，拓展协议2500元/张',
        '平台和摄影师收入分成5:5',
        '获得首页编辑推荐，提高曝光率',
        '平台代理该图片版权相关维权工作'
      ],
      unexclusiveTips: [
        '标准协议299元/张，拓展协议1600元/张',
        '平台和摄影师收入分成6:4'
      ],
      imgTypes: [{
        name: '商业图片',
        description: '：图片可用于商业/广告/传媒等用途。',
        id: 0
      }, {
        name: '传媒图片',
        description: '：图片仅可在出版新闻或资讯页面合法使用，不可被用于商业、广告和任何涉及收费的出版或发表作品中。',
        id: 1
      }],
      isReleasing: false,
      isShowProtocolDialog: false,
      isReleasClicked: false
    }
  },
  computed: {
    currentTips() {
      if (this.currentForm.exclusive.id == 0) {
        return this.exclusiveTips
      } else if (this.currentForm.exclusive.id == 1) {
        return this.unexclusiveTips
      } else {
        return []
      }
    },
    currentSeleted() {
      return this.choosedList.filter(e => {
        return e.isSelected
      })
    },
    currentForm() {
      if (this.currentSeleted.length < 1) {
        return {
          exclusive: {
            id: -1,
            name: ''
          },
          editorial: {
            name: '',
            id: -1
          }
        }
      }

      return this.currentSeleted[0].toPaixinForm
    },
    loginUser() {
      return this.$store.state.login.loginUser
    }
  },
  created() {
    if (this.choosedList.length > 0) {
      this.choosedList.map(e => {
        this.$set(e, 'toPaixinForm', {
          exclusive: {
            id: -1,
            name: ''
          },
          editorial: {
            id: -1,
            name: ''
          },
          status: 0
        })
      })
    }

    window.onerror = (message, source, lineno, colno, error) => {
      const rqBody = {
        type: this.$utilHelper.debugTypes.UPLOAD_ERROR,
        client: this.$utilHelper.getBrowser(),
        content: JSON.stringify({
          user_id: this.loginUser.id,
          user_agent: navigator.userAgent,
          description: '上架到拍信时发生错误（window.onerror全局监听）',
          data: {
            message: message,
            source: source,
            lineno: lineno,
            colno: colno,
            error: error
          },
          time: (new Date()).getTime()
        })
      }

      apiFactory.getPaixinApi().debug(rqBody)
    }
  },
  methods: {
    selecteExclusive(item) {
      if (this.currentSeleted.length < 1) {
        this.$toast.warn('您还没有选中要编辑的作品')
        return
      }

      this.currentSeleted.forEach(e => {
        e.toPaixinForm.exclusive = item
      })
    },
    selecteImgType(item) {
      if (this.currentSeleted.length < 1) {
        this.$toast.warn('您还没有选中要编辑的作品')
        return
      }

      this.currentSeleted.forEach(e => {
        e.toPaixinForm.editorial = item
      })
    },
    async release() {
      this.isReleasClicked = true

      if (this.isReleasing) {
        return
      }

      const l = this.choosedList.length

      for (let i = 0; i < l; i++) {
        if (this.choosedList[i].toPaixinForm.exclusive.id == -1 ||
          this.choosedList[i].toPaixinForm.editorial.id == -1) {
          // ----------
          this.$toast.warn('您还有未编辑的作品')

          return
        }
      }

      const promises = []
      const dataArray = []

      this.choosedList.forEach(e => {
        const rqBody = {
          media_id: e.id,
          is_exclusive: e.toPaixinForm.exclusive.id == 0 ? '1' : '0',
          is_editorial: e.toPaixinForm.editorial.id == 0 ? '1' : '0',
          gaga_id: this.loginUser.gaga_id
        }

        promises.push(apiFactory.getMediaApi().intoOther(rqBody))

        dataArray.push(rqBody)
      })

      promises.forEach(promise => promise.catch(catchHandler))

      this.isReleasing = true

      const results = await Promise.all(promises)

      results.forEach((e, index) => {
        if (e.data.out == '1') {
          this.choosedList[index].toPaixinForm.status = 1
        } else {
          this.$toast.warn(e.data.msg)

          const errorData = {
            type: this.$utilHelper.debugTypes.UPLOAD_TO_PAIXIN_ERROR,
            client: this.$utilHelper.getBrowser(),
            content: JSON.stringify({
              user_id: this.loginUser.id,
              user_agent: navigator.userAgent,
              description: '上架到拍信时发生错误',
              data: {
                params: dataArray[index],
                response: e.data
              },
              time: (new Date()).getTime()
            })
          }

          // 发送错误信息
          apiFactory.getPaixinApi().debug(errorData)
        }
      })

      const filterArray = this.choosedList.filter(e => {
        return e.toPaixinForm.status == 0
      })

      this.choosedList.splice(0, this.choosedList.length)

      this.choosedList.push(...filterArray)

      if (this.choosedList.length < 1) {
        this.$toast.notice('上架成功')
        this.isReleasing = false
        this.$emit('nextStep', { choosedList: this.choosedList, isChoosed: false })
        this.$store.commit('uploadPaixin/isShowUploadPaixinDialog', false)
      }
    },
    onItemClick(index) {
      if (index == 0) {
        this.isShowProtocolDialog = true
      }
    },
    cancelProtocolDialog() {
      this.isShowProtocolDialog = false
    }
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
  padding: 0px 20px;
  font-size: 14px;
  line-height: 2.5;
  overflow: auto;
  padding-bottom: 20px;
}

.choose-exclusive {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.choose-exclusive div {
  border: 1px solid #595959;
  width: calc(50% - 8px);
  height: 70px;
  border-radius: 4px;
  text-align: center;
  line-height: 70px;
  font-size: 1.2em;
  cursor: pointer;
  transition: all .3s;
}

ul {
  padding: 0 0 0 20px;
}

ul :nth-child(1) {
  color: #1d9a5a;
  text-decoration: underline;
  cursor: pointer;
  margin: 10px 0;
}

.selecte-img-type {
  display: flex;
  align-items: flex-start;
  margin-top: 8px;
}

.check-box {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #dddddd;
  cursor: pointer;
  margin-top: 4px;
  margin-right: 8px;
}

.check-box div {
  box-sizing: border-box;
  width: 12px;
  height: 8px;
  border-bottom: 3px solid #666666;
  border-left: 3px solid #666666;
  margin-left: 5px;
  margin-top: 6px;
  transform:rotate(-45deg);
  -ms-transform:rotate(-45deg); 	/* IE 9 */
  -moz-transform:rotate(-45deg); 	/* Firefox */
  -webkit-transform:rotate(-45deg); /* Safari 和 Chrome */
  -o-transform:rotate(-45deg); 	/* Opera */
}

.img-type-description {
  flex: 1;

}

.what-is {
  margin-top: 14px;
  cursor: pointer;
}

.what-is a {
  text-decoration: none;
  font-size: 14px;
  color: #1d9a5a;
}

.release-button {
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
</style>

