<template>
  <div class="good-at">
    <div class="categories">
      <div
        class="item"
        v-for="(item, index) in categoryList" :key="index"
        :style="{ background: 'url(' + item.img + ')' }">

        <div class="mask" @click="item.isSelected = !item.isSelected">
          {{ item.name }}
          <div class="check-box" v-if="item.isSelected">
            <div class="hook"></div>
          </div>
        </div>

      </div>
    </div>

    <div class="sure-button" @click="commit">下一步</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import categoryList from './categoryList'

export default {
  data() {
    return {
      categoryList
    }
  },
  props: [
    'formToal'
  ],
  methods: {
    async commit() {
      let skill = ''
      this.categoryList.map(e => {
        if (e.isSelected) {
          skill = skill + e.name + ','
        }
      })

      skill = skill.substring(0, skill.length - 1)

      if (skill == '') {
        this.$toast.warn('请至少选择一个擅长类型');
        return;
      }

      let rqBody = this.getRqBody(this.formToal);
      rqBody.skill = skill;

      if (this.formToal.company == '') {
        try {
          let res = await this.$apiFactory.getUserApi().setAuthCard(rqBody)
          if (res.data.out == '1') {
            // let user = JSON.parse(JSON.stringify(this.loginUser));
            this.loginUser.user_data.card_status = '1';
            this.$store.commit('loginUser', this.loginUser);
            this.$emit('updateProgress', {
              nextIndex: 3,
              form: {}
            });
            this.$toast.notice('提交成功');
          } else {
            this.$toast.warn('提交失败，请重试');
          }
        } catch (e) {
          console.log(e)
        }
      } else {
        try {
          let res = await this.$apiFactory.getUserApi().setAuthCardCom(rqBody)
          if (res.data.out == '1') {
            // let user = JSON.parse(JSON.stringify(this.loginUser));
            this.loginUser.user_data.company_status = '1';
            this.$store.commit('loginUser', this.loginUser);
            this.$emit('updateProgress', {
              nextIndex: 3,
              form: {}
            });
            this.$toast.notice('提交成功');
          } else {
            this.$toast.warn('提交失败，请重试');
          }
        } catch (e) {
          // console.log(e)
        }
      }
    },
    /**
     * 返回formToal中非空的属性
     * @param {*} formToal nuxt的上下文
     */
    getRqBody(formToal) {
      let obj = {};
      for (let p in formToal) {
        if (formToal[p] != '') {
          obj[p] = formToal[p]
        }
      }
      return obj;
    }
  },
  computed: {
    ...mapGetters([
      'loginUser'
    ])
  }
}
</script>

<style scoped>
.good-at {
  box-sizing: border-box;
  width: 500px;
  margin-top: 60px;
  padding: 9px 25px 25px 25px;
  border-radius: 8px;
  background-color: #ffffff;
  margin-left: calc(50% - 250px);
  margin-left: -moz-calc(50% - 250px);
  margin-left: -webkit-calc(50% - 250px);
}

.categories {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.item {
  width: 140px;
  height: 88px;
  margin-top: 16px;
  border-radius: 4px;
  background-size: cover !important;
  background-position: center !important;
}

.mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .4);
  border-radius: 4px;
  text-align: center;
  color: #fff;
  line-height: 88px;
  font-size: 16px;
  position: relative;
  cursor: pointer;
}


.check-box {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #57cb8f;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  bottom: 8px;
  right: 8px;
}

.hook {
  width: 10px;
  height: 5px;
  margin: 6px 0 0 4px;
  border-bottom: 2px solid #fff;
  border-left: 2px solid #fff;
  transform:  rotate(-45deg);
}

.sure-button {
  width: 450px;
  height: 45px;
  border-radius: 6px;
  background-color: #56cb8f;
  text-align: center;
  line-height: 45px;
  margin: 22px 0 0 calc(50% - 225px);
  cursor: pointer;
  color: #fff;
}
</style>

