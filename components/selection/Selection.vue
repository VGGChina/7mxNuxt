<template>
  <div class="selection-container">
    <div
      class="selection"
      :class="{ 'color-b': !!this.options && !!this.option && Object.keys(this.option).length > 0 }"
      :style="selectionStyle"
      @click="showOptions"
    >
      <span class="selection-text">{{ text }}</span>
      <span class="selection-red" v-if="isShowRed && this.$utilHelper.isEmptyObj(option)">有奖</span>
      <div class="array" :class="{ 'array-rotate': isShowOptions }"></div>
    </div>

    <transition name="options-fade">
      <div class="options" v-if="isShowOptions" :style="optionsStyle">
        <div
          v-for="(item, index) in options"
          @click="selected(item)"
          :key="index"
        >{{ item[optionKey] }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data: () => ({
    isShowOptions: false,
    optionsStyle: {
      width: '300px'
    }
  }),
  props: [
    'maxNum', // 下拉框装最多显示选项的数量
    'selectionWidth', // 选择器的宽度
    'selectionHeight', // 选择器的高度
    'placeText', // 提示文字
    'optionKey', // 每个选项必须对应一个对象，optionKey是对象的一个属性名，用来告诉选择器显示对象中的那个属性
    'options', // 选择器的所有的选项的数组，每个选项必须是一个属性
    'option', // 选中的那个选项
    'isShowRed',
    'borderColor'
  ],
  created() {
    if (this.selectionWidth) {
      this.optionsStyle.width = this.selectionWidth + 'px';
    }
  },
  methods: {
    showOptions() {
      this.isShowOptions = !this.isShowOptions

      if (!this.options) {
        return;
      }
      if (this.options.length < 1) {
        return;
      }
      let length = this.options.length;
      let h = 0;
      let _maxNum = 7;
      if (this.maxNum !== undefined) {
        _maxNum = this.maxNum;
      }
      if (length < _maxNum) {
        h = 32 * length;
      } else {
        h = 32 * _maxNum;
      }
      this.optionsStyle.height = h + 'px';
    },
    selected(item) {
      if (item.id < 0) {
        this.showOptions()

        return
      }

      this.showOptions();

      this.$emit('input', item);
    }
  },
  computed: {
    text() {
      if (!!this.options && !!this.option && Object.keys(this.option).length > 0) {
        return this.option[this.optionKey];
      }

      if (this.placeText) {
        return this.placeText;
      }

      return '请选择';
    },
    selectionStyle() {
      let style = {
        width: '300px',
        height: '45px',
        'border-color': this.borderColor
      }

      if (this.selectionWidth) {
        style.width = this.selectionWidth;
      }

      if (this.selectionHeight) {
        style.height = this.selectionHeight;
      }

      return style;
    }
  },
  watch: {
    'selectionWidth': function (val) {
      this.optionsStyle.width = val + 'px';
    }
  }
}
</script>

<style scoped>
.selection-container {
  position: relative;
}

.selection {
  box-sizing: border-box;
  border-radius: 4px;
  background-color: #f2f2f2;
  border: solid 1px #e3e3e3;
  padding: 0 14px;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 16px;
  transition: border-color 0.2s;
  color: rgba(0, 0, 0, 0.5);
  position: relative;
}

.selection:hover {
  border-color: rgba(0, 0, 0, 0.3) !important;
  transition: border-color 0.2s;
}

.selection-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.array {
  width: 18px;
  height: 10px;
  transition: transform 0.2s;
  opacity: 0.5;
  background: url("./img/array.svg") no-repeat;
  background-size: contain;
}

.array-rotate {
  transform: rotate(-180deg);
}

.options-fade-enter-active,
.options-fade-leave-active {
  transition: all 0.2s;
}

.options-fade-enter,
.options-fade-leave-active {
  opacity: 0;
}

.options {
  margin-top: 6px;
  box-sizing: border-box;
  background: #fff;
  border: solid 1px #e3e3e3;
  border-radius: 4px;
  overflow: auto;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.05);
  position: absolute;
  z-index: 10;
}

.options div {
  color: #000;
  cursor: pointer;
  line-height: 2;
  padding: 0 14px;
  font-size: 16px;
  text-align: left;
}

.options div:hover {
  background: #f2f2f2;
}

.color-b {
  color: #000;
}

.selection-red {
  background: #fff1f4;
  color: #ff6584;
  border: 1px solid rgba(255, 101, 132, 0.34);
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  position: absolute;
  left: 84px;
}
</style>
