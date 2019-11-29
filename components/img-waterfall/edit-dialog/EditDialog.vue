<template>
  <div class="img-edit-container">
    <input v-model="worksName" placeholder="作品名称" class="width300">

    <textarea v-model="worksDescription" class="works-description" placeholder="作品描述" />

    <selection
      v-model="categoryOne"
      class="category"
      place-text="选择分类"
      :options="categoryList"
      :option="categoryOne"
      :option-key="'name'"
      :is-not-allow="false"
      :max-num="8"
    />

    <div class="upload-waterMark">
      <div class="check-box-min" @click="isWaterMark = !isWaterMark">
        <div v-if="isWaterMark" />
      </div>
      <span>图片是否添加水印</span>
    </div>

    <div class="keyword">{{ keyword == '' ? '关键词' : '关键词（输入内容回车即可添加关键词）' }}</div>

    <input
      v-model="keyword"
      class="keyword-input"
      placeholder="输入内容回车即可添加关键词"
      @keyup.enter="pushKeyword"
    >

    <div id="keyword-list" class="keyword-list">
      <div v-for="(item, index) in keywordList" :key="index" class="keyword-item">
        <span>{{ item }}</span>
        <div class="delete" @click="deleteKeyword(index)" />
      </div>
    </div>

    <button @click="release">修改</button>
  </div>
</template>

<script>
import Selection from '~/components/selection/Selection'

export default {
  components: {
    Selection
  },
  props: [
    'imgDetail'
  ],
  data: () => ({
    worksName: '',
    worksDescription: '',
    categoryOne: {},
    originCategoryOne: {},
    isWaterMark: false,
    keyword: '',
    keywordList: [],
    originKeywordList: [],
    isReleasing: false
  }),
  computed: {

    loginUser() {
      return this.$store.state.login.loginUser
    },
    categoryList() {
      return this.$store.state.category.categoryList
    }
  },
  watch: {
    'keyword': function(val) {
      if (val.charAt(val.length - 1) === ' ') {
        this.pushKeyword()
      }
    }
  },
  created() {
    this.worksName = this.imgDetail.title
    this.worksDescription = this.imgDetail.text
    this.isWaterMark = this.imgDetail.is_water_mark == '1'
    this.keywordList = this.getKeywordList(this.imgDetail.tag_list)
    this.originKeywordList = this.getKeywordList(this.imgDetail.tag_list)

    if (this.imgDetail.category_list.length > 0) {
      this.categoryOne = this.imgDetail.category_list[0]
    }

    if (this.imgDetail.category_list.length > 0) {
      this.originCategoryOne = this.imgDetail.category_list[0]
    }

    window.onerror = (message, source, lineno, colno, error) => {
      const rqBody = {
        type: this.$utilHelper.debugTypes.MEDIA_EDIT_DIALOG_ERROR,
        client: this.$utilHelper.getBrowser(),
        content: JSON.stringify({
          user_id: this.loginUser.id,
          user_agent: navigator.userAgent,
          description: '编辑图片弹窗发生错误',
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

      this.$axios.paixinService.debug(rqBody)
    }
  },
  methods: {
    deleteKeyword(index) {
      this.keywordList.splice(index, 1)
    },
    pushKeyword() {
      // 将所有的中文逗号和空格替换为英文逗号
      let word = this.keyword.replace(new RegExp(' ', 'gm'), ',')
      word = word.replace(new RegExp('，', 'gm'), ',')

      word = word.replace(new RegExp(';', 'gm'), ',')

      word = word.replace(new RegExp('；', 'gm'), ',')

      word = word.replace(new RegExp('。', 'gm'), ',')

      word = word.replace(new RegExp('、', 'gm'), ',')

      // 以英文逗号为分隔提取关键字
      const list = word.split(',')
      list.forEach(e => {
        if (e != '') {
          this.keywordList.push(e)
        }
      })

      this.keyword = ''
    },
    getTags(keywordList) {
      let tags = ''
      const length = keywordList.length
      for (let i = 0; i < length; i++) {
        tags = tags + keywordList[i] + ','
      }
      return tags.substring(0, tags.length - 1)
    },
    getTagList(keywordList) {
      const list = []
      keywordList.map(e => {
        list.push({
          name: e
        })
      })
      return list
    },
    async release() {
      if (this.isReleasing) {
        return
      }

      const rqBody = {
        type: '6',
        media_id: this.imgDetail.id,
        title: this.worksName,
        text: this.worksDescription,
        is_water_mark: this.isWaterMark ? '1' : '0'
      }

      const originLength = this.originKeywordList.length

      const addList = this.keywordList.filter(e => {
        if (originLength.length === 0) {
          return true
        } else {
          let isAdd = true

          for (let i = 0; i < originLength; i++) {
            if (e == this.originKeywordList[i]) {
              isAdd = false
              break
            }
          }

          return isAdd
        }
      })

      const reduceList = this.originKeywordList.filter(e => {
        let isReduce = true
        for (let i = 0; i < originLength; i++) {
          if (e == this.keywordList[i]) {
            isReduce = false
            break
          }
        }
        return isReduce
      })

      if (addList.length > 0) {
        rqBody.tag_add = ''
        addList.map((e, index, array) => {
          rqBody.tag_add += (e + (index !== array.length - 1 ? ',' : ''))
        })
      }

      if (reduceList.length > 0) {
        rqBody.tag_reduce = ''
        reduceList.map((e, index, array) => {
          rqBody.tag_reduce += (e + (index !== array.length - 1 ? ',' : ''))
        })
      }

      if (this.originCategoryOne.id !== this.categoryOne.id) {
        rqBody.category_id = this.categoryOne.id
      }

      this.isReleasing = true

      const res = await this.$axios.mediaService.modify(rqBody)

      if (res.data.out === '1') {
        this.$toast.notice('修改成功')

        for (const p in res.data.data) {
          this.imgDetail[p] = res.data.data[p]
        }

        this.$emit('modifyMediaSuccess')
      } else {
        this.$toast.warn(res.data.msg)

        const errData = {
          type: this.$utilHelper.debugTypes.MEDIA_EDIT_DIALOG_ERROR,
          client: this.$utilHelper.getBrowser(),
          content: JSON.stringify({
            user_id: this.loginUser.id,
            user_agent: navigator.userAgent,
            description: '图片信息修改失败（res.data.out != 1）',
            data: {
              params: rqBody,
              response: res.data
            },
            time: (new Date()).getTime()
          })
        }

        // 发送错误信息
        this.$axios.paixinService.debug(errData)
      }

      this.isReleasing = false
    },
    getKeywordList(tagList) {
      const array = []
      tagList.map(e => {
        array.push(e.name)
      })
      return array
    }
  }
}
</script>

<style scoped>
.img-edit-container {
  position: fixed;
  z-index: 30;
  height: 500px;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  left: calc(50% - 172px);
  top: calc(50% - 242px);
  overflow: auto;
}

input {
  box-sizing: border-box;
  width: 300px;
  height: 45px;
  padding: 0 16px;
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #e3e3e3;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

input:hover {
  border-color: rgba(0, 0, 0, 0.3);
  transition: border-color 0.2s;
}

.works-description {
  box-sizing: border-box;
  display: block;
  width: 300px;
  height: 80px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #e3e3e3;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
  margin: 20px 0 0 0;
  resize: none;
}

.works-description:hover {
  border-color: rgba(0, 0, 0, 0.3);
  transition: border-color 0.2s;
}

::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.category {
  margin: 20px 0 0 0;
}

.upload-waterMark {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.check-box-min {
  width: 18px;
  height: 18px;
  border-radius: 1px;
  background-color: #ffffff;
  border: solid 1px #c8c8c8;
  cursor: pointer;
}

.check-box-min div {
  box-sizing: border-box;
  width: 12px;
  height: 7px;
  border-bottom: 2px solid #666666;
  border-left: 2px solid #666666;
  margin-left: 3px;
  margin-top: 4px;
  transform: rotate(-45deg);
}

.upload-waterMark span {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  margin-left: 12px;
}

.keyword {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  margin: 20px 0 0 0;
  text-align: left;
}

.keyword-input {
  margin: 20px 0 0 0;
}

.keyword-list {
  box-sizing: border-box;
  width: calc(100% - 32px);
  width: 300px;
  margin: 20px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
}

.keyword-item {
  box-sizing: border-box;
  height: 32px;
  border-radius: 100px;
  background-color: #fff;
  border: solid 1px #dfdfdf;
  font-size: 15px;
  text-align: left;
  color: #000;
  line-height: 32px;
  padding: 0 10px 0 14px;
  margin: 0 8px 8px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.keyword-item span {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete {
  width: 12px;
  height: 12px;
  background: url("./img/delete_dark.svg") no-repeat;
  background-size: contain;
  -moz-background-size: contain;
  margin-left: 8px;
  cursor: pointer;
}

button {
  width: 300px;
  height: 45px;
  margin: 24px 0 0 0;
  border-radius: 6px;
  background-color: #56cb8f;
  outline: none;
  border: none;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
}

.width300 {
  width: 300px;
}
</style>

