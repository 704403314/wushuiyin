// pages/caozuo/caozuo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 在页面中定义插屏广告
        let interstitialAd = null

        // 在页面onLoad回调事件中创建插屏广告实例
        if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
            adUnitId: 'adunit-9ef87e3d462d04b8'
        })
        interstitialAd.onLoad(() => {})
        interstitialAd.onError((err) => {})
        interstitialAd.onClose(() => {})
        }

        // 在适合的场景显示插屏广告
        if (interstitialAd) {
        interstitialAd.show().catch((err) => {
            console.error(err)
        })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    onShareAppMessage: function () {
        return {
            title: "视频无水印下载,提取短视频音频",
            imageUrl: "../../images/fenxiang.png"
        };
    },
    onShareTimeline: function () {
        return {
            title: "视频无水印下载,提取短视频音频",
            imageUrl: "../../images/fenxiang.png"
        }
    },
})