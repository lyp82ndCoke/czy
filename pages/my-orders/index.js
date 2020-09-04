// pages/my-orders/index.js
import network from '../../utils/network';
const router = require('../../utils/router.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    pageNum: 1,
    pageSize: 10,
    over: false,
    list: []

  },
  // 跳转主页
  goIndex() {
    router.switchTab({
      path: "pages/index/index"
    })
  },
  // 获取订单
  getList(add) {
    if (this.data.loading) {
      return false;
    }
    let $this = this;
    let limt = $this.data.pageSize;
    let page = $this.data.pageNum;
    this.setData({
      loading: true
    })
    network.request('myOrderList', {
      page_num: $this.data.pageNum,
      page_size: $this.data.pageSize,
      is_recommend: 0
    }, data => {
      let list = $this.data.list;
      let newData = data.list;
      if (newData.length < limt) {
        $this.setData({
          over: true
        });
        page--;
      } else {
        page++
      }
      if (add) {
        newData = list.concat(newData)
      }
      $this.setData({
        list: newData,
        pageNum: page
      });
      this.setData({
        loading: false
      })
      wx.hideLoading()
    }, err => {
      this.setData({
        loading: false
      })
    })
  },
  // 前往订单详情
  goOrder(e) {
    console.log(e.currentTarget.dataset.order_id)
    const order_id = e.currentTarget.dataset.order_id;

  },
  goBack() {
    router.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "我的订单" })
    wx.showLoading({
      title: '数据加载中',
    })
    
    this.getList();
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
  onPullDownRefresh: function () {
    if(this.data.over){
      wx.showToast({
        title: '没有更多',
        icon: "none"
      })
      return;
    }
    this.setData({
      pageNum: 1
    });
    this.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.over) {
      wx.showToast({
        title: '没有更多',
        icon: "none"
      })
      return false;
    }
    this.getList('add');
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})