//Page Object
const router = require('../../utils/router.js');
import network from '../../utils/network';
import getCode from "../../utils/getCode";
Page({
    data: {
        list: [],
        loginShow: false,
        loginWrapShow: false,
        isFinish: false,
        page_size: 10,
        page_num: 1,
        requestLock: false
    },
    onLoad: function(options){
        wx.showLoading({
            title: '数据加载中',
        })
        this.getLoginStatus()
        this.initData()
    },
    onShow: function(){
        this.getLoginStatus()
        if (this.data.requestLock) {
            this.initData()
        } else {
            this.setData({requestLock: true})
        }
    },
    initData() {
        let unionid = wx.getStorageSync('unionid');
        if (unionid) {
            this.getTaskList()
            getCode.showMenuNotice()
        } else {
            getCode.login().then(res => {
                this.getTaskList()
                getCode.showMenuNotice()
            })
        }
    },
    getTaskList() {
        const params = {
            page_size: this.data.page_size,
            page_num: this.data.page_num
        }
        network.request('campTaskList', params, res => {
            let list = res.list
            if (params.page_num > 1) {
                this.setData({list: this.data.list.concat(list)})
            } else {
                this.setData({list: list})
            }
            if (res.sign.count < this.data.page_size) {
                this.setData({isFinish: true})
            }
            wx.stopPullDownRefresh()
            wx.hideLoading()
        }, error => {
            wx.stopPullDownRefresh()
            wx.hideLoading()
        })
    },
    // 下拉刷新页面
    onPullDownRefresh() {
        this.setData({
            page_num: 1,
            list: [],
            isFinish: false
        })
        this.getTaskList()
    },
    /**
     * 页面上拉触底事件的处理函数
    */
    onReachBottom: function() {
        if(this.data.isFinish){
            wx.showToast({ title:"没有更多了",icon:"none"})
            return
        }
        this.setData({ page_num: this.data.page_num + 1 })
        this.getTaskList()
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
    goDetail (e) {
        // 任务状态1，已开营，2待开营，3已结束
        const index = e.currentTarget['dataset'].index
        const item = this.data.list[index]
        let url = `pages/match-area-details/index?times_task_id=${item.times_task_id}&camp_times_id=${item.camp_times_id}&sourceType=1`
        if (item.is_buy == 1) {                                             // 已购买一直可以看
            router.navigate({path: url})
            return
        }
        if (item.is_buy == 2 && item.status == 1) {                         // 未购买且正在进行中可以进
            router.navigate({path: url})
            return
        }
        if (item.is_buy == 2 && (item.status == 3 || item.status == 2)) {   // 未购买且（已结束或待开营）
            wx.showToast({
                title: '很抱歉，您未购买不能继续查阅~',
                icon: 'none'
            })
            return
        }
    }
});