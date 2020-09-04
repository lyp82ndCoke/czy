import network from '../../utils/network';
import getCode from "../../utils/getCode";
Page({
    data:{
        loginShow: false,
        loginWrapShow: false,
        shareInfo: {}
    },
    onLoad:function(options){
        this.setData({
            share_id: options.share_id
        })
        wx.showLoading({
            title: '数据加载中',
        })
        // sharelez0fjlphWGX
        let unionid = wx.getStorageSync('unionid');
        if (unionid) {
            this.getShareInfo()
            this.getLoginStatus()
        } else {
            getCode.login().then(res => {
                this.getShareInfo()
                this.getLoginStatus()
            })
        }
    },
    onShow:function(){},
    getShareInfo() {
        const params = {share_id: this.data.share_id}
        network.request('ShareQuestionaire', params, res => {
            wx.hideLoading()
            this.setData({shareInfo: res.shareInfo})
        })
    },
    // 客服消息
	handleContact() {
		// 客服消息
        network.logsRequest({ apipath: 'contact_button/question_share_id', apiparam: this.data.shareInfo.questionnaire_code }, data => {
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
    }
})