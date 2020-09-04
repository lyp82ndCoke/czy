// pages/training-check-list/index.js
const router = require('../../utils/router');
import network from '../../utils/network';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    year: new Date().getFullYear(), //当前的年份
    month: new Date().getMonth() + 1, //当前的月份
    day: new Date().getDate(), 


    explainState: false, //签到说明弹窗状态
    signList: [], //签到列表
    description: '', //签到说明
    page: 1, //页
    size: 10, //每页展示的个数
    hasMoreData: true, //是否有更多
    hideState: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   share: app.globalData.share,
    // })
    // if (typeof options != 'undefined' && options.hideState) {
    //   this.setData({
    //     hideState: options.hideState
    //   })
    // }
    
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
    this.getSignList()
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
    app.globalData.hideState = true
    this.setData({
      hideState: app.globalData.hideState
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  
  /**
   * 页面上拉触底事件的处理函数
   */
 

  /**
   * 打开关闭签到说明弹窗
   */
  openExplain(e) {
    this.setData({
      explainState: true
    })
    let description = e.currentTarget.dataset.description
        this.setData({
          description
        })
  },
  closeExplain() {
    this.setData({
      explainState: false
    })
  },
  /**
   * 已经签到吐丝
   */
  openToast(e) {
    wx.showToast({
      title: `今天无需签到哦~`,
      icon:"none"
    })
    // let self = this
    // let id = e.currentTarget.dataset.id
    // let signInStatus = e.currentTarget.dataset.signInStatus
    // let signList = this.data.signList
    // signList.forEach((item, index) => {
    //   if (item.id == id) {
    //     if (signInStatus > 1) {
    //       item.signState = true
    //       setTimeout(function () {
    //         item.signState = false
    //         self.setData({
    //           signList
    //         })
    //       }, 1000)
    //     }
    //   } else {
    //     item.signState = false
    //   }
    // })
    // self.setData({
    //   signList
    // })
  },
  /**
   * 去签到详情页
   */
  goSign(e) {
    const id = e.currentTarget.dataset.id;
    const month = this.data.month >= 10 ? this.data.month : `0${this.data.month}`, day = this.data.day >= 10 ? this.data.day : `0${this.data.day}`;
    const toDay = this.data.year + "-" + month + "-" + day;
    router.navigate({
      path: `pages/training-answer/index?id=${id}&date=`
    })
   
  },
  /**
   * 去我的钱包
   */
  goWallet() {
    let path = '../my_income/my_income'
    app.func.navigatePath(path)
  },
  /**
   * 去签到日历
   */
  goSignDate(e) {
    const id = e.currentTarget.dataset.id;
    router.navigate({
      path: `pages/training-check-in/index?id=${id}`
    })
  },
  // 未到签到日期
  noBegin(e){
    const day = e.currentTarget.dataset.day;
    wx.showToast({
      title: `${day}才可以开始签到哦`,
      icon:'none'
    })
  },
  /**
   * 签到列表
   */
  getSignList() {
    wx.showLoading({
      title: '数据加载中',
    })
    const params = {
    }
    network.request('getCampTimesSignList',params,res=>{
      console.log(res,"签到列表")
      wx.hideLoading()
      this.setData({
        signList:res
      })
      wx.stopPullDownRefresh();
    },err=>{
      wx.stopPullDownRefresh();
    })
  },
  // 下拉刷新页面
  onPullDownRefresh() {
    this.getSignList();
  },
})