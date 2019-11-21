<template>
  <div class="list" :style="{'min-height': minHeight() + 'px'}">
    <div v-for="(item, index) in detailList" :key="index" class="one">
      <a
        :href="`https://v.paixin.com/photoplus/${item.media_id || item.id}`"
        target="_blank"
        @click.stop
      >
        <div
          @click="toDetail(item.media_id || item.id)"
          :style="{
          'backgroundImage': 'url(' + $utilHelper.getCompressionUrl(item.image, 400, 400) + ')'
        }"
          class="image"
        ></div>
      </a>
      <div class="info">
        <div class="id">{{item.title}}</div>
        <div class="size">
          <span class="size_detail">
            ID: {{item.id}} &nbsp;&nbsp;
            {{ item.image_width || item.media_width }} x {{item.image_height || item.media_height}}px
          </span>
          <span
            class="time"
            :style="{right: item.amount ? '50%;' : '4%;'}"
          >{{ time(item.dateline || item.create_time) }}</span>
          <span class="money" v-if="item.amount">{{ item.amount / 100 || 0 }} 元</span>
        </div>
        <div v-if="false && item.amount" class="auth">{{ '查看授权书' }}</div>
      </div>
    </div>
    <div class="end" v-if="end==`end`&&detailList.length > 0">- 7MX -</div>
  </div>
</template>

<script>
export default {
  name: 'income-list',
  props: ['detailList', 'end'],
  methods: {
    time(time) {
      return this.$utilHelper.getOldTime(time)
    },
    toDetail(id) {
      // window.open(`https://v.paixin.com/photoplus/${id}`, '_blank')
    },
    minHeight() {
      // return window.innerHeight - 60
    }
  }
}
</script>

<style lang='scss' scoped>
.one {
  height: 170px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  .image {
    width: 120px;
    height: 120px;
    background-size: cover;
    margin-left: 20px;
    margin-top: 26px;
    float: left;
    cursor: pointer;
  }
  .info {
    float: left;
    width: calc(100% - 160px);
    margin-top: 26px;
    margin-left: 20px;
    .id {
      font-size: 20px;
      font-weight: 800;
    }
    .size {
      color: rgba(0, 0, 0, 0.4);
      font-size: 0.9rem;
      margin-top: 10px;
      position: relative;
      .time {
        position: absolute;
        margin-left: 20px;
      }
      .money {
        position: absolute;
        right: 4%;
        color: #000;
        font-size: 1.1rem;
        font-weight: 800;
      }
    }
    .auth {
      padding: 5px 12px;
      background: rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      float: left;
      color: rgba(0, 0, 0, 0.7);
      margin-top: 20px;
      &:hover {
        cursor: pointer;
        background: rgba(0, 0, 0, 0.08);
      }
    }
  }
}
.end {
  background: rgba(0, 0, 0, 0.06);
  line-height: 1.3rem;
  border-radius: 100px;
  width: 100px;
  text-align: center;
  padding: 4px 10px;
  margin: 40px auto;
  color: rgba(0, 0, 0, 0.4);
}
</style>