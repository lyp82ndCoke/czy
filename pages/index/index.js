//index.js
//获取应用实例
const app = getApp()
import network from '../../utils/network';
import getCode from "../../utils/getCode";
import shareData from '../../utils/share.js';
const router = require("../../utils/router");

Page({
    data: {
        loginShow: false,
        loginWrapShow: false,
        isIpx: app.globalData.isIpx,
        videoUrl: '', //当前播放视频的地址
        formData: [], //发送请求数据（最后一条的id type组成的数组）
        imgUrls: [
            //     {
            //     "ad_picture": "https://task.zmedc.com/upload/job/20190911/fdd361d22929cad6733995bc61e567b0.jpg",

            // },
            // {
            //     "ad_picture": "https://task.zmedc.com/upload/job/20190404/ea2e99fab200933ee30b372eba2f29a8.jpg",

            // },
            // {
            //     "ad_picture": "https://task.zmedc.com/upload/job/20180918/7972f05b6361bd9ca634342537f6ce07.jpg"

            // }

        ], //banner
        todaySentence: {
            

        }, //金句
        list: [
           
        ],


        pageNum: 1,
        pageSize: 10,
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,


        goods: [],
        lastStudy: {},
        over: false,
    },

    onLoad: function (options) {
      let unionid = wx.getStorageSync('unionid');
      console.log(unionid)
      if (unionid) {
        this.getList();
        getCode.showMenuNotice();
      } else {
        getCode.login().then(res => {
          console.log("code：", res)
          this.getList();
          getCode.showMenuNotice();
        })
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
  // 客服消息
  handleContact(e) {
    network.logsRequest({ apipath: "contact_button/banner_index_item_info", apiparam: e.currentTarget.dataset.all_camp_id }, data => {
      console.log("log日志")
    })
  },
    // 显示并播放视频
    showVideo(e) {
        console.log(e.currentTarget.dataset.url)
        const videoUrl = e.currentTarget.dataset.url;
        this.setData({
            videoUrl,
            videoWrap: true,
        })
    },
    // 关闭视频播放
    closeVideo() {
        this.setData({
            videoWrap: false,
        })
    },
    toNumber(str1,str2=1){
      console.log("strrrrrr", str1, str2, Number(str1) + Number(str2))
      return Number(str1)+Number(str2)
    },
    //每日金句跳详情
    gotoGoldSent(e) {
        if (e.detail.formId) {
            network.reFormId(e.detail.formId)
        }
        const that = this;
        app.istz = 1
      const id = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index, subIndex = e.currentTarget.dataset.subindex;
        const url = `pages/good-sentence/index?id=${id}`;
        let temp = `list[${index}][${subIndex}].view_all_count`  
        router.navigate({
            path: url,
            success(){
              setTimeout(()=>{
                that.setData({
                  [temp]: that.data.list[index][subIndex].view_all_count + 1
                },500)
              })
              
            }
        })
    },
    // 跳转好文、群聊详情
    goDetails(e) {
      const that = this;
        if (e.detail.formId) {
            network.reFormId(e.detail.formId)
        }
        console.log(e.currentTarget.dataset)
      let id = e.currentTarget.dataset.id, type = e.currentTarget.dataset.type, index = e.currentTarget.dataset.index, subIndex = e.currentTarget.dataset.subindex;
      let temp = `list[${index}][${subIndex}].view_all_count`  
      
      
        router.navigate({
            path: 'pages/article-detail/index',
            params: {
                id,
                type
            },
            success(res){

              setTimeout(() => {
                that.setData({
                  [temp]: that.data.list[index][subIndex].view_all_count + 1
                }, 500)
              })
              
            }
        })
    },
    // 获取首页list
    getList(add) {
        // 如果loading说明正在执行请求  需要锁住
        if (this.data.loading) {
            return false;
        }
        let $this = this;
        // 进入函数 锁住请求
        this.setData({
            loading: true
        })
        let param_list = [], lastData = this.data.list[this.data.list.length - 1];
        console.log(lastData)
        if (lastData && lastData.length) {
            lastData.forEach((item, i) => {
                // console.log(item, "item")
                const type = item.type;
                const id = item.content_id;
                param_list[i] = { type, id };
            });
        }


        network.request('getHome', {
            is_index: add ? "" : 1,
            param_list
        }, data => {
            console.log(data, '--首页数据')
            // 获取原始数据（列表已有数据）
            let list = this.data.list;
            // 获取心情求的数据newData
            let newData = data;
            let newList = newData.contentList;
            // 如果新的数据小于当前分页数量 设置下拉数据以为空  over为true
            if (newList.length === 0) {
                this.setData({
                    over: true
                });

            }
            // 如果是下拉请求更多的话  拼接原始数据
            if (add) {
                newList = list.concat(newList)
            } else {
              let indicatorDots = false;
              if (newData.bannerList.length>1){
                indicatorDots=true;
              }
                this.setData({
                    imgUrls: newData.bannerList,
                    todaySentence: newData.todaySentence,
                  indicatorDots
                })
            }


            this.setData({
                list: newList,
                loading: false
            });
            wx.stopPullDownRefresh();
        }, error => {
            this.setData({
                loading: false
            })
        })

    },










    getUid() {
        if (this.options.goIndex) {
            let url = this.options.nav;
            let query = this.options.query;
            const options = this.data.options;
            console.log('url', url)
            router.navigate({
                path: url,
                params: options
            })
            this.getLast();
            this.getbanner();
            this.getList();
            return false;
        }
        if (wx.getStorageSync('user_id')) {
            this.getLast();
            this.getbanner();
            this.getList();
            if (this.options.goIndex) {
                let url = options.nav;
                let query = options.query;
                url = url + '?' + query
                console.log('url', url)
                router.navigate({
                    path: url
                })
            }
        } else {
            getCode.login().then(res => {
                this.getLast();
                this.getbanner();
                this.getList();
                if (this.options.goIndex) {
                    let url = options.nav;
                    let query = options.query;
                    url = url + '?' + query
                    console.log('url', url)
                    router.navigate({
                        path: url
                    })
                }
            })
            console.log('走登录')
        }
    },
    login(options) {
        console.log("首页：options", options)
        let query = options.query || {};
        let path = options.path || "pages/index/index";
        console.log(options)
        wx.getSetting({
            success: res => {
                if (!res.authSetting["scope.userInfo"]) {
                    console.log("没有授权");
                    // router.reLaunch({
                    //     path: "pages/login/index",
                    //     params: options
                    // });
                } else {
                    // this.getUid();
                }
            }
        });
    },

    onReady: function () {

    },
    onShow(options) {
        // console.log(this.getTabBar, "tab")
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
      
        // 根据授权状态 判断是否显示授权浮层
        this.getLoginStatus()

    },
    // 获取最后一次学习的记录
    getLast() {
        network.request('getLastPlay', {}, data => {
            console.log(data);
            this.setData({
                lastStudy: data
            })
        })
    },
    // 获取banner
    getbanner() {
        network.request("getBanner", {}, data => {
            console.log(data)
          
            this.setData({
                imgUrls: data
            })
        }, error => {
            console.log('请求错误')
        })
    },
    // 获取商品列表list

    // banner跳转
    goLink(e) {
        const url = e.target.dataset.path;
        router.navigate({
            path: url
        })
    },




    // 获取userinfo
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onPullDownRefresh() {
        console.log('下拉刷新')
        this.setData({
            pageNum: 1,
            over: false
        })
        this.getList();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
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
            this.getList('add');
        }
    },
    // 转发
    onShareAppMessage(){
      return network.share();
    }
})