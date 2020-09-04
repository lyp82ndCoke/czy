// pages/training-answer/index.js
const router = require('../../utils/router');
import network from '../../utils/network';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    "signInfo": {
      
    },
    "todayList": [], //问题列表
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imageList: [], //广告列表
    swiperCurrent: 0, //轮播图当前的下标
    pupState: false, //弹窗状态
    iosState: false,

    ids: [], //题目ids
    idsArr: [], //去重后题目的ids
    questionIds: [],
    optionIds: [],
    resState: false, //提交状态
    subState: false,
    hehState: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "答题签到" })
    // wx.hideShareMenu() //隐藏右上角的分享
    wx.showLoading({
      title: '加载中...',
    })
    // console.log(options, options)
    if (options.singType){
      this.setData({
        resState:true
      })
    }
    this.getSystemInfo() //系统信息
    this.setData({
      options
    })
    this.getTodayList()
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
    let that = this
    // that.getImageList()
    if (that.data.imageList.length == 1) {
      that.setData({
        indicatorDots: true
      })
    }
    // if (that.data.options.singInDate) {
    //   that.setData({
    //     resState: true
    //   })
    // }


    // setTimeout(function () {
    //   wx.createSelectorQuery().selectAll(".que-start").boundingClientRect().exec(
    //     function (res) {
    //       res[0].forEach((item, index) => {
    //         that.setData({
    //           queHeight: item.height + 50 + 'rpx',
    //         })
    //       })
    //       console.log(that.data.heightArr)
    //     }
    //   )
    // }, 200)

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
  
  // 单选
  single(e) {
    console.log("单选", e)
    const qIndex = e.currentTarget.dataset.qindex;
    const aIndex = e.currentTarget.dataset.aindex;
    const aId = e.currentTarget.dataset.aid;
    let todayList = this.data.todayList;
    todayList[qIndex].answerList.forEach(item => {
      if (item.answer_id == aId) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
    this.setData({
      todayList: this.data.todayList
    })
  },
  /**
   * 多选状态
   */
  check(e) {
    console.log("多选", e)
    // 问题id
    let questionId = e.currentTarget.dataset.questionId

    let optionId = e.currentTarget.dataset.optionId
    let activityQuestionId = e.currentTarget.dataset.activityQuestionId
    let checked = e.currentTarget.dataset.checked
    const qIndex = e.currentTarget.dataset.qindex;
    const aIndex = e.currentTarget.dataset.aindex;
    const aId = e.currentTarget.dataset.aid;
    const qId = e.currentTarget.dataset.qid;
    let todayList = this.data.todayList
    todayList[qIndex].answerList[aIndex].checked = !todayList[qIndex].answerList[aIndex].checked;
    this.setData({
      todayList: this.data.todayList
    })
    
  },
  // 显示提交答案弹框
  alertSubmit() {
    let bool = true;
    let todayList = this.data.todayList;
    let questionList = [];
    todayList.forEach((item, index) => {
      let data = {
        question: {
          question_id: item.question.question_id
        },
        answerList: []
      }

      item.answerList.forEach((subItem, subIndex) => {
        let subData = {}
        console.log(subItem)
        if (subItem.checked) {
          subData = {
            answer_id: subItem.answer_id,
            option_type: subItem.option_type,
            option_sort: subItem.option_sort,
          }
          data.answerList.push(subData)
        }

      })
      if (data.answerList.length === 0) {
        wx.showToast({
          title: '题目没有答完，请继续答题！',
          icon: "none"
        })
        bool = false;
        return false;
      }
      questionList.push(data)
      // questionList.push = item.question.question_id;
    })
    console.log(questionList)
    if (bool) {
      this.setData({
        pupState: bool,
        questionList
      })
    }
  },
  // 提交答案
  submitAnswer() {
    wx.showLoading({
      title: '提交中',
      mask:true
    })
    const params = {
      camp_times_id:this.data.options.id,
      questionList:this.data.questionList,
      // 要注释begin
      // date:this.data.options.date
      // 要注释end
    };
    const id = this.options.id;
    network.request('submitAnswer', params, res => {
      console.log(res)
      wx.hideLoading()
      let text = "";
      if (res.account_type==2){
        text = "签到成功获1颗星星\r\n明天继续哦~";
      } else if (res.account_type == 1){
        text = "签到成功未获星星\r\n明天继续哦~";
      }
      // if (res.income_list.length){
      //   text = `签到成功获${res.star_num}颗星星`;
      //   res.income_list.forEach(item=>{
      //     if (item.income_type==1){
      //       text =`${text}已获得${res.income_list[0].income_amount / 100}元优惠券`
      //     } else if (item.income_type == 2){
      //       text = `${text}已获得押金返还`
      //     }
      //   })
      // }
      console.log(getCurrentPages(), "页面栈")
      const pages = getCurrentPages();
      const lastPage = pages[pages.length-2].route;
      console.log(pages[pages.length-1].route,"页面")
      if (lastPage == "pages/training-check-in/index"){
        // 从签到日历来的
        router.navigateBack({ backText: text })
      }else{
        // 从我的签到来的
        router.redirect({
          path: `pages/training-check-in/index?id=${id}&text=${text}`
        })
      }
      
     
      
    })
  },
  /**
   * 获取多选的内容
   */
  
  /**
   * 指示点索引切换
   */
  swiperChange: function (e) {
    let current = e.detail.current;
    this.setData({
      swiperCurrent: current,
    });
  },
  
  /**
   * 关闭弹窗
   */
  closePup() {
    this.setData({
      pupState: false
    })
  },
  /**
   * 获得设备信息
   */
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success(res) {
        let system = res.system
        if (system.indexOf('iOS') != -1) {
          self.setData({
            iosState: true
          })
        }
      }
    })
  },
  /**
   * 问题列表
   */
  getTodayList() {
    let params = {
      camp_times_id: this.data.options.id,
      date: this.data.options.date
    }
    network.request('getQuestionByDate', params, res => {
      console.log("题目", res)
      if (res.signInfo.today_is_sign==1){
        this.setData({
          resState:true
        })
      }
      this.setData({
        signInfo: res.signInfo,
        todayList: res.questionAnswerList,

      })
      wx.hideLoading()
    },err=>{

    })
    

  },
  /**
   * 广告列表
   */
  getImageList() {
    app.server.getJSON('edu_ad_image/list', {
      show_type: 8
    }, res => {
      this.setData({
        imageList: res.results
      })
    })
  },
  
})