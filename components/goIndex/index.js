// components/goIndex/index.js
const router = require('../../utils/router.js');

Component({

  /**
   * 组件的初始数据
   */
  data: {
    showIndex: false
  },

  ready() {
    console.log("组件index")
    console.log(getCurrentPages().length, "页面栈")
    if (getCurrentPages().length == 1) {
      this.setData({
        showIndex: true
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goIndex() {
      router.switchTab({
        path: "pages/index/index"
      })
    }},
})
