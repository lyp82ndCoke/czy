//留言
import network from '../../utils/network.js';
const router = require('../../utils/router.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    isIpx: app.globalData.isIpx,
    commentlist:[],
    content:'',//输入的内容
    id:0,
    type:null,
    pageSize: 999,
    page: 1,
    hasMoreData: true,
    //悬浮控件参数
    musicFlex: false,
    musicPlay: true,
    music_id: 0,
    nowtime: '0:00',
    userPlaySecond: 0,
    audiotime: '0:00',
    courseTitle: '',
    scrollTopVal: -1,//悬浮框滚动显示、隐藏参数
    loadComplate: false,
    headerImg: '',
    title: {
      text: "留言",
      color: "#000",
      back: true,
      bgColor: "#fff"
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof options != 'undefined' && options.id) {
      this.setData({
        id: options.id,
        title: options.title,
        type: options.type,
      })
    }

    // this.getCommList()
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
    if (this.data.hasMoreData) {
      this.getCommList()
    } else {

    }
  },

 
//  评论加载完毕
  // 评论加载完毕
  commentOver() {
    this.setData({
      commentOver: true
    })
  },
  /**
   * 提交发布
   */
  publish:function(){
    const content = this.data.content;
    const id = this.data.id;
    const identify_type = this.data.type;
    if (content == ''){
      wx.showToast({ title: "发布内容不能为空", icon: "none"})
      return false
    }
    let is_repetition = 0
    this.data.commentlist.forEach(function(item){
      if (item.content == content){
        is_repetition = 1
      }
    })

    if (is_repetition == 1){
      this.showToast('您已提交过该评论')
      return false
    }
    
    const data={
      identify_id:id,
      identify_type,
      comment_contents: content
    }
    this.setData({
      loading: true
    })
    network.request('insertComment',data,res=>{
      wx.showToast({
        title:"发布成功",
        icon:"none"
      })
      this.setData({
        loading: false
      })
      setTimeout(()=>{
        router.navigateBack({back:true})
      },1000)
     
      
    },error => {
      this.setData({
        loading: false
      })
    })
    
    
  },
  /**
   * 监听发布内容
   */
  writeConntent:function(e){
    var content = e.detail.value
    this.setData({
      content: content
    })
  },


  /**
   * 获取评论列表
   */
  getCommList: function () {
    var that = this
    var data = {
      page: that.data.page,
      size: that.data.pageSize,
      article_id:that.data.id
    }
    // app.server.getJSON('edu_article_comment/my_list', data, function (res) {
    //   var contentlistTem = that.data.commentlist
    //   var results = res['results'];
    //   if (res.errorCode == 0) {
    //     if (that.data.page == 1) {
    //       contentlistTem = []
    //     }
    //   }
    //   var commentlist = results
    //   if (commentlist.length < that.data.pageSize) {
    //     that.setData({
    //       commentlist: contentlistTem.concat(commentlist),
    //       hasMoreData: false,
    //       loading: false
    //     })
    //   } else {
    //     that.setData({
    //       commentlist: contentlistTem.concat(commentlist),
    //       hasMoreData: true,
    //       page: that.data.page + 1,
    //       loading: false

    //     })
    //   }



    // });
  },

  /**
   * 刷新评论列表
   */
  refCommList:function(detail){
    var commentlist = this.data.commentlist
    commentlist.unshift(detail)

    this.setData({
      commentlist: commentlist
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
  /**
 * 评论点赞
 */
  prise: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var article_comment_id = that.data.commentlist[index].id
    var data = {
      article_comment_id: article_comment_id
    }
    if (that.data.commentlist[index].isPraise == 1) {
      that.data.commentlist[index].isPraise = 0
      that.data.commentlist[index].praiseCount -= 1
    } else {
      that.data.commentlist[index].isPraise = 1
      that.data.commentlist[index].praiseCount += 1

    }
    that.setData({
      commentlist: that.data.commentlist
    })
    app.server.postJSON('edu_article_comment/praise_comment', data, function (res) {

      if (res.errorCode == 0) {
        // var results = res.results
        // if (results.praiseType == 1) {
        //   that.data.commentlist[index].isPraise = 1
        //   that.data.commentlist[index].praiseCount += 1
        // } else {
        //   that.data.commentlist[index].isPraise = 0
        //   that.data.commentlist[index].praiseCount -= 1

        // }
        // that.setData({
        //   commentlist: that.data.commentlist
        // })
      } else {
        app.func.toast(res.errorStr)
      }
    })

  },

 
})