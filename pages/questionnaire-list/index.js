// pages/questionnaire-list/index.js
const router = require('../../utils/router');
import getCode from "../../utils/getCode";
import network from '../../utils/network';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page_size:10,
    page_num:1,
    over:false,
    loading:false
  },
  // 获取问卷list
  getQuestionaireList(){
    if (this.data.loading) {
      return;
    }
    wx.showLoading({
      title: '数据加载中',
    })
    this.setData({
      loading: true
    })
    const params = {
      page_num: this.data.page_num,
      page_size: this.data.page_size
    }
    network.request('getQuestionaireList', params,res=>{
      console.log("问卷列表",res)
      if (res.list.length < params.page_size){
        this.setData({
          over:true
        })
      }
      const list = [...this.data.list, ...res.list]
      const page_num = params.page_num+1;
      this.setData({
        list,
        page_num,
        loading:false
      })
      wx.hideLoading();
    })
  },
  // 问卷预览详情
  goDetail(e){
    console.log(e.currentTarget)
    const questionnaire_code = e.currentTarget.dataset.questionnaire_code;
    router.navigate({
      path: `pages/questionnaire/index?questionnaire_code=${questionnaire_code}&is_preview=1`
    })
  },
  share(e){
    const questionnaire_code = e.currentTarget.dataset.questionnaire_code;
    const shareTiele = e.currentTarget.dataset.title;
    const shareImage = e.currentTarget.dataset.wx_share_pic||"";
    
    router.navigate({
      path:'pages/questionnaire-share/index',
      params:{
        questionnaire_code,
        shareTiele,
        shareImage
      }
    })
    console.log("分享",e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "调查问卷" })
    this.getQuestionaireList()
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
    let over = this.data.over;
    if (over) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return false;
    } else {
      this.getQuestionaireList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function (e) {
   
  //   console.log("分享", e.target.dataset.questionnaire_code)
  //   const questionnaire_code = e.target.questionnaire_code;
  //   const imageUrl = e.target.imageurl;
  //   // return;
  //   const obj = {
  //     title: this.options.shareTiele,
  //     imageUrl: this.options.shareImage,
  //     paramsFrom: { questionnaire_code },
  //     url: 'pages/questionnaire/index',
  //   }
  //   //       * paramsFrom: 参数
  //   //  * url: 分享路径
  //   //       * title: 分享title
  //   //         * imageUrl: 分享图片
  //   return network.share(obj);
  // }
})