<template>
  <footer>
    <div class="list-container">
      <div class="language">
        <div
          :style="{
            background: 'url(' + require('./img/earth.svg') + ') no-repeat',
            width: '20px',
            height: '20px'
          }"
          class="earth"
        />

        <span>简体中文</span>

        <div
          :style="{
            background: 'url(' + require('./img/array.svg') + ') no-repeat',
            width: '20px',
            height: '10px'
          }"
        />
      </div>

      <div class="footer-community">
        <dl>
          <dt>社区</dt>
          <dd>
            <a href="/about">About 7MX</a>
          </dd>
          <dd>
            <a>7MX工作</a>
          </dd>
          <dd>
            <a href="//q.url.cn/CDzAE8?_type=wpa&qidian=true" target="_blank">意见反馈</a>
          </dd>
          <dd>
            <a>品牌合作</a>
          </dd>
          <dd>
            <a href="/static/pdf/xy.pdf">用户协议</a>
          </dd>
          <dd>
            <span @click="toHelpCenter()">帮助中心</span>
          </dd>
        </dl>
      </div>

      <div class="footer-business">
        <dl>
          <dt>商业</dt>
          <dd>
            <a href="/contributor" target="_blank">签约创作者</a>
          </dd>
          <dd>
            <a>提现收益</a>
          </dd>
          <dd>
            <span @click="toHelpCenter('create')">创作分成</span>
          </dd>
          <dd>
            <span @click="toHelpCenter('order')">定制商业拍摄</span>
          </dd>
          <dd>
            <a>如何发起活动</a>
          </dd>
        </dl>
      </div>

      <div class="footer-contact">
        <dl>
          <dt>联系我们</dt>
          <dd>
            <a>0510-68069587</a>
          </dd>
          <dd>
            <a>support@7mx.com</a>
          </dd>
          <dd>
            <a>邮件24小时内回复</a>
          </dd>
          <dd>
            <a>无锡市滨湖区金融一街11栋</a>
          </dd>
        </dl>
      </div>

      <div class="footer-ideas">
        <dl>
          <dt>一些想法</dt>
          <dd>
            <a>7MX理念</a>
          </dd>
          <dd>
            <a>7MX创意基金</a>
          </dd>
        </dl>
      </div>
    </div>

    <div class="share">
      <img src="./img/fb.svg" width="32px" alt>
      <img src="./img/tw.svg" width="32px" alt>
      <img src="./img/wb.svg" width="32px" alt>
    </div>

    <div class="mx-right">
      © 2017 All Rights Reserved 江苏拍信文化创意有限公司
      <a
        href="http://www.beian.miit.gov.cn"
        target="_blank"
      >苏ICP备14057276号-4</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'IndexFooter',
  components: {

  },
  data: () => ({

  }),
  methods: {
    toHelpCenter(to) {
      if (!to) {
        this.$store.commit('help/help_show')
      } else if (to === 'create') {
        this.$store.commit('help/help_show', { current: { index: 4, subIndex: 0 }})
      } else if (to === 'order') {
        this.$store.commit('help/help_show', { current: { index: 2, subIndex: 0 }})
      }
    }
  }
}
</script>

<style scoped>
footer {
  width: 100%;
  background: #1a1a1a;
  position: absolute;
  bottom: 0px;
  padding-top: 80px;
}

.list-container {
  width: 64%;
  margin-left: 18%;
  margin-bottom: 60px;
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.5);
  position: relative;
}

dt {
  font-size: 1.4em;
  font-weight: 200;
  color: #fff;
  margin-bottom: 24px;
}

dd {
  padding-left: 0 !important;
  font-size: 0.9em;
  margin-left: 0 !important;
  margin-top: 8px;
  transition: color 0.2s;
  /* -webkit-margin-start: 0 !important; */
}

dd a,
dd span {
  color: rgba(255, 255, 255, 0.5);
}

dd a:hover,
dd span:hover {
  color: #fff;
  transition: color 0.2s;
  cursor: pointer;
}

.language {
  position: absolute;
  width: 124px;
  right: -150px;
  top: -60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.language:hover {
  opacity: 1;
  transition: opacity 0.2s;
}

.language div {
  background-size: cover !important;
  background-position: center !important;
}

.language span {
  color: #fff;
  font-size: 0.9em;
}

.share {
  text-align: center;
}

.share img {
  margin-right: 20px;
  cursor: pointer;
}

.mx-right {
  font-size: 0.6rem;
  text-align: center;
  margin: 20px 0;
  color: rgba(255, 255, 255, 0.3);
  width: 100%;
}

.mx-right a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.3);
}
</style>

