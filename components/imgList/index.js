// components/imgList/index.js
Component({
  /**
   * 组件的属性列表
   * list:图片list Array
   * bindimgView：图片点击了预览
   */
  properties: {
    list:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    imgView: function (event) {
      var src = event.currentTarget.dataset.src; //获取data-src
      var imgList = event.currentTarget.dataset.list; //获取data-list
      //图片预览
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: imgList // 需要预览的图片http链接列表
      })
      this.triggerEvent('imgClickShow')
    },
  }
})
