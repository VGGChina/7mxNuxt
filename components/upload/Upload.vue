<template>
  <div>
    <transition name="cover-fade">
      <div v-if="isShowUploadDialog" class="upload-cover" @click="cancelDialog">
        <div class="cancle-button" />
      </div>
    </transition>

    <!-- 上传细则 -->
    <transition name="upload-fade">
      <div v-if="isShowUploadDialog" class="upload-container">
        <div v-if="!isAgreeRules" class="rules">
          <div class="title">上传细则</div>
          <div class="detail">
            <div
              class="detail-black"
            >* 每次最多上传{{ maxUploadNum }}张图片；每张图片最长边必须大于2000像素，最短边必须大于1000像素；每张图片大小不能超过50MB</div>
            <br>
            <div class="detail-black">* 若上传的多张图片属于一个系列，只需要编辑第一张图片，其余图片将默认使用第一张图片的所有信息；否则，请单独编辑每张图片</div>
            <br>
            <div class="detail-red">
              * 声明：上传者需保证上传作品系原创，且拥有作品的独立版权，不会侵犯任何版权、商标或其他
              知识产权，亦不会违反任何第三方隐私权或肖像权，否则上传者承担全部法律责任
            </div>
          </div>

          <button @click="agreeRules">同意并上传</button>
        </div>

        <!-- 上传功能区，在同意上传细则后显示 -->
        <transition name="agreed">
          <div v-if="isAgreeRules" class="upload-main-container">
            <!-- 选择图片区 -->
            <div id="upload-img-pick-container">
              <div id="upload-add-img">
                <div class="horizontal" />
                <div class="vertical" />
              </div>

              <img-pre
                v-for="(item, index) in uploader.files"
                :key="index"
                :file="item"
                :index="index"
                :uploader="uploader"
                @uploadImgPreSelected="onItemSelected"
                @uploadImgPreEmpty="onFilesListEmpty"
              />

              <div
                v-if="!!uploader.files && uploader.files.length < 1"
                class="add-tips"
              >← 点此添加照片，不建议加边框和水印</div>
            </div>

            <!-- 图片信息编辑区 -->
            <div class="upload-img-edit-container">
              <button @click.stop="release">发布</button>

              <input v-model="title" class="works-name" type="text" placeholder="作品名称">

              <textarea
                v-model="text"
                class="works-description"
                type="text"
                placeholder="描述一下图片的故事，有利推荐！"
              />

              <selection
                v-model="category"
                class="category"
                :place-text="'选择分类'"
                :options="categoryList"
                :option="category"
                :option-key="'name'"
                :max-num="8"
                :border-color="isReleaseClicked && isNoCategory ? 'red' : '#e3e3e3'"
              />

              <div class="tag" style="margin: 25px 0 0 22px">参加活动</div>

              <selection
                v-model="activity"
                disabled="disabled"
                class="category"
                :place-text="'参加活动'"
                :options="activities"
                :option="activity"
                :option-key="'name'"
                :is-show-red="true"
                :max-num="8"
                style="margin-top: 10px"
              />

              <div
                v-if="$route.name == 'activityDetail' && activity.id > 0"
                class="upload-activiy"
              >活动：{{ activity.name }}</div>

              <div class="upload-waterMark">
                <div class="check-box-min" @click="addWaterMark">
                  <div v-if="isWaterMark" />
                </div>
                <span>给本图添加水印</span>
              </div>
              <div class="upload-waterMark waterMarkAll">
                <span @click="waterMarkAll">点此全部添加水印</span>
                <span @click="unwaterMarkAll">全部取消</span>
              </div>

              <div class="tag">
                关键词
                <span style="font-size: 14px">(输入关键词，按回车或空格键即可)</span>
              </div>

              <div
                class="upload-keyworkHelp"
                @click="$store.commit('help/help_show', { current: { index: 6, subIndex: 0 } })"
              >如何填写图片关键词？</div>

              <span v-show="tagList.length > 0" class="copy-tags" @click="copyTags()">复制关键词</span>

              <input
                v-model="tag"
                class="tag-input"
                type="text"
                placeholder="至少添加5个关键词"
                :style="{
                  'border-color': isReleaseClicked && isNoKewords ? 'red' : '#e3e3e3'
                }"
                @keyup.enter="pushTag"
              >

              <div id="tag-list" class="tag-list">
                <div v-for="(item, index) in tagList" :key="index" class="tag-item">
                  <span>{{ item.label }}</span>
                  <div class="delete" @click="deleteTag(item, index)" />
                </div>
              </div>

              <div class="tag">推荐关键词</div>
              <div class="recommend-tag-list">
                <div
                  v-for="(item, index) in recommendTagList"
                  v-show="!item.isSelected"
                  :key="index"
                  @click="onClickRecommendTag(item)"
                >
                  <span>{{ item.label }}</span>
                </div>
              </div>
            </div>

            <!-- 发布中的遮罩 -->
            <transition name="release-fade">
              <div v-if="isReleasing" class="release">
                <div class="spinner">
                  <div class="bounce1" />
                  <div class="bounce2" />
                  <div class="bounce3" />
                </div>
                <div class="loading-font">正在发布...</div>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
/* global QiniuJsSDK */
/* global EXIF */
import ImgPre from './img-pre/ImgPre'
import getUptoken from '~/api/uptokenService'
import uploadUtil from '~/utils/uploadUtil'
import { axiosPost } from '~/api/factory/axiosFactory'
import Selection from '~/components/selection/Selection'

export default {
  components: {
    ImgPre,
    Selection
  },
  data: () => ({
    isAgreeRules: false,
    uploader: {},
    upTokenData: {},
    title: '',
    text: '',
    category: {},
    activity: {},
    isWaterMark: false,
    tag: '',
    tagList: [],
    isReleasing: false,
    activities: [],
    isReleaseClicked: false,
    isNoCategory: false,
    isNoKewords: false,
    maxUploadNum: 20
  }),
  computed: {
    isShowUploadDialog() {
      return this.$store.state.upload.isShowUploadDialog
    },
    loginUser() {
      return this.$store.state.login.loginUser
    },
    isLogin() {
      return this.$store.state.login.isLogin
    },
    categoryList() {
      return this.$store.state.category.categoryList
    },
    uploadActivity() {
      return this.$store.state.upload.uploadActivity
    },
    recommendTagList() {
      if (this.$utilHelper.isEmptyObj(this.uploader)) {
        return []
      }

      if (this.uploader.files.length < 1) {
        return []
      }

      const selectedFiles = this.uploader.files.filter(e => {
        return e.isSelected
      })

      if (selectedFiles.length < 1) {
        return []
      }

      return selectedFiles[0].recommendTagList
    },
    userRef() {
      return this.$utilHelper.toUserPage(this.loginUser)
    }
  },
  watch: {
    'isAgreeRules': function(val) {
      if (val) {
        this.activity = this.uploadActivity

        this.$nextTick(() => {
          this.initQiNiu()
        })
      }
    },
    'title': function(val) {
      if (this.$utilHelper.isEmptyObj(this.uploader)) return

      this.uploader.files.forEach(e => {
        if (e.isSelected) {
          e.title = val
        }
      })
    },
    'text': function(val) {
      if (this.$utilHelper.isEmptyObj(this.uploader)) return

      this.uploader.files.forEach(e => {
        if (e.isSelected) {
          e.text = val
        }
      })
    },
    'category': function(val, oldVal) {
      if (this.$utilHelper.isEmptyObj(this.uploader)) return

      if (this.uploader.files.length < 1) return

      this.uploader.files.forEach(e => {
        if (e.isSelected) {
          e.category = val
        }
      })

      if (!this.$utilHelper.isEmptyObj(this.uploader.files[0].category)) {
        this.isNoCategory = false
      }
    },
    'activity': function(val, oldVal) {
      if (this.$utilHelper.isEmptyObj(this.uploader)) return

      this.uploader.files.forEach(e => {
        if (e.isSelected) {
          e.activity = val
        }
      })
    },
    'isWaterMark': function(val) {
      if (this.$utilHelper.isEmptyObj(this.uploader)) return

      this.uploader.files.forEach(e => {
        if (e.isSelected) {
          e.isWaterMark = val
        }
      })
    },
    'tag': function(val) {
      if (val.charAt(val.length - 1) == ' ') {
        this.pushTag()
      }
    },
    'tagList': {
      handler: function(val) {
        if (this.$utilHelper.isEmptyObj(this.uploader)) return

        if (this.uploader.files.length < 1) return

        this.uploader.files.forEach(e => {
          if (e.isSelected) {
            e.tagList = JSON.parse(JSON.stringify(val))
          }
        })

        if (!this.uploader.files[0].tagList.length < 1) {
          this.isNoKewords = false
        }
      },
      deep: true
    },
    'isShowUploadDialog': function(val) {
      if (val) {
        window.onerror = (message, source, lineno, colno, error) => {
          const rqBody = {
            type: this.$utilHelper.debugTypes.UPLOAD_ERROR,
            client: this.$utilHelper.getBrowser(),
            content: JSON.stringify({
              user_id: this.loginUser.id,
              user_agent: navigator.userAgent,
              description: '上传图片时发生错误（window.onerror全局监听）',
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
      } else {
        window.onerror = null
      }
    }
  },
  created() {
    this.fetchActivities()
  },
  methods: {

    agreeRules() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      this.isAgreeRules = true
    },
    cancelDialog() {
      this.$store.commit('upload/isShowUploadDialog', false)

      // 重置所有变量，除了activities
      this.isAgreeRules = false
      this.uploader = {}
      this.upTokenData = {}
      this.title = ''
      this.text = ''
      this.category = {}
      this.activity = {}
      this.isWaterMark = false
      this.tag = ''
      this.tagList = []
      this.isReleasing = false
      this.isReleaseClicked = false
      this.isNoCategory = false
      this.isNoKewords = false
    },
    minNum(x, y) {
      return x > y ? y : x
    },
    maxNum(x, y) {
      return x > y ? x : y
    },
    addWaterMark() {
      this.isWaterMark = !this.isWaterMark
      // this.uploader.files.splice(this.uploader.files.length)
    },
    waterMarkAll() {
      this.uploader.files.map(ele => {
        ele.isWaterMark = true
      })
      this.isWaterMark = true
    },
    unwaterMarkAll() {
      this.uploader.files.map(ele => {
        ele.isWaterMark = false
      })
      this.isWaterMark = false
    },
    put64(file) {
      const extension = file.type.split('/')[1] || 'jpeg'
      const data = uploadUtil.getUploadData('images', 'photos2/', extension)
      let upTokenData = null

      getUptoken(data, request => {
        if (request.status === 200) {
          const res = JSON.parse(request.responseText)

          // if (res.out == '1') {
          //   upTokenData = res.data
          // }
          if (res) {
            upTokenData = res
            upTokenData.uptoken = res.token
            upTokenData.bucket = "gaga-private"
            upTokenData.base_url ="http://private.gaga.me/"
          }
        }
      }, window.localStorage.xToken)

      if (!upTokenData) {
        return
      }

      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = event => {
        file.thumbnailPutStatus = 2

        file.thumbnailSize = event.total

        file.thumbnailLoaded = event.loaded
      }

      xhr.upload.onload = event => {
        file.thumbnailPutStatus = 5
      }

      xhr.upload.onerror = event => {
        file.thumbnailPutStatus = 4
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (file.thumbnailPutStatus == 5) {
            const res = JSON.parse(xhr.responseText)

            file.thumbnailUrl = 'http://images.gaga.me/' + res.key

            // 自动打标签
            axiosPost('//ai.dispatch.paixin.com/', { url: file.thumbnailUrl })
              .then(res => {
                res.data.data.forEach(e => {
                  this.$set(e, 'isSelected', false)
                })
                file.recommendTagList.push(...res.data.data)
              })
          }
        }
      }

      xhr.open('POST', 'https://up.qbox.me/putb64/-1', true)

      xhr.setRequestHeader('Content-Type', 'application/octet-stream')

      xhr.setRequestHeader('Authorization', 'UpToken ' + upTokenData.uptoken)

      xhr.send(file.src.split(',')[1])
    },
    initQiNiu() {
      const vm = this
      const qiniu = new QiniuJsSDK()
      this.uploader = qiniu.uploader({
        runtimes: 'html5,flash,html4',
        multi_selection: true,
        browse_button: 'upload-add-img',
        container: 'upload-img-pick-container',
        uptoken_func: file => {
          const extension = file.type.split('/')[1] || 'jpeg'
          const data = uploadUtil.getUploadData('private', 'photos/', extension)

          getUptoken(data, request => {
            if (request.status === 200) {
              const res = JSON.parse(request.responseText)
              // if (res.out === '1') {
              //   this.upTokenData = res.data
              // } else {
              //   this.$toast.warn(res.msg)
              //   this.upTokenData = {}
              // }
              console.log('res',res)
              if (res) {
                this.upTokenData = res
                this.upTokenData.uptoken = res.token
                this.upTokenData.bucket = "gaga-private"
                this.upTokenData.base_url ="http://private.gaga.me/"
                console.log(1111,this.upTokenData.uptoken)
              } else {
                this.$toast.warn(res.msg)
                this.upTokenData = {}
              }
            } else {
              this.$toast.warn('上传失败，请刷新页面后重试')
              return {}
            }
          }, window.localStorage.xToken)

          return this.upTokenData.uptoken
        },
        get_new_uptoken: true,
        domain: 'private.gaga.com',
        flash_swf_url: 'path/of/plupload/Moxie.swf',
        max_retries: 2,
        auto_start: false,
        unique_names: false,
        save_key: false,
        max_file_size: '50mb',
        filters: {
          prevent_duplicates: true,
          mime_types: [{
            title: 'Image files',
            extensions: 'jpg,jpeg,png',
            max_file_size: '50mb'
          }]
        },
        init: {
          'FilesAdded': function(up, files) {
            if (up.files.length > vm.maxUploadNum) {
              // 上一次添加图片前的数量
              const lastTimeCount = up.files.length - files.length
              // 剩余的可添加图片数量
              const leftCount = vm.maxUploadNum - lastTimeCount

              if (files.length > leftCount) {
                files.splice(leftCount, files.length)
              }

              up.files.splice(vm.maxUploadNum, up.files.length)

              vm.$toast.warn('每次最多只能上传' + vm.maxUploadNum + '张图片')
            }

            files.forEach((file, fileIndex) => {
              file.title = vm.title

              file.text = vm.text

              file.category = vm.category

              file.activity = vm.activity

              file.isWaterMark = vm.isWaterMark

              file.tagList = []

              vm.$set(file, 'recommendTagList', [])

              vm.$set(file, 'src', '')

              if (up.files.length == files.length && file.id == up.files[0].id) {
                vm.$set(file, 'isSelected', true)
              } else {
                vm.$set(file, 'isSelected', false)
              }

              file.thumbnailUrl = ''

              file.thumbnailSize = 0

              // 1：还未开始上传，2：正在上传，4：上传失败，5：上传成功
              file.thumbnailPutStatus = 1

              file.thumbnailLoaded = 0

              // 0代表还未提交给后台，-1代表提价失败
              file.putStaus = 0

              file.isSizeMatch = true

              const fileNative = file.getNative()
              const url = window.URL || window.webkitURL || window.mozURL
              const src = url.createObjectURL(fileNative)
              const image = new Image()

              image.onload = function() {
                if (vm.maxNum(image.width, image.height) < 2000 || vm.minNum(image.width, image.height) < 1000) {
                  vm.$toast.warn('图片的尺寸必须大于2000 × 1000px')
                  // 图片的最长边必须大于2000px，最短边必须大于1000px，否则从队列中去除
                  file.isSizeMatch = false
                }

                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                let maxWidth = 400

                if (image.height > image.width) {
                  maxWidth = image.width / image.height * maxWidth
                }

                canvas.width = maxWidth

                canvas.height = image.height / image.width * maxWidth

                context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)

                const base64 = canvas.toDataURL(file.type, 0.92)

                file.src = base64

                // 上传base64的小图到七牛，以便自动打标签
                if (file.isSizeMatch) {
                  vm.put64(file)
                }

                file.width = image.width

                file.height = image.height

                // 获取图片的exif信息，判断图片的方向
                EXIF.getData(image, function() {
                  const ori = EXIF.getTag(this, 'Orientation')

                  if (ori == 5 || ori == 6 || ori == 7 || ori == 8) {
                    // 如果方向被旋转，则长宽颠倒
                    file.width = image.height

                    file.height = image.width
                  }
                })

                if (fileIndex == files.length - 1) {
                  const notMatchFiles = files.filter(file => !file.isSizeMatch)

                  notMatchFiles.forEach(file => {
                    up.removeFile(file)
                  })
                  up.start()
                }
              }

              image.src = src
            })
          },
          'BeforeUpload': function(up, file) {
          },
          'FileUploaded': function(up, file, info) {
            const infoJson = JSON.parse(info)

            const url = 'http://private.gaga.me/' + infoJson.key

            file.source = url
          },
          'Error': (up, err, errTip) => {
            if (err.code == -600) {
              this.$toast.warn('图片大小不能超过 50 M')
            } else if (err.code == -601) {
              this.$toast.warn('只支持上传jpg(jpeg)或者png格式的图片')
            } else if (err.code == -602) {
              this.$toast.warn('不能重复选择同一张图片')
            } else if (err.status == 401) {
              this.$toast.warn('上传超时，可能是上传网速慢引起，请检查您的网络')
            }

            const errCopy = JSON.parse(JSON.stringify(err))

            // 删除src属性，src中存放图片的base64，太长了，不能传给后台
            delete errCopy.file.src

            // 删除activity属性，太长，不传给后台
            delete errCopy.file.activity

            const rqBody = {
              type: vm.$utilHelper.debugTypes.UPLOAD_ERROR,
              client: vm.$utilHelper.getBrowser(),
              content: JSON.stringify({
                user_id: vm.loginUser.id,
                user_agent: navigator.userAgent,
                description: '上传图片时发生错误',
                data: {
                  error: errCopy,
                  uptokenRes: vm.upTokenData
                },
                time: (new Date()).getTime()
              })
            }

            this.$axios.paixinService.debug(rqBody)
          },
          'UploadComplete': () => {
          },
          'Key': function(up, file) {
            return vm.upTokenData.key
          }
        }
      })
    },
    async fetchActivities() {
      // const config = {
      //   url: '/api/tag/activity_list',
      //   data: { type: '1' }
      // }
      // let res = await this.$axios(config)

      let data = {
        type: 2
      }
      let res = await this.$axios.tagService.getActivityList(data)

      if (res.status === 200) {
        console.log('upload',res)
        this.activities.push({ id: 0, name: '暂不参加' })
        res = res.data.filter(item => {
          return item.name !== '2019年中海汤泉——全国摄影邀请赛'
        })
        this.activities.push(...res)
      } else {
        this.activities.push({ id: -1, name: '暂无活动' })
      }
    },
    onItemSelected() {
      if (this.uploader == null) return

      const array = this.uploader.files.filter(e => {
        return e.isSelected
      })

      if (array.length > 0) {
        const file = array[0]

        this.title = file.title

        this.text = file.text

        this.category = file.category

        this.activity = file.activity

        this.isWaterMark = file.isWaterMark

        this.tagList = JSON.parse(JSON.stringify(file.tagList))
      }
    },
    onFilesListEmpty() {
      this.tagList = []
    },
    deleteTag(item, index) {
      this.tagList.splice(index, 1)

      item.isSelected = false
    },
    pushTag() {
      if (this.tag == '') {
        return
      }

      // 将所有的中文逗号、空格、中英文分号、中文句号、中文顿号替换为英文逗号
      let word = this.tag.replace(new RegExp(' ', 'gm'), ',')

      word = word.replace(new RegExp('，', 'gm'), ',')

      word = word.replace(new RegExp(';', 'gm'), ',')

      word = word.replace(new RegExp('；', 'gm'), ',')

      word = word.replace(new RegExp('。', 'gm'), ',')

      word = word.replace(new RegExp('、', 'gm'), ',')

      // 以英文逗号为分隔提取关键字
      const list = word.split(',')

      list.forEach(e => {
        if (e != '') {
          let isRepeat = false

          this.tagList.forEach(tag => {
            if (tag.label == e) {
              isRepeat = true
            }
          })

          if (!isRepeat) {
            this.tagList.push({
              label: e,
              isSelected: true
            })
          }
        }
      })

      this.tag = ''
    },
    onClickRecommendTag(tag) {
      let isRepeat = false

      this.tagList.forEach((e, index) => {
        if (e.label == tag.label) {
          isRepeat = true
          this.tagList.splice(index, 1, tag)
        }
      })

      if (!isRepeat) {
        this.tagList.push(tag)
      }

      tag.isSelected = true
    },
    getTags(file) {
      let tags = ''

      file.tagList.forEach(e => {
        tags = tags + e.label + ','
      })

      if (!this.$utilHelper.isEmptyObj(file.activity) && file.activity.id > 0) {
        tags = tags + file.activity.name + ','
      }

      return tags.substring(0, tags.length - 1)
    },
    /**
     * 提交给后台之前的验证工作
     * 主要是检查是否还有图片正在上传
     * 检查第一张图片是否选择了分类，添加了关键词
     * 如果出了第一张之外的其他图片没有选择分类和添加关键词，
     * 则使用第一张图片的分类和关键词作为其他图片的
     */
    async release() {
      this.isReleaseClicked = true

      if (this.isReleasing) {
        return
      }

      if (this.uploader.files.length < 1) {
        this.$toast.warn('没有可上传的图片')

        return
      }

      const firstFile = this.uploader.files[0]

      if (this.$utilHelper.isEmptyObj(firstFile.category) || firstFile.tagList.length < 1) {
        if (this.$utilHelper.isEmptyObj(firstFile.category)) {
          this.isNoCategory = true
        }

        if (firstFile.tagList.length < 1) {
          this.isNoKewords = true
        }

        this.$toast.warn('第一张图片必须填写分类和关键词')

        return
      }

      let isUploadFinished = true

      this.uploader.files.forEach(e => {
        // status等于2代表正在上传到七牛
        // 源码地址（第124行）：https://github.com/moxiecode/plupload/blob/master/src/plupload.js
        // if (e.status == 2 || e.thumbnailPutStatus == 2) {
        if (e.status == 2 || e.status == 1) {
          isUploadFinished = false
        }
      })

      if (!isUploadFinished) {
        this.$toast.warn('还有图片正在上传')

        return
      }

      this.uploader.files.forEach(e => {
        if (this.$utilHelper.isEmptyObj(e.category)) {
          e.category = firstFile.category
        }

        if (this.$utilHelper.isEmptyObj(e.activity)) {
          e.activity = firstFile.activity
        }

        if (e.tagList.length < 1) {
          e.tagList = firstFile.tagList
        }

        if (e.title == '') {
          e.title = firstFile.title
        }

        if (e.text == '') {
          e.text = firstFile.text
        }
      })

      this.isReleasing = true

      this.put()
    },
    /**
     * put函数是将上传成功的图片的url以及图片的相关信息提交给后台的函数
     * 使用递归的方式，在接口返回结果后，继续调用put直到没有可以提交的图片为止
     */
    async put() {
      // 如果没有文件，则发布成功了
      if (this.uploader.files.length < 1) {
        this.$toast.notice('发布成功')

        this.$store.commit('upload/isShowUploadDialog', false)

        // 跳转到用户主页
        window.location.replace(this.userRef)

        this.isReleasing = false

        return
      }

      // 筛选出还未提交过的图片
      const files = this.uploader.files.filter(e => {
        // putStatus代表是否提交给了后台，0是未提交，-1是提交失败
        return e.putStaus == 0
      })

      // 能走到这一步，说明 uploader.files.length >= 1，但是 putStaus == 0 的文件却没有了
      // 说明剩下的文件都是 putStaus == -1 的提交失败的文件
      if (files.length < 1) {
        this.$toast.warn('部分图片在上传过程中出现了意外，请重试')

        this.isReleasing = false

        return
      }

      const file = files[0]

      // status等于5代表已经上传到七牛
      // 源码地址（第142行）：https://github.com/moxiecode/plupload/blob/master/src/plupload.js
      if (file.status != 5) {
        // status != 5 表示图片上传到七牛失败，不用提交给后台，直接将putStatus置为-1
        file.putStaus = -1

        // 继续发布剩下的文件
        this.put()

        return
      }

      // const data = {
      //   type: '6',
      //   image: file.source,
      //   source: file.source,
      //   width: file.width,
      //   height: file.height,
      //   size: file.size,
      //   title: file.title,
      //   text: file.text,
      //   tag: this.getTags(file),
      //   category_id: file.category.id,
      //   is_water_mark: file.isWaterMark ? '1' : '0'
      // }

      // const res = await this.$axios.mediaService.put(data)

      let tempList = []
      for(let i of file.tagList) {
        tempList.push(i.label)
      }

      const data = {
        // type: '6',
        title: file.title,
        description: file.text,
        image: file.source,
        mediaWidth: file.width,
        mediaHeight: file.height,
        sourceFile: file.source,
        categoryId: file.category.id,
        watermarked: file.isWaterMark,
        tagList: tempList,
        sourcePreview: ''
        // size: file.size,
      }
      let temp = []
      temp.push(data)

      const res = await this.$axios.mediaService.put(temp)
      console.log('put',res)

      if (res.status === 200) {
        // 反馈给码隆
        this.feedbackToMaLong(file)

        // 移除发布成功的文件
        this.uploader.removeFile(file)

        // 继续发布剩下的图片
        setTimeout(() => {
          this.put()
        }, 100)
      } else {
        // 发布状态置为-1
        file.putStaus = -1

        const rqBody = {
          type: this.$utilHelper.debugTypes.UPLOAD_API_ERROR,
          client: this.$utilHelper.getBrowser(),
          content: JSON.stringify({
            user_id: this.loginUser.id,
            user_agent: navigator.userAgent,
            description: '发布图片时发生错误',
            data: {
              params: data,
              response: res.data
            },
            time: (new Date()).getTime()
          })
        }

        // 发送错误信息
        this.$axios.paixinService.debug(rqBody)

        // 继续发布剩下的图片
        this.put()
      }
    },
    copyTags() {
      if (this.tagList.length < 1) {
        return
      }

      let tags = ''

      this.tagList.forEach(e => {
        tags += e.label + ','
      })

      tags = tags.substring(0, tags.length - 1)
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', tags)
      input.select()
      if (document.execCommand('copy')) {
        this.$toast.notice('复制成功，请选择其他图片后在关键词输入框中粘贴')
      } else {
        this.$toast.warn('复制失败，请尝试升级您的浏览器')
      }
      document.body.removeChild(input, false, null)
    },
    async feedbackToMaLong(file) {
      const addTags = []
      const removeTags = []

      file.tagList.forEach(e => {
        if (!e.hasOwnProperty('puid')) {
          addTags.push({
            category: e.label
          })
        }
      })

      file.recommendTagList.forEach(e => {
        if (!e.isSelected) {
          removeTags.push({
            category: e.label,
            puid: e.puid
          })
        }
      })

      const rqBody = {
        url: file.thumbnailUrl,
        add_tags: addTags,
        remove_tags: removeTags
      }

      const url = '//es0.paixin.com/ai/feedback'

      await axiosPost(url, rqBody, {})
    }
  }
}
</script>

<style lang='scss' scoped src="./upload.scss" />
