// pages/questionnaire-qrcode/index.js
import network from '../../utils/network';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openSetting: false, //首次授权拒绝，然后显示打开设置信息的按钮
    qrCodeUrl: "",
  },
  // 获取二维码
  getQrCode(){
    wx.showLoading({
      title: '获取二维码中'
    })
    const questionnaire_code = this.data.options.questionnaire_code;
    const params = {
      questionnaire_code: this.data.options.questionnaire_code,
      qrcode_type:1,
      // path: `pages/questionnaire/index?questionnaire_code=${questionnaire_code}`,
      path: `pages/questionnaire/index?questionnaire_code=${questionnaire_code}`
    }
    network.request("shareQRcode",params,res=>{
      console.log("二维码",res)
      this.setData({
        qrCodeUrl:res.picture
      })
      wx.hideLoading()
    })

  },
  // 判断是否授权保存图片
  save() {
    const that = this;
    wx.getSetting({
      success(res) {
        console.log('res', res)
        console.log(res.authSetting['scope.writePhotosAlbum'])
        if (res.authSetting['scope.writePhotosAlbum']) {
          console.log('已授权')
          app.saveImg(that.data.qrCodeUrl)
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
              app.saveImg(that.data.qrCodeUrl)
            },
            fail(err) {
              console.log(err)
              wx.showModal({
                content: "请先授权",
                showCancel: false,
                success() { }
              })
              that.setData({
                openSetting: true
              })

            }
          })
        }
      }

    })
  },
  // 打开设置页面
  openSetting() {
    const that = this;
    wx.openSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum']) {
          console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
          console.log(that)
          that.setData({
            openSetting: false
          })
          app.saveImg(that.data.qrCodeUrl);
        } else {
          console.log('获取权限失败，给出不给权限就无法正常使用的提示')
        }
      },
      complete(err) {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "调查问卷" })
    this.setData({
      options
    })
    this.getQrCode();
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
  // onShareAppMessage: function () {

  // }
})