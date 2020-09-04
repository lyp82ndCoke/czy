const router = require('../../utils/router.js');
import network from '../../utils/network';
import getCode from "../../utils/getCode";
let imgShow=false;
Page({
    data: {
        task_total_info: {},
        rankingList: [],
        task_info: {},
        tabIndex: 0,
        navList: [{value: '最热', key: 'hottest'}, {value: '最新', key: 'newest'}, {value: '精选', key: 'selected'}, {value: '我的', key: 'myTask'}],
        page_size: 10,
        page_num: 1,
        loginShow: false,
        loginWrapShow: false,
        sort: 'hottest',
        tabFixed: false,
        showBackTop: false
    },
    onLoad: function(options){
        this.setData({times_task_id: options.times_task_id, camp_times_id: options.camp_times_id})
        wx.showLoading({
            title: '数据加载中',
        })
        let unionid = wx.getStorageSync('unionid');
        if (unionid) {
            this.getUserRankList()
            this.getLoginStatus()
        } else {
            getCode.login().then(res => {
                this.getUserRankList()
                this.getLoginStatus()
            })
        }
    },
    onShow: function(){
        if (imgShow) {
            imgShow = false
            return
        }
        // let unionid = wx.getStorageSync('unionid');
        // if (unionid) {
        //     this.getLoginStatus()
        // } else {
        //     getCode.login().then(res => {
        //         this.getLoginStatus()
        //     })
        // }
    },
    backTop() {
        wx.pageScrollTo({
          scrollTop: 0
        })
        this.setData({
            showBackTop: false
        })
    },
    onPageScroll (e) {
        let scroll_top = e.scrollTop
        if (scroll_top > 400 && !this.data.showBackTop) {
          this.setData({
            showBackTop: true
          })
        } else if (scroll_top < 400 && this.data.showBackTop) {
          this.setData({
            showBackTop: false
          })
        }
        if (this.data.tabFixed === (scroll_top > this.data.tabTop)) return;
        this.setData({
            tabFixed: (scroll_top > this.data.tabTop)
        })
    },
    imgClickShow() { imgShow = true },
    // 去任务日历页
    goTaskCalendar() {
        router.navigate({
            path: `pages/match-task-calendar/index?camp_times_id=${this.data.task_total_info.task_info.camp_times_id}`
        })
    },
    tabChange(e) {
        const index = e.currentTarget['dataset'].id
        const sort = e.currentTarget['dataset'].key
        if (this.data.tabIndex === index) { return }
        this.setData({tabIndex: index, sort: sort, page_num: 1, rankingList: [], isFinish: false})
        this.getRankList(sort)
    },
    // 查询tab距离文档顶部的距离tabTop
    initClientRect() {
        let _this = this
        var query = wx.createSelectorQuery()
        query.select('#tabwrap').boundingClientRect()
        query.exec(function(res) {
            _this.setData({
                tabTop: res[0].top
            })
        })
    },
    // 数据统计
    getUserRankList() {
        let params = { times_task_id: this.data.times_task_id, camp_times_id: this.data.camp_times_id, share_type: 'share_list' }
        network.request('userRankList', params, res => {
            res.task_info.task_start_time = `${res.task_info.task_start_time} 00:00:00`
            this.setData({task_total_info: res})
            // 如果比赛还没有人发布，就不请求列表，展示示例 task_example,有公布，不返回
            if (!this.data.task_total_info.task_info.task_example) {
                // 赛区最热最新
                this.getRankList(this.data.sort)
                // 查询tab距离文档顶部的距离tabTop
                this.initClientRect()
            }
            wx.hideLoading()
        }, error => {
            wx.hideLoading()
        })
    },
    getRankList(sort) {
        if (this.data.isLoading) { return }
        this.setData({isLoading: true})
        let params = {sort: sort, times_task_id: this.data.times_task_id, camp_times_id: this.data.camp_times_id, page_size: this.data.page_size, page_num: this.data.page_num}
        wx.showLoading({
            title: '数据加载中',
        })
        network.request('taskRankingData', params, res => {
            this.initClientRect()
            this.setData({task_info: res.task_info, rankingList: this.data.rankingList.concat(res.rankingList), isLoading: false})
            if (res.sign.count < this.data.page_size) {
                this.setData({isFinish: true})
            }
            wx.hideLoading()
        }, error => {
            this.setData({isLoading: false})
            wx.hideLoading()
        })
    },
    onReachBottom: function() {
        // 如果没有人公开到赛区，显示示例，加载更多
        if (this.data.task_total_info.task_info.task_example) return
        if(this.data.isFinish){
            wx.showToast({ title:"没有更多了",icon:"none"})
            return
        }
        this.setData({ page_num: this.data.page_num + 1 })
        this.getRankList(this.data.sort)
    },
    likeFun (e) {
        const item = e.currentTarget['dataset']
        if (item.like === 1) { return }
        const index = e.currentTarget['dataset'].index
        const identify_id = e.currentTarget['dataset'].id
        let params = {
            identify_id: identify_id,
            action_type: 1,
            identify_type: 7,
            times_task_id: this.data.times_task_id
        }
        network.request('matchLike', params, res => {
            let taskZan = this.data.rankingList[index].valid_zan_nums
            let totalZan = this.data.rankingList[index].total_zan_num
            const valid = `rankingList[${index}].valid_zan_nums`
            const total = `rankingList[${index}].total_zan_num`
            const isLike = `rankingList[${index}].is_like`
            this.setData({[valid]: parseInt(taskZan) + 1, [total]: parseInt(totalZan) + 1, [isLike]: 1})
        })
    },
    clickComment (e) {  // 去任务详情个人， type: 2 代表是普通列表 1 是任务日历
        // 如果点击的事示例，则返回
        if (this.data.task_total_info.task_info.task_example) return
        const index = e.currentTarget['dataset'].index
        const item = this.data.rankingList[index]
        let url = `pages/match-task-person/index?times_task_id=${this.data.times_task_id}&camp_times_id=${this.data.camp_times_id}&task_submit_id=${item.task_submit_id}&unionid=${item.unionid}&index=${index}&type=2`
        router.navigate({path: url})
    },
    queryTasks () {     // 查看每日任务
        let url = `pages/match-daily-tasks/index?times_task_id=${this.data.times_task_id}&camp_times_id=${this.data.camp_times_id}`
        router.navigate({path: url})
    },
    queryPrize () {     // 查看奖品
        let url = `pages/match-activity-prize/index?camp_times_id=${this.data.camp_times_id}&times_task_id=${this.data.times_task_id}`
        router.navigate({path: url})
    },
    queryRank () {      // 查看排行榜
        router.navigate({path: `pages/match-rank-list/index?camp_times_id=${this.data.camp_times_id}&times_task_id=${this.data.times_task_id}&rank_type=1`})
    },
    goBackArea() { router.switchTab({path: 'pages/match-area/index'}) },
    handleContact (e) {
        // 客服消息
        const params = e.currentTarget['dataset']
        network.logsRequest({ apipath: params.button_path, apiparam: params.goods_id }, data => {
            console.log("log日志")
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
    // 用户点击右上角分享
    onShareAppMessage: function (e) {
        const obj = {
            title: `${this.data.task_total_info.nickname}正在参加${this.data.task_total_info.task_info.camp_times_name}，邀您一起陪孩子赢大奖`,
            imageUrl: this.data.task_total_info.task_info.face_img_url,
            paramsFrom: {times_task_id: this.data.times_task_id, camp_times_id: this.data.camp_times_id}
        }
        return network.share(obj);
    }
});