
<template>
    <div class="drop" v-on="{mouseenter:openDropdown,mouseleave:closeDropdown}">
      <div :class="downClass" v-on="{touchstart:touchClick}">
        <span class="span_img"><slot name="icon"></slot></span>
        <span><slot name="text">dropdown</slot></span>
        <div
          :class="
            isDropDown ? 'div_down iconfont div_down-open' : 'div_down iconfont'
          "
        >
          &#xe60b;
        </div>
      </div>
      <div
        :class="isDropDown ? 'dropdown-list dropdown-list-open' : 'dropdown-list'"
      >
        <ul>
          <li
            v-for="item in items"
            :key="item"
            @click="$emit('listClick', downListClick(item))"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    name: "dropdown",
    components: {},
    props: {
      className: {
        type: String,
      },
      items: {
        type: Array || Object,
      },
    },
    data: function () {
      return {
        isDropDown: false,
      };
    },
    computed: {
      downClass() {
        return this.className + " dropdown";
      },
    },
    methods: {
      openDropdown() {
        this.isDropDown = true;
      },
      closeDropdown() {
        this.isDropDown = false;
      },
      downListClick(item) {
        this.isDropDown = false;
  
        return item;
      },
      touchClick(){
        this.isDropDown = !this.isDropDown;
      }
    },
  };
  </script>
  
  <style>
  .drop {
    display: inline;
    position: relative;
    bottom: 0;
    padding: 2px;
    font-size: 15px;
    cursor: pointer;
    overflow: hidden;
    color: #1890ff !important;
  }
  .dropdown {
    display: inline-block;
    z-index: 10;
    position: relative;
    background-color: white;
    transition: 0.2s;
  }
  .div_down-open {
    transform: rotate(-180deg);
  }
  .drop:hover .dropdown {
    opacity: 0.9;
  }
  
  /* .drop:hover .dropdown-list li {
    height: 50px !important;
  }
  .drop:hover .dropdown-list {
    box-shadow: 0 4px 6px 3px #dadad6;
  } */
  
  .span_img {
    margin-right: 5px;
    position: relative;
  }
  .dropdown-list-open {
    /* display: block !important; */
    z-index: 1;
    box-shadow: 0 4px 6px 3px #dadad6;
  }
  
  .dropdown-list {
    width: 100%;
    overflow: hidden;
    background-color: white;
    position: absolute;
    z-index: 2;
    /* display: none; */
  }
  
  .dropdown-list ul {
    margin: 0;
    padding: 0;
  }
  .dropdown-list-open li {
    height: 50px !important;
  }
  .dropdown-list li {
    list-style: none;
    height: 0px;
    transition: 0.2s;
    line-height: 50px;
    text-align: center;
    transition-property: height;
  }
  
  .dropdown-list li:hover {
    background-color: rgb(221 228 228);
  }
  .div_down {
    transition: 0.3s;
    display: inline-block;
  }
  </style>