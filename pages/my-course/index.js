// 我的课程
import network from '../../utils/network';
const router = require('../../utils/router.js');
import getCode from "../../utils/getCode";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 授权登录弹框
    loginShow: false,
    loginWrapShow: false,

    isIpx: app.globalData.isIpx,
    page_num:1,
    page_size:10,
    list: [],


    link: true, //控制路由重复跳转的控制参数
    btflag: 3, //导航默认为我的课程
    courseList: [],

    //悬浮控件参数
    musicFlex: false,
    musicPlay: true,
    music_id: 0,
    nowtime: '0:00',
    userPlaySecond: 0,
    audiotime: '0:00',
    spec_column_title: '',
    scrollTopVal: -1, //悬浮框滚动显示、隐藏参数
    loadComplate: false,
    headerImg: '',

    //文案参数
    copyWriImg: '',
    copyWriTitle: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "我的课程" })
    wx.showLoading({
      title: '数据加载中',
    })
    let unionid = wx.getStorageSync('unionid');
    if (unionid) {
      this.getCourseList();
      this.getLoginStatus()
    } else {
      getCode.login().then(res => {
        this.getCourseList();
        this.getLoginStatus()
      })
    }
    
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
  // 获取授权状态
  getLoginStatus() {
    getCode.loginShow().then(res => {
      if (res) {
        this.setData({
          loginShow: res,
          loginWrapShow: true
        })
      } else {
        this.setData({
          loginShow: res,
          loginWrapShow: false
        })
      }
    })
  },
  // 全局唤醒授权点击框
  loginShow() {
    console.log("333")
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
  },
  // 取消授权
  cancelLogin() {
    this.setData({
      loginShow: false
    });
  },



  //获取课程训练营列表
  getCourseList(add) {
    if(this.data.loading){
      return
    }
    this.setData({
      loading:true
    })
    const params = {
      page_size: this.data.page_size,
      page_num: this.data.page_num
    }
    const page_num = this.data.page_num+1;
    network.request('myColumnList',params,res=>{
      console.log(res)
      let list =this.data.list;
      if (res.list.length<this.data.page_size){
        this.setData({over:true})
      }
      let newList = [...list,...res.list];
      this.setData({
        list:newList,
        page_num,
        loading: false
      })
      wx.hideLoading()
    },err=>{
      this.setData({
        loading: false
      })
    })
  },
  // 触底加载更多
  onReachBottom() {
    console.log("触底了")
    let over = this.data.over;
    if (over) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return false;
    } else {
      this.getCourseList();
    }
  },
  //跳转
  gotoModular: function (e) {
    const type = e.currentTarget.dataset.type;
    const spec_column_id = e.currentTarget.dataset.spec_column_id;
    const camp_times_id = e.currentTarget.dataset.camp_times_id;
    const is_enable = e.currentTarget.dataset.is_enable;
    const index = e.currentTarget.dataset.index;
    if (type == 1) { 
      // 训练营专栏
      router.navigate({
        path: `pages/course-list/index?camp_times_id=${camp_times_id}&spec_column_id=${spec_column_id}`
      })
    }else if(type==2){
      // 赠送课程专栏
      console.log(is_enable, "is_enable")
      if (is_enable) {
        router.navigate({
          path: `pages/course-list/index?camp_times_id=${camp_times_id}&spec_column_id=${spec_column_id}&is_enable=${is_enable}`
        })
      } else {
        router.navigate({
          path: `pages/my-course-list/index?camp_times_id=${camp_times_id}&spec_column_id=${spec_column_id}`
        })
      }
    } else if (type == 3){
      // 免费课程专栏
      router.navigate({
        path: `pages/my-course-list/index?spec_column_id=${spec_column_id}`
      })
    }
    if (this.data.list[index].is_show_notice){
      const str = `list[${index}].is_show_notice`;
      this.setData({
        [str]:0
      })

    }
    
  },

  //处理重复跳转
  link: function (url, that) {
    if (that.data.link == true) {
      that.setData({
        link: false
      }, function () {
        wx.navigateTo({
          url: url,
          complete: function () {
            that.setData({
              link: true
            })
          }
        })
      })

    } else {
      return;
    }
  },

  //音频悬浮窗按钮控件
  musicPlay: function () {
    app.AudioManagerOverAllmusicPlay(this)
  },

  //悬浮上拉下拉
  onPageScroll: function (e) {
    // app.showAudioFrame(e, this);
  },

  //关闭即隐藏
  musicClosed() {
    app.closeMusicPlayer(this)
  },

  //悬浮标题点击跳详情页
  gotoDetail: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var course_id = e.currentTarget.dataset.course_id;
    wx.navigateTo({
      url: '../course_detail/course_detail?id=' + id + "&course_id=" + course_id + "&audioType =1",

    })
  },
  // 转发
  // onShareAppMessage: function (res) {
  //   return app.commonShare(res)
  // },
})