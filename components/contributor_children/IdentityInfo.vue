<template>
  <div class="form">
    <!-- 个人或企业选项卡 -->
    <div class="category-options">
      <div class="slide" :style="slideStyle"></div>
      <div
        class="category-option"
        v-for="(option, index) in categoryOptions"
        :key="index"
        @click="slide(index)">
        {{ option }}
      </div>
    </div>

    <input
      v-model="form.company"
      v-if="whichOption == 1"
      :class="{ 'border-red': commitCheak && form.company === '' }"
      placeholder="公司名字"/>

    <input
      v-model="form.name"
      :class="{ 'border-red': commitCheak && form.name === '' }"
      :placeholder="whichOption == 0 ? '真实姓名' : '联系人名字'"/>

    <div
      v-if="loginUser.phone != ''"
      class="have-phone">
      {{ loginUser.phone }}
    </div>

    <div
      v-if="loginUser.phone == ''"
      class="input-area"
      :class="{
        'border-red': commitCheak && form.phone == '',
        'border-normal': !(commitCheak && form.phone == '')
      }">

      <span class="add86">+86</span>
      
      <input
        v-model="form.phone"
        class="phone"
        placeholder="联系方式"/>
  
      <span class="code" @click="getCode">{{ timeLeft }}</span>
    </div>

    <input
      v-if="loginUser.phone == ''"
      v-model="form.smcode"
      :class="{ 'border-red': commitCheak && form.smcode === '' }"
      placeholder="验证码"/>

    <input
      v-model="form.address"
      :class="{ 'border-red': commitCheak && form.address === '' }"
      placeholder="常住城市"/>

    <input
      v-model="form.cardId"
      :class="{ 'border-red': commitCheak && form.cardId === '' }"
      :placeholder="whichOption == 0 ? '身份证号码' : '统一社会信用代码'"/>

    <div class="upload-card">
      <div id="positive-container" class="h153">
        <div id="positive" class="card-pick" v-if="positivePre === ''">
          <div class="top-row">
            <div class="top-left"></div>
            <div class="top-right"></div>
          </div>
          <div class="center-row">
            <span>{{ whichOption == 0 ? '身份证正面' : '营业执照照片' }}</span> 
          </div>
          <div class="bottom-row">
            <div class="bottom-left"></div>
            <div class="bottom-right"></div>
          </div>
        </div>

        <div class="card-pre" v-if="positivePre !== ''">
          <img :src="positivePre" class="card-image" alt="">
          <div class="card-cover" :style="coverStyle1"></div>
        </div>
      </div> 
      
      <div id="negative-container"  class="h153" v-if="whichOption == 0">
        <div id="negative" class="card-pick" v-if="negativePre === ''">
          <div class="top-row">
            <div class="top-left"></div>
            <div class="top-right"></div>
          </div>
          <div class="center-row">
            <span>身份证背面</span>
          </div>
          <div class="bottom-row">
            <div class="bottom-left"></div>
            <div class="bottom-right"></div>
          </div>
        </div>

        <div class="card-pre" v-if="negativePre !== ''">
          <img :src="negativePre" class="card-image" alt="">
          <div class="card-cover" :style="coverStyle1"></div>
        </div>
      </div>
    </div>

    <button @click="commit">下一步</button>
  </div>
</template>

<script>
/* global QiniuJsSDK */
import { mapGetters } from 'vuex'
import getUptoken from '~/api/uptokenService';
import uploadUtil from '~/utils/uploadUtil'

export default {
  data() {
    return {
      categoryOptions: ['个人', '企业'],
      whichOption: 0, // 0为个人，1为企业
      slideStyle: { transform: 'translateX(0px)' },
      time: 0,
      isTimer: false,
      form: {
        company: '',
        name: '',
        phone: '',
        smcode: '',
        address: '',
        cardId: ''
      },
      width: 100,
      commitCheak: false,
      positiveUrl: '',
      negativeUrl: '',
      positivePre: '',
      negativePre: '',
      uploader1: {},
      uploader2: {},
      uploadData1: {},
      uploadData2: {},
      uploadProgress1: 0,
      uploadProgress2: 0,
      isUploading1: 0,
      isUploading2: 0,
      isInitQiniu: false
    };
  },
  props: [
    'progressIndex'
  ],
  methods: {
    /**
    * 顶部选项卡选中时的动画控制
    * @param index 这个参数是指当前选中的选项卡的索引
    */
    slide(index) {
      this.whichOption = index;
      // 每个选项卡的宽度为228px，滑块宽度为226， 所以需要滑动230
      this.slideStyle = {
        transform: 'translateX(' + index * 230 + 'px)'
      }

      // 清空表单
      for (let p in this.form) {
        this.form[p] = ''
      }
    },
    timer: function () {
      if (this.time > 0) {
        this.time--;
        setTimeout(this.timer, 1000);
      } else {
        this.isTimer = false;
      }
    },
    async getCode() {
      if (this.isTimer) {
        return;
      }

      if (!(/^[0-9]{11}$/.test(this.form.phone))) {
        this.$toast.warn('请输入正确的手机号码');
        return;
      }

      // 获取服务器时间
      let timeRes = await this.$apiFactory.getCommonApi().getServerTime()

      let time = null

      if (timeRes.data.out == '1') {
        time = timeRes.data.data.time;
      } else {
        time = (new Date().getTime() / 1000).toFixed(0)
      }

      let params = {
        phone: 'test:' + this.$utilHelper.rsa_encrypt('0086' + this.form.phone + '@' + time),
        scene: 'verify'
      };
      this.$apiFactory.getCommonApi().smcode(params)
        .then(res => {
          if (res.data.out === '1') {
            this.isTimer = true;
          } else {
            this.$toast.warn(res.data.msg)
          }
        });
      this.time = 60;
      this.timer();
    },
    async commit() {
      this.commitCheak = true;

      let cheakArray = [];

      if (this.loginUser.phone != '') {
        cheakArray.push(...['name', 'address', 'cardId'])
      } else {
        cheakArray.push(...['name', 'address', 'cardId', 'phone', 'mscode'])
      }

      if (this.whichOption == 1) {
        cheakArray.push('company')
      }

      let len = cheakArray.length;
      for (let i = 0; i < len; i++) {
        if (this.form[cheakArray[i]] === '') {
          this.$toast.warn('您的个人信息未填写完整');
          return;
        }
      }

      if (this.isUploading1 || this.isUploading2) {
        this.$toast.warn('图片正在上传中，请稍等');
        return;
      }

      if (this.whichOption == '0') {
        if (this.positiveUrl === '' || this.negativeUrl === '') {
          this.$toast.warn('您还没有上传身份证');
          return;
        }
      } else {
        if (this.positiveUrl === '') {
          this.$toast.warn('您还没有上传营业执照');
          return;
        }
      }

      if (this.loginUser.phone == '') {
        this.bindPhone();
      } else if (this.loginUser.gaga_id == '') {
        this.intoOther();
      } else {
        this.updateForm();
      }
    },
    async bindPhone() {
      // 获取服务器时间
      let timeRes = await this.$apiFactory.getCommonApi().getServerTime()

      let time = null

      if (timeRes.data.out == '1') {
        time = timeRes.data.data.time;
      } else {
        time = (new Date().getTime() / 1000).toFixed(0)
      }

      let rqBody = {
        phone: '0086' + this.form.phone,
        smcode: 'test:' + this.$utilHelper.rsa_encrypt(this.form.smcode + '@' + time)
      }
      let res = await this.$apiFactory.getUserApi().bindPhone(rqBody);
      if (res.data.out == '1') {
        this.loginUser.phone = this.form.phone;
        this.$store.commit('loginUser', this.loginUser);
        this.intoOther();
      } else {
        this.$toast.warn(res.data.msg);
      }
    },
    async intoOther() {
      let res1 = await this.$apiFactory.getUserApi().intoOther();
      if (res1.data.out == '1') {
        this.loginUser.gaga_id = res1.data.data.gaga_id;
        this.$store.commit('loginUser', this.loginUser);
        this.updateForm();
      }
    },
    updateForm() {
      let data = {};
      if (this.whichOption == '0') {
        data = {
          card_id: this.form.cardId,
          card_name: this.form.name,
          card_image_front: this.positiveUrl,
          card_image_back: this.negativeUrl,
          company_uscc: '',
          company: '',
          company_contact: '',
          company_bl_image: '',
          address: this.form.address
        }
      } else {
        data = {
          card_id: '',
          card_name: '',
          card_image_front: '',
          card_image_back: '',
          company_uscc: this.form.cardId,
          company: this.form.company,
          company_contact: this.form.name,
          company_bl_image: this.positiveUrl,
          address: this.form.address
        }
      }
      this.$emit('updateProgress', {
        nextIndex: 2,
        form: data
      });
    },
    initQiNiu() {
      let qiniu1 = new QiniuJsSDK();
      this.uploader1 = qiniu1.uploader({
        runtimes: 'html5,flash,html4',
        multi_selection: false,
        browse_button: 'positive',
        uptoken_func: file => {
          let extension = file.type.split('/')[1] || 'jpeg'
          let data = uploadUtil.getUploadData('private', 'cards/', extension)
          getUptoken(data, request => {
            if (request.status === 200) {
              let res = JSON.parse(request.responseText);
              if (res.out === '1') {
                this.uploadData = res.data;
              } else {
                this.$toast.warn(res.msg);
                this.uploadData = {};
              }
            } else {
              this.$toast.warn('上传失败，请刷新页面后重试');
              return {};
            }
          })
          return this.uploadData.uptoken;
        },
        get_new_uptoken: true,
        domain: 'private.gaga.com',
        container: 'positive-container',
        flash_swf_url: 'path/of/plupload/Moxie.swf',
        max_retries: 3,
        auto_start: true,
        unique_names: false,
        save_key: false,
        max_file_size: '30mb',
        filters: {
          prevent_duplicates: true,
          mime_types: [{
            title: 'Image files',
            extensions: 'jpg,jpeg,gif,png'
          }],
          max_file_size: '30mb'
        },
        init: {
          'FilesAdded': (up, files) => {
            let fileItem = files[0].getNative();
            let url = window.URL || window.webkitURL || window.mozURL;
            this.positivePre = url.createObjectURL(fileItem);
          },
          // 上传过程中
          'UploadProgress': (up, file, info) => {
            this.isUploading1 = true;
            this.uploadProgress1 = file.percent;
          },
          // 上传完成以后
          'FileUploaded': (up, file, info) => {
            this.isUploading1 = false;
            let infoJson = JSON.parse(info);
            this.positiveUrl = 'http://private.gaga.me/' + infoJson.key;
          },
          'Error': (up, err, errTip) => {
            this.$toast('上传身份证正面失败，请重试');
          },
          'UploadComplete': (up, file, info) => {
          },
          'Key': (up, file) => {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在unique_names: false，save_key: false时才生效
            return this.uploadData.key
          }
        }
      });

      let qiniu2 = new QiniuJsSDK();
      this.uploader2 = qiniu2.uploader({
        runtimes: 'html5,flash,html4',
        multi_selection: false,
        browse_button: 'negative',
        uptoken_func: file => {
          let extension = file.type.split('/')[1] || 'jpeg'
          let data = uploadUtil.getUploadData('private', 'cards/', extension)

          getUptoken(data, request => {
            if (request.status === 200) {
              let res = JSON.parse(request.responseText);
              if (res.out === '1') {
                this.uploadData = res.data;
              } else {
                this.$toast.warn(res.msg);
                this.uploadData = {};
              }
            } else {
              this.$toast.warn('上传失败，请刷新页面后重试');
              return {};
            }
          })
          return this.uploadData.uptoken;
        },
        get_new_uptoken: true,
        domain: 'private.gaga.com',
        container: 'negative-container',
        flash_swf_url: 'path/of/plupload/Moxie.swf',
        max_retries: 3,
        auto_start: true,
        unique_names: false,
        save_key: false,
        max_file_size: '30mb',
        filters: {
          prevent_duplicates: true,
          mime_types: [{
            title: 'Image files',
            extensions: 'jpg,jpeg,gif,png'
          }],
          max_file_size: '30mb'
        },
        init: {
          'FilesAdded': (up, files) => {
            let fileItem = files[0].getNative();
            let url = window.URL || window.webkitURL || window.mozURL;
            this.negativePre = url.createObjectURL(fileItem);
          },
          // 上传过程中
          'UploadProgress': (up, file, info) => {
            this.isUploading2 = true;
            this.uploadProgress2 = file.percent;
          },
          // 上传完成以后
          'FileUploaded': (up, file, info) => {
            this.isUploading2 = false;
            let infoJson = JSON.parse(info);
            this.negativeUrl = 'http://private.gaga.me/' + infoJson.key;
          },
          'Error': (up, err, errTip) => {
            this.$toast('上传身份证背面失败，请重试');
          },
          'UploadComplete': (up, file, info) => {
          },
          'Key': (up, file) => {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在unique_names: false，save_key: false时才生效
            return this.uploadData.key
          }
        }
      });
    }
  },
  computed: {
    ...mapGetters([
      'loginUser'
    ]),
    timeLeft() {
      return this.time > 0 ? this.time + 's后重新获取' : '发送验证码';
    },
    coverStyle1() {
      let w = 182 * (100 - this.uploadProgress1) / 100;
      return {width: w + 'px'};
    },
    coverStyle2() {
      let w = 182 * (100 - this.uploadProgress2) / 100;
      return {width: w + 'px'};
    }
  },
  watch: {
    'progressIndex': function (val) {
      if (val == 1 && !this.isInitQiniu) {
        this.$nextTick(() => {
          this.initQiNiu()

          this.isInitQiniu = true
        })
      }
    }
  }
};
</script>

<style scoped>
.form {
  box-sizing: border-box;
  width: 500px;
  margin-top: 60px;
  padding: 30px 25px;
  border-radius: 8px;
  background-color: #ffffff;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  align-items: center;
  margin-left: calc(50% - 250px);
  margin-left: -moz-calc(50% - 250px);
  margin-left: -webkit-calc(50% - 250px);
}

.category-options {
  box-sizing: border-box;
  width: 460px;
  height: 38px;
  padding: 0 2px;
  border-radius: 4px;
  background-color: #f6f6f6;
  display: flex;
  margin-bottom: 24px;
  display: -webkit-flex;
  flex-direction: row;
}

.slide {
  width: 226px;
  height: 34px;
  border-radius: 4px;
  background-color: #fff;
  position: absolute;
  transition: transform .3s;
  margin-top: 2px;
}

.category-option {
  flex: 1;
  line-height: 38px;
  cursor: pointer;
  z-index: 10;
  text-align: center;
}

.border-red {
  border: 1px solid red;
}

.border-normal {
  border: 1px solid #e4e4e4;
}

input {
  box-sizing: border-box;
  width: 460px;
  height: 48px;
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px #e4e4e4;
  outline: none;
  font-size: 16px;
  padding: 0 18px;
  margin-bottom: 24px;
  transition: border .5s;
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

.have-phone {
  box-sizing: border-box;
  width: 460px;
  height: 48px;
  border: 1px solid #e4e4e4;
  border-radius: 6px;
  margin-bottom: 24px;
  cursor: not-allowed;
  line-height: 48px;
  padding-left: 16px; 
  color: rgba(0, 0, 0, 0.5);
}

.input-area {
  box-sizing: border-box;
  width: 460px;
  height: 48px;
  align-items: center;
  border-radius: 6px;
  background-color: #fff;
  margin-bottom: 24px;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  transition: border .5s;
}

.input-area:hover {
  border: solid 1px #555;
  transition: border .5s;
}

.add86 {
  -webkit-flex: initial;
  flex: initial;
  width: 30px;
  margin-left: 18px;
}

.phone {
  -webkit-flex: 1;
  flex: 1;
  box-sizing: border-box;
  height: 42px;
  border: none;
  outline: none;
  border-radius: 8px;
  border: none;
  background-color: #ffffff;
  font-size: 16px;
  padding: 0 18px;
  margin-bottom: 0px;
}

.phone:hover {
  border: none;
}

.code {
  -webkit-flex: initial;
  flex: initial;
  min-width: 70px;
  height: 34px;
  padding: 0px 6px;
  text-align: center;
  line-height: 34px;
  font-size: 12px;
  margin-right: 6px;
  cursor: pointer;
  border-radius: 4px;
  background-color: #f2f2f2;
  border: solid 1px #dadada;
  color: rgba(0, 0, 0, .5)
}

.upload-card {
  width: 460px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}

.card-pick {
  box-sizing: border-box;
  width: 220px;
  height: 153px;
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px #e9e9e9;
   padding: 12px 18px; 
  cursor: pointer;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-pre {
  box-sizing: border-box;
  width: 220px;
  height: 153px;
  border-radius: 8px;
  border: solid 1px #e9e9e9;
  padding: 12px 18px; 
  cursor: pointer;
}

.card-cover {
  height: 127px;
  background: rgba(0, 0, 0, 0.6);
  position: relative;
  top: -129px;
  float: right;
}

.card-image {
  width: 100%;
  height: 100%;
}

.top-row {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}

.top-left {
  width: 30px;
  height: 20px;
  border-top-left-radius: 8px;
  border-top: 1px solid #e9e9e9;
  border-left: 1px solid #e9e9e9;
}

.top-right {
  width: 30px;
  height: 20px;
  border-top-right-radius: 8px;
  border-top: 1px solid #e9e9e9;
  border-right: 1px solid #e9e9e9;
}

.bottom-row {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}

.bottom-left {
  width: 30px;
  height: 20px;
  border-bottom-left-radius: 8px;
  border-bottom: 1px solid #e9e9e9;
  border-left: 1px solid #e9e9e9;
}

.center-row {
  color: rgba(0, 0, 0, 0.5);
  font-size: 16px;
  display: flex;
  justify-content: center;
}

.bottom-right {
  width: 30px;
  height: 20px;
  border-bottom-right-radius: 8px;
  border-bottom: 1px solid #e9e9e9;
  border-right: 1px solid #e9e9e9;
}

.h153 {
  height: 153px;
}

button {
  width: 100%;
  height: 45px;
  outline: none;
  border: none;
  margin-top: 30px;
  border-radius: 6px;
  background-color: #56cb8f;
  font-size: 18px;
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
}
</style>
