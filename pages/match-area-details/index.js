//Page Object
const router = require('../../utils/router.js');
import network from '../../utils/network';
const WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        navList: [{value: '最热', key: 'hottest'}, {value: '最新', key: 'newest'}, {value: '精选', key: 'selected'}, {value: '我的', key: 'myTask'}],
        sort: 'hottest',
        rankingList: [],
        taskData: {},
        page_size: 10,
        page_num: 1,
        tabIndex: 0,
        showBackTop: false,
        tabFixed: false,
        showPopup: false,
        isShowRules: false
    },
    onLoad: function(options){
        const is_show_rules = wx.getStorageSync('is_task_show_rules');
        if (is_show_rules !== 1) {
            this.setData({
                showPopup: true
            })
        }
        wx.showLoading({
            title: '数据加载中',
        })
        this.setData({times_task_id: options.times_task_id, camp_times_id: options.camp_times_id, sourceType: options.sourceType})
        // 赛区user排名信息
        this.getUserRankList()
    },
    getUnionid() {
        let unionid = wx.getStorageSync('unionid')
        if (unionid) {
            return unionid
        } else {
            getCode.login().then(res => {
                return wx.getStorageSync('unionid')
            })
        }
    },
    queryOther(e) {
        // 如果点击的事示例，则返回
        if (this.data.taskData.task_info.task_example) return
        const index = e.currentTarget['dataset'].index
        const task_view_unionid = this.data.rankingList[index].unionid
        const unionidSelf = this.getUnionid()
        // type: 1自己、2他人
        let type = 2
        if (unionidSelf == task_view_unionid) {
            type = 1
        }
        let url = `pages/match-my-task/index?times_task_id=${this.data.times_task_id}&camp_times_id=${this.data.camp_times_id}&type=${type}&task_view_unionid=${task_view_unionid}`
        router.navigate({path: url})
    },
    imgClickShow() {},
    closeInterval() {
        console.log('倒计时结束返回')
    },
    showRule() {
        this.setData({ showPopup: true })
    },
    closePopup() {
        this.setData({showPopup: false})
        wx.setStorageSync('is_task_show_rules', 1)
    },
    // 点赞
    likeFun (e) {
        const item = e.currentTarget['dataset']
        if (item.like === 1) return
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
    tabChange(e) {
        const index = e.currentTarget['dataset'].id
        const sort = e.currentTarget['dataset'].key
        if (this.data.tabIndex === index) { return }
        this.setData({tabIndex: index, sort: sort, page_num: 1, rankingList: [], isFinish: false})
        this.getRankList(sort)
    },
    getRankList(sort) {
        if (this.data.isLoading) return
        this.setData({isLoading: true})
        let params = {
            sort: sort,
            times_task_id: this.data.times_task_id,
            camp_times_id: this.data.camp_times_id,
            page_num: this.data.page_num,
            page_size: this.data.page_size,
            dataType: 'match'
        }
        wx.showLoading({
            title: '数据加载中',
        })
        network.request('taskRankingData', params, res => {
            let count = res.sign.count
            this.setData({rankingList: this.data.rankingList.concat(res.rankingList), isLoading: false})
            if (count < this.data.page_size) {
                this.setData({isFinish: true})
            }
            wx.hideLoading()
        }, error => { this.setData({isLoading: false}) })
    },
    getUserRankList() {
        // share_type: share_list(列表分享)\hare_view（详情分享）
        let params = {
            times_task_id: this.data.times_task_id,
            camp_times_id: this.data.camp_times_id,
            share_type: this.data.sourceType == 1 ? 'share_list' : 'share_view'
        }
        network.request('userRankList', params, res => {
            res.task_info.task_start_time = `${res.task_info.task_start_time} 00:00:00`
            if (res.task_info.task_rule_content){
                WxParse.wxParse('content', 'html', res.task_info.task_rule_content, this, 0);
            }
            this.setData({taskData: res})
            // 如果比赛还没有人发布，就不请求列表，展示示例 task_example,有公布，不返回
            if (!this.data.taskData.task_info.task_example) {
                // 赛区最热最新
                this.getRankList(this.data.sort)
                // 查询tab距离文档顶部的距离tabTop
                this.initClientRect()
            }
            wx.hideLoading()
        }, error => {})
    },
    // 页面上拉触底事件的处理函数
    onReachBottom: function() {
        // 如果没有人公开到赛区，显示示例，加载更多
        if (this.data.taskData.task_info.task_example) return
        if (this.data.isFinish) {
            wx.showToast({ title:"没有更多了",icon:"none"})
            return
        }
        this.setData({ page_num: this.data.page_num + 1 })
        this.getRankList(this.data.sort)
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
    backTop() {
        wx.pageScrollTo({
          scrollTop: 0
        })
        this.setData({
            showBackTop: false
        })
    },
    queryTask () {
        let url = `pages/match-daily-tasks/index?camp_times_id=${this.data.camp_times_id}&times_task_id=${this.data.times_task_id}`
        router.navigate({path: url})
    },
    queryPrice () {
        let url = `pages/match-activity-prize/index?camp_times_id=${this.data.camp_times_id}&times_task_id=${this.data.times_task_id}`
        router.navigate({path: url})
    },
      // 去任务日历页
    goTaskCalendar() {
        router.navigate({
            path: `pages/match-task-calendar/index?camp_times_id=${this.data.camp_times_id}`
        })
    },
    queryRank () {
        // 未购买用户不能查看排行榜
        const role = this.data.taskData.roles
        if (role == 2) {
            wx.showToast({
                title: '暂未参加，不能查阅~',
                icon: 'none',
                duration: 2000
            })
            return
        }
        let url = `pages/match-rank-list/index?camp_times_id=${this.data.camp_times_id}&times_task_id=${this.data.times_task_id}&rank_type=1`
        router.navigate({path: url})
    },
    // 去评论
    clickComment (e) {
        // 如果点击的事示例，则返回
        if (this.data.taskData.task_info.task_example) return
        // type: 2 代表是普通列表 1 是任务日历
        const index = e.currentTarget['dataset'].index
        const item = this.data.rankingList[index]
        let url = `pages/match-task-person/index?times_task_id=${this.data.times_task_id}&camp_times_id=${this.data.camp_times_id}&task_submit_id=${item.task_submit_id}&unionid=${item.unionid}&index=${index}&type=2`
        router.navigate({path: url})
    },
    // 用户点击右上角分享
    onShareAppMessage: function (e) {
        const obj = {
            title: `${this.data.taskData.nickname}正在参加${this.data.taskData.task_info.camp_times_name}，邀您一起陪孩子赢大奖`,
            imageUrl: this.data.taskData.task_info.face_img_url,
            paramsFrom: { times_task_id: this.data.times_task_id, camp_times_id: this.data.camp_times_id},
            url: 'pages/match-share-area/index',
        }
        return network.share(obj);
    },
    // 客服消息log
    handleContact(e) {
        const params = e.currentTarget['dataset']
        network.logsRequest({ apipath: params.button_path, apiparam: params.goods_id }, data => {
            console.log("log日志")
        })
    },
    goBackArea() { router.switchTab({path: 'pages/match-area/index'}) }
});