// pages/login/index.js
import {request} from '../../utils/network.js';
const router = require('../../utils/router.js');
import getCode from "../../utils/getCode";
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: {
            text: '好妈妈拼课',
            color: '#000',
            bgColor: '#fff'
        },
      btn:true
    },
  bindGetUserInfo(e){
    console.log(this.data.options)
    console.log(JSON.stringify(e.detail));
    const fromData = e.detail;
    const userinfo = e.detail.userInfo;
    const params = this.data.options;
    const path = params && params.nav ? params.nav: "pages/index/index";
    request('pushUserInfo', fromData,data=>{
      wx.setStorageSync("unionid", data.unionid);
      wx.setStorageSync("openid", data.openid);
      console.log(data)
    })
    wx.setStorageSync("userinfo", userinfo);
    console.log("登录打印",this.data.options)
    router.reLaunch({
      path,
      params
    })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      if (app.globalData.isIpx) {
        this.setData({
          isIpx: true,
          "title.isIpx": true
        })
      }
      console.log(wx.getStorageSync('user_id'))
      if (wx.getStorageSync('user_id')){
        this.setData({
          options,
          btn:true
        })
      }else{
        console.log("没有user_id")
        getCode.login().then(res => {
          console.log('注册用户返回',res)
          this.setData({
            options,
            btn: true
          })
        })
      }
      console.log("login",options)
      
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})