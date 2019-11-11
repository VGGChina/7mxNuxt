<template>
<div style="position: relative">
  <div class='container'>
    <p class="poll-intro" v-if="activeDetail.vote_caption" v-html="activeDetail.vote_caption ? activeDetail.vote_caption : ''">
    </p>

    <div class="poll-row" v-for="(pollRow, rowIndex) in sliceStageList" :key="rowIndex">
      <div class="poll-heading" v-if="stage === '3'">
        <span class="line"></span>
        <h3 class="place" v-if="pollRow[0]">《{{ pollRow[0]['awards_title'] }}》</h3>
        <span class="line"></span>
      </div>
      <div class="poll-col" v-for="(pollCol, colIndex) in pollRow" :key="colIndex">
        <div class="poll-col-top">
          <a :href="`/photo/${pollCol.id}`" target="_blank">
              <img :src="pollCol.image" :alt="pollCol.title" width="100%" height="100%" />
            </a>
        </div>
        <div class="poll-col-content">
          <div class="poll-info poll-id" v-if="stage !== '3'">
            <span>作品编号</span>
            <span>{{ ($route.params.page - 1) * 40 + rowIndex * 4 + (colIndex + 1) }}</span>
          </div>
          <div class="poll-info poll-author" :class="{ award: stage === '3' }">
            <span>作者</span>
            <strong>{{ pollCol["user_data"].nick }}</strong>
          </div>
          <div class="poll-info poll-amount" v-if="stage !== '3'">
            <span>得票数</span>
            <strong>{{ pollCol["vote_num"] }}</strong>
          </div>
          <button v-if="stage !== '3'" class="poll-btn button-green" v-on:click="handlePoll(pollCol)">投票</button>
        </div>
      </div>
    </div>

    <div class="poll-addwechat"
      v-show="stageList.length > 0 && stage == '3'">
        获奖摄影师可联系工作人员领取奖励 官方微信号：paixin_1004
      </div>    
  </div>

  <no-content :isNoContentShow="stageList.length < 1 && !isLoading"></no-content>
</div>
</template>

<script>
import NoContent from '~/components/no-content/NoContent'

export default {
  props: [
    'stageList',
    'stage',
    'isLoading',
    'activeDetail'
  ],
  methods: {
    async handlePoll(col) {
      const formData = {
        tag_id: this.$route.params.id,
        media_id: col.id
      }
      const res = await this.$apiFactory.getMediaApi().poll(formData)
      const { data } = res

      data.out == '1' ? col['vote_num']++ : this.$toast.warn(data.msg)
    }
  },
  computed: {
    sliceStageList() {
      let result = [];

      if (this.stage !== '3') {
        // 分割数组
        for (let i = 0; i < this.stageList.length; i += 4) {
          result.push(this.stageList.slice(i, i + 4));
        }
      } else {
        let firstPlace = this.stageList.filter((value) => (
          value.awards === '1'
        ))
        let secondPlace = this.stageList.filter((value) => (
          value.awards === '2'
        ))
        let thirdPlace = this.stageList.filter((value) => (
          value.awards === '3'
        ))
        if (thirdPlace.length > 0) result.push(thirdPlace)
        if (secondPlace.length > 0) result.push(secondPlace)
        if (firstPlace.length > 0) result.push(firstPlace)
      }
      return result
    }
  },
  components: {
    NoContent
  }
}
</script>

<style lang='scss' scoped>
.container {
    width: 1200px;
    margin: 0 auto;
    padding-top: 20px;

    .poll-intro {
        width: 800px;
        margin: 54px auto;
    }

    .poll-row {
        margin: 10px 0;

        .poll-heading {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin-bottom: 20px;
            padding: 0 10px;
            box-sizing: border-box;
            .line {
                width: calc((100% - 900px) / 2);
                height: 2px;
                background-color: rgba(0, 0, 0, 0.06);
            }

            .place {
                width: 100px;
                margin: 0;
                text-align: center;
            }
        }

        .poll-col {
            display: inline-block;
            width: 25%;
            margin-bottom: 10px;
        }

        .poll-col-top a {
            display: block;
            width: 280px;
            height: 280px;
            margin: 0 auto;
        }

        .poll-col-top img {
            object-fit: cover;
        }

        .poll-col-content {
            width: 280px;
            margin: 0 auto;
            padding: 16px;
            background-color: #f3f3f3;
            box-sizing: border-box;
        }

        .poll-info {
            text-align: left;
        }

        .poll-id {
            margin-bottom: 6px;
        }

        .poll-amount {
            margin-top: 6px;
        }

        .poll-info > span:first-child {
            display: inline-block;
            width: 80px;
        }

        .poll-info.award > span:first-child {
          width: 40px;
        }

        .poll-btn {
            width: 100%;
            margin-top: 10px;
            border: none;
            outline: none;
        }
    }
    .poll-addwechat {
      text-align: center;
      margin: 40px 0;
      color: rgba(0, 0, 0, 0.5);
    }
}
</style>
