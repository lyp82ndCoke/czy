// pages/course/index.js
const router = require('../../utils/router');
import getCode from "../../utils/getCode";
import network from '../../utils/network';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginShow: false,
    loginWrapShow: false,
    isIpx: app.globalData.isIpx,
    navHeight: app.globalData.navHeight,
    currentIndex: 0,
    page_size: 10,
    firstPage_num: 1,
    secondPage_num: 1,
    firstOver: false,
    firstLoading: false,
    secondLoading: false,
    secondOver: false,
    firstList: [],
    secondList: [],
    requestLock: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    })
    this.initData()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    this.getLoginStatus();
    this.setData({
      // firstList: [],
      // secondList: [],
      firstPage_num: 1,
      secondPage_num: 1,
      firstOver: false,
      secondOver: false,
    })
    // 加请求锁防止连续请求两次 getUnionid 接口产生垃圾数据
    if (this.data.requestLock) {
      this.initData()
    } else {
      this.setData({requestLock: true})
    }
  },
  initData() {
    let unionid = wx.getStorageSync('unionid');
    if (unionid) {
      this.getAllCampData()
      this.getUserCampTimesList()
      getCode.showMenuNotice()
    } else {
      getCode.login().then(res => {
        this.getAllCampData()
        this.getUserCampTimesList()
        getCode.showMenuNotice()
      })
    }
  },
  // 跳转课程详情
  goCourseList(e) {
    console.log(e.currentTarget)
    const spec_column_id = e.currentTarget.dataset.spec_column_id;
    const camp_times_id = e.currentTarget.dataset.camp_times_id;
    const type = e.currentTarget.dataset.type;
    const is_enable = e.currentTarget.dataset.is_enable
    if (type == 1) {
      // 训练营专栏
      router.navigate({
        path: `pages/course-list/index?camp_times_id=${camp_times_id}&spec_column_id=${spec_column_id}`
      })
    } else if (type == 2) {
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

    } else if (type == 3) {
      // 免费课程专栏
      router.navigate({
        path: `pages/my-course-list/index?spec_column_id=${spec_column_id}`
      })
    }


    // router.navigate({
    //   path: `pages/course-list/index?spec_column_id=${spec_column_id}&camp_times_id=${camp_times_id}`

    // })
  },
  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 2
      this.setData({
        currentIndex: currentPageIndex
      })
      if (currentPageIndex == 1) {
        this.logs()
      }
    }
  },
  //用户点击tab时调用
  titleClick: function (e) {
    let currentIndex = e.currentTarget.dataset.idx;
    if (currentIndex == 1) {
      this.logs()
    }
    this.setData({
      //拿到当前索引并动态改变
      currentIndex
    })
  },
  logs() {
    network.logsRequest({ apipath: "page_button/all_prod_list", apiparam: "" })
  },
  // 去任务日历页
  goTaskCalendar(e) {
    const id = e.currentTarget['dataset'].id;
    router.navigate({
      path: `pages/match-task-calendar/index?camp_times_id=${id}`
    })
  },
  // 去签到记录
  goSign(e) {
    const id = e.currentTarget.dataset.id;
    router.navigate({
      path: `pages/training-check-in/index?id=${id}`
    })
  },
  goEvaluation(e) {
    const id = e.currentTarget.dataset.id;
    router.navigate({
      path: `pages/evaluation-list/index?id=${id}`
    })
  },
  // 获取正在参加的训练营
  getUserCampTimesList(add) {
    if (this.data.firstLoading) {
      return false;
    }
    this.setData({
      firstLoading: true
    })
    const formData = {
      page_num: this.data.firstPage_num,
      page_size: this.data.page_size,
    }
    network.request('getUserCampTimesList', formData, data => {
      let list = this.data.firstList;
      console.log(data, "data")
      let newData = data.list;
      if (newData.length < this.data.page_size) {
        this.setData({
          firstOver: true
        })
      }
      if (formData.page_num > 1) {
        newData = list.concat(newData)
      }
      let page_num = this.data.firstPage_num + 1;
      console.log(page_num)
      this.setData({
        firstPage_num: page_num,
        firstList: newData,
        firstLoading: false
      })
      wx.hideLoading();
    }, error => {
      this.setData({
        firstLoading: false
      })
    })

  },
  // 获取所有训练营
  getAllCampData(add) {
    if (this.data.secondLoading) {
      return false;
    }
    this.setData({
      secondLoading: true
    })
    const formData = {
      page_num: this.data.secondPage_num,
      page_size: this.data.page_size
    }
    network.request('getAllCampData', formData, data => {
      let list = this.data.secondList;
      let newData = data;
      if (newData.length < this.data.page_size) {
        this.setData({
          secondOver: true
        })
      }
      if (formData.page_num > 1) {
        newData = list.concat(newData)
      }
      let page_num = this.data.secondPage_num + 1;
      this.setData({
        secondPage_num: page_num,
        secondList: newData,
        secondLoading: false
      })
    }, error => {
      this.setData({
        secondLoading: false
      })
    })
  },
  // 获取当前授权状态
  getLoginStatus() {
    getCode.loginShow().then(res => {
      this.setData({
        loginWrapShow: res
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
    console.log(222)
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 客服消息
  handleContact(e) {
    network.logsRequest({ apipath: "contact_button/item_info", apiparam: e.currentTarget.dataset.all_camp_id }, data => {
      console.log("log日志")
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   if (this.data.currentIndex) {
  //     this.setData({
  //       secondPage_num: 1,
  //       secondOver: false
  //     })
  //     this.getAllCampData()
  //   } else {
  //     this.setData({
  //         firstPage_num: 1,
  //       firstOver: false
  //     })
  //     this.getUserCampTimesList();
  //   }
  // },
  // 上拉触底事件
  onScrollEnd() {
    if (this.data.currentIndex == 0) {
      console.log("触底了")
      let over = this.data.firstOver;
      console.log(over)
      if (over) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
        return false;
      } else {
        this.getUserCampTimesList('add');
      }
    } else {
      let over = this.data.secondOver;
      if (over) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
        return false;
      } else {
        // this.getAllCampData('add');
      }
    }
  }
})