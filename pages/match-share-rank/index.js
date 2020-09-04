const router = require('../../utils/router.js');
import network from '../../utils/network';
import getCode from "../../utils/getCode";
import fromat from "../../utils/fromat";
Page({
    data:{
        myRank: {},
        taskList: [],
        adv_info: {},
        totalTime: 0,
        timerInterval: null,
        loginShow: false,
        loginWrapShow: false
    },
    onLoad:function(options){
        this.setData({times_task_id: options.times_task_id, camp_times_id: options.camp_times_id, task_view_unionid: options.task_view_unionid})
        wx.showLoading({
            title: '数据加载中',
        })
        let unionid = wx.getStorageSync('unionid');
        if (unionid) {
            this.getRankShareIndex()
            this.getLoginStatus()
        } else {
            getCode.login().then(res => {
                this.getRankShareIndex()
                this.getLoginStatus()
            })
        }
    },
    onShow: function(){
        // let unionid = wx.getStorageSync('unionid');
        // if (unionid) {
        //     this.getLoginStatus()
        // } else {
        //     getCode.login().then(res => {
        //         this.getLoginStatus()
        //     })
        // }
        // 倒计时
        if (parseInt(this.data.myRank.task_status) === 1) {
            this.handleTime(this.data.myRank.task_end_time)
        }
    },
    onHide() {
        clearInterval(this.data.timerInterval)
        this.setData({ totalTime: 0, timeData: [] })
    },
    // 获取当前授权状态
    getLoginStatus() {
        getCode.loginShow().then(res => {
            if (res) {
                this.setData({ loginWrapShow:true })
            }else{
                this.setData({ loginWrapShow: false })
            }
        })
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
    // 全局唤醒授权点击框
    loginShow() {
        this.setData({
            loginShow: true
        });
    },
    getRankShareIndex() {
        let params = {
            times_task_id: this.data.times_task_id,
            camp_times_id: this.data.camp_times_id,
            task_view_unionid: this.data.task_view_unionid
        }
        network.request('rankShareIndex', params, res => {
            wx.hideLoading()
            this.setData({
                myRank: res.myRank,
                adv_info: res.adv_info,
                taskList: res.taskList
            })
            // 倒计时
            if (parseInt(res.myRank.task_status) === 1) {
                this.handleTime(res.myRank.task_end_time)
            }
        }, error => { wx.hideLoading() })
    },
    handleContact(e) {
        // 客服消息
        const params = e.currentTarget['dataset']
        network.logsRequest({ apipath: params.button_path, apiparam: params.goods_id }, data => {
            console.log("log日志")
        })
    },
    handleTime (time) {
        let start = new Date().getTime();
        let endTime = time.replace(/-/g,"/");
        let end = new Date(endTime).getTime();
        let value  = parseInt(end - start)/1000;
        this.setData({totalTime: value})
        this.timer()
    },
    timer(){
        let localTime = this.data.totalTime
        this.data.timerInterval = setInterval(() => {
            if (localTime < 1) {
				clearInterval(this.data.timerInterval)
				return
			}
            this.setData({
                totalTime: localTime--,
                timeData: fromat.formstr(localTime)
            })
        }, 1000);
    },
    // 用户点击右上角分享
    onShareAppMessage: function (e) {
        const obj = {
            title: `${this.data.myRank.nickname}正在参加${this.data.myRank.camp_times_name}，邀您一起陪孩子赢大奖`,
            imageUrl: this.data.myRank.face_img_url,
            paramsFrom: {times_task_id: this.data.times_task_id, camp_times_id: this.data.camp_times_id, task_view_unionid: this.data.task_view_unionid}
        }
        return network.share(obj);
    }
})