<template>
  <div class="work-pre">
    <!-- 单个编辑或者多个编辑 -->
    <div v-if="step == 1" class="category-options">
      <div class="slide" :style="slideStyle" />
      <div
        v-for="(option, index) in categoryOptions"
        :key="index"
        class="category-option"
        @click="slide(index)"
      >
        {{ option }}
      </div>
    </div>

    <div v-if="whichOption == 1 || step == 0" class="select-all">
      <div class="circle" :style="selectAllStyle" @click="selectAll()">
        <div class="hook" />
      </div>
      全部选择
      <span class="selected-commoditys">
        已选中<span class="selected-num">{{ selectedNum }}</span>个作品
      </span>
    </div>

    <div class="workItem-list">
      <div
        v-for="(item, index) in workList"
        :key="index"
        class="work-item"
        :style="{
          background: 'url(' + $utilHelper.getCompressionUrl(item.image) + ')',
          borderColor: item.isSelected ? '#56cb8f' : '#fff'
        }"
        @click="selected(item, index)"
      >
        <div
          v-if="step == 1"
          class="mask"
          :style="{
            background: currentIndex == index ? 'rgba(0, 0, 0, .2)' : 'transparent'
          }"
          @mouseenter="currentIndex = index"
          @mouseleave="currentIndex = -1"
        >
          <transition name="">
            <div v-if="currentIndex == index" class="remove" @click="removeItem(index)" />
          </transition>

          <span v-if="isReleasClicked && (item.toPaixinForm.exclusive.id == -1 || item.toPaixinForm.editorial.id == -1)">未编辑</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'workList',
    'step',
    'isReleasClicked'
  ],
  data() {
    return {
      categoryOptions: ['单个编辑', '多个编辑'],
      whichOption: 0,
      slideStyle: { transform: 'translateX(0px)' },
      currentIndex: -1,
      isSelectAll: false
    }
  },
  computed: {
    selectAllStyle() {
      if (this.isSelectAll) {
        return {
          background: '#57cb8f'
        }
      } else {
        return {
          border: '1px solid #cecece'
        }
      }
    },
    selectedNum() {
      let sum = 0

      this.workList.forEach(e => {
        if (e.isSelected) {
          sum++
        }
      })

      return sum
    }
  },
  methods: {
    /**
    * 顶部选项卡选中时的动画控制
    * @param index 这个参数是指当前选中的选项卡的索引
    */
    slide(index) {
      this.whichOption = index
      // 每个选项卡的宽度为190px，滑块宽度为188， 所以需要滑动188
      this.slideStyle = {
        transform: 'translateX(' + index * 188 + 'px)'
      }

      this.isSelectAll = false

      this.workList.forEach(e => {
        e.isSelected = false
      })
    },
    minNum(x, y) {
      return x > y ? y : x
    },
    maxNum(x, y) {
      return x > y ? x : y
    },
    selected(item, index) {
      const width = parseInt(item.image_width)
      const height = parseInt(item.image_height)

      if (this.maxNum(width, height) < 4000 || this.minNum(width, height) < 2800) {
        this.$toast.warn('图片的最长边必须大于4000像素、最短边必须大于3000像素才能上架，请选择其他图片')

        return
      }

      if (this.step == 0) {
        item.isSelected = !item.isSelected
      }

      if (this.step == 1) {
        if (this.whichOption == 0) {
          this.workList.forEach((e, i) => {
            if (i != index) {
              e.isSelected = false
            }
          })
          item.isSelected = true
        } else {
          item.isSelected = !item.isSelected
        }
      }
    },
    removeItem(index) {
      this.workList.splice(index, 1)
    },
    selectAll() {
      this.isSelectAll = !this.isSelectAll

      this.workList.forEach(e => {
        const width = parseInt(e.image_width)
        const height = parseInt(e.image_height)

        const b = this.maxNum(width, height) < 4000 || this.minNum(width, height) < 2800
        if (b) {
          if (this.isSelectAll) {
            this.$toast.warn('部分图片不满足上架条件，已自动过滤')
          }
        } else {
          e.isSelected = this.isSelectAll
        }
      })
    }
  }
}
</script>

<style scoped>
.work-pre {
  margin: 0 20px;
  padding: 30px 0;
}

.category-options {
  box-sizing: border-box;
  width: 380px;
  height: 38px;
  padding: 0 2px;
  border-radius: 4px;
  background-color: #efefef;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  margin: 0 0 0 calc(50% - 190px);
  position: relative;
}

.slide {
  width: 188px;
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

.select-all {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  height: 35px;
  margin-left: 8px;
}

.circle {
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 14px;
  cursor: pointer;
}

.selected {
  background-color: #57cb8f;
}

.no-selected {
  border: solid 1px #cecece;
}

.hook {
  box-sizing: border-box;
  width: 10px;
  height: 6px;
  margin: 6px 0 0px 5px;
  border-bottom: 2px solid #fff;
  border-left: 2px solid #fff;
  transform: rotate(-45deg);
}

.selected-commoditys {
  margin-left: 30px;
}

.selected-num {
  font-size: 16px;
  margin: 0px 6px;
  font-weight: 600;
}

.workItem-list {
  width: 100%;
  margin-top: 32px;
}

.work-item {
  width: 120px;
  height: 120px;
  margin: 8px 8px 0 0;
  display: inline-block;
  cursor: pointer;
  background-size: cover !important;
  background-position: center !important;
  border: solid 6px #fff;
}

.mask {
  width: 100%;
  height: 100%;
  background: transparent;
  position: relative;
  transition: all .2s;
}

.remove {
  width: 12px;
  height: 12px;
  background-image: url("./img/remove.svg");
  background-size: contain;
  cursor: pointer;
  position: absolute;
  right: 8px;
  top: 10px;
}

.mask span {
  color: #fff;
  background-color: rgb(255, 87, 34);
  padding: 4px 8px;
  border-radius: 6px;
  bottom: 0px;
  right: 0px;
  position: absolute;
  font-size: 14px;
}
</style>

