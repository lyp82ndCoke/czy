const router = require('../../utils/router.js');
import network from '../../utils/network';
import getCode from "../../utils/getCode";
Page({
  data:{
    is_ceping: false
  },
  onLoad:function(options){
    this.setData({paper_id: options.paper_id, camp_times_id: options.camp_times_id, assess_id: options.assess_id, assess_paper_id: options.assess_paper_id, prevIndex: options.prevIndex})
    // 生命周期函数--监听页面加载
    const accessInfo = wx.getStorageSync('access_info')
    this.setData({ accessInfo: accessInfo })
    const userinfo = wx.getStorageSync('userinfo');
    if (userinfo) {
      this.setData({
        userInfo: userinfo
      })
    }
  },
  onUnload() {
    // 离开页面清除缓存
    wx.removeStorageSync('access_info')
  },
  getInfo(){
    network.request('myInfo',{},res=>{
      this.setData({
        userInfo: res,
      })
      wx.setStorageSync('userinfo', res)
    })
  },
  onShow: function () {
    let unionid = wx.getStorageSync('unionid');
    if (unionid) {
      this.getInfo()
    } else {
      getCode.login().then(res => {
        this.getInfo()
      })
    }
  },
  evaluationNow() {
    router.redirect({path: `pages/evaluation-answer/index?paper_id=${this.data.paper_id}&camp_times_id=${this.data.camp_times_id}&assess_id=${this.data.assess_id}&assess_paper_id=${this.data.assess_paper_id}&prevIndex=${this.data.prevIndex}`})
  }
})
  