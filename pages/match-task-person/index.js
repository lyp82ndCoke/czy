const router = require('../../utils/router.js');
import network from '../../utils/network';
import getCode from "../../utils/getCode";
Page({
    data: {
        commentList: [],
        submit_info: {},
        taskData:{},
        page_size: 10,
        page_num: 1,
        isFinish: false,
        commontShow: true,
        loadingBtn: true,
        comment_contents: '',
        commentType: null,
        placeholderMsg: '说点什么...',
        showPopup: false,
        shareType: '',
        loginShow: false,
        loginWrapShow: false
    },
    onLoad: function(options){
        // 获取授权状态
        this.getLoginStatus()
        this.setData({
            times_task_id: options.times_task_id,
            camp_times_id: options.camp_times_id,
            task_submit_id: options.task_submit_id,
            unionid: options.unionid,
            prevIndex: options.index,
            sourceType: options.type,
            shareType: options.shareType || 'area'
        })
        let unionid = wx.getStorageSync('unionid');
        if (unionid) {
            this.getUserTaskView()
            this.getUserSubmitData(res => {
                this.setData({submit_info: res})
                this.getCommentList()
            })
        } else {
            getCode.login().then(res => {
                this.getUserTaskView()
                this.getUserSubmitData(res => {
                    this.setData({submit_info: res})
                    this.getCommentList()
                })
            })
        }
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
    replyTask(e) {
        const item = e.currentTarget['dataset'].info
        this.setData({
            placeholderMsg: `回复@${item.nickname}：`,
            commentType: 'reply',
            commentInfo: item,
            commontShow: false
        })
    },
    dianZan() {
        if (this.data.submit_info.is_like === 1) { return }
        let params = {
            like_type: 'task',
            identify_id: this.data.task_submit_id,
            action_type: 1,
            identify_type: 7
        }
        network.request('matchLike', params, res => {
            this.setData({
                'taskData.total_zan_num': parseInt(this.data.taskData.total_zan_num) + 1,
                'submit_info.valid_zan_nums': res.zan_num,
                'submit_info.is_like': 1
            })
            if (this.data.prevIndex !== undefined && this.data.shareType != 'task'){
                this.fissionZan(res)
            }
        })
    },
    // 裂变加点赞数量
    fissionZan(res){
        let sourceType = this.data.sourceType
        let pages = getCurrentPages();
        let currPage = null; //当前页面
        let prevPage = null; //上一个页面
        if (pages.length >= 2) {
            currPage = pages[pages.length - 1]; //当前页面
            prevPage = pages[pages.length - 2]; //上一个页面
        }
        const index = this.data.prevIndex;
        if (sourceType == 1 || sourceType == 3) {          // 任务日历页 || 发布页跳转过来
            const zan_count_num = `task_list[${index}].submit_info.zan_count_num`
            if (prevPage) {
                prevPage.setData({
                    [zan_count_num]: res.zan_num,
                    'times_task_user_info.zan_num': parseInt(prevPage.data.times_task_user_info.zan_num) + 1,               // 总任务赞
                    'times_task_user_info.today_zan_num': parseInt(prevPage.data.times_task_user_info.today_zan_num) + 1,   // 今日新增赞
                    'times_task_user_info.valid_zan_num': parseInt(prevPage.data.times_task_user_info.valid_zan_num) + 1    // 单条任务赞
                });
            }
        } else if (sourceType == 2) {   // 我的、他人的任务页
            const valid = `rankingList[${index}].valid_zan_nums`
            const total = `rankingList[${index}].total_zan_num`
            const isLike = `rankingList[${index}].is_like`
            const isZan = `rankingList[${index}].is_zan`
            const zanNum = `rankingList[${index}].zan_num`
            if (prevPage) {
                prevPage.setData({
                    [valid]: res.zan_num,
                    [total]: parseInt(prevPage.data.rankingList[index].total_zan_num) + 1,
                    [isLike]: 1,
                    [isZan]: 1,
                    [zanNum]: res.zan_num
                });
            }
        }
    },
    // 发布评论
    release() {
        const comment_contents = this.data.comment_contents.trim()
        if (!comment_contents) {
            wx.showToast({
                title: '请输入评论内容',
            })
            return
        }
        let params = {
            identify_id: this.data.submit_info.task_submit_id,
            times_task_id: this.data.times_task_id,
            identify_type: 6,
            comment_contents: comment_contents
        }
        if (this.data.commentType === 'reply') {
            params.parent_id = this.data.commentInfo.comment_id
        }
        network.request('insertComment', params, data => {
            wx.showToast({
                title: "评论成功",
                icon: "success"
            })
            this.setData({
                loadingBtn: false,
                commontShow: true,
                comment_contents: '',
                page_num: 1,
                commentList: []
            })
            const comment = `submit_info.comment_count_num`
            this.setData({[comment]: parseInt(this.data.submit_info.comment_count_num) + 1})
            this.getCommentList()
            if (this.data.prevIndex !== undefined && this.data.shareType != 'task'){
                this.fissionComment()
            }
        }, error => {
            this.setData({
                loadingBtn: false
            })
        })
    },
    // 裂变加评论数量
    fissionComment(){
        let sourceType = this.data.sourceType
        let pages = getCurrentPages();
        let currPage = null; //当前页面
        let prevPage = null; //上一个页面
        if (pages.length >= 2) {
            currPage = pages[pages.length - 1]; //当前页面
            prevPage = pages[pages.length - 2]; //上一个页面
        }
        const index = this.data.prevIndex;
        if (sourceType == 1) {  // 任务日历页
            const comment = `task_list[${index}].submit_info.comment_count_num`
            if (prevPage) {
                prevPage.setData({
                    [comment]: parseInt(prevPage.data.task_list[index].submit_info.comment_count_num) + 1
                })
            }
        } else {    // type 2普通页面
            const comment = `rankingList[${index}].comment_count_num`
            if (prevPage) {
                prevPage.setData({
                    [comment]: parseInt(prevPage.data.rankingList[index].comment_count_num) + 1
                })
            }
        }
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
        }
    },
    // 数据统计
    getUserTaskView() {
        wx.showLoading({
            title: '数据加载中',
        })
        let params = { 
            times_task_id: this.data.times_task_id,
            camp_times_id: this.data.camp_times_id,
            task_view_unionid: this.data.unionid,
            share_type: 'share_view'
        }
        network.request('userRankList', params, res => {
            if (res.task_info.is_buy == 2) {
                router.switchTab({path: 'pages/index/index'})
                return
            }
            this.setData({taskData: res})
            if (this.data.sourceType == 3) {
                this.setData({showPopup: true})
            }
        }, error => {})
    },
    closePopup() {
        this.setData({showPopup: false})
    },
    // 详情
    getUserSubmitData(cb) {
        let data = {
            task_submit_id: this.data.task_submit_id,
            times_task_id: this.data.times_task_id
        }
        network.request('UserSubmitData', data, res => {
            cb(res)
        })
    },
    // 加载更多
    getMoreComment() {
        if (this.data.isFinish) {
            wx.showToast({ title:"没有更多评论了",icon:"none"})
            return
        }
        this.setData({page_num: this.data.page_num + 1})
        this.getCommentList()
    },
    // 评论
    getCommentList() {
        let data = {
            identify_id: this.data.submit_info.task_submit_id,
            times_task_id: this.data.times_task_id,
            identify_type: 6,
            page_size: this.data.page_size,
            page_num: this.data.page_num
        }
        if (this.data.isLoading) { return }
        this.setData({isLoading: true})
        network.request('getMatchComment', data, res => {
            this.setData({isLoading: false})
            this.setData({ commentList: this.data.commentList.concat(res.list) })
            if (res.sign.count < this.data.page_size) {
                this.setData({isFinish: true})
            }
            wx.hideLoading()
        }, error => {
            wx.hideLoading()
            this.setData({isLoading: false})
        })
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
    // 分享记录调用接口
    shareRecord() {
        const unionid = this.getUnionid()
        let params = {
            task_submit_id: this.data.task_submit_id,
            unionid: unionid
        }
        network.request('shareTaskSubmit', params, res => {
            console.log('分享成功')
        })
    },
    // 用户点击右上角分享
    onShareAppMessage: function (e) {
        // 记录分享
        this.shareRecord()
        var obj = {}
        if (this.data.shareType == 'task') {
            obj = {
                title: `${this.data.taskData.nickname}正在参加${this.data.taskData.task_info.camp_times_name}`,
                imageUrl: this.data.taskData.task_info.face_img_url,
                paramsFrom: {
                    times_task_id: this.data.times_task_id,
                    camp_times_id: this.data.camp_times_id,
                    task_submit_id: this.data.task_submit_id,
                    unionid: this.data.unionid,
                    prevIndex: this.data.index,
                    sourceType: this.data.type,
                    shareType: this.data.shareType
                }
            }
        } else if (this.data.shareType == 'area') {
            obj = {
                title: `${this.data.taskData.nickname}正在参加${this.data.taskData.task_info.camp_times_name}，邀您一起陪孩子赢大奖`,
                imageUrl: this.data.taskData.task_info.face_img_url,
                paramsFrom: { times_task_id: this.data.times_task_id, task_submit_id: this.data.task_submit_id},
                url: 'pages/match-share-mytask/index'
            }
        }
        return network.share(obj);
    }
});