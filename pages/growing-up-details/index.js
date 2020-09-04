// pages/growing-up-details/index.js
const app = getApp();
import network from '../../utils/network';
import getCode from "../../utils/getCode";
import shareData from '../../utils/share.js';
const router = require("../../utils/router");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    detail: {},
    commentlist: [],
    page_size: 10,
    page_num: 1,
    commontShow:true,
    commentText:"",
    commentInputBottom:0,
    loadingBtn:true
  },

  problemList: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const growth_wall_id = options.growth_wall_id;
    this.setData({
      growth_wall_id,
      prevIndex: options.index
    })
    this.getDetails()
    this.getCommentList()
  },
  onShow: function(options) {
    if (this.data.back) {
      this.setData({
        commentlist: [],
        page_num: 1
      })
      this.getCommentList()
    }
   
  },
  // 获取成长墙详情
  getDetails() {
    const params = {
      growth_wall_id: this.data.growth_wall_id
    };
    network.request('GrouthwallDetails', params, res => {
      console.log("详情", res)
      this.setData({
        detail: res
      })
    })
  },
  /** 点赞 */
  postsPraise: function(event) {
    const identify_id = event.currentTarget.dataset.id;
    const index = event.currentTarget.dataset.index;
    const action_type = event.currentTarget.dataset.action_type == 1 ? 2 : 1;
    let params = {
      identify_type: 5,
      action_type,
      identify_id
    };
    network.request("likeAction", params, res => {
      const zans = `detail.is_zans`;
      const zanNum = `detail.zan_num`;
      // this.data.bbslist[index].is_zans = action_type;
      // action_type == 1 ? this.data.bbslist[index].zan_num++ : this.data.bbslist[index].zan_num--;
      this.setData({
        [zans]: res.is_zans,
        [zanNum]: res.zan_num
      })
      if (this.data.prevIndex!==undefined){
        this.bbslistZan(res);
      }
    })


  },
  // 裂变加点赞状态
  bbslistZan(res){
    let pages = getCurrentPages();
    let currPage = null; //当前页面
    let prevPage = null; //上一个页面
    if (pages.length >= 2) {
      currPage = pages[pages.length - 1]; //当前页面
      prevPage = pages[pages.length - 2]; //上一个页面
    }
    const index = this.data.prevIndex;
    const zans = `bbslist[${index}].is_zans`;
    const zanNum = `bbslist[${index}].zan_num`;
    if (prevPage) {
      prevPage.setData({
        [zans]: res.is_zans,
        [zanNum]:res.zan_num
      });
    }
  },
  //评论点赞
  commPraise(e) {
    const identify_id = e.currentTarget.dataset.id;
    const action_type = e.currentTarget.dataset.identify_type == 1 ? 2 : 1;
    const index = e.currentTarget.dataset.index;
    const identify_type = 6;
    network.request('likeAction', {
      identify_id,
      action_type,
      identify_type
    }, res => {
      const zans = `commentlist[${index}].is_zans`;
      const zanNum = `commentlist[${index}].zan_num`;
      this.setData({
        [zans]: res.is_zans,
        [zanNum]: res.zan_num
      })
    })
  },
  resetCommentList(){
    this.setData({
      page_num:1,
      over:false
    })
    this.getCommentList();
  },
  //获取评论列表 
  getCommentList(add) {
    // console.log('music_id', this.data.music_id)
    const formData = {
      page_num: this.data.page_num,
      identify_type: 5,
      identify_id: this.data.growth_wall_id,
      page_size: this.data.page_size,
    }
    network.request('getCourseComment', formData, data => {
      if (this.data.loading) {
        return false;
      }
      this.setData({
        loading: true
      })
      // 获取原始数据（列表已有数据）
      let list = this.data.commentlist;
      // 获取心情求的数据newData
      let newData = data.list;
      // console.log(list.length, this.data.page_size)
      if (newData.length < this.data.page_size) {
        this.triggerEvent('commentOver');
        this.setData({
          over: true
        });
      }
      let page_num = 2;
      // 如果是下拉请求更多的话  拼接原始数据
      if (add) {
        newData = list.concat(newData)
        page_num = this.data.page_num + 1;
      }
      // console.log(newData, "newData")


      // 如果新的数据小于当前分页数量 设置下拉数据以为空  over为true

      // console.log(this.data, "data")
      // 设置数据
      this.setData({
        page_num,
        commentlist: newData,
        loading: false,
      });
    })

  },
  // 显示评论弹层
  showCommon(){
    this.setData({
      commontShow: false
    })
  },
  // 隐藏评论弹层
  hideCommon(){
    this.setData({
      commontShow:true
    })
  },
  // 绑定评论数据
  commontChange(e){
    console.log(e.detail.value);
    const text = e.detail.value;
    this.setData({
      commentText: text
    })
    if (text.trim().length){
      this.setData({
        loadingBtn:false
      })
    }else{
      this.setData({
        loadingBtn: true
      })
    }
  },
  // 输入框获取焦点时
  focus(e){
    console.log("键盘高读", e.detail.height)
  //  this.setData({
  //    commentInputBottom: e.detail.height
  //  })
  },
  //输入框失去焦点时
  blur(){
    this.setData({
      commentInputBottom: 0
    })
  },
  // 发布评论
  release(){
    const commentText = this.data.commentText.trim();
    if (commentText.length){
      const comment_contents = this.data.commentText;
      const identify_id = this.data.detail.growth_wall_id;
      const identify_type = 5;
      const data = {
        identify_id,
        identify_type,
        comment_contents
      }
      this.setData({
        loadingBtn: true
      })
      network.request('insertComment', data, res => {
        wx.showToast({
          title: "发布成功",
          icon: "success"
        })
        this.setData({
          loadingBtn: false,
          commontShow:true,
          commentText:""
        })
        if(this.data.prevIndex!==undefined){
          this.addCommentNum()
        }
        this.resetCommentList()
        // this.setData


      }, error => {
        this.setData({
          loadingBtn: false
        })
      })

    }else{
      wx.showToast({
        title: '请输入评论内容',
      })
    }

  },
  // 成长墙列表增加评论数
  addCommentNum(){
    let pages = getCurrentPages();
    let currPage = null; //当前页面
    let prevPage = null; //上一个页面
    if (pages.length >= 2) {
      currPage = pages[pages.length - 1]; //当前页面
      prevPage = pages[pages.length - 2]; //上一个页面
    }
    const index = this.data.prevIndex;
    const str = `bbslist[${index}].comment_num`;
    console.log(index, prevPage.data.bbslist[index].comment_num)
    if (prevPage) {
      prevPage.setData({
        [str]: prevPage.data.bbslist[index].comment_num+1
      });
    }
    console.log(index, prevPage.data.bbslist[index].comment_num)

  },
  //写评论  版本升级 已废弃
  // writeBtn: function (e) {
  //   const id = this.data.growth_wall_id;
  //   const type = 5;
  //   const title = this.data.detail.details;
  //   router.navigate({
  //     path: `pages/publish/publish?id=${id}&title=${title}&type=${type}`
  //   })

  // },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.over) {
      wx.showToast({
        title: '已加载全部评论',
        icon: "none"
      })
    } else {
      this.getCommentList('add')
    }
  },
  // 页面转发
  onShareAppMessage: function (e) {
    const obj = {
      paramsFrom:{
        growth_wall_id: this.data.growth_wall_id
      }
    }
    return network.share(obj);
  },









})