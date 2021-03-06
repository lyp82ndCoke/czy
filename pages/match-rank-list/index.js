const router = require('../../utils/router.js');
import network from '../../utils/network';
Page({
    data: {
        taskInfo: {},
        prizeList: [],
        myRank: {},
        rankList: [],
        page_size: 10,
        page_num: 1,
        bot_height: 0,
        rank_type: 0, // 1：排行榜 2：获奖名单"
        showPopup: false,
        isFinish: false,
        prizeInfo: {}
    },
    onLoad: function(options){
        this.setData({camp_times_id: options.camp_times_id, times_task_id: options.times_task_id, rank_type: options.rank_type})
        this.initData()
    },
    clickItem(e) {
        const info = e.currentTarget['dataset'].item
        this.setData({
            prizeInfo: info,
            showPopup: true
        })
    },
    closePopup() {
        this.setData({
            prizeInfo: {},
            showPopup: false
        })
    },
    initData() {
        wx.showLoading({
            title: '数据加载中',
        })
        let params = {camp_times_id: this.data.camp_times_id, times_task_id: this.data.times_task_id, rank_type: this.data.rank_type}
        network.request('taskRankIndex', params, res => {
            if (res.taskInfo.rank_status != 0) {
                this.winnersList()
            }
            this.setData({
                myRank: res.myRank,
                prizeList: res.prizeList,
                taskInfo: res.taskInfo
            })
            wx.hideLoading()
        }, error => { wx.hideLoading() })
    },
    winnersList() {
        if (this.data.isLoading) return
        this.setData({isLoading: true})
        wx.showLoading({
            title: '数据加载中',
        })
        let params = {
            camp_times_id: this.data.camp_times_id,
            times_task_id: this.data.times_task_id,
            rank_type:  this.data.rank_type,
            page_num: this.data.page_num,
            page_size:  this.data.page_size
        }
        network.request('winnersList', params, res => {
            this.setData({rankList: this.data.rankList.concat(res.rankList), isLoading: false})
            if (res.sign.count < this.data.page_size) {
                this.setData({isFinish: true})
            }
            wx.hideLoading()
        }, error => {
            wx.hideLoading()
            this.setData({ isLoading: false })
        })
    },
    // 页面上拉触底事件的处理函数
    onReachBottom: function() {
        if (this.data.taskInfo.task_status == 0) return
        if(this.data.isFinish){
            wx.showToast({ title:"没有更多了",icon:"none"})
            return;
        }
        this.setData({
            page_num: this.data.page_num + 1
        });
        this.winnersList()
    },
    // 用户点击右上角分享
    onShareAppMessage: function (e) {
        let unionid = wx.getStorageSync('unionid')
        const obj = {
            title: `${this.data.myRank.nickname}正在参加${this.data.taskInfo.camp_times_name}，邀您一起陪孩子赢大奖`,
            imageUrl: this.data.taskInfo.face_img_url,
            paramsFrom: {times_task_id: this.data.times_task_id, camp_times_id: this.data.camp_times_id, task_view_unionid: unionid},
            url: 'pages/match-share-rank/index'
        }
        return network.share(obj);
    }
});