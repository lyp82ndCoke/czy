const app = getApp();
import network from '../../utils/network';
import getCode from "../../utils/getCode";
import shareData from '../../utils/share.js';
const router = require("../../utils/router");
var imgShow,iszan=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_size: 10,
    page_num: 1,
    loginShow: false,
    loginWrapShow: false,
    isIpx: app.globalData.isIpx,
    zaning:false,


    // globalShow: 1,
    compelteLoding: false,
    btflag: 1,
    bbsShow: 1,
    isfold: true,
    page: 1,
    bbslist: [],
    bbslength: 0,
    haveBBS: false,
    msginfo: [],
  },
  problemList: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '数据加载中',
    })

    let unionid = wx.getStorageSync('unionid');
    if (unionid) {
      this.getPostsList();
      getCode.showMenuNotice();
    } else {
      getCode.login().then(res => {
        this.getPostsList();
        getCode.showMenuNotice();
      })
    }

    
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    
    if(this.data.back){
      wx.startPullDownRefresh();
      this.setData({
        back:false
      })
    }
    console.log('=====:外面', imgShow)
    if (imgShow) {
      imgShow = false;
      console.log('=====:里面', imgShow)
      return;
    }
    this.getLoginStatus() 
    // 兼容新用户授权后没有数据
    let unionid = wx.getStorageSync('unionid');
    if (unionid) {
      setTimeout(()=>{
        if (this.data.bbslist.length==0){
          this.getPostsList();
         
        }
      },1000)
    }
    
    
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
  // 跳转详情评论
  goDetail(e){
    const growth_wall_id = e.currentTarget.dataset.growth_wall_id, index = e.currentTarget.dataset.index;
    router.navigate({
      path: `pages/growing-up-details/index?growth_wall_id=${growth_wall_id}&index=${index}`
    })
  },

// 展开收起
  showDetail(e) {
    console.log(e.currentTarget.dataset.index)
    const index = e.currentTarget.dataset.index;
      this.data.bbslist[index]['isfold'] = !this.data.bbslist[index]['isfold'];
    this.setData({
      bbslist: this.data.bbslist
    });
  },
  // 防止图片缩小时候触发onshow事件
  imgClickShow() {
    console.log('==============onshow')
    imgShow = true;
  },
  //图片点击事件
  // imgYu: function(event) {
  //   var src = event.currentTarget.dataset.src; //获取data-src
  //   var imgList = event.currentTarget.dataset.list; //获取data-list
  //   console.log("srcsrc", src);
  //   console.log("event", event);
  //   console.log("imgListimgList", imgList);
  //   //图片预览
  //   wx.previewImage({
  //     current: src, // 当前显示图片的http链接
  //     urls: imgList // 需要预览的图片http链接列表
  //   })
    
  // },

  /** 点赞 */
  postsPraise: function(event) {
    
    const identify_id = event.currentTarget.dataset.id;
    const index = event.currentTarget.dataset.index;
    const action_type = event.currentTarget.dataset.action_type==1?2:1;
    let params = {
      identify_type:5,
      action_type,
      identify_id
    };
    network.request("likeAction",params,res=>{
      const zans = `bbslist[${index}].is_zans`;
      const zanNum = `bbslist[${index}].zan_num`
      // this.data.bbslist[index].is_zans = action_type;
      // action_type == 1 ? this.data.bbslist[index].zan_num++ : this.data.bbslist[index].zan_num--;
      this.setData({
        [zans]: res.is_zans,
        [zanNum]: res.zan_num
      })
    },error=>{
      
    })
   

  },
  /** 获取点赞数字 和 图标 */
  getPraiseInfo: function(postsLocal) {
    var praiseInfo = {};
    praiseInfo['praiseLabel'] = postsLocal['praiseCount'] > 0 ? postsLocal['praiseCount'] : "点赞";
    praiseInfo['praiseImg'] = postsLocal['isPraise'] > 0 ? "../../img/zan_red.png" : "../../img/zan_gray.png";
    return praiseInfo;
  },
  // 获取心得列表数据
  getPostsList: function() {
    if(this.data.isLoading){
      return
    }
    this.setData({
      isLoading:true
    })
    var that = this;
    var params = {};
    params['page_num'] = that.data.page_num;
    params['page_size'] = that.data.page_size;
    wx.showLoading({
      title: '数据加载中',
    })
    network.request('GrouthwallList', params, res => {
      let rsults = res.list;
      rsults.forEach(item => {
        item['isfold'] = true;
        let contentLength = 0;
        if (item['details']) {
          contentLength = item['details'].length;
          if (item['details'].indexOf("\n")) {
            // 统计换行次数 超过7行就显示全部
            var contentN = item['details'].split("\n").length - 1;
            if (contentN > 0) {
              contentLength += contentN * 25;
            }
          }
          item.contentLength = contentLength;
        }
      })
      if (rsults.length < this.data.page_size) {
        that.setData({
          over: true,
        })
      }
      let list;
      if(this.data.page_num>1){
        list = [...this.data.bbslist, ...rsults]
      }else{
        list = rsults
      }
      that.setData({
        bbslist: list,
        compelteLoding: true,
        isLoading: false
      });
      wx.stopPullDownRefresh();
      wx.hideLoading()
    }, error => {
      this.setData({
        isLoading: false
      })
      wx.stopPullDownRefresh();
    })

  },
  // 下拉刷新页面
  onPullDownRefresh() {
    
    this.setData({
      page_num: 1,
      over: false
    })
    this.getPostsList();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(this.data.over){
      wx.showToast({ title:"没有更多了",icon:"none"})
      return;
    }
    this.setData({
      page_num: this.data.page_num + 1
    });
    // wx.showToast('正在刷新数据...');
    this.getPostsList();
  },

  sendInfoMsg: function() {
    wx.navigateTo({
      url: '../../pages/growing-up-add/index',
    })
  },
  // 客服消息
  handleContact(e){
    network.logsRequest({ apiparam: "", apipath:"contact_button/grow_up"},data=>{
      console.log("log日志")
    })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (e) {
    return network.share();
  },
})