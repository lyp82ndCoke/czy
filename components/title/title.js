// components/title/title.js
const router = require('../../utils/router.js');
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type: String,
      value: "无痕养育成长营"
    },
    back: {
      type: Boolean,
      value: false
    },
    bgColor:{
      type: String,
      value: '#fff'
    } ,
    color: {
      type: String,
      value: '#000'
    }
    
  },
  /**
   * 组件的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 返回
    goBack() {
      router.navigateBack()
    },
  }
})
