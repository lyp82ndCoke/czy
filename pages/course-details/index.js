// pages/course_dtl/course_dtl.js
/**
 *  赵冬修改于2019/2/19
 */
import network from '../../utils/network';
const router = require("../../utils/router");
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
let backgroundAudioManager = wx.getBackgroundAudioManager();
let VideoContext  = wx.createVideoContext("video")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
   
    detail:{
      // "course_id": "courselXJkPOxA2267",
      // "audio_title": "测试音频111",
      // // "audio_url": "https://dw-xiaochengxu.oss-cn-beijing.aliyuncs.com/00029abc5540ad96943489893d105515.mp3",
      // "audio_url":"https://small-programs.oss-cn-beijing.aliyuncs.com/zuoye/25d241ad943349e66108bb63059d19ec.mp4",
      // "audio_length": 133,
      // "course_details": "测试音频简介111",
      // "type": 2,
      // "create_time": "2019-10-24",
      // "create_real_name": null,
      // "play_num": 1,
      // "format_audio_length": "02:13",
      // "last_song_course_id": null,
      // "next_song_course_id": "courselMF0PJEHr57O"


    },
    userPlaySecond: 0,
    userPlayTotal: 0,
    page_num:1,
    page_size:10,



    // preMusicShow: true,
    // nexMusicShow: true,
    // height: '250rpx',
    // start: true,
    // playEnd: false, //false:没有播放完
    // perCentage: 0, //播放百分比
    // value: 0,
    // max: 248,
    // page: 1,
    // pageSize: 10,
    // hasMoreData: true,
    // commentlist: [],
    // commentType: 'new',
    // hidden_bottom: false,
    // nowtime: '0:00',
    // duration: 0,
    // display: 'fixed',
   
    
    // focus: false,
    // is_more: false,
    // commTotal: 0,
    // maxValue: 1000,
    // headerImg: '', //头图
    placeholderMsg:'说点什么',
    commontShow: true,
    loadingBtn: true,
    countWinnow_num:0,
    isFirst:true,
    pre:0
  },
  //  视频加载错误
  videoError(){
    wx.showToast({
      title: '视频加载错误，请稍后再试',
      icon:"none",
      duration:3000
    })
  },

  onShow: function () {
    if(this.data.back){
      this.setData({
        commentlist: [],
        page_num: 1
      })
      this.getCommentList()
    }

    // var that = this
    // var animation = wx.createAnimation({
    //   duration: 400,
    //   timingFunction: 'ease',
    // })
    // this.animation = animation

    // this.setData({
    //   animationData: this.animation.export()
    // })

    // app.getSuspend(this)

    // app.AudioManagerOverAllInit(this,
    //   //播放
    //   function () { },
    //   //更新
    //   function () { },
    //   //结束
    //   function () {
    //     that.getCommentList('new')
    //   }
    // )
    // var headerImg = app.headerImg
    // this.setData({ headerImg: headerImg })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options
    })
    
    this.getDetail()

    // var that = this
    // var id = options.id //音频id
    // var course_id = options.course_id //核心课id
    // var audioType = options.audioType //资源类型
    // var playAudioUrl = options.playAudioUrl //音频路径
    // var playVideoUrl = options.playVideoUrl //视频路径
    // var headerImg = options.headerImg //头图
    // if (typeof headerImg != 'undefined') {
    //   that.setData({
    //     headerImg: headerImg
    //   })
    // }
    // console.log(that.data.headerImg + "写评论OonLoad")
    // app.headerImg = that.data.headerImg
    // console.log(options)
    // that.setData({
    //   music_id: id,
    //   course_id: course_id
    // })

    // //全局变量赋值
    // app.globalData.course_content_id = id;
    // app.globalData.user_course_id = course_id;

    // //如果id大于0给全局变量id赋当前id
    // if (id > 0 && id != app.globalData.course_content_id) {

    //   //如果不是当前播放  seek值为0  从头播放
    //   globalCourseAudioManager.seek(0);

    // } else {

    //   //再次进入依旧是当前播放，seek从指定时间点播放
    //   globalCourseAudioManager.seek(app.globalData.play_second);

    // }
    // if (audioType == 2) {
    //   that.getVideoDetails(id)
    //   app.AudioManagerOverAllPause(that)
    // } else {
    //   that.getDetail(id)
    // }
    // that.getCommentList('new')

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.autoPlay();
    
    
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  //设置音频时间
  // setPlatSecond: function (cb) {
  //   backgroundAudioManagerOverAll.onTimeUpdate((e) => {
  //     console.log('播放着：', e)
  //   })
  //   var that = this
  //   var value = app.globalData.play_second;
  //   var user_course_id = that.data.course_id //核心课id
  //   var course_content_id = that.data.id //音频id
  //   var data = {
  //     user_course_id: user_course_id,
  //     course_content_id: course_content_id,
  //     play_second: value
  //   }

  //   app.server.postJSON('edu_course_play/play_second', data, function (res) {
  //     // console.log('隐藏', res)
  //     typeof cb == 'function' && cb()
  //   });

  // },

  
  //获取音频播放进度
  // getplaySecond: function () {
  //   var that = this
  //   var user_course_id = that.data.course_id
  //   var course_content_id = that.data.misic_id
  //   var data = {
  //     user_course_id: user_course_id,
  //     course_content_id: course_content_id,
  //   }

  //   app.server.postJSON('edu_course_play/play_second', data, function (res) {
  //     if (res.errorCode == 0) {
  //       var value = res.results.playSecond
  //       var nowtime_s = value % 60
  //       var nowtime_m = (value - nowtime_s) / 60
  //       nowtime_s = Math.floor(nowtime_s)
  //       if (nowtime_s < 10) {
  //         var nowtime = nowtime_m + ':' + '0' + nowtime_s
  //       } else {
  //         var nowtime = nowtime_m + ':' + nowtime_s

  //       }
  //       that.setData({
  //         value: res.results.playSecond,
  //         nowtime: nowtime
  //       })
  //       app.globalData.nowtime = nowtime;
  //       app.globalData.play_second = res.results.playSecond;
  //       app.globalData.user_course_id = user_course_id; //课程的id(属于哪个核心课)
  //       app.globalData.course_content_id = course_content_id; //音频的id
  //     }

  //   });

  // },

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
  // onReachBottom: function () {

  // },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function (res) {
  //   return app.commonShare(res)

  // },

  /**
   * 更多
   */

  more: function () {

    var height = this.data.height
    if (height == 'auto') {
      this.animation.rotate(0).step()

      this.setData({
        height: '250rpx',
        animationData: this.animation.export()

      })

    } else {
      this.animation.rotate(180).step()

      this.setData({
        height: 'auto',
        animationData: this.animation.export()

      })

    }



  },

  //开始播放
  // start: function () {
  //   var that = this;
  //   that.setData({
  //     start: that.data.start ? false : true,
  //     playEnd: false
  //   });
  //   app.globalData.start = that.data.start ? true : false;
  //   app.globalData.playEnd = false;
  //   app.globalData.musicFlex = true;
  //   app.globalData.musicPlay = that.data.start ? false : true;
  //   if (that.data.start) {
  //     var value = that.data.value
  //     globalCourseAudioManager.seek(value);

  //     setTimeout(function () {
  //       globalCourseAudioManager.play()

  //     }, 500)


  //   } else {
  //     globalCourseAudioManager.pause()
  //     // console.log('暂停')
  //     var duration = globalCourseAudioManager.duration;
  //     var currentTime = globalCourseAudioManager.currentTime;
  //     that.setData({
  //       start: false,
  //       playEnd: false,
  //       perCentage: Math.ceil(currentTime / duration * 100)
  //     })
  //     app.globalData.perCentage = Math.ceil(currentTime / duration * 100);
  //     app.globalData.start = false;
  //     app.globalData.playEnd = false;

  //   }

  // },
  //接口记录音频开始播放
  // audioRecord: function (playtype) {
  //   var that = this
  //   var user_course_id = that.data.course_id
  //   var course_content_id = that.data.music_id
  //   var data = {
  //     user_course_id: user_course_id,
  //     course_content_id: course_content_id,
  //     event: playtype
  //   }
  //   app.server.postJSON('edu_course_play/add_event', data, function (res) {
  //     // console.log('记录播放', res)

  //   });

  // },
  //当时间滚动时候
  // updatatime: function () {
  //   var that = this;
    // var duration = app.globalData.musicObj.audioSecond;
    // var currentTime = app.globalData.userPlaySecond;
    // var nowtime = 

    // that.setData({
    //   value: currentTime,
    //   nowtime: nowtime,
    //   duration: duration,
    // });

  // },
  //监听滑动
  radioChange: function (e) {
    // 获取滑动当前位置
    const playValue = e.detail.value
    const duration = this.data.userPlayTotal;
    // 获得滑动位置比例
    const bar = playValue / this.data.userPlayTotal;
    console.log(this.data.userPlayTotal)
    console.log('比例：', bar)
    // 获音频跳转时长
    const seek = bar * duration;
    console.log(seek, '时长')
    console.log(backgroundAudioManager.duration / 60, '实际时长')
    backgroundAudioManager.seek(seek)
    setTimeout(()=>{
      backgroundAudioManager.play();
    },500)


  },
  
  // 自动播放音频
  autoPlay(seek){
    
    
    if (seek) {
      backgroundAudioManager.seek(seek)
    }else{
      backgroundAudioManager.src = this.data.detail.audio_url;
      backgroundAudioManager.title = this.data.detail.audio_title;
      backgroundAudioManager.play();
    }
    this.setData({
      userPlayTotal: this.data.detail.audio_length
    })
    backgroundAudioManager.onTimeUpdate(() => {
      // console.log(parseInt(backgroundAudioManager.currentTime))
      this.setData({
        userPlaySecond: parseInt(backgroundAudioManager.currentTime),
      })
      if (!this.data.userPlayTotal) {
        this.setData({
          userPlayTotal: parseInt(backgroundAudioManager.duration)
        })
      } else {
        // console.log(222)
      }
    })
    backgroundAudioManager.onError(err=>{
      console.log(err)
    })
    backgroundAudioManager.onPause(()=>{
      this.setData({
        musicPlay:true
      })
      app.globalData.onPlay = false;
    })
    // 监听播放状态
    backgroundAudioManager.onPlay(() => {
      this.setData({
        musicPlay: false
      })
      app.globalData.onPlay = true;
    })
    // 监听自然停止状态
    backgroundAudioManager.onEnded(()=>{
     
      
      if (this.data.detail.next_song_course_id){
        this.nextCourse()
      }else{
        backgroundAudioManager.src = this.data.detail.audio_url;
        backgroundAudioManager.title = this.data.detail.audio_title;
        backgroundAudioManager.pause();
      }
      this.setData({
        musicPlay:true
      })
      // this.getDetail(this.data.detail.next_song_course_id);
      
    })
    // 监听iOS面板上一曲
    backgroundAudioManager.onPrev(()=>{
      this.prevCourse();
    })
    // 监听iOS面板下一曲
    backgroundAudioManager.onNext(()=>{
      this.nextCourse();
    })
    // 监听停止状态 退出小程序音频播放悬浮框关闭时
    backgroundAudioManager.onStop(()=>{
      console.log("停止了，怎么办？", backgroundAudioManager)
      // backgroundAudioManager.src = this.data.detail.audio_url;
      // backgroundAudioManager.title = this.data.detail.audio_title;
      backgroundAudioManager.pause();
      this.setData({
        musicPlay: true
      })
    })
  },

  // 获取视频详情
  // getVideoDetails: function (id) {
  //   var that = this
  //   app.getVideoDetail(id, function () {
  //     var results = app.globalData.videoObj;
  //     // console.log(app.globalData.videoObj + "视频内容")
  //     var article = results.courseContent
  //     WxParse.wxParse('article', 'html', data.article, that, 5);
  //     if (results.courseContent.length > 50) {
  //       that.setData({
  //         is_more: true
  //       })
  //     }
  //     that.setData({
  //       detail: results
  //     })
  //   })
  // },
  //获取课程详情
  getDetail(id) {
    const params = this.data.options;
    if(id){
      params.course_id = id;
    }
    wx.showLoading({
      title: '数据加载中',
    })
    network.request('getCourseDetails',params,res=>{
      console.log(res.course_details,'---------')
      wx.hideLoading()
      const html = res.course_details;
      // WxParse.wxParse('content', 'html', html, this, 5);
      WxParse.wxParse('content', 'html', html, this, 5);
      
      this.setData({
        detail:res
      })
     
      console.log(app.globalData,"app.globalData")
        
      if(res.type==1){
        // 音频
        if (app.globalData.spec_column_id == this.data.options.spec_column_id && app.globalData.course_id == this.data.options.course_id){
          console.log(backgroundAudioManager, backgroundAudioManager.currentTime,"播放状态")
          console.log()
          const seek = backgroundAudioManager.currentTime;
          this.autoPlay(seek);
        }else{
          this.autoPlay();
        }
        app.globalData.camp_times_id = this.data.options.camp_times_id;
        app.globalData.spec_column_id = this.data.options.spec_column_id;
        
       
      } else if (res.type == 2){
        backgroundAudioManager.pause();
        app.globalData.play = true;
        // 视频
      }
      app.globalData.course_id = res.course_id;
      // backgroundAudioManager.src = 
      console.log(222222,this.data.detail)
      this.getCommentList();
    })
    


  },
  // 上个课程
  // last_song_course_id
  prevCourse(){
    this.getDetail(this.data.detail.last_song_course_id);
  },
  // 下个课程
  nextCourse(){
    this.getDetail(this.data.detail.next_song_course_id);
  },

  //全局播放暂停
  musicPlay: function () {
    console.log("是否停止", backgroundAudioManager.paused, backgroundAudioManager)
    if (backgroundAudioManager.paused){
      if (!backgroundAudioManager.src){
        const seek = backgroundAudioManager.currentTime;
        backgroundAudioManager.src = this.data.detail.audio_url;
        this.autoPlay(seek)
      }
      backgroundAudioManager.play()
      this.setData({
        musicPlay:false
      })
    }else{
      backgroundAudioManager.pause()
      this.setData({
        musicPlay: true
      })
    }
  },
  // 上一曲 下一曲 按钮
  changeMusic(e){
    console.log(e.currentTarget.dataset.id);
    const id = e.currentTarget.dataset.id;
    if(id){
      backgroundAudioManager.pause();
      this.getDetail(id)
    }else{
      wx.showToast({
        title: '暂无课程',
        icon:'none'
      })
    }
  },
  //获取评论列表 
  getCommentList: function (add) {
    // console.log('music_id', this.data.music_id)
    const formData = {
      page_num: this.data.page_num,
      identify_type: 4,
      identify_id: this.data.detail.course_id,
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
      if(this.data.commentType === 'comment' && !this.data.isFirst) {
        this.countWinnow(this.data.commentlist);
        this.topWinnow();
      }
    })
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.over){
      wx.showToast({
        title: '已加载全部评论',
        icon:"none"
      })
    }else{
      this.getCommentList('add')
    }
  },

  //选择评论类型
  selectComm: function (e) {
    var type = e.currentTarget.dataset.type
    this.setData({
      commentType: type,
      page: 1
    })
  },
  //评论
  comment: function (e) {
    this.animation.translateY(-50).step()
    this.setData({
      hidden_bottom: true,
      content: '',
      animationData1: this.animation.export()


    })
    var that = this
    setTimeout(function () {
      that.setData({
        focus: true,

      })
    }, 600)



  },
  //监听评论内容
  bindCommentText: function (e) {
    var that = this
    var content = e.detail.value
    that.setData({
      content: content
    })
  },
  //提交评论
  tjComment: function (e) {
    var that = this
    var data = {
      content: that.data.content,
      course_content_id: that.data.music_id
    }

    app.server.postJSON('edu_course_comment/add', data, function (res) {
      var results = res['results'];
      if (res.errorCode == 0) {
        wx.showToast({
          title: '提交成功',
        })
        var type = that.data.commentType
        var commTotal = that.data.commTotal

        var commentlist = that.data.commentlist
        commentlist.splice(0, 0, results);
        that.animation.translateY(50).step()

        that.setData({
          hidden_bottom: false,
          commTotal: commTotal + 1,
          commentlist: commentlist,
          display: "fixed",
          focus: false,
          animationData1: that.animation.export()

        })
      } else {
        app.func.toast(res.errorStr);

      }


    });
  },

  //课程内容点赞
  // praise: function() {
  //   var that = this
  //   var data = {
  //     id: that.data.music_id
  //   }
  //   app.server.postJSON('edu_course_content/praise', data, function(res) {
  //     var results = res['results'];
  //     if (res.errorCode == 0) {
  //       that.setData({
  //         praiseType: results.praiseType,
  //         praiseCount: results.praiseCount,
  //       })
  //     } else {
  //       app.func.toast(res.errorStr);

  //     }


  //   });

  // },
  //写评论
  writeBtn: function (e) {
    const id = this.data.detail.course_id;
    const type = 4;
    const title = this.data.detail.audio_title;
    router.navigate({
      path: `pages/publish/publish?id=${id}&title=${title}&type=${type}`
    })
    // var that = this
    // // console.log(that.data.headerImg + 'that.data.headerImg写评论')

    // wx.navigateTo({
    //   url: '../course_publish/index?id=' + that.data.detail.id + '&title=' + that.data.detail.courseTitle + '&headerImg=' + that.data.headerImg
    // })

  },
  //课程点赞
  coursePrise: function () {
    const _this = this;
    _this.throttle(function() {
      const identify_id = _this.data.detail.course_id, action_type = _this.data.detail.is_zans==1?2:1, identify_type=4;
      // console.log(data.id + 'data数据')
      network.request('likeAction', { identify_id, action_type, identify_type }, res => {
        _this.data.detail.is_zans = action_type;
        action_type == 1 ? _this.data.detail.zan_num++ : _this.data.detail.zan_num--;
        _this.setData({
          detail: _this.data.detail
        })
      })
    },1000)()
  },

  //评论点赞
  commPraise: function (e) {
    const _this = this;
    _this.throttle(function() {
      const identify_id = e.currentTarget.dataset.id;
      const action_type = e.currentTarget.dataset.identify_type==1?2:1;
      const index = e.currentTarget.dataset.index;
      const identify_type = 6;
      network.request('likeAction', { identify_id, action_type, identify_type},res=>{
        _this.data.commentlist[index].is_zans = action_type;
        action_type == 1 ? _this.data.commentlist[index].zan_num++ : _this.data.commentlist[index].zan_num--;
        _this.setData({
          commentlist: _this.data.commentlist
        })
      })
    },1000)()
  },

  //弹出二级评论弹层
  replyTask(e) {
    const item = e.currentTarget['dataset'].info;
    const idx = e.currentTarget['dataset'].idx;
    this.setData({
        placeholderMsg: `回复@${item.nickname}：`,
        commentType: 'reply',
        commentInfo: item,
        commentIdx: idx,
        commontShow: false
    })
  },
   // 发布二级评论
   release() {
     const userinfo = wx.getStorageSync('userinfo');
     const comment_contents = this.data.comment_contents.trim();
     const item = this.data.commentInfo;
    if (!comment_contents) {
        wx.showToast({
            title: '请输入评论内容',
        })
        return
    }
    let params = {
        identify_id: this.data.options.course_id,
        unionid: this.data.options.unionid,
        openid: this.data.options.openid,
        comment_contents: comment_contents,
        identify_type: 4,
      }
      if (this.data.commentType === 'reply') {
        params.parent_id = this.data.commentInfo.comment_id
      }
      
      
      network.request('insertComment', params, data => {
        wx.showToast({
          title: "评论成功",
          icon: "success"
        })
        
        if(this.data.commentType === 'reply') {
          const obj = this.data.commentInfo;
          obj._apply.unshift({
            nickname:userinfo.nickname,
            comment_contents
          })
          const arr = this.data.commentlist.splice(this.data.commentIdx,1,obj);
          this.setData({
            commentlist:this.data.commentlist,
            loadingBtn: true,
            commontShow: true,
            comment_contents: '',
          })
        }else{
          this.setData({
            over:false,
            loadingBtn: true,
            commontShow: true,
            comment_contents: '',
            page_num: 1,
            commentlist: []
          })
        
          this.getCommentList();
        }
    }, error => {
        this.setData({
            loadingBtn: false
        })
    })
  },

  // 发布一级评论
  reComment() {
  const userinfo = wx.getStorageSync('userinfo');
  const comment_contents = this.data.comment_contents.trim();
  const item = this.data.commentInfo;
  if (!comment_contents) {
      wx.showToast({
          title: '请输入评论内容',
      })
      return
  }
  let params = {
      identify_id: this.data.options.course_id,
      unionid: this.data.options.unionid,
      openid: this.data.options.openid,
      comment_contents: comment_contents,
      identify_type: 4,
    }
    // if (this.data.commentType === 'reply') {
    //   params.parent_id = this.data.commentInfo.comment_id
    // }
    
    network.request('insertComment', params, data => {
      wx.showToast({
        title: "评论成功",
        icon: "success"
      })
      
      // if(this.data.commentType === 'reply') {
      //   const obj = this.data.commentInfo;
      //   obj._apply.unshift({
      //     nickname:userinfo.nickname,
      //     comment_contents
      //   })
      //   this.data.commentlist.splice(this.data.commentIdx,1,obj);
      //   this.setData({
      //     commentlist:this.data.commentlist,
      //     loadingBtn: true,
      //     commontShow: true,
      //     comment_contents: '',
      //   })
      // }else{
        this.setData({
          isFirst:false,
          over:false,
          loadingBtn: true,
          commontShow: true,
          comment_contents: '',
          page_num: 1,
          commentlist: []
        })
      
        this.getCommentList();
      // }
  }, error => {
      this.setData({
          loadingBtn: false
      })
  })
},
  // 显示评论弹层
  showCommon() {
    this.setData({
        commontShow: false,
        placeholderMsg: '说点什么...',
        commentType: 'comment'
    })
  },
   // 隐藏评论弹层
   hideCommon() { this.setData({ commontShow: true }) },
   // 绑定评论数据
   commontChange(e){
       const text = e.detail.value;
       this.setData({
           comment_contents: text
       })
       if (text.trim().length){
           this.setData({
               loadingBtn:false
           })
       }else{
           this.setData({
               loadingBtn: true
           })
           wx.showToast({
             title: '评论内容不能为空',
             icon:'none'
           })
       }
   },
  //上一曲 未使用
  prevMusic: function () {
    var that = this

    app.PreAudioPlay(this, function () {
      var results = app.globalData.musicObj;
      var article = results.courseContent
      WxParse.wxParse('article', 'html', article, that, 5);
      if (results.courseContent.length > 50) {
        that.setData({
          is_more: true
        })
      }
      backgroundAudioManagerOverAll.src = results.playAudioUrl
      backgroundAudioManagerOverAll.title = results.courseTitle
      that.setData({
        detail: results,
        praiseType: results.praiseType,
        praiseCount: results.praiseCount,
        courseDate: results.courseDate,
        course_id: results.userCourseID,
        audiotime: results.audioSecondMinute,
        userPlayTotal: results.audioSecond

      })
      that.getCommentList()

    })

  },
  //下一曲 未使用
  // nextMusic: function () {
  //   var that = this
  //   app.NextAudioPlay(that, function () {
  //     var results = app.globalData.musicObj;
  //     var article = results.courseContent
  //     WxParse.wxParse('article', 'html', article, that, 5);
  //     if (results.courseContent.length > 50) {
  //       that.setData({
  //         is_more: true
  //       })
  //     }
  //     backgroundAudioManagerOverAll.src = results.playAudioUrl
  //     backgroundAudioManagerOverAll.title = results.courseTitle
  //     that.setData({
  //       detail: results,
  //       praiseType: results.praiseType,
  //       praiseCount: results.praiseCount,
  //       courseDate: results.courseDate,
  //       course_id: results.userCourseID,
  //       audiotime: results.audioSecondMinute,
  //       userPlayTotal: results.audioSecond

  //     })
  //     that.getCommentList('new')

  //   })
  // },
  // //获取焦点时候
  Onfoucus: function () {
    this.setData({
      display: "static",

    })

  },
  hideTextarea: function () {
    this.animation.translateY(50).step()

    this.setData({
      display: "fixed",
      hidden_bottom: false,
      focus: false,
      animationData1: this.animation.export()

    })


  },

  // 时间转换
  stotime(s) {
    let t = '';
    if (s > -1) {
      // let hour = Math.floor(s / 3600);
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;
      // if (hour < 10) {
      //   t = '0' + hour + ":";
      // } else {
      //   t = hour + ":";
      // }

      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec;
    }
    return t;
  },

  //音频播放配置
  // setMusicPauseOpotions: function () {
  //   //globalCourseAudioManager.pause();
  //   //暂停
  //   // console.log('暂停111')
  //   var that = this
  //   globalCourseAudioManager.onPause((res) => {

  //     that.setPlaySecond(function () {
  //       that.audioRecord('play_end');
  //     })
  //   })
  // },
  
  topWinnow() {
    const _this = this;
    const query = wx.createSelectorQuery();
    query.select('.topQuery' + _this.data.countWinnow_num).boundingClientRect();
    query.exec(function(res) {
      _this.setData({
          tabTop: res[0].top,
          isFirst:true
      })
      wx.pageScrollTo({
        scrollTop:_this.data.tabTop
      })
    })
  },
  //计算精选评论数量
  countWinnow(data) {
    let num = 0;
    for(let i=0;i<data.length;i++) {
      if(data[i].is_featured == 1) {
        num ++;
      }
    }
    this.setData({
      countWinnow_num:num
    })
  },

  throttle (fn, delay = 2000) {
    let pre = this.data.pre // 初始值是 0 
    let that = this
    return function () {
        let now = + new Date();
        if(now - pre >= delay) {
            fn.apply(this, arguments)
            that.setData({
                pre: now
            })
        }
    }
  }
})