<template>
  <div class='album_wrap'>
    <div class="clear"></div>
    <div class="album_list">
      <div class="album_item" v-for='(item, i) in albumList' :key="i">
        <div v-if="loginUser.id == item.user_data.id"
          @click="showDeleteAlbum(item.id, i)"
          class="delete-album">
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div @click='toAlbumDetail(item.id)'
          class="pic_wrap"
          :style="{
            'backgroundImage': 'url(' + $utilHelper.getCompressionUrl(item.image) + ')'
          }">
        </div>

        <div class="desc_wrap">
          <div @click='toAlbumDetail(item.id)' class="name">{{item.name}}</div>
          <div class="belong">作者 {{item.user_data.nick || item.user_data.name}}</div>
        </div>
      
      </div>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'album-list',
  props: [
    'albumList'
  ],
  methods: {
    toAlbumDetail(id) {
      this.$router.push({name: 'album', params: {album_id: id}})
    },
    showDeleteAlbum(id, index) {
      if (!this.isLogin) {
        this.$store.commit('isShowLoginDialog', true)

        return
      }

      this.$store.commit('confirmationDialogData', {
        isShowConfirmationDialog: true,
        confirmationDialogTitle: '是否删除此灵感集？',
        confirmFunction: this.deleteAlbum,
        confirmFunctionParams: { album_id: id, index: index }
      })
    },
    async deleteAlbum(data) {
      let res = await this.$apiFactory
        .getAlbumApi()
        .deleteAlbum({ album_id: data.album_id })

      if (res.data.out == '1') {
        this.$store.commit('confirmationDialogData', {
          isShowConfirmationDialog: false,
          confirmationDialogTitle: '是否确定删除？',
          confirmFunction: null,
          confirmFunctionParams: null
        })

        this.$toast.notice('删除成功')

        this.albumList.splice(data.index, 1)
      } else {
        this.$toast.warn(res.data.msg)
      }
    }
  },
  computed: {
    ...mapGetters([
      'isLogin',
      'loginUser'
    ])
  }
}
</script>

<style lang='scss' scoped>

.album_list {
  width: 1100px;
  margin: 80px auto;
  margin-top: 20px;
  .album_item {
    width: 33.33%;
    float: left;
    height: 310px;
    margin-bottom: 20px;
    border-radius: 10px;
    padding-top: 10px;
    transition: all .2s;
    position: relative;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
      
      .delete-album {
        opacity: 1;
        transition: opacity .2s;
      }
    }

    .delete-album {
      box-sizing: border-box;
      width: 24px;
      height: 24px;
      position: absolute;
      right: 20px;
      top: 30px;
      z-index: 10;
      cursor: pointer;
      opacity: 0;
      transition: opacity .2s;

      :nth-child(1) {
        width: 1px;
        height: 1px;
        top: 4px;
        left: 8px;
        position: absolute;
        background: transparent;
        box-shadow: 0 0 20px 4px rgba(0, 0, 0, .8);
      }

      :nth-child(2) {
        width: 20px;
        height: 4px;
        border-radius: 5px;
        background: #fff;
        transform: rotate(45deg) translateY(3px);
      }

      :nth-child(3) {
        width: 20px;
        height: 4px;
        border-radius: 5px;
        background: #fff;
        transform: rotate(-45deg) translateY(-3px);
      }
    }

    .pic_wrap {
      width: 94%;
      height: 230px;
      border-radius: 10px;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: rgba(0, 0, 0, 0.05);
      margin: 0 auto;
      cursor: pointer;
    }
    .desc_wrap {
      text-align: center;
      margin-top: 14px;
      font-size: 1.1rem;
      .name {
        cursor: pointer;
        font-weight: 800;
      }
      .belong {
        font-size: .9rem;
        margin-top: 4px;
      }
    }
  }
}

</style>