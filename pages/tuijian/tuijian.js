// pages/tuijian/tuijian.js
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    redirectGusuan() {
        wx.navigateToMiniProgram({
            appId: 'wxa114f53f63c185e7',
            path: '/pages/zixuan/zixuan',
            extraData: {
              // 传递给目标小程序的数据
            },
            envVersion: 'release', // 要打开的目标小程序版本，可选值有 'develop', 'trial', 'release'
            success(res) {
              // 打开小程序成功的回调函数
            }
          }) 
    },
    redirectAI() {
        wx.navigateToMiniProgram({
            appId: 'wx7dc930943646998f',
            path: '/pages/index/index',
            extraData: {
              // 传递给目标小程序的数据
            },
            envVersion: 'release', // 要打开的目标小程序版本，可选值有 'develop', 'trial', 'release'
            success(res) {
              // 打开小程序成功的回调函数
            }
          }) 
    }
})