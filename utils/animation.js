var animation = wx.createAnimation({
    duration: 1000,
    timingFunction: 'ease',
})

this.animation = animation

animation.scale(2, 2).rotate(45).step()

this.setData({
    animationData: animation.export()
})

setTimeout(function() {
    animation.translate(30).step()
    this.setData({
        animationData: animation.export()
    })
}.bind(this), 1000)
const bottomToTop = function(params) {
    Animation.height('100%')
}