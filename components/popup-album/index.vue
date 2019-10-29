<template lang='pug'>
  transition( name='opacity' )
    .popup-album( v-show='show' @click.stop='hide' )
      transition( name='opacity_transform' )
        .content_wrap( v-if='show' @click.stop='' )
          .content
            .title {{ titleText[switchMode] }}
            //- 灵感集列表
            .list_wrap(v-if='switchMode==0')
              loading( :isLoading="isLoading" :loadingColor="'#000'" )
              .no_wrap( v-show='list.length==0&&isLoading==false' )
                no-content( :isNoContentShow='true' :content='"您尚未创建灵感集"' )
              .list_item( v-for='item in list' )
                .item {{ item.name }}
                .num {{ item.media_num }} 件作品
                .save.button( @click='addToAlbum(item.id, item.is_favor)' ) {{item.is_favor > 0 ? '已添加' : '添加'}}
            //- 创建灵感集的选项
            .create_wrap(v-if='switchMode==1')
              input.name(v-model='submitName' placeholder='灵感集名称')
            //- 创建 返回 确认按钮
            .button_wrap
              .button-green.submit_button( v-show='switchMode==0' @click='creatAlbum' ) 创建新灵感集
              .button-white.back_button( v-if='switchMode==1' @click='prevStep' ) 返回
              .button-green.confirm_button( v-if='switchMode==1' @click='confirm' ) 确认创建
</template>

<script>
import apiFactory from '~/api/factory/apiFactory.js'
import { mapGetters } from 'vuex'
import noContent from '~/components/no-content/NoContent_2'

export default {
  name: 'popup-album',
  data: () => ({
    show: false,
    switchMode: 0,
    titleText: ['添加到灵感集', '创建新灵感集'],
    buttonText: '',
    isLoading: true,
    list: [],
    submitName: '',
    media_id: ''
  }),
  methods: {
    ifShow() {
      this.$bus.on('popup-album', e => {
        this.show = e.show
        this.media_id = e.media_id
      })
    },
    hide() {
      this.show = false
    },
    creatAlbum() {
      this.switchMode = 1
    },
    prevStep() {
      this.switchMode = 0
    },
    // 添加作品到灵感集
    async addToAlbum(albumId, isFavor) {
      if (isFavor > 0) {
        return this.$toast.warn('已经添加过了')
      }

      let res = await apiFactory
        .getMediaApi()
        .addToAlbum({album_id: albumId, media_id: this.media_id})

      if (res.data.out > 0) {
        this.$toast.notice(res.data.msg)
        this.$bus.emit('popup-album', {show: false, media_id: ''})
      } else {
        this.$toast.warn(res.data.msg)
      }

      this.getAlbumList()
    },
    // 创建灵感集
    async confirm() {
      if (this.submitName == '') {
        this.$toast.warn('您尚未输入任何名称')
        return
      }
      let res = await apiFactory.getAlbumApi().createAlbum({ name: this.submitName })
      if (res.data.out > 0) {
        this.$toast.notice(res.data.msg)
        setTimeout(() => {
          this.switchMode = 0
          this.getAlbumList()
        }, 300)
        return
      }
      this.$toast.warn(res.data.msg)
    },
    // 获取灵感集列表
    async getAlbumList() {
      this.switchMode = 0
      let res = await apiFactory.getAlbumApi().albumList({media_id: this.media_id})
      if (res.data.out > 0) {
        this.list = res.data.data
      }
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    }
  },
  created() {
    this.ifShow()
  },
  mounted() {

  },
  watch: {
    show(n, o) {
      if (n) {
        this.getAlbumList()
      }
    }
  },
  computed: {
    ...mapGetters([
      'loginUser'
    ])
  },
  components: {
    noContent
  }
}
</script>

<style lang='scss' scoped>

.popup-album {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.2);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  .content_wrap {
    width: 550px;
    height: 660px;
    background: #fff;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    .content {
      padding-top: 30px;
      .no_wrap {
        padding-top: 100px;
      }
      .title {
        font-size: 1.8rem;
        line-height: 2;
        height: 90px;
        text-align: center;
      }
      .list_wrap {
        overflow-y: auto;
        height: 450px;
        box-sizing: border-box;
        padding: 0 30px 30px 30px;
        .list_item {
          height: 60px;
          width: 100%;
          line-height: 60px;
          margin-bottom: 10px;
          position: relative;
          &:hover {
            background: rgba(0,0,0,0.02);
            border-radius: 10px;
          }
          .item {
            padding: 0 20px;
            line-height: 34px;
          }
          .num {
            position: absolute;
            bottom: 8px;
            line-height: 20px;
            left: 20px;
            opacity: .6;
            font-size: .8rem;
            letter-spacing: 1px;
          }
          .save {
            position: absolute;
            right: 16px;
            top: 8px;
            cursor: pointer;
            display: block;
            color: rgba(0,0,0,0.7);
            border: 1px solid rgba(0,0,0,0.1);
            &:hover {
              background: rgba(0,0,0,0.05);
              color: rgba(0,0,0,0.9);
            }
          }
        }
      }
      .create_wrap {
        height: 100px;
        .name {
          height: 50px;
          line-height: 50px;
          width: 80%;
          font-size: 1.1rem;
          box-sizing: border-box;
          margin: 0 10%;
          margin-top: 20px;
        }
      }
      .button_wrap {
        padding: 26px 40px;
        box-sizing: border-box;
        width: 100%;
        position: absolute;
        bottom: 0;
        background: #fff;
        user-select: none;
        .submit_button {
          letter-spacing: 1px;
          margin: 0 auto;
          border: 1px solid #57cb8f;
        }
        .back_button {
          width: 48%;
          float: left;
        }
        .confirm_button {
          margin-left: 3.5%;
          width: 48%;
          float: left;
          border: 1px solid #57cb8f;
        }
      }
    }
  }
}

</style>