// pages/my/m'y.js
import network from '../../utils/network';
import getCode from "../../utils/getCode";
const router = require("../../utils/router");
const app = getApp();
const phoneRexp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
let interval;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginShow: false,
    loginWrapShow:false,
    isIpx: app.globalData.isIpx,
    userInfo: {},
    ghlist: [],
    openSetting:false,
    showOrder:false,
    phone: "",
    code:'',
    showCodeBtn:true



  },
  // 电话号码
  changOrder(e){
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },
  // 电话号码
  changCode(e) {
    console.log(e.detail.value)
    this.setData({
      code: e.detail.value
    })
  },
  // 取消输入
  cancel(){
    this.setData({
      tid:'',
      showOrder:false
    })
  },
  // 提交手机号和验证码
  confirm(){
    if (this.blurPhone&&this.data.code.trim()){
      wx.showLoading({
        title: "提交中",
        mask: true
      })
      const parmas = {
        mobile: this.data.phone,
        sms_code: this.data.code
      }
      network.request("checkSms", parmas, res => {
        wx.showToast({
          title:"验证成功",
          icon: "none",
        })
        this.clearIntervalCode();
        this.setData({
          showOrder:false,
          code:""
        })
      })
    }else{
      wx.showToast({
        title:'请检查输入信息',
        icon:"none"
      })
    }
    
  },
  // 获取验证码
  getCode(){
    if (this.blurPhone()){
      console.log("手机号正确")
      // 发送验证码
      network.request("sendSms", { mobile:this.data.phone},res=>{
        wx.showToast({
          title:"发送成功",
          icon:"none"
        })
        this.hidBtn()
      })
      
    }
    
  },
  // 隐藏获取验证码的按钮
  hidBtn(){
    this.setData({
      showCodeBtn:false
    })
    this.countDown();
  },
  // 倒计时
  countDown(){
    const that = this;
    const num = 60;
    that.setData({
      num
    })
   interval=setInterval(()=>{
    
      const num = that.data.num-1;
      that.setData({
        num
      })
      if (num<=0){
        this.clearIntervalCode();
      }
    },1000)
    
  },
  clearIntervalCode(){
    clearInterval(interval);
    this.setData({
      showCodeBtn: true
    })
  },
  // 验证手机号
  blurPhone: function () {
    let that = this,
      phone = this.data.phone,
      errMsg = '';
    that.setData({
      Loading: true
    })
    if (!phone) {
      errMsg = '手机号不能为空！';
    }
    // if (!code) {
    //   errMsg = '验证码不能为空！';
    // }
    if (phone) {
      if (!phoneRexp.test(phone)) {
        errMsg = '手机号格式有误！';
      }
    }
    if (errMsg) {
      that.setData({
        Loading: false
      })
      
      wx.showToast({
        title: errMsg,
        icon:"none"
      })
      return false
    }else{
      return true;
    }
  },
  // 显示输入订单弹框
  showPutOrser(){

    const bind_mobile = this.data.userInfo.bind_mobile;
    if(bind_mobile){
      const that = this;
      wx.showModal({
        title:'提示',
        content: `您当前绑定的手机号为\r\n${bind_mobile}，是否换绑？`,
        confirmText:'换绑',
        success(res) {
          if (res.confirm) {
            that.setData({
              showOrder: true
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      this.setData({
        showOrder: true
      })
    }
  },
  // 去签到
  goSing(){
    const path = `pages/training-check-list/index`
    router.navigate({
      path
    })
  },
  // 跳转page页面
  goPage(e) {
    if (e.detail.formId) {
      network.reFormId(e.detail.formId)
    }
    const path = e.currentTarget.dataset.path;
    console.log(e.currentTarget.dataset)
    router.navigate({
      path
    })
  },
  // 获取当前授权状态
  getLoginStatus() {
    getCode.loginShow().then(res => {
      if (res) {
        this.setData({
          loginShow: res,
          loginWrapShow:true
        })
      }else{
        this.setData({
          loginShow: res,
          loginWrapShow: false
        })
      }
    })
  },
  // 获取公号关注状态
  getSubStatus(){
    network.request('getSubStatus',{},res=>{
      this.setData({
        ghlist:res
      })
    })
  },
  // 全局唤醒授权点击框
  loginShow() {
    this.setData({
      loginShow: true
    });
  },
  // 授权成功
  loginHide() {
    this.setData({
      loginShow: false,
      loginWrapShow: false
    });
    let userInfo = wx.getStorageSync('userinfo');
    this.setData({
      userInfo,
      // phone: userInfo.bind_mobile||''
    })
    // this.getInfo();
  },
  // 取消授权
  cancelLogin() {
    this.setData({
      loginShow: false
    });
  },
  // 遮罩层
  showdetail(e) {
    console.log(e)
    this.setData({
      isfmodal: true,
      detaillist: e.currentTarget.dataset
    })

  },
  closeFmdal() {
    this.setData({
      isfmodal: false
    })
  },
  // 一键保存到相册
  saveCodeBtn: function (e) {
    var that = this
    var goods_group_id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var groupQrcode = e.currentTarget.dataset.groupqrcode
    console.log(e)
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { //这里是用户同意授权后的回调
              that.downloadImg(groupQrcode)
            },
            fail() { //这里是用户拒绝授权后的回调
              that.setData({
                openSetting: true
              })
            }
          })
        } else { //用户已经授权过了
          that.downloadImg(groupQrcode)
        }
      }
    })

  },

  hideAlert(){
    this.setData({
      isfmodal: false
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    wx.setNavigationBarTitle({title:"我的"})
    const userinfo = wx.getStorageSync('userinfo');
    console.log(userinfo, "us")
    if (userinfo) {
      this.setData({
        userInfo: userinfo,
        // phone: userinfo.bind_mobile || ''
      })
    }

  },
  getInfo(){
    network.request('myInfo',{},res=>{
      // 解决没有openid问题
      if (!res.openid) {
        console.log("userInfo", res, "没有openid")
        const openid = wx.getStorageSync("openid");
        console.log(openid, "openid获取本地")
        res.openid = wx.getStorageSync("openid");
        network.request("saveUserInfo", res, data => {
        })
      }
      this.setData({
        userInfo: res,
        // phone: res.bind_mobile || ''
      })
      wx.setStorageSync('userinfo', res)
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    let unionid = wx.getStorageSync('unionid');
    if (unionid) {
      this.getInfo()
      this.getSubStatus()
      this.getLoginStatus()
      getCode.showMenuNotice()
    } else {
      getCode.login().then(res => {
        console.log("code：", res)
        this.getInfo()
        this.getSubStatus()
        this.getLoginStatus()
        getCode.showMenuNotice()
      })
    }
    // wx.showTabBarRedDot({ index:3})
  },
  // 打开设置页面
  openSetting(e) {
    const that = this;
    console.log(e.currentTarget,"groupQrcode,e")
    const groupQrcode = e.currentTarget.dataset.groupqrcode;

    wx.openSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum']) {
          console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
          console.log(groupQrcode,"图片地址")
          that.downloadImg(groupQrcode)
          that.setData({
            openSetting: false
          })
          that.downloadImg()
        } else {
          console.log('获取权限失败，给出不给权限就无法正常使用的提示')
        }
      },
      complete(err) {
        console.log(err)
      }
    })
  },
  // 保存图片
  downloadImg(url){
    wx.showLoading({
      title: '保存图片中...',
      mask: true
    })
    wx.downloadFile({
      url: url,
      success: function (res) {
        // if(res.statusCode === 200){
        let img = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: img,
          success(result) {
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
          },
          fail: function (err) { 
            wx.showToast({
              title: '图片保存失败，请重新保存！',
              icon:"none",
              duration: 2000
            })
          }
        })
        // }
      }
    })
  },
  // 编辑个人资料
  editInfoMsg(){
    console.log('编辑个人资料')
    router.navigate({
      path:`pages/edit-info/index`
    })
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

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})