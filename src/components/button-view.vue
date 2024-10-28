<template>
  <button
    :class="classStyle"
    @click="$emit('click')"
    v-bind:disabled="disabled"
  >
    <slot>Menu Button</slot>
  </button>
</template>

<script>
export default {
  components: {},
  name: "button-menu",
  props: {
    className: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
  },
  data: function () {
    return {
      isDisabled: false,
    };
  },
  computed: {
    classStyle() {
      if (this.className) {
        return "button_menu " + this.className;
      } else {
        return "button_menu";
      }
    },
  },
  watch: {
    disabled: function (val) {
      this.isDisabled = val;
      // console.log(val)
    },
  },
};
</script>

<style>
.button_menu:hover {
  opacity: 0.8;
}
.button_menu {
  border: 0;
  padding: 4px 10px;
  border-radius: 5px;
  color: white;
  background-color: #1890ff;
  opacity: 0.9;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: 0.5s;
}
</style>
