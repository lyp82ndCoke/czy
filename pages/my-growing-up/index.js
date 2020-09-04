import network from '../../utils/network';
const router = require('../../utils/router.js');
const app = getApp();
let imgShow;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    userinfo: {},
    btflag: 2,
    isfold: true,
    over:false,
    isLoading:false,
    page_size: 10,
    page_num:1,
    bbslist: [],
    problemList: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: "我的成长墙" })
    const userinfo = wx.getStorageSync("userinfo");
    
    if (userinfo){
      this.setData({
        userinfo
      })
      
      this.getPostsList();
    }else{
      this.getInfo();
    }
    

    // this.getInfo();
    //var bbslength = this.data.bbslength||0;
  },
  // 获取成长墙list
  getPostsList: function () {
    if (this.data.isLoading) {
      return
    }
    wx.showLoading({
      title: '数据加载中',
    })
    this.setData({
      isLoading: true
    })
    var that = this;
    var params = {};
    
    params['page_num'] = that.data.page_num;
    params['is_self'] = 1;
    params['page_size'] = that.data.page_size;
    network.request('GrouthwallList', params, res => {
      let rsults = res.list;
      rsults.forEach(item => {
        item['isfold'] = true;
        let contentLength = 0;
        if (item['details']) {
          contentLength = item['details'].length;
          if (item['details'].indexOf("\n")) {
            // 统计换行次数 超过7次就显示全部
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
      let bbslist;
      if (that.data.page_num>1){
        bbslist = [...this.data.bbslist, ...rsults];
      }else{
        bbslist = rsults;
      }
      that.setData({
        bbslist,
        isLoading: false
      });
      wx.hideLoading()
      wx.stopPullDownRefresh()

    }, error => {
      this.setData({
        isLoading: false
      })
      wx.stopPullDownRefresh()
    })

  },
  getInfo: function () {
    network.request('getUserInfo', {}, data => {
      console.log("data--",data)
      this.setData({
        userinfo: data
      })
      wx.setStorageSync("userinfo", userinfo);
      this.getPostsList();
    }, err => {
      console.log(err)
    })
  },
  
  onShow: function () {
    if (this.data.back) {
      wx.startPullDownRefresh();
      this.setData({
        back: false
      })
    }
    if (imgShow) {
      imgShow = false;
      return;
    }

    //this.onLoad();
  },
  // 成长墙详情
  goDetail(e){
    const growth_wall_id = e.currentTarget.dataset.growth_wall_id;
    const index = e.currentTarget.dataset.index;
    router.navigate({
      path: `pages/growing-up-details/index?growth_wall_id=${growth_wall_id}&index=${index}`
    })
  },
  
  //图片点击事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    console.log("srcsrc", src);
    console.log("event", event);
    console.log("imgListimgList", imgList);
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
      imgShow=true
  },
  /** 删除 */
  postsDel: function (e) {
    const that = this;
    wx.showModal({
      title: '确定要删除吗',
      success(res){
        if (res.confirm) {
          console.log(e)
          const index = e.currentTarget.dataset.index;
          const growth_wall_id = e.currentTarget.dataset.id;
          
          network.request('delGrouthWall', { growth_wall_id},res=>{
            that.data.bbslist.splice(index,1);
            that.setData({
              bbslist: that.data.bbslist
            })
          })
        } else if (res.cancel) {
        }

      }
    })

    


  },
  /** 点赞 */
  postsPraise: function (event) {
    const identify_id = event.currentTarget.dataset.id;
    const index = event.currentTarget.dataset.index;
    const action_type = event.currentTarget.dataset.action_type == 1 ? 2 : 1;
    let params = {
      identify_type: 5,
      action_type,
      identify_id

    };
    network.request("likeAction", params, res => {
      console.log('点赞成功', res)
      const str = `bbslist[${index}].is_zans`;
      const zanNum = `bbslist[${index}].zan_num`;
      this.setData({
        [str]: res.is_zans,
        [zanNum]:res.zan_num
      })
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
  /** 获取点赞数字 和 图标 */
 
  // 获取心得列表数据
  // 页面上拉刷新
  onPullDownRefresh(){
    this.setData({
      page_num:1,
      over:false
    })
    this.getPostsList();

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.over){
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
      })
      return
    }
    this.setData({
      page_num: this.data.page_num + 1
    });
    this.getPostsList();
  },


  sendInfoMsg: function () {
    wx.navigateTo({
      url: '../../pages/growing-up-add/index',
    })
  },

})
