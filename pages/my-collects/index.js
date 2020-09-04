// 我的收藏
import network from '../../utils/network';
const router = require('../../utils/router.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    //收藏列表配置项
    list: [],
    page: 1,
    pageSize: 10,
    hasMoreData: true,
    firstListLength: 0,
    loadComplete: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({ title: "我的收藏" })
    //首页列表
    // this.allListData();
  },
  // 事件处理函数
  collectionDetail: function(e) {
    const id = e.currentTarget.dataset.id
    const type = e.currentTarget.dataset.type;
    router.navigate({
      path: `pages/article-detail/index?id=${id}&type=${type}`
    })


  },
  //首页列表
  allListData: function() {
    if(this.data.loading){
      return 
    }
    this.setData({
      loading:true
    })
   
    const params = {
      page_num: this.data.page,
      page_size: this.data.pageSize
    };
    network.request("getUserCollectList",params,res=>{
      const page = this.data.page+1;
      if (res.length < params.size){
        this.setData({
          over:true
        })
      }
      const list = [...this.data.list,...res];
      this.setData({
        page,
        list,
        loading:false
      })
      wx.hideLoading()
    },err=>{
      this.setData({
        loading: false
      })
    })
  },
  

  //用户上拉列表触底
  onReachBottom: function() {
   if(this.data.over){
     wx.showToast({
       title: '没有更多了',
       icon:'none'
     })
   }else{
     this.allListData()
   }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '数据加载中',
    })
    this.setData({
      list:[],
      page:1
    })
    this.allListData();
  },

  


 
})