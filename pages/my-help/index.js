// 使用帮助
import network from '../../utils/network';
const router = require('../../utils/router.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    sugList: [],
    page: 1,
    size: 10,
    hasMoreData: true,
    category: 2 //个人中心种类
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "使用帮助" })
    this.getHelp()
    
  },
  
  getHelp(){
    wx.showLoading({
      title: '加载中',
    })
    const parmas={
      page_num:1,
      page_size:1000
    }
    network.request('Usehelp',parmas,res=>{
      this.setData({
        sugList:res.list
      })
      wx.hideLoading()
    })
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   this.data.page = 1
  //   this.getSugList('正在刷新数据')
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  // 获取意见反馈列表
  getSugList: function () {
    var that = this
    var param = {
      page: that.data.page,
      size: that.data.size,
      category: that.data.category
    }

    app.server.getJSON('edu_fqa/list', param, function (res) {
      var results = res['results'];
      var isShow = false
      for (var i = 0; i < results.length; i++) {
        results[i].isShow = isShow
      }
      console.log(param.page + '页数')
      if (param.page == 1) {
        results[0].isShow = true
      } else {
        results[0].isShow = false
      }

      var sugItem = that.data.sugList
      if (res.errorCode == 0) {
        if (that.data.page == 1) {
          sugItem = []
        }
        var sugList = results
        if (sugList.length < that.data.size) {
          that.setData({
            sugList: sugItem.concat(sugList),
            hasMoreData: false
          })
        } else {
          that.setData({
            sugList: sugItem.concat(sugList),
            page: that.data.page + 1,
            hasMoreData: true
          })
        }
      }
      wx.hideLoading()
    })

  },

  // 事件处理函数
  showHide: function (e) {
    var that = this
    let index = parseInt(e.currentTarget.dataset.index)
    let isShow = e.currentTarget.dataset.show
    let sugList = that.data.sugList
    console.log(isShow + '当前的状态' + index)
    this.data.sugList[index].isShow = !this.data.sugList[index].isShow;
    // if (isShow == true) {
    //   sugList[index].isShow = false
    // } else if (isShow == false) {
    //   sugList[index].isShow = true
    // }
    that.setData({
      sugList: sugList
    })
  },
  // 跳转意见发布
  kipBtn: function () {
    wx.redirectTo({
      url: '../release_sug/release_sug',
    })
  }
})