// pages/training-check-in/index.js
import network from '../../utils/network';
// import getCode from "../../utils/getCode";
const router = require("../../utils/router");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    alreadySignState: false, //已经签到吐丝状态
    year: new Date().getFullYear(), //当前的年份
    month: new Date().getMonth() + 1, //当前的月份
    day: new Date().getDate(), //当前的天
      "signInfo": {
        
      },
      "incomeList": [
       
      ],
      "canSignList": [
      ],
      bottomText:false,
      // 优惠券说明
    explainState:false,
    description:"说明：首先在四大公众号中找到新家长课程入口，其次进入我的优惠券中即可查阅\r\n注：四大公众号通过小程序-导航“我的”即可查阅到哦~",
    currentDayList: '',
    currentObj: '',
    starState: true,
    corrState: true,
    bgState: true,
    dateInfo: {},
    signState: false,
    signState1: false,
    saveImgBtnHidden: false,
    openSettingBtnHidden: true,
    billState: false, //海报显示状态
    currentMon: new Date().getMonth() + 1,
    subSignin: "",
    signEndState: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideShareMenu();
    this.getUserInfo()
    this.setData({
      options: options,
    })
    let currentObj = this.getCurrentDayString()
    this.setData({
      currentObj: currentObj
    })
    wx.showLoading({
      title: '加载中',
    })
    // console.log(options, "options.text")
    // if (options.text) {
    //   console.log("提示语", options.text)
    //   wx.showToast({
    //     title: options.text,
    //     icon: "none",
    //     duration:3000
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
  onShow: function (options) {
    this.setSchedule(this.data.currentObj)
    if(this.data.backText && this.data.signInfo.sign_type == 1){
      wx.showToast({
        title: this.data.backText,
        icon: "none",
        duration:3000
      })
      return
    }
    if (this.data.signInfo.sign_type == 2) {
      wx.showToast({
        title: '签到成功，明天继续哦~',
        icon: "none",
        duration:3000
      })
      return
    }
    // let that = this
    
    // setTimeout(()=>{
    //   this.formatSingDate()
    // },1000)
    
    // if (that.data.saveImgBtnHidden != false && that.data.openSettingBtnHidden == true) {
    //   that.handleSetting()
    // }
   
    
    // if (that.data.options.subSigninTips != "" && typeof that.data.options.subSigninTips != "undefined") {
    //   that.setData({

    //     subSignin: true

    //   })
    //   setTimeout(function () {
    //     that.setData({
    //       subSignin: false
    //     })
    //   }, 3000)
    // }
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
  // onShareAppMessage: function (res) {

  //   let dateInfo = this.data.dateInfo.shareInfo
  //   let title = dateInfo.shareTitle
  //   let signInStepDay = dateInfo.signInStepDay
  //   let goodsType = dateInfo.goodsType
  //   let goodsId = dateInfo.goodsID
  //   let goodsPicturePerView = dateInfo.goodsPicturePerView
  //   let path
  //   if (goodsId > 0) {
  //     if (goodsType == 7) {
  //       path = `revisionPackage/pages/goods_dta/goods_dta?id=${goodsId}&hideState=false&signState=true`
  //     } else if (goodsType == 8) {
  //       path = `revisionPackage/pages/series_dta/series_dta?id=${goodsId}&hideState=false&signState=true`
  //     } else if (goodsType == 5 || goodsType == 6) {
  //       path = `revisionPackage/pages/train_product/train_product?goods_id=${goodsId}&hideState=false&signState=true`
  //     }
  //   } else {
  //     path = `pages/home_page/index`
  //   }

  //   return {
  //     title: title,
  //     path: path,
  //     imageUrl: goodsPicturePerView,
  //     success: function (res) {
  //       console.log('我已成功分享')
  //     }
  //   }

  //   if (res.from === 'button') {
  //     return {
  //       title: title,
  //       path: path,
  //       imageUrl: goodsPicturePerView,
  //       success: function (res) {
  //         console.log('我已成功分享')
  //       }
  //     }
  //   }
  // },
  /**
   * 去签到详情页
   */
  goSign(e) {
    let id =this.options.id;
    const is_today_have_question = e.currentTarget.dataset.is_today_have_question;
    // console.log(is_today_have_question,"is_today_have_question")
    if (is_today_have_question==2){
      wx.showToast({
        title: '今日无需签到',
        icon:"none",
      })
      return;
    }
    const year = this.data.year, month = this.data.month < 10 ? `0${this.data.month}` : this.data.month, day = this.data.day < 10 ? `0${this.data.day}` : this.data.day;
    const toDay = year + "-" + month + "-" + day;
    console.log("今天", toDay)
    let path = `pages/training-answer/index?id=${id}&date=`
    // router.navigate({path})
    router.navigate({
      path
    })
  },
  // 优惠券提示框
  couponPrompt(){
    this.setData({
      explainState:true
    })
    // wx.showModal({
    //   title: '如何找到我的优惠券',
    //   content: '说明：首先在四大公众号中找到新家长课程入口，其次进入我的优惠券中即可查阅\r\n注：四大公众号通过小程序-导航“我的”即可查阅到哦~',
    //   showCancel:false
    // })
  },
  // 关闭弹框
  closeExplain() {
    this.setData({
      explainState: false
    })
  },
  /**
   * 已经签到提示  no
   */
  // openToast(e) {
  //   let self = this
  //   let signInStatus = e.currentTarget.dataset.signInStatus;
  //   console.log(signInStatus)
  //   if (signInStatus > 1) {
      
  //   }
  // },
  /**
   * 选择日期
   */

  // 上一年
  cutYear() {
    this.setData({
      year: this.data.year - 1
    })
    let a = this.data.year + '/' + (this.data.month) + '/' + this.data.day
    let currentObj = new Date(a)
    this.setSchedule(currentObj)
    this.setData({
      currentObj: currentObj
    })
    this.formatSingDate();
  },
  // 下一年
  plusYear() {
    this.setData({
      year: this.data.year + 1
    })
    let a = this.data.year + '/' + (this.data.month) + '/' + this.data.day
    let currentObj = new Date(a)
    this.setSchedule(currentObj)
    this.setData({
      currentObj: currentObj
    })
    this.formatSingDate();
  },
  // 上一月
  cutMonth() {
    if (this.data.month < 2) { 
      this.setData({
        month: 12
      })
      this.cutYear()
    } else {
      this.setData({
        month: this.data.month - 1
      })
    }
    let a = this.data.year + '/' + (this.data.month) + '/' + this.data.day
    let currentObj = new Date(a)
    this.setSchedule(currentObj)
    this.setData({
      currentObj: currentObj
    })
    this.formatSingDate();
  },
  // 下一月
  plusMonth() {
    if (this.data.month > 11) {
      this.setData({
        month:1
      })
      this.plusYear()
     } else {
      this.setData({
        month: this.data.month + 1
      })
    }
    let a = this.data.year + '/' + (this.data.month) + '/' + this.data.day
    let currentObj = new Date(a)
    this.setSchedule(currentObj)
    this.setData({
      currentObj: currentObj
    })
    this.formatSingDate();
  },
  /**
   * 获取当前的日期
   */
  getCurrentDayString: function () {
    var objDate = this.data.currentObj
    if (objDate != '') {
      return objDate
    } else {
      var a = this.data.year + '/' + (this.data.month) + '/' + this.data.day
      return new Date(a)
    }
  },
  /**
   * 展示日历
   */
  setSchedule: function (currentObj) {
    var m = currentObj.getMonth() + 1
    if (m == 1 || m == 2 || m == 3 || m == 4 || m == 5 || m == 6 || m == 7 || m == 8 || m == 9) {
      m = '0' + m
    }
    var Y = currentObj.getFullYear()
    var d = currentObj.getDate();
    var dayString = Y + '/' + m + '/' + currentObj.getDate()
    var currentDayNum = new Date(Y, m, 0).getDate()
    var currentDayWeek = currentObj.getUTCDay() + 1
    var result = currentDayWeek - (d % 7 - 1);
    var firstKey = result <= 0 ? 7 + result : result;
    var currentDayList = []
    var f = 0
    for (var i = 0; i < 42; i++) {
      let data = []
      if (i < firstKey - 1) {
        currentDayList[i] = ''
      } else {
        if (f < currentDayNum) {
          currentDayList[i] = f + 1
          f = currentDayList[i]
        } else if (f >= currentDayNum) {
          currentDayList[i] = ''
        }
      }
    }
    this.setData({
      currentDayList: currentDayList
    })


    let currentDayList2 = this.data.currentDayList
    let currentDayList3 = []
    currentDayList2.forEach((item, index) => {
      let currentDayList1 = {}
      currentDayList1.day = item
      currentDayList3.push(currentDayList1)
    })
    this.setData({
      currentDayList1: currentDayList3
    })

    let currentNewDayList = []
    for (let i = 0; i < this.data.currentDayList.length; i++) {
      this.data.currentDayList.forEach((item, index) => {
        if (item == 1 || item == 2 || item == 3 || item == 4 || item == 5 || item == 6 || item == 7 || item == 8 || item == 9) {
          item = '0' + item
        }
        if (index == i) {
          currentNewDayList[i] = Y + '-' + m + '-' + item
        }
      })
    }

    this.setData({
      currentNewDayList
    })

    let currentDayList4 = this.data.currentDayList1
    this.data.currentNewDayList.forEach((item, index) => {
      currentDayList4.forEach((subItem, subIndex) => {
        if (index == subIndex) {
          subItem.date = item
        }
      })
    })
    this.setData({
      currentDayList1: currentDayList4
    })

    this.getDateInfo()
  },
  /**
   * 格式化日历信息
   */
  formatSingDate(){
    let currentNewDayList = this.data.currentDayList1
    let signInDateList = this.data.canSignList;
    // console.log(currentNewDayList, "currentNewDayList", signInDateList, "signInDateList")
    currentNewDayList.forEach((subItem, subIndex) => {
      signInDateList.forEach((item, index) => {
        // console.log('相等', subItem.date,item.date)
        if (subItem.date == item.date) {
          subItem.bgState = true;
          subItem.sign_type = item.sign_type;
          // console.log('相等')
          if (item.sign_type == 1) {
            subItem.corrState = true
            // corrState: false,
            // bgState: false
          }else if (item.sign_type == 2) {
            subItem.starState = true;
            subItem.corrState = true;
          }
        }


      })
    })
    this.setData({
      currentDayList1: currentNewDayList
    })
    let currentDayList2 = this.data.currentDayList1
    let i = 0
    // currentDayList2.forEach((subItem, subIndex) => {
    //   if (subItem.bgState) {
    //     subItem.queDay = i++
    //   }
    // })
    this.setData({
      currentDayList1: currentDayList2
    })
  },
  // 获取用户签到信息
  getDateInfo() {
   
    let options = this.data.options;
    const params={
      camp_times_id:options.id
      
    }
    network.request('getUserSignLog',params,res=>{
      // console.log("日历数据---",res)
      this.setData({
        canSignList: res.canSignList,
        signInfo: res.signInfo,
        incomeList: res.incomeList
      })
      res.incomeList.forEach(item=>{
        if (item.income_type==2){
          this.setData({
            bottomText:true
          })
        }
      })
      this.formatSingDate();
      setTimeout(() => { wx.hideLoading()},2000)
    })
  },
  /**
   * 生成海报
   */
  createBill() {
    let that = this
    let bill = that.data.dateInfo.shareInfo.sharePicturePerView
    // let bill = "https://task.zmedc.com/upload/20180927/044175aabb7c0669a0dad77c6fe5f58f_272392.png"
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { //这里是用户同意授权后的回调
              wx.downloadFile({
                url: bill,
                success: function (res) {
                  if (res.statusCode === 200) {
                    let img = res.tempFilePath
                    wx.saveImageToPhotosAlbum({
                      filePath: img,
                      success(result) {
                        that.setData({
                          billState: true
                        })
                      },
                      fail: res => {
                        wx.showToast({
                          title: '保存失败',
                          icon: 'fail',
                          duration: 2000
                        })
                      }
                    })
                  }
                }
              })
            },
            fail() { //这里是用户拒绝授权后的回调
              that.setData({
                saveImgBtnHidden: true,
                openSettingBtnHidden: false
              })
            }
          })
        } else { //用户已经授权过了
          // console.log('成功1111')
          wx.downloadFile({
            url: bill,
            success: function (res) {
              if (res.statusCode === 200) {
                let img = res.tempFilePath
                wx.saveImageToPhotosAlbum({
                  filePath: img,
                  success(result) {
                    that.setData({
                      billState: true
                    })
                  },
                  fail: res => {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'fail',
                      duration: 2000
                    })
                    console.log(res)
                  }
                })
              }
            }

          })
        }
      }
    })

  },
  handleSetting: function (e) {
    let that = this;
    // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      that.setData({
        saveImgBtnHidden: true,
        openSettingBtnHidden: false
      })
    } else {
      that.setData({
        saveImgBtnHidden: false,
        openSettingBtnHidden: true
      })
    }
  },
  /**
   * 获取用户信息
   */
  getUserInfo() {
    let userInfo = wx.getStorageSync('userinfo')
    var title = userInfo.nickName
    this.setData({
      title
    })
  },
  /**
   * 海报弹层显示/隐藏
   */
  showBill() {
    this.setData({
      billState: false
    })
  },
  /**
   * 跳答题页
   */
  kipQue(e) {
    let self = this
    let id = self.options.id;
    let title = e.currentTarget.dataset.activityTitle
    let day = e.currentTarget.dataset.day
    let sign_type = e.currentTarget.dataset.sign_type
    let corrState = e.currentTarget.dataset.corrState
    let bgState = e.currentTarget.dataset.bgState
    this.setData({
      // signEndState: true
    })
   
    let date = e.currentTarget.dataset.signDate;
    let path = `pages/training-answer/index?id=${id}&date=${date}&singType=${sign_type}`
    // id=timeslFAxXGQTsXIT&date=2019-12-20&singInDate=undefined
    // id = timeslFAxXGQTsXIT & date=2019 - 12 - 20 & singInDate=0
    this.setData({
      indexDay: day
    })
    let alertTitle = "";
    if (this.data.day > day || this.data.month < this.data.currentMon) {
      // this.setData({
      //   voVlue: '哎呀，今日漏签了~'
      // })
      alertTitle = '哎呀，今日漏签了~';
     
    } else if (this.data.day == day && this.data.month == this.data.currentMon) {
      alertTitle = '未签到哦~';
      // this.setData({
      //   voVlue: '未签到哦'
      // })
    } else if (this.data.day < day && this.data.month == this.data.currentMon) {
      alertTitle = '还未到签到日期哦~';
      // this.setData({
      //   voVlue: '还未到签到日期哦'
      // })
    }
    // 这里要注释begin
    // router.navigate({ path })
    // 这里要注释end

    if (corrState && bgState) {
      router.navigate({path})
    } else if (!corrState && bgState) {
      wx.showToast({
        title: alertTitle,
        icon: "none",
      })

    }
  }
})