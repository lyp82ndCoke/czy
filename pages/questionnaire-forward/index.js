import network from '../../utils/network';
const util = require('../../utils/util.js')
const app = getApp()
Page({
    data:{
        height: 0,
        openSetting: false,     // 首次拒绝获取相册权限
        showPoster: false,      // 显示海报
        posterPicture: '',      // 海报照片
        isShowEextarea: false,
        fontvaluelength: 0,
        shareInfo: {},
        default_message: '',
        share_id: ''
        // ques1leYTjVxGhXJh
    },
    onLoad:function(options){
        this.setData({options: options})
        wx.showLoading({
            title: '数据加载中',
        })
        const params = {questionnaire_code: this.data.options.questionnaire_code}
        network.request('ShareQuestionaire', params, res => {
            wx.hideLoading()
            this.setData({shareInfo: res.shareInfo})
            this.userShare(res.shareInfo.message)
        })
    },
    onShow:function(){},
    userShare(message) {
        const params = {
            questionnaire_code: this.data.options.questionnaire_code,
            message: message
        }
        network.request('userShareQuestion', params, res => {
            this.setData({share_id: res.share_id})
        })
    },
    editMessage() {
        if (this.data.isShowEextarea) {
            const message = this.data.default_message ? this.data.default_message : this.data.shareInfo.message
            this.setData({
                'shareInfo.message': message,
                isShowEextarea: false
            })
            this.userShare(message)
            return
        }
        this.setData({isShowEextarea: true, fontvaluelength: this.data.shareInfo.message.length})
    },
    cancelEdit() {
        this.setData({isShowEextarea: false})
    },
    getAreaValue(e) {
        const value = e.detail.value;
        const vlength = value.length;
        this.setData({
            default_message: value,
            fontvaluelength: vlength
        })
    },
    sendFriend() {
        if (this.data.isShowEextarea) {
            wx.showToast({
                title: '请点击完成寄语',
                icon: 'none',
                duration: 2000
            })
            return
        }
    },
    showPopup() {
        if (this.data.isShowEextarea) {
            wx.showToast({
                title: '请点击完成寄语',
                icon: 'none',
                duration: 2000
            })
            return
        }
        const params = {
            questionnaire_code: this.data.options.questionnaire_code,
            default_message: this.data.shareInfo.message,
            nickname: this.data.shareInfo.nickname
        }
        wx.showLoading({
            title: '数据加载中',
        })
        network.request('SharePosterPicture', params, res => {
            this.setData({
                posterPicture: res.picture,
                showPoster: true
            })
            this.posterLog('get')
            wx.hideLoading()
        })
    },
    posterLog(type) {
        const apipath = type == 'save' ? 'save_button/question_save_poster' : 'get_button/question_get_poster'
        network.logsRequest({ apipath: apipath, apiparam: this.data.options.questionnaire_code }, data => {
            console.log("log日志")
        })
    },
    closePoster() {
        this.setData({showPoster: false, posterPicture: '', openSetting: false})
    },
    // 打开设置页面
    openSetting() {
        wx.openSetting({
            success: (res) => {
                if (res.authSetting['scope.writePhotosAlbum']) {
                    this.setData({
                        openSetting: false
                    })
                    this.downloadImg()
                } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                }
            },
            complete(err) {
                console.log(err)
            }
        })
    },
    shareFirends() {
        if (this.data.openSetting) {
            this.openSetting()
            return
        }
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.writePhotosAlbum']) {
                    this.downloadImg()
                } else {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success: () => {
                            console.log('授权成功')
                            this.downloadImg()
                        },
                        fail:(err) => {
                            wx.showModal({
                                content: "请先授权",
                                showCancel: false,
                                success() {}
                            })
                            this.setData({
                                openSetting: true
                            })
                        }
                    })
                }
            }

        })
    },
    // 函数节流
    downloadImg: util.throttle(function() {
        app.saveImg(this.data.posterPicture, () => {
            this.posterLog('save')
        })
    }),
    onShareAppMessage: function() {
        const obj = {
            title: '我学完了父母训练营系列课程，邀请你来看看，真的有用！',
            imageUrl: this.data.shareInfo.picture,
            paramsFrom: {share_id: this.data.share_id},
            url: 'pages/questionnaire-share-forward/index',
            apiparam: this.data.options.questionnaire_code,
            apipath: 'share_button/question_share_friend'
        }
        return network.share(obj);
    }
})