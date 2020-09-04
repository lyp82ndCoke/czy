// pages/navBar/navBar.js
// components/title/title.js
const router = require('../../utils/router.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        background: {
            type: String,
            value: 'rgba(255, 255, 255, 1)'
        },
        color: {
            type: String,
            value: 'rgba(0, 0, 0, 1)'
        },
      text: {
            type: String,
          value: '无痕养育成长营'
        },
        titleImg: {
            type: String,
            value: ''
        },
      back: {
            type: Boolean,
            value: false
        },
        homeIcon: {
            type: String,
            value: ''
        },
        fontSize: {
            type: Number,
            value: 16
        },
        iconHeight: {
            type: Number,
            value: 19
        },
        iconWidth: {
            type:Number,
            value: 58
        }
    },
    attached: function(){
        var that = this;
        that.setNavSize();
        that.setStyle();
    },
    data: {

    },
    methods: {
        // 通过获取系统信息计算导航栏高度
        setNavSize: function() {
            var that = this
                , sysinfo = wx.getSystemInfoSync()
                , statusHeight = sysinfo.statusBarHeight
                , isiOS = sysinfo.system.indexOf('iOS') > -1
                , navHeight;
            if (!isiOS) {
                navHeight = 48;
            } else {
                navHeight = 44;
            }
            that.setData({
                status: statusHeight,
                navHeight: navHeight
            })
        },
        setStyle: function() {
            var that  = this
                , containerStyle
                , textStyle
                , iconStyle;
            containerStyle = [
                'background:' + that.data.background
                ].join(';');
            textStyle = [
                'color:' + that.data.color,
                'font-size:' + that.data.fontSize + 'px'
            ].join(';');
            iconStyle = [
                'width: ' + that.data.iconWidth + 'px',
                'height: ' + that.data.iconHeight + 'px'
            ].join(';');
            that.setData({
                containerStyle: containerStyle,
                textStyle: textStyle,
                iconStyle: iconStyle
            })
        },
        // 返回事件
        back: function(){
          router.navigateBack()
        },
        home: function() {
          router.goHome()
        }
    }
})
