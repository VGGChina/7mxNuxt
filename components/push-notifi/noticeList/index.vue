<template>
  <div>
    <div v-for='item in list' class='noticeList list_item' :key="item.dateline">
      <!-- <div v-if='item.avatar' class="avatar" :style="{ 'backgroundImage' : `url(${item.avatar})` }"></div> -->
      <div v-if="item.type == 0 || item.type == 1" class="text">
        <div class="operation">
          <span class="action" :style="{'cursor': item.jump ? 'pointer' : ''}" @click="toPhoto(item.jump)">{{ item.title }}</span>
        </div>
      </div>

      <div v-if="item.type == 11 || item.type == 12" class="text">
        <div class="operation">
          <span class="title">
            {{ item.title }}
            <span v-if="item.type == 11 || item.type == 12" :style="{'background':item.type==11?'rgba(117, 181, 56, 0.68)':'rgba(255, 56, 14, 0.58)'}" class="innerTitle">
              {{ item.type == 11 ? '通过' : '未通过' }}
            </span>
          </span>
        </div>
        <div class="photo" @click='toPhoto(item.jump)' :style="{ 'backgroundImage' : `url(${item.image})` }"/>
      </div>

      <div v-if="item.type == 2" class="text">
        <div class="operation">
          <span class="title">
            {{ item.title }}
          </span>
        </div>
        <div class="photo" @click='toPhoto(item.jump)' :style="{ 'backgroundImage' : `url(${item.image})` }"/>
      </div>

      <div v-if="item.type == 21 || item.type == 22" class="text">
        <div class="operation">
          <span class="action" @click="toPhoto(item.jump)">您的摄影师审核{{ item.type==21?'通过':'未通过' }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeList',
  props: [
    'list'
  ],
  data: () => ({

  }),
  methods: {
    toPhoto(id) {
      if (!id) return
      if (id.indexOf('http') > -1) return window.open(id, '_blank')
      window.open(`/photo/${id.split(':')[1]}`, '_blank')
    }
  }
}
</script>

<style lang='scss' scoped>
* {
  color: #000;
}
.noticeList {
  display: flex;
  min-height: 62px;
  box-sizing: border-box;
  padding: 10px 0;
  margin: 12px 12px;
  border-radius: 10px;
  position: relative;
  align-items: center;
  transition: all 0.2s;
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  .avatar {
    width: 50px;
    height: 50px;
    margin-left: 4px;
    margin-right: 10px;
    border-radius: 100px;
    background-size: cover;
    cursor: pointer;
  }
  .text {
    font-size: 0.95rem;
    margin-left: 10px;
    .operation {
      // width: 230px;
      width: 320px;
      float: left;
      .name {
        max-width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        float: left;
      }
      .action {
        display: block;
        float: left;
        color: rgba(0, 0, 0, 1);
      }
      .innerTitle {
        color: #fff;
        padding: 1px 4px;
        font-size: .7rem;
        border-radius: 4px;
      }
    }
    .title {
      display: block;
      max-width: 192px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgba(0, 0, 0, 0.6);
    }
  }
  .photo {
    width: 50px;
    height: 50px;
    background-size: cover;
    position: absolute;
    right: 8px;
    top: 6px;
    background-color: rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }
}
</style>
