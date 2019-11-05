<template>
  <div>
    <div class="list-wrap">
      <div class="array_wrap">
        <div class="array" />
      </div>

      <ul class="wrap">
        <li>
          <router-link to="/category/0/0/1">热门图片</router-link>
        </li>
        <li>
          <router-link :to="'/tag'">热门标签</router-link>
        </li>
      </ul>

      <div class="list-division" />

      <ul class="wrap">
        <li
          v-for="(item,index) in categoryListAll"
          v-if="index <= 4"
          :key="item.id"
        >
          <router-link :to="'/category/' + item.name + '/' + item.id + '/0/1'">{{ item.name }}</router-link>
        </li>
      </ul>

      <ul class="wrap">
        <li
          v-for="(item,index) in categoryListAll"
          v-if="4 < index && index <=9"
          :key="item.id"
        >
          <router-link :to="'/category/' + item.name + '/' + item.id + '/0/1'">{{ item.name }} </router-link>
        </li>
      </ul>

      <ul class="wrap">
        <li
          v-for="(item,index) in categoryListAll"
          v-if="9 < index && index <= 14"
          :key="item.id"
        >
          <router-link :to="'/category/' + item.name + '/' + item.id + '/0/1'">{{ item.name }} </router-link>
        </li>
      </ul>

      <ul class="wrap">
        <li
          v-for="(item,index) in categoryListAll"
          v-if="14 < index"
          :key="item.id"
        >
          <router-link :to="'/category/' + item.name + '/' + item.id + '/0/1'">{{ item.name }} </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'isTopbar'
  ],
  computed: {
    categoryListAll() {
      return this.$store.state.category.categoryListAll
    }
  }
}
</script>

<style lang='scss' scoped>
.list-wrap {
  display: flex !important;
  flex-direction: row;
  background: #fff;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 -1px 20px rgba(0, 0, 0, .1);
  font-size: .9rem;
  line-height: 1.8;
  box-sizing: border-box;
  font-weight: normal;
  margin: 0px;
  position: relative;
  cursor: default;
}

.array_wrap {
  width: 100px;
  height: 26px;
  overflow: hidden;
  position: absolute;
  left: 39%;
  top: -25px;
  .array {
    background: #fff;
    width: 20px;
    height: 20px;
    transform: translate(-50%, 10px) rotate(45deg);
    border-radius: 4px;
    position: absolute;
    left: 50px;
    top: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  }
}

.wrap {
  padding: 0 30px;
}

li {
  list-style-type: none;
  margin: 10px 0;
}

li span {
  color: #000;
  opacity: .7;
  cursor: pointer;
  transition: all .3s;
}

li span:hover {
  opacity: 1;
}

.list-division {
  width: 1px;
  height: 180px;
  margin: 20px  20px 0 20px;
  background: rgba(0, 0, 0, .1);
}

a {
  color: #000;
  opacity: .7;
  text-decoration: none;
}

a:hover {
  opacity: 1;
}
</style>
