<template>
  <div class="about-container absolute">
    <div class="about_content1">
      <div id="about_img1_cover">
        <img :src="img1" width="600px" alt>
      </div>

      <div id="about_content1_text">
        <h1 class="about_content1_title">此刻，在7MX激起你的创作</h1>
        <div class="about_content1_paragraph">
          江苏拍信文化创意有限公司旗下平台-7MX是中国知名的视觉摄影社区，2017年7MX与Eput完成合并，
          <br>超过100万创作者入驻，在这里可以将你的创意作品分享给更多
          <br>人，当然也可以将你的作品变成收益，期待与你共建7MX社区
          <br>7MX is one of the biggest community of photography in
          <br>China, in 2017, 7MX and Eput are merged, more than 1
          <br>million artists, here you can share your creative work with
          <br>more people, of course, you can turn your work into income
        </div>
        <button class="about_content1_btn" @click="toUpload">立刻创作</button>
      </div>
    </div>

    <div class="about_content2">
      <div id="about_content2_text">
        <h1 class="about_content2_title">或许是中国最酷的视觉社区</h1>
        <div class="about_content2_paragraph">
          我们为每一位创作者提供了优秀的内容管理系统，让创作者随时
          随地创作和管理自己优秀的作品，7MX越来越受到大家的喜爱
          <br>We provide every creator with a great content management system that lets creators feel free to come and go, 7MX is more and more loved by everyone because of creating
        </div>and managing excellent works anywhere
      </div>
      <img id="about_content2_img" :src="img2" width="700">
    </div>

    <div class="about_content3">
      <div id="about_content3_text">
        <h1 class="about_content3_title">7MX，让你的创作变现</h1>
        <div class="about_content3_paragraph">
          我们坚信好的作品会说话，成为7MX签约创作者，可以将你的作品
          售卖给全球200个国家， 我们更会保护好你的作品版权，快开始吧
          <br>We firmly believe that good works will speak to become 7MX contracted creators, you can work, sold to 200 countries around the world, we will protect the copyright of your work,
        </div>
        <div class="about_content3_paragraph_last">let's get started</div>
        <button class="about_content3_btn" @click="toContributor">立刻签约</button>
      </div>
    </div>

    <index-footer />
  </div>
</template>

<script>
import IndexFooter from '~/components/footer/IndexFooter'

export default {
  components: {
    IndexFooter
  },
  data() {
    return {
      img1: require('./img/about-1.jpg'),
      img2: require('./img/about-2.svg')
    }
  },
  head() {
    return {
      title: '关于 - 7MX 中国领先的视觉创作社区'
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.login.isLogin
    },
    loginUser() {
      return this.$store.state.login.loginUser
    },
    winPageYOffset() {
      return this.$store.state.window.winPageYOffset
    },
    cardStatus: function() {
      try {
        return this.loginUser.user_data.card_status
      } catch (e) {
        return '0'
      }
    },
    companyStatus: function() {
      try {
        return this.loginUser.user_data.company_status
      } catch (e) {
        return '0'
      }
    },
    status: function() {
      if (this.cardStatus == '0') {
        if (this.companyStatus == '0') {
          return '0'
        } else {
          return this.companyStatus
        }
      } else {
        return this.cardStatus
      }
    }
  },
  watch: {
    'winPageYOffset': function(val) {
      // 当页面的滚动条滚动时,会执行这里的代码
      this.setStyle(300, val)

      if (val >= 800) {
        document.getElementById('about_content2_text').style.transform = 'translate3d(40px, 0, 0)'
        document.getElementById('about_content2_text').style.opacity = '1'
        document.getElementById('about_content2_img').style.transform = 'translate3d(-40px, 0, 0)'
        document.getElementById('about_content2_img').style.opacity = '1'
      }

      if (val >= 1800) {
        document.getElementById('about_content3_text').style.opacity = '1'
      }
    }
  },
  mounted() {
    const img = new Image()
    img.onload = function() {
      document.getElementById('about_img1_cover').style.transform = 'translate3d(40px, 0, 0)'
      document.getElementById('about_img1_cover').style.opacity = '1'
      document.getElementById('about_content1_text').style.transform = 'translate3d(-40px, 0, 0)'
      document.getElementById('about_content1_text').style.opacity = '1'
    }

    img.src = '/static/imgs/about-1.jpg'
  },
  methods: {
    async toContributor() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      if (this.status === '3') {
        this.$toast.notice('您已经签约，无需再次签约')
        return
      }

      this.$router.push({ name: 'contributor' })
    },
    toUpload() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      this.$store.commit('upload/isShowUploadDialog', true)
    },
    setStyle(height, pageYOffset) {
      const taopBar = document.getElementById('topbar')

      if (pageYOffset < 150) {
        taopBar.style.position = 'absolute'

        taopBar.style.background = 'transparent'

        taopBar.style.opacity = '1'
      } else if (pageYOffset > 150 && pageYOffset < height) {
        taopBar.style.position = 'absolute'

        taopBar.style.opacity = '0'
      } else {
        taopBar.style.position = 'fixed'

        let transparent = (pageYOffset - height) / 200

        if (transparent > 1) {
          transparent = 1
        }

        taopBar.style.opacity = transparent

        taopBar.style.background = 'rgba(26, 26, 26, ' + transparent + ')'
      }
    }
  }
}
</script>

<style scoped>
.absolute {
  position: absolute;
}
.about-container {
  top: 0;
  width: 100%;
}

.about_content1 {
  width: 100%;
  height: 1000px;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
}
#about_img1_cover {
  position: relative;
  margin-left: -100px;
  opacity: 0;
  transition: all 2s;
}
#about_img1_cover:after {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-shadow: 0 0 50px 50px #0a0a0a inset;
}
#about_img1_cover img {
  display: block;
}
#about_content1_text {
  margin-left: 120px;
  color: #fff;
  opacity: 0;
  transition: all 2s;
}
.about_content1_title {
  font-size: 2.2em;
  font-weight: 400;
}
.about_content1_paragraph {
  /* max-width: 460px; */
  font-size: 16px;
  width: 480px;
  line-height: 1.56;
  text-align: justify;
  text-justify: distribute-all-lines; /*ie6-8*/
  text-align-last: justify; /* ie9*/
  -moz-text-align-last: justify; /*ff*/
  -webkit-text-align-last: justify; /*chrome 20+*/
}

.about_content1_paragraph div {
  text-align: left;
  text-justify: left; /*ie6-8*/
  text-align-last: left; /* ie9*/
  -moz-text-align-last: left; /*ff*/
  -webkit-text-align-last: left; /*chrome 20+*/
}

.about_content1_btn {
  display: block;
  margin-top: 35px;
  width: 160px;
  height: 42px;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  background-color: transparent;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.2s;
}

.about_content1_btn:hover {
  border-color: #fff;
  color: #fff;
  transition: all 0.2s;
}
/* content1 end */

/* content2 */
.about_content2 {
  width: 100%;
  height: 1000px;
  background-color: #57cb8f;
  display: flex;
  align-items: center;
  justify-content: center;
}

#about_content2_text {
  color: #fff;
  opacity: 0;
  transition: all 2s;
}
.about_content2_title {
  font-size: 2.2em;
  font-weight: 400;
}
.about_content2_paragraph {
  max-width: 464px;
  font-size: 16px;
  line-height: 1.56;
  text-align: justify;
  text-justify: distribute-all-lines; /*ie6-8*/
  text-align-last: justify; /* ie9*/
  -moz-text-align-last: justify; /*ff*/
  -webkit-text-align-last: justify; /*chrome 20+*/
}

#about_content2_img {
  margin-left: 100px;
  opacity: 0;
  transition: all 2s;
}
/* content2 end */

/* content3 */
.about_content3 {
  width: 100%;
  height: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 502px;
}
#about_content3_text {
  left: 50%;
  top: 50%;
  color: #000;
  text-align: center;
  opacity: 0;
  transition: all 3s;
}
.about_content3_title {
  font-size: 2.2em;
  font-weight: 400;
  text-align: center;
}
.about_content3_paragraph {
  max-width: 480px;
  font-size: 16px;
  line-height: 1.56;
  text-align: justify;
  text-justify: distribute-all-lines; /*ie6-8*/
  text-align-last: justify; /* ie9*/
  -moz-text-align-last: justify; /*ff*/
  -webkit-text-align-last: justify; /*chrome 20+*/
}
.about_content3_paragraph_last {
  text-align: center;
}
.about_content3_btn {
  margin-top: 40px;
  width: 160px;
  height: 42px;
  color: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  background-color: transparent;
  outline: transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 1em;
  transition: all 0.2s;
}

.about_content3_btn:hover {
  color: #000;
  border-color: #000;
  transition: all 0.2s;
}
/* content3 end */
</style>

