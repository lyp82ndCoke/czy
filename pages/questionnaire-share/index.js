// pages/questionnaire-share/index.js
const router = require('../../utils/router');
import getCode from "../../utils/getCode";
import network from '../../utils/network';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "调查问卷" })
    this.setData({
      options
    })
  },
// 跳转到二维码页面
  goQrCode(){
    router.navigate({
      path: 'pages/questionnaire-qrcode/index',
      params: {
        questionnaire_code: this.data.options.questionnaire_code,
        shareImage: this.data.options.shareImage,
        shareTiele: this.data.options.shareTiele
      }
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("分享图片", this.options.shareImage)
    const obj = {
      title: this.data.options.shareTiele,
      imageUrl: this.data.options.shareImage||"",
      paramsFrom: { questionnaire_code: this.data.options.questionnaire_code},
      url: 'pages/questionnaire/index',
    }
//       * paramsFrom: 参数
//  * url: 分享路径
//       * title: 分享title
//         * imageUrl: 分享图片questionnaire_code=ques1li0j8VZ8VudY&is_preview=1
    return network.share(obj);
  }
})
