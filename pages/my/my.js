const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        barHeight: 20, //  顶部状态栏高度
        navBarHeight: 66, // 顶部高度
        tabList: [],
        nickname: "",
        headImage:"/images/默认头像.png",
        avatarUrl: defaultAvatarUrl,
    },
    onChooseAvatar(e) {
        const { avatarUrl } = e.detail 
        console.log("avatarUrl", avatarUrl)
        this.setData({
          avatarUrl:avatarUrl,
        })
        wx.setStorageSync('avatarUrl', avatarUrl)
      },
    onLoad() {
        const nickname = wx.getStorageSync('nickname')
        if (nickname) {
            this.setData({
                nickname: nickname
            })
        }

        const avatarUrl = wx.getStorageSync('avatarUrl')
        if (avatarUrl) {
            this.setData({
                avatarUrl: avatarUrl
            })
        }
    },
    handleBlur(event) {
        const value = event.detail.value;
        console.log('输入内容：', value);
        wx.setStorageSync('nickname', value)
      },
    // 头像监听
    // headClick() {
    //     wx.navigateTo({
    //         url: '/pages/touxiang/touxiang'
    //       });
    //       return
        
    // },
    dashang() {
        wx.navigateTo({
            url: '/pages/dashang/dashang'
          });
    },
    


    // 二级菜单监听
    tabClick(e) {
        var info = e.currentTarget.dataset.item;
        wx.showToast({
            title: info.title,
            icon: 'none'
        })
        switch (info.id) {
            case '1':
                wx.navigateTo({
                    url: '菜单一需要跳转的链接路径',
                })
                break;
            case '2':
                wx.navigateTo({
                    url: '菜单二需要跳转的链接路径',
                })
                break;
            case '3':
                wx.navigateTo({
                    url: '菜单三需要跳转的链接路径',
                })
                break;
            default:
                wx.navigateTo({
                    url: '菜单四需要跳转的链接路径',
                })
                break;
        }
    },
    
    // 页面滚动监听
    onPageScroll(e) {
        if (e.scrollTop > 60) {
            this.setData({
                show: true
            })
        } else {
            this.setData({
                show: false
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onShow() {
        var that = this;
        // 胶囊信息
        var menu = wx.getMenuButtonBoundingClientRect();
        wx.getSystemInfo({
            success(res) {
                that.setData({
                    barHeight: res.statusBarHeight,
                    navBarHeight: menu.top + menu.height
                })
            }
        })
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
        };
    },
})
