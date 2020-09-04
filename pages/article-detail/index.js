// pages/course-details/index.js
import network from '../../utils/network';
const router = require('../../utils/router.js');
import shareData from '../../utils/share.js';
import getCode from "../../utils/getCode";
const WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
let interval, messageInterval;
const animation = wx.createAnimation({
  duration: 200,
  timingFunction: "linear",
  delay: 0,
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    shareText: "",
    topShow: false,
    formData:{
      article_id:'',
      article_type:''
    }
    
  },
  

  // 可改成获取文章或群聊详情
  getDetail() {
    network.request('getArticleDesc', this.data.formData, data => {
     
      console.log(data)
      if (data.content){
        WxParse.wxParse('content', 'html', data.content, this, 0);
        // let content = data.content.replace(/\<img/gi, '<img width="100%" ');
        // data.content = content;
      }
      this.setData({
        details: data
      })
      wx.stopPullDownRefresh();
      // const content = data.content.replace('<img', '<img style="max-width:100%;height:auto" ') ;
      // console.log(content,'content')
    
      // WxParse.wxParse('article', 'html', this.data.details.content, this);
    }, err => {
      wx.stopPullDownRefresh();
    })
  },
  // 收藏和取消收藏
  collect(e) { 
    let action_type=e.currentTarget.dataset.collect;
    action_type= (action_type == 1 ? 2 : 1);
    console.log('action_type', action_type)
    const formData = {
      identify_id: this.data.formData.article_id,
      identify_type: this.data.formData.article_type,
      action_type,
    }
    network.request('collectAction',formData,data=>{
      const collect = "details.is_collect";
      const collectNum = "details.collect_num";
        console.log(action_type,'action_type')
        this.setData({
          [collect]: data.is_collects,
          [collectNum]: data.collect_num
        })
    })
  },
  // 点赞
  like(e){
    let action_type = e.currentTarget.dataset.like;
    action_type = (action_type == 1 ? 2 : 1);
    const formData = {
      identify_id: this.data.formData.article_id,
      identify_type: this.data.formData.article_type,
      action_type,
    }
    network.request('likeAction', formData, data => {
      const like = "details.is_zan";
      const likeNum = "details.zan_num";
      this.setData({
        [like]: data.is_zans,
        [likeNum]: data.zan_num
      })
    })
  },
  // 评论加载完毕
  commentOver() {
    this.setData({
      commentOver: true
    })
  },
  // 触底
  onReachBottom: function () {
    if (this.data.commentOver) {
      // wx.showToast({
      //   icon: 'success',
      //   title: '已加载全部',
      // })
    } else {
      this.selectComponent("#comment").getList("add");
    }

  },
  // 回到顶部
  goTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  // 阻止冒泡
  stop() {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    console.log("详情onload：", options);
    const formData = {
      article_type: options.type,
      article_id:options.id,
    }
    this.setData({
      formData
    })
    this.getDetail();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.selectComponent("#comment").getList();
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(messageInterval);
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
    this.getDetail();
  },

  // 滚动事件
  onPageScroll(e) {
    if (e.scrollTop > 300 && !this.data.topShow) {
      this.data.topShow = true;
      this.setData({
        topShow: this.data.topShow
      })
    } else if (e.scrollTop < 300 && this.data.topShow) {
      this.data.topShow = false;
      this.setData({
        topShow: this.data.topShow
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    const obj = {
      title: this.data.details.title, paramsFrom: { id: this.data.details.article_id, type: this.data.details.article_type }, imageUrl:this.data.details.share_picture
    }
    return network.share(obj);
  }
})