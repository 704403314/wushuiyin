// pages/dashang/dashang.js
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
        return {
            title: "视频无水印下载,提取短视频音频",
            imageUrl: "../../images/fenxiang.png"
        };
    },
    handleLongTap: function (event) {
        wx.showActionSheet({
          itemList: ['发送给朋友', '保存图片'],
          success: function (res) {
            if (res.tapIndex === 0) {
            //   wx.showShareMenu({
            //     withShareTicket: true,
            //     menus: ['shareAppMessage', 'shareTimeline']
            //   })
            wx.showShareImageMenu({
                path: '/images/weixinzhifu.png'
              })
            } else if (res.tapIndex === 1) {
              wx.saveImageToPhotosAlbum({
                filePath: '/images/weixinzhifu.png',
                success(res) {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
            }
          }
        })
      }
})